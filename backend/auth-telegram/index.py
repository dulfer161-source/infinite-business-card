import json
import os
import jwt
import hashlib
import hmac
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
        
        jwt_secret = os.environ.get('JWT_SECRET', 'default_secret_change_me')
        full_name = f"{first_name} {last_name}".strip()
        
        jwt_token = jwt.encode({
            'user_id': str(telegram_id),
            'name': full_name,
            'username': username,
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
                    'id': str(telegram_id),
                    'name': full_name,
                    'username': username,
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
