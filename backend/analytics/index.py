"""
Backend функция для аналитики просмотров визиток.
Записывает статистику посещений и возвращает данные для дашборда.
"""

import json
import os
from typing import Dict, Any
import psycopg2
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Обрабатывает запросы аналитики визиток.
    
    GET /analytics?card_id=123 - получить статистику визитки
    POST /analytics - записать просмотр визитки
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
        if method == 'GET':
            params = event.get('queryStringParameters', {})
            card_id = params.get('card_id')
            
            if not card_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'card_id is required'}),
                    'isBase64Encoded': False
                }
            
            # Получаем статистику просмотров
            cur.execute("""
                SELECT 
                    COUNT(*) as total_views,
                    COUNT(DISTINCT viewer_ip) as unique_visitors,
                    COUNT(DISTINCT DATE(viewed_at)) as days_active
                FROM card_views 
                WHERE card_id = %s
            """, (card_id,))
            stats = cur.fetchone()
            
            # Получаем последние просмотры
            cur.execute("""
                SELECT viewer_country, viewer_city, viewed_at, referer
                FROM card_views 
                WHERE card_id = %s 
                ORDER BY viewed_at DESC 
                LIMIT 10
            """, (card_id,))
            recent_views = cur.fetchall()
            
            # Просмотры по дням (последние 7 дней)
            cur.execute("""
                SELECT DATE(viewed_at) as date, COUNT(*) as views
                FROM card_views 
                WHERE card_id = %s AND viewed_at >= CURRENT_DATE - INTERVAL '7 days'
                GROUP BY DATE(viewed_at)
                ORDER BY date
            """, (card_id,))
            daily_views = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'total_views': stats[0] or 0,
                    'unique_visitors': stats[1] or 0,
                    'days_active': stats[2] or 0,
                    'recent_views': [
                        {
                            'country': v[0],
                            'city': v[1],
                            'timestamp': v[2].isoformat() if v[2] else None,
                            'referer': v[3]
                        } for v in recent_views
                    ],
                    'daily_views': [
                        {'date': str(d[0]), 'views': d[1]} for d in daily_views
                    ]
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            card_id = body.get('card_id')
            
            if not card_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'card_id is required'}),
                    'isBase64Encoded': False
                }
            
            # Извлекаем данные о просмотре
            request_context = event.get('requestContext', {})
            identity = request_context.get('identity', {})
            headers = event.get('headers', {})
            
            viewer_ip = identity.get('sourceIp', '')
            user_agent = identity.get('userAgent', '')
            referer = headers.get('Referer', headers.get('referer', ''))
            
            # Записываем просмотр
            cur.execute("""
                INSERT INTO card_views (card_id, viewer_ip, referer, user_agent, viewed_at)
                VALUES (%s, %s, %s, %s, %s)
            """, (card_id, viewer_ip, referer, user_agent, datetime.now()))
            
            # Обновляем счетчик просмотров визитки
            cur.execute("""
                UPDATE business_cards 
                SET view_count = view_count + 1 
                WHERE id = %s
            """, (card_id,))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
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
