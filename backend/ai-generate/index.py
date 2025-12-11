import json
import os
import base64
import boto3
from openai import OpenAI

def handler(event, context):
    '''
    AI-генерация изображений через DALL-E 3
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
        
        body = json.loads(event.get('body', '{}'))
        prompt = body.get('prompt')
        
        if not prompt:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Prompt is required'}),
                'isBase64Encoded': False
            }
        
        client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
        
        response = client.images.generate(
            model="dall-e-3",
            prompt=f"Professional business logo or image: {prompt}. Modern, clean, high quality.",
            size="1024x1024",
            quality="standard",
            n=1
        )
        
        image_url = response.data[0].url
        
        s3 = boto3.client('s3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )
        
        import urllib.request
        img_data = urllib.request.urlopen(image_url).read()
        
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
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
