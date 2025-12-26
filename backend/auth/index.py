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
from psycopg2.extras import RealDictCursor

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
    Аутентификация, регистрация и подписки пользователей
    POST /register - регистрация нового пользователя
    POST /login - вход в систему
    GET /subscriptions - получить активные подписки пользователя
    GET /plans - список всех доступных тарифов
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
    
    # GET endpoints (public)
    if method == 'GET':
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        try:
            # Get all subscription plans
            if 'plans' in event.get('path', ''):
                cur.execute("SELECT * FROM t_p18253922_infinite_business_ca.subscriptions ORDER BY price ASC")
                plans = [dict(row) for row in cur.fetchall()]
                
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'plans': plans}, default=str),
                    'isBase64Encoded': False
                }
            
            # Get user subscriptions (requires auth)
            if 'subscriptions' in event.get('path', ''):
                headers = event.get('headers', {})
                auth_token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
                
                if not auth_token:
                    return {
                        'statusCode': 401,
                        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                        'body': json.dumps({'error': 'Unauthorized'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(f"SELECT user_id FROM t_p18253922_infinite_business_ca.auth_tokens WHERE token = '{auth_token}' AND expires_at > NOW()")
                token_row = cur.fetchone()
                
                if not token_row:
                    return {
                        'statusCode': 401,
                        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                        'body': json.dumps({'error': 'Invalid token'}),
                        'isBase64Encoded': False
                    }
                
                user_id = token_row['user_id']
                
                cur.execute(f"""
                    SELECT us.*, s.name, s.price, s.duration_days, s.features, s.can_remove_branding
                    FROM t_p18253922_infinite_business_ca.user_subscriptions us
                    JOIN t_p18253922_infinite_business_ca.subscriptions s ON us.subscription_id = s.id
                    WHERE us.user_id = {int(user_id)} AND us.is_active = TRUE AND us.expires_at > NOW()
                    ORDER BY us.expires_at DESC
                """)
                subscriptions = [dict(row) for row in cur.fetchall()]
                
                has_branding_access = any(sub.get('can_remove_branding') for sub in subscriptions)
                
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({
                        'subscriptions': subscriptions,
                        'has_branding_access': has_branding_access
                    }, default=str),
                    'isBase64Encoded': False
                }
        
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()
    
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
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
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
            
            # Проверка существующего email
            email_check = email.replace("'", "''")
            cur.execute(
                f"SELECT id FROM t_p18253922_infinite_business_ca.users WHERE email = '{email_check}'"
            )
            if cur.fetchone():
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Email уже зарегистрирован'}),
                    'isBase64Encoded': False
                }
            
            # Проверка реферального кода (если указан)
            referred_by_id = None
            if referral_code:
                referral_code_safe = referral_code.upper().replace("'", "''")
                cur.execute(
                    f"SELECT id FROM t_p18253922_infinite_business_ca.users WHERE referral_code = '{referral_code_safe}'"
                )
                referrer = cur.fetchone()
                if referrer:
                    referred_by_id = referrer['id']
            
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            # Генерируем уникальный реферальный код для нового пользователя
            import random
            import string
            new_referral_code = None
            max_attempts = 10
            for _ in range(max_attempts):
                candidate = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
                cur.execute(
                    f"SELECT id FROM t_p18253922_infinite_business_ca.users WHERE referral_code = '{candidate}'"
                )
                if not cur.fetchone():
                    new_referral_code = candidate
                    break
            
            if not new_referral_code:
                cur.close()
                conn.close()
                return {
                    'statusCode': 500,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Не удалось сгенерировать реферальный код'})
                }
            
            # Get next id explicitly for users
            cur.execute("SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM t_p18253922_infinite_business_ca.users")
            user_id = cur.fetchone()['next_id']
            
            # Escape values for Simple Query Protocol
            email_safe = email.replace("'", "''")
            password_hash_safe = password_hash.replace("'", "''")
            name_safe = name.replace("'", "''")
            referral_code_safe = new_referral_code.replace("'", "''")
            
            cur.execute(
                f"INSERT INTO t_p18253922_infinite_business_ca.users (id, email, password_hash, name, referral_code, referred_by) VALUES ({user_id}, '{email_safe}', '{password_hash_safe}', '{name_safe}', '{referral_code_safe}', {referred_by_id if referred_by_id else 'NULL'}) RETURNING id, email, name"
            )
            result = cur.fetchone()
            user = {'id': result['id'], 'email': result['email'], 'name': result['name']}
            
            # Get next id explicitly for user_subscriptions
            cur.execute("SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM t_p18253922_infinite_business_ca.user_subscriptions")
            sub_id = cur.fetchone()['next_id']
            
            cur.execute(
                f"INSERT INTO t_p18253922_infinite_business_ca.user_subscriptions (id, user_id, plan_id, status) VALUES ({sub_id}, {user['id']}, 1, 'active')"
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
            
            email_safe = email.replace("'", "''")
            cur.execute(
                f"SELECT id, email, name, password_hash FROM t_p18253922_infinite_business_ca.users WHERE email = '{email_safe}'"
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
            
            stored_hash = result['password_hash']
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
                    new_hash_safe = new_hash.replace("'", "''")
                    cur.execute(
                        f"UPDATE t_p18253922_infinite_business_ca.users SET password_hash = '{new_hash_safe}' WHERE id = {result['id']}"
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
            
            user = {'id': result['id'], 'email': result['email'], 'name': result['name']}
            
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
            
            # Сохраняем токен в базу для других функций (login)
            expires_at = datetime.utcnow() + timedelta(days=30)
            
            # Get next id explicitly for auth_tokens
            cur.execute("SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM t_p18253922_infinite_business_ca.auth_tokens")
            token_id = cur.fetchone()['next_id']
            
            token_safe = token.replace("'", "''")
            expires_at_str = expires_at.strftime('%Y-%m-%d %H:%M:%S')
            
            cur.execute(
                f"INSERT INTO t_p18253922_infinite_business_ca.auth_tokens (id, user_id, token, expires_at) VALUES ({token_id}, {user['id']}, '{token_safe}', '{expires_at_str}')"
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
        
        elif action == 'feedback':
            import smtplib
            from email.mime.text import MIMEText
            from email.mime.multipart import MIMEMultipart
            from email.mime.image import MIMEImage
            import base64
            
            message = body.get('message', '')
            user_email = body.get('email', 'Не указан')
            url = body.get('url', 'N/A')
            user_agent = body.get('userAgent', 'N/A')
            timestamp = body.get('timestamp', 'N/A')
            screenshot = body.get('screenshot')
            screenshot_name = body.get('screenshotName', 'screenshot.png')
            
            if not message:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Message is required'}),
                    'isBase64Encoded': False
                }
            
            admin_email = os.environ.get('ADMIN_EMAIL')
            smtp_host = os.environ.get('SMTP_HOST')
            smtp_port = int(os.environ.get('SMTP_PORT', '465'))
            smtp_user = os.environ.get('SMTP_USER')
            smtp_password = os.environ.get('SMTP_PASSWORD')
            
            if not all([admin_email, smtp_host, smtp_user, smtp_password]):
                return {
                    'statusCode': 500,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'SMTP configuration incomplete'}),
                    'isBase64Encoded': False
                }
            
            msg = MIMEMultipart('related')
            msg['From'] = smtp_user
            msg['To'] = admin_email
            msg['Subject'] = f'🐛 Сообщение об ошибке - Portfolio Site'
            
            screenshot_html = ''
            if screenshot:
                screenshot_html = f'''
        <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
            <h3 style="margin-bottom: 10px;">📸 Прикрепленный скриншот:</h3>
            <img src="cid:screenshot" style="max-width: 100%; border-radius: 5px; border: 1px solid #ddd;" alt="Screenshot"/>
        </div>
                '''
            
            email_body = f"""
<html>
<body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
        <h2 style="color: #d4a574; margin-bottom: 20px;">🐛 Новое сообщение об ошибке</h2>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="margin-top: 0;">Описание проблемы:</h3>
            <p style="white-space: pre-wrap;">{message}</p>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px;">
            <p><strong>Email пользователя:</strong> {user_email}</p>
            <p><strong>URL:</strong> <a href="{url}">{url}</a></p>
            <p><strong>Время:</strong> {timestamp}</p>
            <p><strong>User Agent:</strong> {user_agent}</p>
        </div>
        
        {screenshot_html}
    </div>
</body>
</html>
            """
            
            msg_alternative = MIMEMultipart('alternative')
            msg.attach(msg_alternative)
            msg_alternative.attach(MIMEText(email_body, 'html'))
            
            if screenshot:
                try:
                    if screenshot.startswith('data:image'):
                        header, encoded = screenshot.split(',', 1)
                        image_data = base64.b64decode(encoded)
                        
                        mime_type = header.split(';')[0].split(':')[1]
                        maintype, subtype = mime_type.split('/')
                        
                        image = MIMEImage(image_data, _subtype=subtype)
                        image.add_header('Content-ID', '<screenshot>')
                        image.add_header('Content-Disposition', 'inline', filename=screenshot_name)
                        msg.attach(image)
                except Exception as img_error:
                    print(f"Screenshot processing error: {img_error}")
            
            try:
                with smtplib.SMTP_SSL(smtp_host, smtp_port) as server:
                    server.login(smtp_user, smtp_password)
                    server.send_message(msg)
            except Exception as smtp_error:
                print(f"Email send error: {smtp_error}")
                return {
                    'statusCode': 500,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Failed to send email'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'success': True, 'message': 'Feedback sent successfully'}),
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