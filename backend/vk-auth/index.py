import json
import os
import urllib.request
import urllib.parse
import psycopg2
from datetime import datetime, timedelta
import jwt

def handler(event, context):
    '''
    Авторизация через ВКонтакте OAuth
    POST /callback - обработка callback от VK с кодом авторизации
    GET /url - получение URL для авторизации через VK
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    vk_app_id = os.environ.get('VK_APP_ID')
    vk_app_secret = os.environ.get('VK_SECRET_KEY')
    
    if not vk_app_id or not vk_app_secret:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'VK credentials not configured'}),
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        redirect_uri = event.get('queryStringParameters', {}).get('redirect_uri', 'https://visitka.site/auth/vk')
        
        auth_url = f"https://oauth.vk.com/authorize?client_id={vk_app_id}&display=page&redirect_uri={urllib.parse.quote(redirect_uri)}&scope=email&response_type=code&v=5.131"
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'auth_url': auth_url}),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body = json.loads(event.get('body', '{}'))
        code = body.get('code')
        redirect_uri = body.get('redirect_uri', 'https://visitka.site/auth/vk')
        
        if not code:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Authorization code required'}),
                'isBase64Encoded': False
            }
        
        token_url = f"https://oauth.vk.com/access_token?client_id={vk_app_id}&client_secret={vk_app_secret}&redirect_uri={urllib.parse.quote(redirect_uri)}&code={code}"
        
        with urllib.request.urlopen(token_url) as response:
            token_data = json.loads(response.read())
        
        if 'error' in token_data:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': token_data.get('error_description', 'VK auth failed')}),
                'isBase64Encoded': False
            }
        
        access_token = token_data.get('access_token')
        vk_user_id = token_data.get('user_id')
        vk_email = token_data.get('email')
        
        user_info_url = f"https://api.vk.com/method/users.get?user_ids={vk_user_id}&fields=photo_200&access_token={access_token}&v=5.131"
        
        with urllib.request.urlopen(user_info_url) as response:
            user_info = json.loads(response.read())
        
        if 'error' in user_info or not user_info.get('response'):
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Failed to get user info'}),
                'isBase64Encoded': False
            }
        
        vk_user = user_info['response'][0]
        full_name = f"{vk_user.get('first_name', '')} {vk_user.get('last_name', '')}".strip()
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        cur.execute(
            "SELECT id, email FROM t_p18253922_infinite_business_ca.users WHERE vk_id = %s",
            (str(vk_user_id),)
        )
        existing_user = cur.fetchone()
        
        if existing_user:
            user_id = existing_user[0]
        else:
            if not vk_email:
                vk_email = f"vk{vk_user_id}@visitka.site"
            
            cur.execute(
                "INSERT INTO t_p18253922_infinite_business_ca.users (email, name, vk_id, created_at) VALUES (%s, %s, %s, %s) RETURNING id",
                (vk_email, full_name, str(vk_user_id), datetime.now())
            )
            user_id = cur.fetchone()[0]
        
        expires_at = datetime.utcnow() + timedelta(days=30)
        
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
            {'user_id': user_id, 'email': vk_email, 'exp': expires_at},
            jwt_secret,
            algorithm='HS256'
        )
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({
                'token': token,
                'user': {
                    'id': user_id,
                    'email': vk_email,
                    'name': full_name
                }
            }),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }