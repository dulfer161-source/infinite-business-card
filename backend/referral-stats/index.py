import json
import os
import psycopg2
import jwt
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Получение реферальной статистики пользователя
    Args: event - dict с httpMethod, headers
          context - объект с request_id, function_name
    Returns: HTTP response с реферальным кодом и списком рефералов
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    auth_token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    
    if not auth_token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'}),
            'isBase64Encoded': False
        }
    
    try:
        payload = jwt.decode(auth_token, os.environ['JWT_SECRET'], algorithms=['HS256'])
        user_id = payload['user_id']
    except:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid token'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    cur.execute("""
        SELECT referral_code 
        FROM t_p18253922_infinite_business_ca.users 
        WHERE id = %s
    """, (user_id,))
    
    result = cur.fetchone()
    referral_code = result[0] if result else None
    
    cur.execute("""
        SELECT id, email, created_at 
        FROM t_p18253922_infinite_business_ca.users 
        WHERE referred_by = %s
        ORDER BY created_at DESC
    """, (user_id,))
    
    referrals = []
    for row in cur.fetchall():
        referrals.append({
            'id': row[0],
            'email': row[1],
            'created_at': row[2].isoformat() if row[2] else None
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'referral_code': referral_code,
            'referral_count': len(referrals),
            'referrals': referrals
        }),
        'isBase64Encoded': False
    }
