import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event, context):
    '''
    Webhook для получения уведомлений от ЮКасса о статусе платежа
    POST / - обработка webhook от ЮКасса
    '''
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
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
        body = json.loads(event.get('body', '{}'))
        
        event_type = body.get('event')
        payment_object = body.get('object', {})
        
        if event_type != 'payment.succeeded':
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'message': 'Event ignored'}),
                'isBase64Encoded': False
            }
        
        provider_payment_id = payment_object.get('id')
        status = payment_object.get('status')
        metadata = payment_object.get('metadata', {})
        
        if not provider_payment_id:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Missing payment ID'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        provider_payment_id_escaped = provider_payment_id.replace("'", "''")
        status_escaped = status.replace("'", "''")
        
        cur.execute(
            f"""
            UPDATE t_p18253922_infinite_business_ca.payments 
            SET status = '{status_escaped}', updated_at = CURRENT_TIMESTAMP
            WHERE provider_payment_id = '{provider_payment_id_escaped}'
            RETURNING *
            """
        )
        
        payment = cur.fetchone()
        
        if not payment:
            return {
                'statusCode': 404,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Payment not found'}),
                'isBase64Encoded': False
            }
        
        # Activate subscription if payment succeeded
        if status == 'succeeded':
            user_id = metadata.get('user_id') or payment.get('user_id')
            subscription_id = metadata.get('subscription_id')
            
            if user_id and subscription_id:
                # Get subscription details
                cur.execute(f"SELECT duration_days FROM t_p18253922_infinite_business_ca.subscriptions WHERE id = {int(subscription_id)}")
                subscription = cur.fetchone()
                
                if subscription:
                    duration_days = subscription['duration_days']
                    
                    # Create user subscription
                    cur.execute("SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM t_p18253922_infinite_business_ca.user_subscriptions")
                    next_id = cur.fetchone()['next_id']
                    
                    cur.execute(f"""
                        INSERT INTO t_p18253922_infinite_business_ca.user_subscriptions 
                        (id, user_id, subscription_id, starts_at, expires_at, is_active)
                        VALUES ({next_id}, {int(user_id)}, {int(subscription_id)}, NOW(), NOW() + INTERVAL '{int(duration_days)} days', TRUE)
                    """)
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'message': 'Payment updated successfully'}),
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