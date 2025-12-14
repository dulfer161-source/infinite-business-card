import json
import os
import uuid
import base64
import requests
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для работы с платежами через ЮKassa
    Создание платежей, проверка статуса, webhook обработка
    '''
    method: str = event.get('httpMethod', 'GET')
    
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
    
    query_params = event.get('queryStringParameters', {}) or {}
    action = query_params.get('action', '')
    
    shop_id = os.environ.get('YOOKASSA_SHOP_ID')
    secret_key = os.environ.get('YOOKASSA_SECRET_KEY')
    
    if action and action != 'webhook':
        if not shop_id or not secret_key:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Payment system not configured',
                    'message': 'Платёжная система не настроена. Добавьте YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY.'
                }),
                'isBase64Encoded': False
            }
    
    auth_string = f"{shop_id}:{secret_key}" if shop_id and secret_key else ":"
    auth_header = base64.b64encode(auth_string.encode()).decode()
    
    headers = {
        'Authorization': f'Basic {auth_header}',
        'Content-Type': 'application/json',
        'Idempotence-Key': str(uuid.uuid4())
    }
    
    if method == 'POST' and action == 'create':
        return create_payment(event, headers)
    
    if method == 'GET' and action == 'status':
        payment_id = query_params.get('payment_id', '')
        if payment_id:
            return get_payment_status(payment_id, headers)
    
    if method == 'POST' and action == 'webhook':
        return handle_webhook(event)
    
    return {
        'statusCode': 404,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Not found'}),
        'isBase64Encoded': False
    }

def create_payment(event: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    
    amount = body_data.get('amount')
    description = body_data.get('description', 'Оплата подписки')
    return_url = body_data.get('return_url', 'https://visitka.site')
    user_email = body_data.get('email')
    user_phone = body_data.get('phone')
    
    if not amount or amount <= 0:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid amount'}),
            'isBase64Encoded': False
        }
    
    payment_data = {
        'amount': {
            'value': str(amount),
            'currency': 'RUB'
        },
        'confirmation': {
            'type': 'redirect',
            'return_url': return_url
        },
        'capture': True,
        'description': description,
        'metadata': {
            'order_id': str(uuid.uuid4())
        }
    }
    
    if user_email:
        payment_data['receipt'] = {
            'customer': {
                'email': user_email
            },
            'items': [{
                'description': description,
                'quantity': '1',
                'amount': {
                    'value': str(amount),
                    'currency': 'RUB'
                },
                'vat_code': 1
            }]
        }
    
    try:
        response = requests.post(
            'https://api.yookassa.ru/v3/payments',
            headers=headers,
            json=payment_data,
            timeout=10
        )
        
        if response.status_code in [200, 201]:
            payment_response = response.json()
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'payment_id': payment_response.get('id'),
                    'status': payment_response.get('status'),
                    'confirmation_url': payment_response.get('confirmation', {}).get('confirmation_url'),
                    'amount': payment_response.get('amount', {}).get('value'),
                    'currency': payment_response.get('amount', {}).get('currency')
                }),
                'isBase64Encoded': False
            }
        else:
            return {
                'statusCode': response.status_code,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Payment creation failed',
                    'details': response.text
                }),
                'isBase64Encoded': False
            }
    except requests.RequestException as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Request failed',
                'message': str(e)
            }),
            'isBase64Encoded': False
        }

def get_payment_status(payment_id: str, headers: Dict[str, str]) -> Dict[str, Any]:
    try:
        response = requests.get(
            f'https://api.yookassa.ru/v3/payments/{payment_id}',
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            payment_data = response.json()
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'payment_id': payment_data.get('id'),
                    'status': payment_data.get('status'),
                    'paid': payment_data.get('paid', False),
                    'amount': payment_data.get('amount', {}).get('value'),
                    'created_at': payment_data.get('created_at')
                }),
                'isBase64Encoded': False
            }
        else:
            return {
                'statusCode': response.status_code,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Payment not found'}),
                'isBase64Encoded': False
            }
    except requests.RequestException as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Request failed',
                'message': str(e)
            }),
            'isBase64Encoded': False
        }

def handle_webhook(event: Dict[str, Any]) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    
    event_type = body_data.get('event')
    payment = body_data.get('object', {})
    
    payment_id = payment.get('id')
    status = payment.get('status')
    paid = payment.get('paid', False)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'received': True,
            'payment_id': payment_id,
            'status': status,
            'paid': paid
        }),
        'isBase64Encoded': False
    }