import json
import os
import jwt
import hashlib
import hmac
import psycopg2
from datetime import datetime, timedelta
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Обрабатывает Telegram авторизацию через Login Widget
    Проверяет подпись данных от Telegram и возвращает JWT токен
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
            'body': ''
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
        
        telegram_id = body_data.get('id', '')
        first_name = body_data.get('first_name', '')
        last_name = body_data.get('last_name', '')
        username = body_data.get('username', '')
        photo_url = body_data.get('photo_url', '')
        auth_date = body_data.get('auth_date', '')
        hash_value = body_data.get('hash', '')
        
        if not telegram_id or not hash_value:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Missing required fields'})
            }
        
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
        
        data_check_string = '\n'.join([
            f'auth_date={auth_date}',
            f'first_name={first_name}',
            f'id={telegram_id}',
            f'last_name={last_name}' if last_name else '',
            f'photo_url={photo_url}' if photo_url else '',
            f'username={username}' if username else ''
        ])
        data_check_string = '\n'.join([line for line in data_check_string.split('\n') if line])
        
        secret_key = hashlib.sha256(bot_token.encode()).digest()
        calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
        
        if calculated_hash != hash_value:
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Invalid hash signature'})
            }
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        telegram_id_escaped = str(telegram_id).replace("'", "''")
        cur.execute(
            f"SELECT id, name, email FROM users WHERE telegram_id = '{telegram_id_escaped}'"
        )
        existing_user = cur.fetchone()
        
        if existing_user:
            user_id, user_name, user_email = existing_user
        else:
            full_name = f"{first_name} {last_name}".strip()
            full_name_escaped = full_name.replace("'", "''")
            username_escaped = username.replace("'", "''") if username else ''
            photo_escaped = photo_url.replace("'", "''") if photo_url else ''
            
            email = f"telegram_{telegram_id}@visitka.site"
            email_escaped = email.replace("'", "''")
            
            cur.execute(
                f"INSERT INTO users (name, email, telegram_id, avatar, provider) "
                f"VALUES ('{full_name_escaped}', '{email_escaped}', '{telegram_id_escaped}', '{photo_escaped}', 'telegram') "
                f"RETURNING id, name, email"
            )
            result = cur.fetchone()
            conn.commit()
            
            if not result:
                cur.close()
                conn.close()
                return {
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Failed to create user'})
                }
            
            user_id, user_name, user_email = result
        
        cur.close()
        conn.close()
        
        jwt_secret = os.environ.get('JWT_SECRET', 'default_secret_change_me')
        
        jwt_token = jwt.encode({
            'user_id': user_id,
            'name': user_name,
            'email': user_email,
            'picture': photo_url,
            'provider': 'telegram',
            'exp': datetime.utcnow() + timedelta(days=30)
        }, jwt_secret, algorithm='HS256')
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'token': jwt_token,
                'user': {
                    'id': user_id,
                    'name': user_name,
                    'email': user_email,
                    'picture': photo_url
                }
            })
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }