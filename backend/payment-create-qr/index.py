import json
import os
import uuid
import psycopg2
from psycopg2.extras import RealDictCursor
import requests
import base64

def handler(event, context):
    '''
    Создание платежа с QR-кодом для СБП через ЮКасса
    POST / - создать платёж с QR-кодом
    '''
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
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
        headers = event.get('headers', {})
        auth_token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
        
        if not auth_token:
            return {
                'statusCode': 401,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Unauthorized'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute(f"SELECT user_id FROM t_p18253922_infinite_business_ca.auth_tokens WHERE token = '{auth_token}' AND expires_at > NOW()")
        token_row = cur.fetchone()
        
        if not token_row:
            return {
                'statusCode': 401,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Invalid token'}),
                'isBase64Encoded': False
            }
        
        user_id = token_row['user_id']
        
        body = json.loads(event.get('body', '{}'))
        amount = body.get('amount')
        description = body.get('description', 'Оплата подписки')
        
        if not amount:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Amount is required'}),
                'isBase64Encoded': False
            }
        
        shop_id = os.environ.get('YOOKASSA_SHOP_ID') or os.environ.get('YUKASSA_SHOP_ID')
        secret_key = os.environ.get('YOOKASSA_SECRET_KEY') or os.environ.get('YUKASSA_SECRET_KEY')
        
        if not shop_id or not secret_key:
            return {
                'statusCode': 500,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Payment provider not configured'}),
                'isBase64Encoded': False
            }
        
        idempotence_key = str(uuid.uuid4())
        
        auth_string = f"{shop_id}:{secret_key}"
        auth_header = base64.b64encode(auth_string.encode()).decode()
        
        yookassa_payload = {
            'amount': {
                'value': str(amount),
                'currency': 'RUB'
            },
            'confirmation': {
                'type': 'qr'
            },
            'capture': True,
            'description': description,
            'metadata': {
                'user_id': user_id
            },
            'receipt': {
                'customer': {
                    'email': 'noreply@visitka.site'
                },
                'items': [{
                    'description': description[:128],
                    'quantity': '1',
                    'amount': {
                        'value': str(amount),
                        'currency': 'RUB'
                    },
                    'vat_code': 1,
                    'payment_subject': 'commodity',
                    'payment_mode': 'full_payment'
                }]
            }
        }
        
        yookassa_response = requests.post(
            'https://api.yookassa.ru/v3/payments',
            json=yookassa_payload,
            headers={
                'Authorization': f'Basic {auth_header}',
                'Idempotence-Key': idempotence_key,
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        
        if yookassa_response.status_code != 200:
            error_data = yookassa_response.json()
            return {
                'statusCode': 500,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Payment creation failed', 'details': error_data}),
                'isBase64Encoded': False
            }
        
        payment_data = yookassa_response.json()
        
        cur.execute("SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM t_p18253922_infinite_business_ca.payments")
        next_id = cur.fetchone()['next_id']
        
        metadata_json = json.dumps({'description': description, 'idempotence_key': idempotence_key}).replace("'", "''")
        
        cur.execute(
            f"""
            INSERT INTO t_p18253922_infinite_business_ca.payments 
            (id, user_id, amount, currency, payment_type, payment_provider, provider_payment_id, status, metadata)
            VALUES ({next_id}, {int(user_id)}, {float(amount)}, 'RUB', 'subscription', 'yookassa', '{payment_data['id']}', '{payment_data['status']}', '{metadata_json}')
            RETURNING *
            """
        )
        
        payment_record = dict(cur.fetchone())
        conn.commit()
        
        qr_data = payment_data.get('confirmation', {}).get('confirmation_data', '')
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({
                'payment_id': payment_record['id'],
                'provider_payment_id': payment_data['id'],
                'qr_data': qr_data,
                'status': payment_data['status']
            }),
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