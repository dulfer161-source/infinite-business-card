import json
import os
import psycopg2
import secrets
import smtplib
import bcrypt
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Обрабатывает запросы на восстановление пароля
    POST /request - отправка письма с кодом восстановления
    POST /verify - проверка кода и смена пароля
    '''
    method: str = event.get('httpMethod', 'GET')
    
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
    
    if method == 'POST':
        try:
            body_data = json.loads(event.get('body', '{}'))
        except json.JSONDecodeError:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Invalid JSON'})
            }
        
        action = body_data.get('action', 'request')
        
        if action == 'request':
            return handle_request(body_data)
        elif action == 'verify':
            return handle_verify(body_data)
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Invalid action'})
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }

def handle_request(body_data: Dict[str, Any]) -> Dict[str, Any]:
    email = body_data.get('email', '').strip()
    
    if not email:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Email обязателен'})
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    email_escaped = email.replace("'", "''")
    
    cur.execute(
        f"SELECT id, name FROM t_p18253922_infinite_business_ca.users WHERE email = '{email_escaped}'"
    )
    user = cur.fetchone()
    
    if not user:
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': True, 'message': 'Если аккаунт существует, письмо отправлено'})
        }
    
    user_id, user_name = user
    reset_code = secrets.token_urlsafe(32)
    expires_at = (datetime.now() + timedelta(hours=1)).isoformat()
    
    reset_code_escaped = reset_code.replace("'", "''")
    
    cur.execute(
        f"DELETE FROM t_p18253922_infinite_business_ca.password_reset_tokens WHERE user_id = {user_id}"
    )
    
    cur.execute(
        f"INSERT INTO t_p18253922_infinite_business_ca.password_reset_tokens (user_id, token, expires_at) VALUES ({user_id}, '{reset_code_escaped}', '{expires_at}')"
    )
    
    conn.commit()
    cur.close()
    conn.close()
    
    smtp_host = os.environ.get('SMTP_HOST', '')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_password = os.environ.get('SMTP_PASSWORD', '')
    
    if not all([smtp_host, smtp_user, smtp_password]):
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'SMTP не настроен'})
        }
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = 'Восстановление пароля - visitka.site'
    msg['From'] = smtp_user
    msg['To'] = email
    
    reset_link = f"https://visitka.site/reset-password?token={reset_code}"
    
    text_content = f'''
Здравствуйте, {user_name}!

Вы запросили восстановление пароля для вашего аккаунта на visitka.site.

Перейдите по ссылке для смены пароля:
{reset_link}

Ссылка действительна 1 час.

Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.

С уважением,
Команда visitka.site
'''
    
    html_content = f'''
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #D4AF37;">∞7 visitka.site</h2>
        <p>Здравствуйте, {user_name}!</p>
        <p>Вы запросили восстановление пароля для вашего аккаунта на visitka.site.</p>
        <p>
            <a href="{reset_link}" 
               style="display: inline-block; padding: 12px 24px; background-color: #D4AF37; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
                Восстановить пароль
            </a>
        </p>
        <p style="color: #666; font-size: 14px;">Ссылка действительна 1 час.</p>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">
            Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.
        </p>
    </div>
</body>
</html>
'''
    
    part1 = MIMEText(text_content, 'plain')
    part2 = MIMEText(html_content, 'html')
    msg.attach(part1)
    msg.attach(part2)
    
    try:
        with smtplib.SMTP_SSL(smtp_host, smtp_port) as server:
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Ошибка отправки письма: {str(e)}'})
        }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'success': True, 'message': 'Письмо с инструкцией отправлено'})
    }

def handle_verify(body_data: Dict[str, Any]) -> Dict[str, Any]:
    token = body_data.get('token', '').strip()
    new_password = body_data.get('password', '')
    
    if not token or not new_password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Токен и новый пароль обязательны'})
        }
    
    if len(new_password) < 6:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Пароль должен быть минимум 6 символов'})
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    token_escaped = token.replace("'", "''")
    now = datetime.now().isoformat()
    
    cur.execute(
        f"SELECT user_id FROM t_p18253922_infinite_business_ca.password_reset_tokens WHERE token = '{token_escaped}' AND expires_at > '{now}'"
    )
    result = cur.fetchone()
    
    if not result:
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Неверный или истекший токен'})
        }
    
    user_id = result[0]
    
    password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    password_hash_escaped = password_hash.replace("'", "''")
    
    cur.execute(
        f"UPDATE t_p18253922_infinite_business_ca.users SET password_hash = '{password_hash_escaped}' WHERE id = {user_id}"
    )
    
    cur.execute(
        f"DELETE FROM t_p18253922_infinite_business_ca.password_reset_tokens WHERE user_id = {user_id}"
    )
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'success': True, 'message': 'Пароль успешно изменён'})
    }