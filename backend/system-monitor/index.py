"""
Мониторинг системы и отправка уведомлений администратору
при проблемах с облачными функциями или секретами
"""

import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any, List
from datetime import datetime


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Проверяет статус системы и отправляет уведомления при проблемах
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response dict
    """
    method: str = event.get('httpMethod', 'GET')
    
    # CORS для всех запросов
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
        'Access-Control-Max-Age': '86400'
    }
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        try:
            body = json.loads(event.get('body', '{}'))
            alert_type = body.get('type', 'system_error')
            alert_data = body.get('data', {})
            
            # Отправляем уведомление
            notification_sent = send_alert_email(alert_type, alert_data)
            
            return {
                'statusCode': 200,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({
                    'success': True,
                    'notification_sent': notification_sent,
                    'timestamp': datetime.utcnow().isoformat()
                }),
                'isBase64Encoded': False
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': str(e)}),
                'isBase64Encoded': False
            }
    
    # GET - проверка здоровья функции
    return {
        'statusCode': 200,
        'headers': {**cors_headers, 'Content-Type': 'application/json'},
        'body': json.dumps({
            'status': 'healthy',
            'service': 'system-monitor',
            'smtp_configured': bool(os.environ.get('SMTP_HOST'))
        }),
        'isBase64Encoded': False
    }


def send_alert_email(alert_type: str, data: Dict[str, Any]) -> bool:
    """Отправляет email-уведомление администратору"""
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    from_email = os.environ.get('SMTP_FROM_EMAIL')
    admin_email = os.environ.get('ADMIN_EMAIL', smtp_user)
    
    # Если SMTP не настроен, пропускаем
    if not all([smtp_host, smtp_user, smtp_password, from_email]):
        return False
    
    # Формируем письмо в зависимости от типа алерта
    subject, body = format_alert_message(alert_type, data)
    
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = from_email
        msg['To'] = admin_email
        
        html_body = f"""
        <html>
          <head>
            <style>
              body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
              .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
              .header {{ background: #ef4444; color: white; padding: 20px; border-radius: 8px 8px 0 0; }}
              .content {{ background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }}
              .alert-type {{ display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 4px; font-size: 14px; }}
              .details {{ background: white; padding: 15px; border-radius: 6px; margin-top: 15px; border-left: 4px solid #ef4444; }}
              .footer {{ margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }}
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">⚠️ Системное уведомление</h2>
              </div>
              <div class="content">
                <p><span class="alert-type">{alert_type.upper()}</span></p>
                <div class="details">
                  {body}
                </div>
                <div class="footer">
                  <p>Время: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC</p>
                  <p>Проверьте <a href="https://poehali.dev">панель администратора</a></p>
                </div>
              </div>
            </div>
          </body>
        </html>
        """
        
        msg.attach(MIMEText(html_body, 'html'))
        
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False


def format_alert_message(alert_type: str, data: Dict[str, Any]) -> tuple:
    """Форматирует сообщение в зависимости от типа алерта"""
    
    if alert_type == 'missing_secrets':
        missing = data.get('missing_secrets', [])
        subject = f"⚠️ Отсутствуют секреты ({len(missing)})"
        body = f"""
        <h3>Не настроены следующие секреты:</h3>
        <ul>
          {''.join([f'<li><strong>{s}</strong></li>' for s in missing])}
        </ul>
        <p>Некоторые функции могут работать некорректно.</p>
        """
    
    elif alert_type == 'function_error':
        func_name = data.get('function', 'unknown')
        error = data.get('error', 'Unknown error')
        subject = f"🔴 Ошибка функции: {func_name}"
        body = f"""
        <h3>Функция <code>{func_name}</code> вернула ошибку</h3>
        <p><strong>Описание:</strong> {error}</p>
        <p>Требуется проверка и исправление.</p>
        """
    
    elif alert_type == 'high_error_rate':
        func_name = data.get('function', 'unknown')
        error_rate = data.get('error_rate', 0)
        subject = f"⚠️ Высокий процент ошибок: {func_name}"
        body = f"""
        <h3>Функция <code>{func_name}</code></h3>
        <p><strong>Процент ошибок:</strong> {error_rate}%</p>
        <p>Рекомендуется проверить логи и стабильность функции.</p>
        """
    
    else:
        subject = f"⚠️ Системное предупреждение: {alert_type}"
        body = f"""
        <h3>Обнаружена проблема</h3>
        <pre>{json.dumps(data, indent=2, ensure_ascii=False)}</pre>
        """
    
    return subject, body
