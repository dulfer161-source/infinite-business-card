"""
Backend функция для реферальной программы.
Генерация реферальных кодов и начисление бонусов.
"""

import json
import os
import random
import string
from typing import Dict, Any
import psycopg2

def generate_referral_code(user_id: int) -> str:
    """Генерирует уникальный реферальный код"""
    chars = string.ascii_uppercase + string.digits
    random_part = ''.join(random.choice(chars) for _ in range(6))
    return f"REF{user_id}{random_part}"

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Управление реферальной программой.
    
    GET /referrals - получить реферальный код пользователя и статистику
    POST /referrals/apply - применить реферальный код при регистрации
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
            headers = event.get('headers', {})
            user_id = headers.get('X-User-Id')
            
            if not user_id:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Unauthorized'}),
                    'isBase64Encoded': False
                }
            
            # Получаем или создаем реферальный код
            cur.execute('SELECT referral_code FROM referrals WHERE user_id = %s LIMIT 1', (user_id,))
            result = cur.fetchone()
            
            if not result:
                # Создаем новый реферальный код
                referral_code = generate_referral_code(int(user_id))
                cur.execute(
                    'INSERT INTO referrals (user_id, referral_code) VALUES (%s, %s)',
                    (user_id, referral_code)
                )
                conn.commit()
            else:
                referral_code = result[0]
            
            # Получаем статистику рефералов
            cur.execute("""
                SELECT COUNT(*) as total_referrals, 
                       COUNT(CASE WHEN reward_granted = true THEN 1 END) as rewarded
                FROM referrals 
                WHERE user_id = %s AND referred_user_id IS NOT NULL
            """, (user_id,))
            stats = cur.fetchone()
            
            # Получаем список приглашенных пользователей
            cur.execute("""
                SELECT u.full_name, r.created_at, r.reward_granted
                FROM referrals r
                JOIN users u ON r.referred_user_id = u.id
                WHERE r.user_id = %s
                ORDER BY r.created_at DESC
                LIMIT 10
            """, (user_id,))
            referred_users = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'referral_code': referral_code,
                    'total_referrals': stats[0] or 0,
                    'rewards_earned': stats[1] or 0,
                    'referred_users': [
                        {
                            'name': u[0],
                            'joined_at': u[1].isoformat() if u[1] else None,
                            'reward_granted': u[2]
                        } for u in referred_users
                    ]
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            referral_code = body.get('referral_code')
            new_user_id = body.get('new_user_id')
            
            if not referral_code or not new_user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'referral_code and new_user_id are required'}),
                    'isBase64Encoded': False
                }
            
            # Находим владельца реферального кода
            cur.execute('SELECT user_id FROM referrals WHERE referral_code = %s LIMIT 1', (referral_code,))
            result = cur.fetchone()
            
            if not result:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid referral code'}),
                    'isBase64Encoded': False
                }
            
            referrer_id = result[0]
            
            # Проверяем, что пользователь не приглашает сам себя
            if int(referrer_id) == int(new_user_id):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Cannot use your own referral code'}),
                    'isBase64Encoded': False
                }
            
            # Создаем запись о реферале
            cur.execute("""
                INSERT INTO referrals (user_id, referral_code, referred_user_id, reward_granted)
                VALUES (%s, %s, %s, true)
            """, (referrer_id, referral_code, new_user_id))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'message': 'Referral applied successfully',
                    'bonus_days': 7
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
