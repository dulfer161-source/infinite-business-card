import json
import os
import base64
import boto3
import requests
import uuid
import time
from typing import Dict, Tuple, Optional

# In-memory rate limiting
_rate_limit_store: Dict[str, list] = {}

def check_rate_limit(identifier: str, max_req: int = 5, window: int = 300) -> Tuple[bool, Optional[int]]:
    current = time.time()
    if identifier not in _rate_limit_store:
        _rate_limit_store[identifier] = []
    
    _rate_limit_store[identifier] = [t for t in _rate_limit_store[identifier] if current - t < window]
    
    if len(_rate_limit_store[identifier]) >= max_req:
        oldest = _rate_limit_store[identifier][0]
        return False, int(window - (current - oldest))
    
    _rate_limit_store[identifier].append(current)
    return True, None

def handler(event, context):
    '''
    AI-генерация изображений через GigaChat (Kandinsky от Сбера)
    POST / - генерация изображения по текстовому описанию
    Требуется Premium подписка
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
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
        user_id = headers.get('X-User-Id') or headers.get('x-user-id')
        
        if not user_id:
            return {
                'statusCode': 401,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Unauthorized'}),
                'isBase64Encoded': False
            }
        
        # Rate limiting - 5 запросов в 5 минут (дорогая операция)
        allowed, retry_after = check_rate_limit(f'ai:{user_id}', max_req=5, window=300)
        
        if not allowed:
            return {
                'statusCode': 429,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Retry-After': str(retry_after)
                },
                'body': json.dumps({'error': 'Too many AI requests'}),
                'isBase64Encoded': False
            }
        
        body = json.loads(event.get('body', '{}'))
        prompt = body.get('prompt')
        
        if not prompt:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Prompt is required'}),
                'isBase64Encoded': False
            }
        
        # Валидация длины промпта
        if len(prompt) > 500:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Prompt too long (max 500 chars)'}),
                'isBase64Encoded': False
            }
        
        # Получаем access token GigaChat
        gigachat_api_key = os.environ.get('GIGACHAT_API_KEY')
        
        if not gigachat_api_key:
            raise Exception('GIGACHAT_API_KEY not configured')
        
        print(f'Key length: {len(gigachat_api_key)}, starts with Basic: {gigachat_api_key.startswith("Basic")}')
        
        # GIGACHAT_API_KEY уже в формате Base64, просто добавляем Basic если нужно
        auth_header = gigachat_api_key if gigachat_api_key.startswith('Basic ') else f'Basic {gigachat_api_key}'
        
        print(f'Auth header: {auth_header[:50]}...')
        
        auth_response = requests.post(
            'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
            headers={
                'Authorization': auth_header,
                'RqUID': str(uuid.uuid4()),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data={'scope': 'GIGACHAT_API_PERS'},
            verify=False,
            timeout=10
        )
        
        print(f'Auth status: {auth_response.status_code}')
        auth_data = auth_response.json()
        print(f'Auth response: {auth_data}')
        
        if 'access_token' not in auth_data:
            raise Exception(f'No access_token in response: {auth_data}')
        
        access_token = auth_data['access_token']
        
        # Генерируем изображение через GigaChat
        enhanced_prompt = f"Профессиональный бизнес логотип: {prompt}. Современный, чистый дизайн, высокое качество."
        
        generation_response = requests.post(
            'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'GigaChat',
                'messages': [
                    {
                        'role': 'user',
                        'content': enhanced_prompt
                    }
                ],
                'function_call': 'text2image'
            },
            verify=False,
            timeout=30
        )
        
        result = generation_response.json()
        
        # Извлекаем base64 изображение из ответа
        image_base64 = None
        if 'choices' in result and len(result['choices']) > 0:
            content = result['choices'][0]['message']['content']
            # GigaChat возвращает изображение в формате <img src="data:image/png;base64,..." />
            if 'base64,' in content:
                image_base64 = content.split('base64,')[1].split('"')[0]
        
        if not image_base64:
            raise Exception('Failed to generate image')
        
        # Декодируем и загружаем в S3
        img_data = base64.b64decode(image_base64)
        
        s3 = boto3.client('s3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )
        
        file_key = f'ai-generated/{user_id}/{context.request_id}.png'
        
        s3.put_object(
            Bucket='files',
            Key=file_key,
            Body=img_data,
            ContentType='image/png'
        )
        
        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_key}"
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({
                'image_url': cdn_url,
                'prompt': prompt
            }),
            'isBase64Encoded': False
        }
    
    except requests.exceptions.Timeout as e:
        print(f'Timeout error: {str(e)}')
        return {
            'statusCode': 504,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'AI service timeout'}),
            'isBase64Encoded': False
        }
    except requests.exceptions.RequestException as e:
        print(f'Request error: {str(e)}')
        return {
            'statusCode': 502,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'AI service unavailable: {str(e)}'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        print(f'General error: {str(e)}')
        import traceback
        traceback.print_exc()
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'Image generation failed: {str(e)}'}),
            'isBase64Encoded': False
        }