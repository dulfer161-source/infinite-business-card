import json
import os
import urllib.request
import urllib.parse
import jwt
import psycopg2
from datetime import datetime, timedelta
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Авторизация через Яндекс OAuth
    GET ?action=login&redirect_uri=... - получить URL для редиректа на Яндекс
    GET ?action=callback&code=...&redirect_uri=... - обработка callback от Яндекса
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')
    
    yandex_client_id = os.environ.get('YANDEX_CLIENT_ID')
    yandex_client_secret = os.environ.get('YANDEX_CLIENT_SECRET')
    jwt_secret = os.environ.get('JWT_SECRET')
    
    if not yandex_client_id or not yandex_client_secret or not jwt_secret:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Server configuration error'}),
            'isBase64Encoded': False
        }
    
    try:
        if action == 'login':
            redirect_uri = params.get('redirect_uri', '')
            if not redirect_uri:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'redirect_uri is required'}),
                    'isBase64Encoded': False
                }
            
            auth_url = (
                f"https://oauth.yandex.ru/authorize?"
                f"response_type=code&"
                f"client_id={urllib.parse.quote(yandex_client_id)}&"
                f"redirect_uri={urllib.parse.quote(redirect_uri)}"
            )
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'auth_url': auth_url}),
                'isBase64Encoded': False
            }
        
        elif action == 'callback':
            code = params.get('code', '')
            redirect_uri = params.get('redirect_uri', '')
            
            if not code or not redirect_uri:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'code and redirect_uri are required'}),
                    'isBase64Encoded': False
                }
            
            # Обмен кода на токен
            token_data = urllib.parse.urlencode({
                'grant_type': 'authorization_code',
                'code': code,
                'client_id': yandex_client_id,
                'client_secret': yandex_client_secret
            }).encode()
            
            token_req = urllib.request.Request(
                'https://oauth.yandex.ru/token',
                data=token_data,
                headers={'Content-Type': 'application/x-www-form-urlencoded'}
            )
            
            with urllib.request.urlopen(token_req) as response:
                token_response = json.loads(response.read().decode())
            
            access_token = token_response.get('access_token')
            if not access_token:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Failed to get access token'}),
                    'isBase64Encoded': False
                }
            
            # Получение информации о пользователе
            user_req = urllib.request.Request(
                'https://login.yandex.ru/info',
                headers={'Authorization': f'OAuth {access_token}'}
            )
            
            with urllib.request.urlopen(user_req) as response:
                user_data = json.loads(response.read().decode())
            
            yandex_id = user_data.get('id')
            email = user_data.get('default_email') or user_data.get('emails', [None])[0]
            name = user_data.get('display_name') or user_data.get('real_name') or 'Пользователь Яндекс'
            
            if not yandex_id:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Failed to get user info'}),
                    'isBase64Encoded': False
                }
            
            # Работа с БД
            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cur = conn.cursor()
            
            try:
                # Ищем пользователя по yandex_id (Simple Query - без параметров!)
                yandex_id_escaped = str(yandex_id).replace("'", "''")
                cur.execute(
                    f"SELECT id, email, name FROM t_p18253922_infinite_business_ca.users WHERE yandex_id = '{yandex_id_escaped}'"
                )
                user_row = cur.fetchone()
                
                if user_row:
                    user_id, user_email, user_name = user_row
                else:
                    # Создаем нового пользователя
                    import random
                    import string
                    new_referral_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
                    
                    user_email = email or f'yandex_{yandex_id}@temp.local'
                    user_name_escaped = name.replace("'", "''")
                    user_email_escaped = user_email.replace("'", "''")
                    
                    cur.execute(
                        f"""INSERT INTO t_p18253922_infinite_business_ca.users 
                        (email, name, yandex_id, referral_code) 
                        VALUES ('{user_email_escaped}', '{user_name_escaped}', '{yandex_id_escaped}', '{new_referral_code}') 
                        RETURNING id, email, name"""
                    )
                    user_row = cur.fetchone()
                    user_id, user_email, user_name = user_row
                    
                    # Добавляем бесплатную подписку
                    cur.execute(
                        f"INSERT INTO t_p18253922_infinite_business_ca.user_subscriptions (user_id, plan_id, status) VALUES ({user_id}, 1, 'active')"
                    )
                
                conn.commit()
                
                # Создаем JWT токен
                token = jwt.encode(
                    {'user_id': user_id, 'email': user_email, 'exp': datetime.utcnow() + timedelta(days=30)},
                    jwt_secret,
                    algorithm='HS256'
                )
                
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({
                        'token': token,
                        'user': {'id': user_id, 'email': user_email, 'name': user_name}
                    }),
                    'isBase64Encoded': False
                }
            finally:
                cur.close()
                conn.close()
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Invalid action'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }