import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event, context):
    '''
    Управление визитками, макетами, рекламой и white-label
    GET / - получить визитки пользователя (с учетом white-label клиента)
    GET /?id=X - публичный просмотр визитки
    POST / - создать визитку (автоматически привязывается к white-label клиенту)
    POST /?id=X - записать просмотр
    PUT / - обновить визитку
    GET /templates?card_id=X - макеты визитки
    POST /templates - создать макет
    GET /ad-zones?card_id=X - рекламные зоны
    POST /ad-zones - создать зону
    POST /ad-placements - создать размещение
    '''
    method = event.get('httpMethod', 'GET')
    path_params = event.get('pathParams', {})
    card_id = path_params.get('id')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Public GET card by ID (using query param ?id=123)
        query_params = event.get('queryStringParameters', {})
        card_id_query = query_params.get('id') if query_params else None
        
        if method == 'GET' and card_id_query:
            cur.execute(f"SELECT * FROM t_p18253922_infinite_business_ca.business_cards WHERE id = {int(card_id_query)}")
            card = cur.fetchone()
            
            if not card:
                return {
                    'statusCode': 404,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Card not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'card': dict(card)}, default=str),
                'isBase64Encoded': False
            }
        
        # Track view (using query param ?id=123)
        if method == 'POST' and card_id_query:
            request_ctx = event.get('requestContext', {})
            identity = request_ctx.get('identity', {})
            source_ip = identity.get('sourceIp', 'unknown').replace("'", "''")
            user_agent = identity.get('userAgent', 'unknown').replace("'", "''")
            
            # Get next sequence value explicitly
            cur.execute("SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM t_p18253922_infinite_business_ca.card_views")
            next_id = cur.fetchone()['next_id']
            
            cur.execute(
                f"""
                INSERT INTO t_p18253922_infinite_business_ca.card_views (id, card_id, viewer_ip, viewer_user_agent)
                VALUES ({next_id}, {int(card_id_query)}, '{source_ip}', '{user_agent}')
                """
            )
            
            cur.execute(
                f"UPDATE t_p18253922_infinite_business_ca.business_cards SET view_count = view_count + 1 WHERE id = {int(card_id_query)}"
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        # All other methods require authentication
        headers = event.get('headers', {})
        auth_token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
        
        if not auth_token:
            return {
                'statusCode': 401,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Unauthorized - no token'}),
                'isBase64Encoded': False
            }
        
        # Get user_id from token
        cur.execute(f"SELECT user_id FROM t_p18253922_infinite_business_ca.auth_tokens WHERE token = '{auth_token}' AND expires_at > NOW()")
        token_row = cur.fetchone()
        
        if not token_row:
            return {
                'statusCode': 401,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Unauthorized - invalid token'}),
                'isBase64Encoded': False
            }
        
        user_id = token_row['user_id']
        
        if method == 'GET':
            cur.execute(
                f"SELECT * FROM t_p18253922_infinite_business_ca.business_cards WHERE user_id = {int(user_id)} ORDER BY created_at DESC"
            )
            cards = [dict(row) for row in cur.fetchall()]
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'cards': cards}, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            name = body.get('name', '').replace("'", "''")
            position = body.get('position', '').replace("'", "''")
            company = body.get('company', '').replace("'", "''")
            phone = body.get('phone', '').replace("'", "''")
            email = body.get('email', '').replace("'", "''")
            website = body.get('website', '').replace("'", "''")
            description = body.get('description', '').replace("'", "''")
            logo_url = body.get('logo_url', '').replace("'", "''")
            
            # Get next sequence value explicitly
            cur.execute("SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM t_p18253922_infinite_business_ca.business_cards")
            next_id = cur.fetchone()['next_id']
            
            # Check user subscription for branding permissions
            cur.execute(f"""
                SELECT s.can_remove_branding 
                FROM t_p18253922_infinite_business_ca.user_subscriptions us
                JOIN t_p18253922_infinite_business_ca.subscriptions s ON us.subscription_id = s.id
                WHERE us.user_id = {int(user_id)} AND us.is_active = TRUE AND us.expires_at > NOW()
                ORDER BY us.expires_at DESC LIMIT 1
            """)
            subscription = cur.fetchone()
            can_remove_branding = subscription['can_remove_branding'] if subscription else False
            
            custom_branding = body.get('custom_branding', {})
            hide_platform_branding = body.get('hide_platform_branding', False) and can_remove_branding
            custom_branding_json = json.dumps(custom_branding).replace("'", "''")
            
            # Get white-label client ID from user
            cur.execute(f"SELECT white_label_client_id FROM t_p18253922_infinite_business_ca.users WHERE id = {int(user_id)}")
            user_row = cur.fetchone()
            white_label_client_id = user_row['white_label_client_id'] if user_row and user_row['white_label_client_id'] else 'NULL'
            
            cur.execute(
                f"""
                INSERT INTO t_p18253922_infinite_business_ca.business_cards 
                (id, user_id, name, position, company, phone, email, website, description, logo_url, custom_branding, hide_platform_branding, white_label_client_id)
                VALUES ({next_id}, {int(user_id)}, '{name}', '{position}', '{company}', '{phone}', '{email}', '{website}', '{description}', '{logo_url}', '{custom_branding_json}', {hide_platform_branding}, {white_label_client_id})
                RETURNING *
                """
            )
            card = dict(cur.fetchone())
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'card': card}, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            card_id = body.get('id')
            
            if not card_id:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Card ID is required'}),
                    'isBase64Encoded': False
                }
            
            name = body.get('name', '').replace("'", "''")
            position = body.get('position', '').replace("'", "''")
            company = body.get('company', '').replace("'", "''")
            phone = body.get('phone', '').replace("'", "''")
            email = body.get('email', '').replace("'", "''")
            website = body.get('website', '').replace("'", "''")
            description = body.get('description', '').replace("'", "''")
            logo_url = body.get('logo_url', '').replace("'", "''")
            
            # Check branding permissions if trying to hide platform branding
            cur.execute(f"""
                SELECT s.can_remove_branding 
                FROM t_p18253922_infinite_business_ca.user_subscriptions us
                JOIN t_p18253922_infinite_business_ca.subscriptions s ON us.subscription_id = s.id
                WHERE us.user_id = {int(user_id)} AND us.is_active = TRUE AND us.expires_at > NOW()
                ORDER BY us.expires_at DESC LIMIT 1
            """)
            subscription = cur.fetchone()
            can_remove_branding = subscription['can_remove_branding'] if subscription else False
            
            custom_branding = body.get('custom_branding', {})
            hide_platform_branding = body.get('hide_platform_branding', False) and can_remove_branding
            custom_branding_json = json.dumps(custom_branding).replace("'", "''")
            
            cur.execute(
                f"""
                UPDATE t_p18253922_infinite_business_ca.business_cards 
                SET name = '{name}', position = '{position}', company = '{company}', phone = '{phone}', 
                    email = '{email}', website = '{website}', description = '{description}', logo_url = '{logo_url}', 
                    custom_branding = '{custom_branding_json}', hide_platform_branding = {hide_platform_branding},
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = {int(card_id)} AND user_id = {int(user_id)}
                RETURNING *
                """
            )
            card = cur.fetchone()
            
            if not card:
                return {
                    'statusCode': 404,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Card not found'}),
                    'isBase64Encoded': False
                }
            
            card = dict(card)
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'card': card}, default=str),
                'isBase64Encoded': False
            }
        
        # --- TEMPLATES ---
        elif method == 'GET' and query_params and 'templates' in event.get('path', ''):
            card_id = query_params.get('card_id')
            if not card_id:
                return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, 'body': json.dumps({'error': 'card_id required'}), 'isBase64Encoded': False}
            
            cur.execute(f"SELECT * FROM t_p18253922_infinite_business_ca.card_templates WHERE card_id = {int(card_id)} ORDER BY created_at DESC")
            templates = [dict(row) for row in cur.fetchall()]
            return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, 'body': json.dumps({'templates': templates}, default=str), 'isBase64Encoded': False}
        
        elif method == 'POST' and 'templates' in event.get('path', ''):
            body = json.loads(event.get('body', '{}'))
            card_id = body.get('card_id')
            template_url = body.get('template_url', '').replace("'", "''")
            template_type = body.get('template_type', 'uploaded')
            
            if not card_id or not template_url:
                return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, 'body': json.dumps({'error': 'card_id and template_url required'}), 'isBase64Encoded': False}
            
            cur.execute(f"SELECT id FROM t_p18253922_infinite_business_ca.business_cards WHERE id = {int(card_id)} AND user_id = {int(user_id)}")
            if not cur.fetchone():
                return {'statusCode': 403, 'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, 'body': json.dumps({'error': 'Access denied'}), 'isBase64Encoded': False}
            
            cur.execute("SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM t_p18253922_infinite_business_ca.card_templates")
            next_id = cur.fetchone()['next_id']
            cur.execute(f"INSERT INTO t_p18253922_infinite_business_ca.card_templates (id, user_id, card_id, template_type, template_url) VALUES ({next_id}, {int(user_id)}, {int(card_id)}, '{template_type}', '{template_url}') RETURNING *")
            template = dict(cur.fetchone())
            conn.commit()
            return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, 'body': json.dumps({'template': template}, default=str), 'isBase64Encoded': False}
        
        # --- AD ZONES ---
        elif method == 'GET' and query_params and 'ad-zones' in event.get('path', ''):
            card_id = query_params.get('card_id')
            if not card_id:
                return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, 'body': json.dumps({'error': 'card_id required'}), 'isBase64Encoded': False}
            
            cur.execute(f"SELECT * FROM t_p18253922_infinite_business_ca.ad_zones WHERE card_id = {int(card_id)} ORDER BY created_at DESC")
            zones = [dict(row) for row in cur.fetchall()]
            return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, 'body': json.dumps({'zones': zones}, default=str), 'isBase64Encoded': False}
        
        elif method == 'POST' and 'ad-zones' in event.get('path', ''):
            body = json.loads(event.get('body', '{}'))
            card_id = body.get('card_id')
            zone_name = body.get('zone_name', '').replace("'", "''")
            zone_position = body.get('zone_position', 'content')
            
            cur.execute(f"SELECT id FROM t_p18253922_infinite_business_ca.business_cards WHERE id = {int(card_id)} AND user_id = {int(user_id)}")
            if not cur.fetchone():
                return {'statusCode': 403, 'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, 'body': json.dumps({'error': 'Access denied'}), 'isBase64Encoded': False}
            
            cur.execute("SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM t_p18253922_infinite_business_ca.ad_zones")
            next_id = cur.fetchone()['next_id']
            cur.execute(f"INSERT INTO t_p18253922_infinite_business_ca.ad_zones (id, card_id, zone_name, zone_position) VALUES ({next_id}, {int(card_id)}, '{zone_name}', '{zone_position}') RETURNING *")
            zone = dict(cur.fetchone())
            conn.commit()
            return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, 'body': json.dumps({'zone': zone}, default=str), 'isBase64Encoded': False}
        
        # --- AD PLACEMENTS ---
        elif method == 'POST' and 'ad-placements' in event.get('path', ''):
            body = json.loads(event.get('body', '{}'))
            ad_zone_id = body.get('ad_zone_id')
            advertiser_name = body.get('advertiser_name', '').replace("'", "''")
            advertiser_email = body.get('advertiser_email', '').replace("'", "''")
            ad_content = body.get('ad_content', '').replace("'", "''")
            ad_image_url = body.get('ad_image_url', '').replace("'", "''")
            price_per_month = body.get('price_per_month', 0)
            
            cur.execute("SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM t_p18253922_infinite_business_ca.ad_placements")
            next_id = cur.fetchone()['next_id']
            cur.execute(f"INSERT INTO t_p18253922_infinite_business_ca.ad_placements (id, ad_zone_id, advertiser_name, advertiser_email, ad_content, ad_image_url, price_per_month, status) VALUES ({next_id}, {int(ad_zone_id)}, '{advertiser_name}', '{advertiser_email}', '{ad_content}', '{ad_image_url}', {float(price_per_month)}, 'pending') RETURNING *")
            placement = dict(cur.fetchone())
            conn.commit()
            return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, 'body': json.dumps({'placement': placement}, default=str), 'isBase64Encoded': False}
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Method not allowed'}),
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