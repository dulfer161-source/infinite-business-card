import json
import os
import jwt
from urllib.parse import urlencode, parse_qs
from datetime import datetime, timedelta
import requests
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Обрабатывает OAuth авторизацию через Google
    Обменивает код на токен доступа и возвращает JWT токен
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters', {})
        action = params.get('action', '')
        
        if action == 'login':
            client_id = os.environ.get('GOOGLE_CLIENT_ID', '')
            redirect_uri = params.get('redirect_uri', 'https://preview--infinite-business-card.poehali.dev/auth/google')
            
            google_auth_url = 'https://accounts.google.com/o/oauth2/v2/auth?' + urlencode({
                'client_id': client_id,
                'redirect_uri': redirect_uri,
                'response_type': 'code',
                'scope': 'openid email profile',
                'access_type': 'online',
                'prompt': 'select_account'
            })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'auth_url': google_auth_url})
            }
        
        elif action == 'callback':
            code = params.get('code', '')
            redirect_uri = params.get('redirect_uri', 'https://preview--infinite-business-card.poehali.dev/auth/google')
            
            if not code:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'No authorization code provided'})
                }
            
            client_id = os.environ.get('GOOGLE_CLIENT_ID', '')
            client_secret = os.environ.get('GOOGLE_CLIENT_SECRET', '')
            
            token_response = requests.post('https://oauth2.googleapis.com/token', data={
                'code': code,
                'client_id': client_id,
                'client_secret': client_secret,
                'redirect_uri': redirect_uri,
                'grant_type': 'authorization_code'
            })
            
            if token_response.status_code != 200:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Failed to get access token'})
                }
            
            token_data = token_response.json()
            access_token = token_data.get('access_token', '')
            
            user_response = requests.get('https://www.googleapis.com/oauth2/v2/userinfo', 
                                        headers={'Authorization': f'Bearer {access_token}'})
            
            if user_response.status_code != 200:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Failed to get user info'})
                }
            
            user_data = user_response.json()
            
            jwt_secret = os.environ.get('JWT_SECRET', 'default_secret_change_me')
            jwt_token = jwt.encode({
                'user_id': user_data.get('id', ''),
                'email': user_data.get('email', ''),
                'name': user_data.get('name', ''),
                'picture': user_data.get('picture', ''),
                'provider': 'google',
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
                        'id': user_data.get('id', ''),
                        'email': user_data.get('email', ''),
                        'name': user_data.get('name', ''),
                        'picture': user_data.get('picture', '')
                    }
                })
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }
