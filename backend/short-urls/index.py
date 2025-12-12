"""
Backend функция для генерации и редиректа коротких ссылок на визитки.
Создает короткие URL вида visitka.site/abc123 вместо длинных ID.
"""

import json
import os
import random
import string
from typing import Dict, Any
import psycopg2

def generate_short_code(length: int = 6) -> str:
    """Генерирует случайный короткий код"""
    chars = string.ascii_lowercase + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Управление короткими ссылками визиток.
    
    POST /short-urls - создать короткую ссылку для визитки
    GET /short-urls/{code} - получить данные визитки по короткому коду
    """
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
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            card_id = body.get('card_id')
            custom_code = body.get('custom_code')
            
            if not card_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'card_id is required'}),
                    'isBase64Encoded': False
                }
            
            # Проверяем, есть ли уже короткая ссылка
            cur.execute('SELECT short_url FROM business_cards WHERE id = %s', (card_id,))
            existing = cur.fetchone()
            
            if existing and existing[0]:
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'short_url': existing[0]}),
                    'isBase64Encoded': False
                }
            
            # Генерируем уникальный код
            attempts = 0
            while attempts < 10:
                short_code = custom_code if custom_code else generate_short_code()
                
                # Проверяем уникальность
                cur.execute('SELECT id FROM business_cards WHERE short_url = %s', (short_code,))
                if not cur.fetchone():
                    # Сохраняем короткую ссылку
                    cur.execute(
                        'UPDATE business_cards SET short_url = %s WHERE id = %s',
                        (short_code, card_id)
                    )
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'short_url': short_code}),
                        'isBase64Encoded': False
                    }
                
                attempts += 1
                custom_code = None
            
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Failed to generate unique short URL'}),
                'isBase64Encoded': False
            }
        
        elif method == 'GET':
            params = event.get('queryStringParameters', {})
            short_code = params.get('code')
            
            if not short_code:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'code is required'}),
                    'isBase64Encoded': False
                }
            
            # Ищем визитку по короткому коду
            cur.execute("""
                SELECT id, name, position, company, phone, email, website, description, logo_url
                FROM business_cards 
                WHERE short_url = %s AND is_public = true
            """, (short_code,))
            
            card = cur.fetchone()
            
            if not card:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Card not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'id': card[0],
                    'name': card[1],
                    'position': card[2],
                    'company': card[3],
                    'phone': card[4],
                    'email': card[5],
                    'website': card[6],
                    'description': card[7],
                    'logo_url': card[8]
                }),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()
