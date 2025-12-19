import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event, context):
    '''
    Управление визитками пользователя
    GET / - получить визитки пользователя
    GET /{id} - публичный просмотр визитки
    POST / - создать новую визитку
    POST /{id}/view - записать просмотр визитки
    PUT / - обновить визитку
    '''
    method = event.get('httpMethod', 'GET')
    path_params = event.get('pathParams', {})
    card_id = path_params.get('id')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Public GET card by ID (using query param ?id=123)
        query_params = event.get('queryStringParameters', {})
        card_id_query = query_params.get('id') if query_params else None
        
        if method == 'GET' and card_id_query:
            cur.execute(f"SELECT * FROM t_p18253922_infinite_business_ca.business_cards WHERE id = {int(card_id_query)}")
            card = cur.fetchone()
            
            if not card:
                return {
                    'statusCode': 404,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Card not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'card': dict(card)}, default=str),
                'isBase64Encoded': False
            }
        
        # Track view (using query param ?id=123)
        if method == 'POST' and card_id_query:
            request_ctx = event.get('requestContext', {})
            identity = request_ctx.get('identity', {})
            source_ip = identity.get('sourceIp', 'unknown').replace("'", "''")
            user_agent = identity.get('userAgent', 'unknown').replace("'", "''")
            
            cur.execute(
                f"""
                INSERT INTO t_p18253922_infinite_business_ca.card_views (card_id, viewer_ip, viewer_user_agent)
                VALUES ({int(card_id_query)}, '{source_ip}', '{user_agent}')
                """
            )
            
            cur.execute(
                f"UPDATE t_p18253922_infinite_business_ca.business_cards SET view_count = view_count + 1 WHERE id = {int(card_id_query)}"
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        # All other methods require authentication
        headers = event.get('headers', {})
        auth_token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
        
        if not auth_token:
            return {
                'statusCode': 401,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Unauthorized - no token'}),
                'isBase64Encoded': False
            }
        
        # Get user_id from token
        cur.execute(f"SELECT user_id FROM t_p18253922_infinite_business_ca.auth_tokens WHERE token = '{auth_token}' AND expires_at > NOW()")
        token_row = cur.fetchone()
        
        if not token_row:
            return {
                'statusCode': 401,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Unauthorized - invalid token'}),
                'isBase64Encoded': False
            }
        
        user_id = token_row['user_id']
        
        if method == 'GET':
            cur.execute(
                f"SELECT * FROM t_p18253922_infinite_business_ca.business_cards WHERE user_id = {int(user_id)} ORDER BY created_at DESC"
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
            
            name = body.get('name', '').replace("'", "''")
            position = body.get('position', '').replace("'", "''")
            company = body.get('company', '').replace("'", "''")
            phone = body.get('phone', '').replace("'", "''")
            email = body.get('email', '').replace("'", "''")
            website = body.get('website', '').replace("'", "''")
            description = body.get('description', '').replace("'", "''")
            
            cur.execute(
                f"""
                INSERT INTO t_p18253922_infinite_business_ca.business_cards 
                (user_id, name, position, company, phone, email, website, description)
                VALUES ({int(user_id)}, '{name}', '{position}', '{company}', '{phone}', '{email}', '{website}', '{description}')
                RETURNING *
                """
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
            
            name = body.get('name', '').replace("'", "''")
            position = body.get('position', '').replace("'", "''")
            company = body.get('company', '').replace("'", "''")
            phone = body.get('phone', '').replace("'", "''")
            email = body.get('email', '').replace("'", "''")
            website = body.get('website', '').replace("'", "''")
            description = body.get('description', '').replace("'", "''")
            
            cur.execute(
                f"""
                UPDATE t_p18253922_infinite_business_ca.business_cards 
                SET name = '{name}', position = '{position}', company = '{company}', phone = '{phone}', 
                    email = '{email}', website = '{website}', description = '{description}', updated_at = CURRENT_TIMESTAMP
                WHERE id = {int(card_id)} AND user_id = {int(user_id)}
                RETURNING *
                """
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
        import traceback
        error_details = traceback.format_exc()
        print(f"ERROR: {error_details}")
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e), 'details': error_details}),
            'isBase64Encoded': False
        }
    
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()