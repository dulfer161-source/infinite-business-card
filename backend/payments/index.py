import json
import os
import uuid
import requests
import base64
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event, context):
    '''
    Обработка платежей через ЮKassa
    POST - создание платежа
    GET - проверка статуса платежа по payment_id
    '''
    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'create')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'POST':
            headers = event.get('headers', {})
            user_id = headers.get('X-User-Id') or headers.get('x-user-id')
            
            if not user_id:
                return {
                    'statusCode': 401,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Unauthorized'}),
                    'isBase64Encoded': False
                }
            
            body = json.loads(event.get('body', '{}'))
            amount = body.get('amount')
            payment_type = body.get('payment_type')
            
            if not amount or not payment_type:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Amount and payment_type are required'}),
                    'isBase64Encoded': False
                }
            
            idempotence_key = str(uuid.uuid4())
            
            shop_id = os.environ.get('YUKASSA_SHOP_ID')
            secret_key = os.environ.get('YUKASSA_SECRET_KEY')
            
            auth_string = f"{shop_id}:{secret_key}"
            auth_bytes = base64.b64encode(auth_string.encode()).decode()
            
            payment_data = {
                'amount': {
                    'value': str(amount),
                    'currency': 'RUB'
                },
                'confirmation': {
                    'type': 'redirect',
                    'return_url': body.get('return_url', 'https://visitka.site/dashboard')
                },
                'capture': True,
                'description': f'{payment_type} payment',
                'payment_method_data': {
                    'type': 'bank_card'
                }
            }
            
            payment_methods = body.get('payment_methods', ['bank_card', 'sbp', 'yoo_money'])
            if 'mir' in payment_methods or 'bank_card' in payment_methods:
                payment_data['payment_method_data'] = {'type': 'bank_card'}
            
            yukassa_response = requests.post(
                'https://api.yookassa.ru/v3/payments',
                headers={
                    'Authorization': f'Basic {auth_bytes}',
                    'Idempotence-Key': idempotence_key,
                    'Content-Type': 'application/json'
                },
                json=payment_data
            )
            
            yukassa_data = yukassa_response.json()
            
            cur.execute(
                """
                INSERT INTO t_p18253922_infinite_business_ca.payments 
                (user_id, amount, payment_type, payment_provider, provider_payment_id, status, metadata)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (
                    user_id,
                    amount,
                    payment_type,
                    'yukassa',
                    yukassa_data.get('id'),
                    yukassa_data.get('status'),
                    json.dumps(yukassa_data)
                )
            )
            payment = dict(cur.fetchone())
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({
                    'payment': payment,
                    'confirmation_url': yukassa_data.get('confirmation', {}).get('confirmation_url')
                }, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'GET':
            params = event.get('queryStringParameters', {})
            payment_id = params.get('payment_id')
            
            if not payment_id:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'payment_id is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "SELECT * FROM t_p18253922_infinite_business_ca.payments WHERE id = %s",
                (payment_id,)
            )
            payment = cur.fetchone()
            
            if not payment:
                return {
                    'statusCode': 404,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Payment not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'payment': dict(payment)}, default=str),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 404,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Not found'}),
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