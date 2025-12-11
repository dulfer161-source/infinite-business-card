import json
import os
import hashlib
import jwt
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

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
    
    try:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if action == 'register':
            email = body.get('email')
            password = body.get('password')
            name = body.get('name')
            
            if not email or not password or not name:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Email, password and name are required'}),
                    'isBase64Encoded': False
                }
            
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            cur.execute(
                "INSERT INTO users (email, password_hash, name) VALUES (%s, %s, %s) RETURNING id, email, name",
                (email, password_hash, name)
            )
            user = dict(cur.fetchone())
            
            cur.execute(
                "INSERT INTO user_subscriptions (user_id, plan_id, status) VALUES (%s, 1, %s)",
                (user['id'], 'active')
            )
            
            conn.commit()
            
            token = jwt.encode(
                {'user_id': user['id'], 'email': user['email'], 'exp': datetime.utcnow() + timedelta(days=30)},
                'secret_key_change_in_production',
                algorithm='HS256'
            )
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'token': token, 'user': user}),
                'isBase64Encoded': False
            }
        
        elif action == 'login':
            email = body.get('email')
            password = body.get('password')
            
            if not email or not password:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Email and password are required'}),
                    'isBase64Encoded': False
                }
            
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            cur.execute(
                "SELECT id, email, name FROM users WHERE email = %s AND password_hash = %s",
                (email, password_hash)
            )
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 401,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Invalid credentials'}),
                    'isBase64Encoded': False
                }
            
            user = dict(user)
            
            token = jwt.encode(
                {'user_id': user['id'], 'email': user['email'], 'exp': datetime.utcnow() + timedelta(days=30)},
                'secret_key_change_in_production',
                algorithm='HS256'
            )
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'token': token, 'user': user}),
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
        return {
            'statusCode': 409,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'User with this email already exists'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
