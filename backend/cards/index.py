import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event, context):
    '''
    Управление визитками
    GET / - получить визитки пользователя
    POST / - создать новую визитку
    PUT /{id} - обновить визитку
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        headers = event.get('headers', {})
        user_id = headers.get('X-User-Id') or headers.get('x-user-id')
        
        if not user_id:
            return {
                'statusCode': 401,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Unauthorized'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            cur.execute(
                "SELECT * FROM business_cards WHERE user_id = %s ORDER BY created_at DESC",
                (user_id,)
            )
            cards = [dict(row) for row in cur.fetchall()]
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'cards': cards}, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            cur.execute(
                """
                INSERT INTO business_cards 
                (user_id, name, position, company, phone, email, website, description)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (
                    user_id,
                    body.get('name'),
                    body.get('position'),
                    body.get('company'),
                    body.get('phone'),
                    body.get('email'),
                    body.get('website'),
                    body.get('description')
                )
            )
            card = dict(cur.fetchone())
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'card': card}, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            card_id = body.get('id')
            
            if not card_id:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Card ID is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """
                UPDATE business_cards 
                SET name = %s, position = %s, company = %s, phone = %s, 
                    email = %s, website = %s, description = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s AND user_id = %s
                RETURNING *
                """,
                (
                    body.get('name'),
                    body.get('position'),
                    body.get('company'),
                    body.get('phone'),
                    body.get('email'),
                    body.get('website'),
                    body.get('description'),
                    card_id,
                    user_id
                )
            )
            card = cur.fetchone()
            
            if not card:
                return {
                    'statusCode': 404,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Card not found'}),
                    'isBase64Encoded': False
                }
            
            card = dict(card)
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'card': card}, default=str),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Method not allowed'}),
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
