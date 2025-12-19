import json
import os
import re
import bcrypt
import hashlib
import jwt
import time
from datetime import datetime, timedelta
from typing import Dict, Tuple, Optional
import psycopg2

# In-memory rate limiting
_rate_limit_store: Dict[str, list] = {}

def check_rate_limit(identifier: str, max_req: int = 5, window: int = 60) -> Tuple[bool, Optional[int]]:
    current = time.time()
    if identifier not in _rate_limit_store:
        _rate_limit_store[identifier] = []
    
    _rate_limit_store[identifier] = [t for t in _rate_limit_store[identifier] if current - t < window]
    
    if len(_rate_limit_store[identifier]) >= max_req:
        oldest = _rate_limit_store[identifier][0]
        return False, int(window - (current - oldest))
    
    _rate_limit_store[identifier].append(current)
    return True, None

def handler(event, context):
    '''
    Аутентификация и регистрация пользователей
    POST /register - регистрация нового пользователя
    POST /login - вход в систему
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    # Rate limiting по IP (10 запросов за 60 секунд для тестирования)
    ip = event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'unknown')
    allowed, retry_after = check_rate_limit(f'auth:{ip}', max_req=10, window=60)
    
    if not allowed:
        return {
            'statusCode': 429,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Retry-After': str(retry_after)
            },
            'body': json.dumps({'error': 'Too many requests'}),
            'isBase64Encoded': False
        }
    
    conn = None
    cur = None
    
    try:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        if action == 'register':
            email = body.get('email', '')
            password = body.get('password', '')
            name = body.get('name', '')
            referral_code = body.get('referral_code', '')
            
            # Валидация email
            if not email or len(email) > 255:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Invalid email'}),
                    'isBase64Encoded': False
                }
            
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, email):
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Invalid email format'}),
                    'isBase64Encoded': False
                }
            
            # Валидация пароля
            if not password or len(password) < 6 or len(password) > 100:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Password must be 6-100 chars'}),
                    'isBase64Encoded': False
                }
            
            # Валидация имени
            if not name or len(name) < 2 or len(name) > 100:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Name must be 2-100 chars'}),
                    'isBase64Encoded': False
                }
            
            # Проверка реферального кода (если указан)
            referred_by_id = None
            if referral_code:
                cur.execute(
                    "SELECT id FROM t_p18253922_infinite_business_ca.users WHERE referral_code = %s",
                    (referral_code.upper(),)
                )
                referrer = cur.fetchone()
                if referrer:
                    referred_by_id = referrer[0]
            
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            # Генерируем уникальный реферальный код для нового пользователя
            import random
            import string
            new_referral_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            
            # Insert without specifying id - let DEFAULT handle it
            cur.execute(
                "INSERT INTO t_p18253922_infinite_business_ca.users (email, password_hash, name, referral_code, referred_by) VALUES (%s, %s, %s, %s, %s) RETURNING id, email, name",
                (email, password_hash, name, new_referral_code, referred_by_id)
            )
            result = cur.fetchone()
            user = {'id': result[0], 'email': result[1], 'name': result[2]}
            
            cur.execute(
                "INSERT INTO t_p18253922_infinite_business_ca.user_subscriptions (user_id, plan_id, status) VALUES (%s, %s, %s)",
                (user['id'], 1, 'active')
            )
            
            conn.commit()
            
            jwt_secret = os.environ.get('JWT_SECRET')
            if not jwt_secret:
                cur.close()
                conn.close()
                return {
                    'statusCode': 500,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Server configuration error'}),
                    'isBase64Encoded': False
                }
            
            token = jwt.encode(
                {'user_id': user['id'], 'email': user['email'], 'exp': datetime.utcnow() + timedelta(days=30)},
                jwt_secret,
                algorithm='HS256'
            )
            
            # Сохраняем токен в базу для других функций
            expires_at = datetime.utcnow() + timedelta(days=30)
            cur.execute(
                "INSERT INTO t_p18253922_infinite_business_ca.auth_tokens (user_id, token, expires_at) VALUES (%s, %s, %s)",
                (user['id'], token, expires_at)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'token': token, 'user': user}),
                'isBase64Encoded': False
            }
        
        elif action == 'login':
            email = body.get('email', '')
            password = body.get('password', '')
            
            if not email or not password:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Email and password are required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "SELECT id, email, name, password_hash FROM t_p18253922_infinite_business_ca.users WHERE email = %s",
                (email,)
            )
            result = cur.fetchone()
            
            if not result:
                cur.close()
                conn.close()
                return {
                    'statusCode': 401,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Invalid credentials'}),
                    'isBase64Encoded': False
                }
            
            stored_hash = result[3]
            is_valid = False
            
            # Проверка bcrypt хеша
            if stored_hash.startswith('$2b$'):
                is_valid = bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))
            # Проверка старого SHA256 хеша (backward compatibility)
            else:
                sha256_hash = hashlib.sha256(password.encode()).hexdigest()
                is_valid = (sha256_hash == stored_hash)
                
                # Если пароль верный - обновляем на bcrypt
                if is_valid:
                    new_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                    cur.execute(
                        "UPDATE t_p18253922_infinite_business_ca.users SET password_hash = %s WHERE id = %s",
                        (new_hash, result[0])
                    )
                    conn.commit()
            
            if not is_valid:
                cur.close()
                conn.close()
                return {
                    'statusCode': 401,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Invalid credentials'}),
                    'isBase64Encoded': False
                }
            
            user = {'id': result[0], 'email': result[1], 'name': result[2]}
            
            jwt_secret = os.environ.get('JWT_SECRET')
            if not jwt_secret:
                cur.close()
                conn.close()
                return {
                    'statusCode': 500,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Server configuration error'}),
                    'isBase64Encoded': False
                }
            
            token = jwt.encode(
                {'user_id': user['id'], 'email': user['email'], 'exp': datetime.utcnow() + timedelta(days=30)},
                jwt_secret,
                algorithm='HS256'
            )
            
            # Сохраняем токен в базу для других функций
            expires_at = datetime.utcnow() + timedelta(days=30)
            cur.execute(
                "INSERT INTO t_p18253922_infinite_business_ca.auth_tokens (user_id, token, expires_at) VALUES (%s, %s, %s)",
                (user['id'], token, expires_at)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'token': token, 'user': user}),
                'isBase64Encoded': False
            }
        
        elif action == 'forgot_password':
            email = body.get('email', '')
            
            if not email:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Email is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "SELECT id, name FROM t_p18253922_infinite_business_ca.users WHERE email = %s",
                (email,)
            )
            user_result = cur.fetchone()
            
            if not user_result:
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'message': 'If email exists, reset link sent'}),
                    'isBase64Encoded': False
                }
            
            import secrets
            reset_token = secrets.token_urlsafe(32)
            reset_expires = datetime.utcnow() + timedelta(hours=1)
            
            cur.execute(
                "UPDATE t_p18253922_infinite_business_ca.users SET reset_token = %s, reset_token_expires = %s WHERE email = %s",
                (reset_token, reset_expires, email)
            )
            conn.commit()
            
            smtp_host = os.environ.get('SMTP_HOST')
            smtp_port = int(os.environ.get('SMTP_PORT', '465'))
            smtp_user = os.environ.get('SMTP_USER')
            smtp_password = os.environ.get('SMTP_PASSWORD')
            
            if all([smtp_host, smtp_user, smtp_password]):
                import smtplib
                from email.mime.text import MIMEText
                from email.mime.multipart import MIMEMultipart
                
                reset_url = f"https://visitka.site/reset-password?token={reset_token}"
                
                msg = MIMEMultipart('alternative')
                msg['Subject'] = 'Восстановление пароля'
                msg['From'] = smtp_user
                msg['To'] = email
                
                html = f"""
                <html>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Восстановление пароля</h2>
                    <p>Здравствуйте, {user_result[1]}!</p>
                    <p>Вы запросили восстановление пароля. Перейдите по ссылке ниже:</p>
                    <p><a href="{reset_url}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Восстановить пароль</a></p>
                    <p>Ссылка действительна 1 час.</p>
                    <p>Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.</p>
                </body>
                </html>
                """
                
                msg.attach(MIMEText(html, 'html'))
                
                try:
                    if smtp_port == 465:
                        server = smtplib.SMTP_SSL(smtp_host, smtp_port)
                    else:
                        server = smtplib.SMTP(smtp_host, smtp_port)
                        server.starttls()
                    
                    server.login(smtp_user, smtp_password)
                    server.send_message(msg)
                    server.quit()
                except Exception as e:
                    print(f"Email send error: {e}")
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'message': 'If email exists, reset link sent'}),
                'isBase64Encoded': False
            }
        
        elif action == 'reset_password':
            reset_token = body.get('token', '')
            new_password = body.get('password', '')
            
            if not reset_token or not new_password:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Token and password required'}),
                    'isBase64Encoded': False
                }
            
            if len(new_password) < 6 or len(new_password) > 100:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Password must be 6-100 chars'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "SELECT id FROM t_p18253922_infinite_business_ca.users WHERE reset_token = %s AND reset_token_expires > NOW()",
                (reset_token,)
            )
            user_result = cur.fetchone()
            
            if not user_result:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Invalid or expired token'}),
                    'isBase64Encoded': False
                }
            
            password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            cur.execute(
                "UPDATE t_p18253922_infinite_business_ca.users SET password_hash = %s, reset_token = NULL, reset_token_expires = NULL WHERE id = %s",
                (password_hash, user_result[0])
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'message': 'Password reset successful'}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Invalid action'}),
                'isBase64Encoded': False
            }
    
    except psycopg2.IntegrityError:
        if conn:
            conn.rollback()
        return {
            'statusCode': 409,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'User with this email already exists'}),
            'isBase64Encoded': False
        }
    
    except jwt.PyJWTError:
        if conn:
            conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Token generation failed'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        print(f'ERROR: {type(e).__name__}: {str(e)}')
        import traceback
        print(traceback.format_exc())
        if conn:
            conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'Authentication failed: {str(e)}'}),
            'isBase64Encoded': False
        }
    
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()