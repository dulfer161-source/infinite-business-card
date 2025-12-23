import json
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Проверяет наличие всех секретов в окружении
    """
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
    
    secrets_status = {
        'database': {
            'DATABASE_URL': bool(os.environ.get('DATABASE_URL'))
        },
        'storage': {
            'AWS_ACCESS_KEY_ID': bool(os.environ.get('AWS_ACCESS_KEY_ID')),
            'AWS_SECRET_ACCESS_KEY': bool(os.environ.get('AWS_SECRET_ACCESS_KEY'))
        },
        'auth': {
            'JWT_SECRET': bool(os.environ.get('JWT_SECRET'))
        },
        'email': {
            'SMTP_HOST': bool(os.environ.get('SMTP_HOST')),
            'SMTP_PORT': bool(os.environ.get('SMTP_PORT')),
            'SMTP_USER': bool(os.environ.get('SMTP_USER')),
            'SMTP_PASSWORD': bool(os.environ.get('SMTP_PASSWORD')),
            'ADMIN_EMAIL': bool(os.environ.get('ADMIN_EMAIL'))
        },
        'oauth': {
            'VK_APP_ID': bool(os.environ.get('VK_APP_ID')),
            'VK_SECRET_KEY': bool(os.environ.get('VK_SECRET_KEY')),
            'YANDEX_CLIENT_ID': bool(os.environ.get('YANDEX_CLIENT_ID')),
            'YANDEX_CLIENT_SECRET': bool(os.environ.get('YANDEX_CLIENT_SECRET'))
        },
        'payments': {
            'YUKASSA_SHOP_ID': bool(os.environ.get('YUKASSA_SHOP_ID')),
            'YUKASSA_SECRET_KEY': bool(os.environ.get('YUKASSA_SECRET_KEY'))
        },
        'ai': {
            'GIGACHAT_API_KEY': bool(os.environ.get('GIGACHAT_API_KEY'))
        }
    }
    
    # Подсчет статистики
    total = 0
    configured = 0
    
    for category, secrets in secrets_status.items():
        for secret, is_set in secrets.items():
            total += 1
            if is_set:
                configured += 1
    
    result = {
        'secrets': secrets_status,
        'summary': {
            'total': total,
            'configured': configured,
            'missing': total - configured,
            'percentage': round(configured / total * 100, 1)
        }
    }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps(result, ensure_ascii=False)
    }