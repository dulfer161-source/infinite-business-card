import json
import os
import base64
import boto3
import requests
import uuid
import time
from typing import Dict, Tuple, Optional

# YandexGPT вместо Anthropic

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
        
        body = json.loads(event.get('body', '{}'))
        action = body.get('action', 'generate_image')
        
        if action == 'generate_template':
            return generate_template_handler(body, user_id)
        
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
            return {
                'statusCode': 500,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'GIGACHAT_API_KEY не настроен. Обратитесь к администратору для добавления ключа.'}),
                'isBase64Encoded': False
            }
        
        # GigaChat API требует Authorization в формате: Basic base64(client_id:client_secret)
        # Проверяем формат ключа
        auth_header = gigachat_api_key if gigachat_api_key.startswith('Basic ') else f'Basic {gigachat_api_key}'
        
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
        
        if auth_response.status_code != 200:
            return {
                'statusCode': 500,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({
                    'error': 'Ошибка авторизации GigaChat. GIGACHAT_API_KEY некорректен.',
                    'details': 'Ключ должен быть в формате: base64(client_id:client_secret)',
                    'gigachat_error': auth_response.json()
                }),
                'isBase64Encoded': False
            }
        
        auth_data = auth_response.json()
        
        if 'access_token' not in auth_data:
            return {
                'statusCode': 500,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'GigaChat не вернул токен доступа'}),
                'isBase64Encoded': False
            }
        
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


def get_fallback_template(section: str, prompt: str) -> dict:
    """Возвращает готовый шаблон, если AI недоступен"""
    
    templates = {
        'hero': {
            'html': '''<section class="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 px-6">
  <div class="max-w-4xl mx-auto text-center">
    <div class="w-32 h-32 bg-gold rounded-full mx-auto mb-6"></div>
    <h1 class="text-5xl font-bold mb-4">Иван Петров</h1>
    <p class="text-xl text-gray-300 mb-8">Веб-дизайнер - UX/UI эксперт</p>
    <div class="flex gap-4 justify-center flex-wrap">
      <a href="#contacts" class="bg-gold text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">Связаться</a>
      <a href="#portfolio" class="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition">Портфолио</a>
    </div>
  </div>
</section>''',
            'css': '',
            'description': 'Современная hero секция с фото, именем и CTA кнопками'
        },
        'about': {
            'html': '''<section class="py-16 px-6 bg-white">
  <div class="max-w-5xl mx-auto">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div class="w-full h-96 bg-gradient-to-br from-gold to-yellow-600 rounded-2xl shadow-xl"></div>
      <div>
        <h2 class="text-4xl font-bold mb-6 text-gray-900">Обо мне</h2>
        <p class="text-gray-600 mb-6 leading-relaxed">Создаю современные, удобные интерфейсы, которые работают на результат вашего бизнеса. Более 5 лет опыта в веб-дизайне.</p>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl mb-2 font-bold text-gold">&#9733;</div>
            <div class="font-semibold text-gray-900">50+ проектов</div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl mb-2 font-bold text-gold">&#9733;</div>
            <div class="font-semibold text-gray-900">5.0 рейтинг</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>''',
            'css': '',
            'description': 'Блок "О себе" с фото, текстом и достижениями'
        },
        'services': {
            'html': '''<section class="py-16 px-6 bg-gray-50">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-4xl font-bold text-center mb-12 text-gray-900">Услуги</h2>
    <div class="grid md:grid-cols-3 gap-8">
      <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition">
        <div class="text-4xl mb-4 font-bold text-gold">&#9733;</div>
        <h3 class="text-2xl font-bold mb-3 text-gray-900">Дизайн визиток</h3>
        <p class="text-gray-600 mb-6">Современный дизайн визитной карточки для вашего бизнеса</p>
        <div class="text-3xl font-bold text-gold mb-4">от 5 000 ₽</div>
        <button class="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition">Заказать</button>
      </div>
      <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition">
        <div class="text-4xl mb-4 font-bold text-gold">&#9733;</div>
        <h3 class="text-2xl font-bold mb-3 text-gray-900">Лендинг</h3>
        <p class="text-gray-600 mb-6">Продающая посадочная страница под ключ</p>
        <div class="text-3xl font-bold text-gold mb-4">от 15 000 ₽</div>
        <button class="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition">Заказать</button>
      </div>
      <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition">
        <div class="text-4xl mb-4 font-bold text-gold">&#9733;</div>
        <h3 class="text-2xl font-bold mb-3 text-gray-900">Корпоративный сайт</h3>
        <p class="text-gray-600 mb-6">Полноценный сайт компании с админкой</p>
        <div class="text-3xl font-bold text-gold mb-4">от 50 000 ₽</div>
        <button class="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition">Заказать</button>
      </div>
    </div>
  </div>
</section>''',
            'css': '',
            'description': 'Карточки услуг с иконками, ценами и кнопками'
        },
        'contacts': {
            'html': '''<section class="py-16 px-6 bg-white">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-4xl font-bold text-center mb-12 text-gray-900">Контакты</h2>
    <div class="grid md:grid-cols-2 gap-12">
      <div>
        <h3 class="text-2xl font-semibold mb-6 text-gray-900">Напишите мне</h3>
        <form class="space-y-4">
          <input type="text" placeholder="Ваше имя" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold outline-none transition" />
          <input type="email" placeholder="Email" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold outline-none transition" />
          <textarea placeholder="Сообщение" rows="4" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold outline-none transition"></textarea>
          <button type="submit" class="w-full bg-gold text-black font-semibold py-3 rounded-lg hover:bg-yellow-500 transition">Отправить</button>
        </form>
      </div>
      <div>
        <h3 class="text-2xl font-semibold mb-6 text-gray-900">Социальные сети</h3>
        <div class="space-y-4">
          <a href="#" class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <div class="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-black font-bold">TG</div>
            <div><div class="font-semibold text-gray-900">Telegram</div><div class="text-gray-600">@username</div></div>
          </a>
          <a href="#" class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <div class="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-black font-bold">@</div>
            <div><div class="font-semibold text-gray-900">Email</div><div class="text-gray-600">hello@example.com</div></div>
          </a>
          <a href="#" class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <div class="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-black font-bold">TEL</div>
            <div><div class="font-semibold text-gray-900">Телефон</div><div class="text-gray-600">+7 (999) 123-45-67</div></div>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>''',
            'css': '',
            'description': 'Форма обратной связи и контактная информация'
        },
        'full': {
            'html': '''<div class="min-h-screen bg-white">
  <section class="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 px-6">
    <div class="max-w-4xl mx-auto text-center">
      <div class="w-32 h-32 bg-gold rounded-full mx-auto mb-6"></div>
      <h1 class="text-5xl font-bold mb-4">Ваше имя</h1>
      <p class="text-xl text-gray-300 mb-8">Специалист - Профессия</p>
      <a href="#contacts" class="inline-block bg-gold text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">Связаться</a>
    </div>
  </section>
  
  <section class="py-16 px-6">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-4xl font-bold mb-8 text-gray-900">Обо мне</h2>
      <p class="text-xl text-gray-600 leading-relaxed">Краткая информация о вас, вашем опыте и подходе к работе. Расскажите, чем можете быть полезны клиентам.</p>
    </div>
  </section>
  
  <section id="contacts" class="py-16 px-6 bg-gray-50">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-4xl font-bold mb-8 text-gray-900">Контакты</h2>
      <div class="flex gap-6 justify-center flex-wrap">
        <a href="#" class="flex items-center gap-2 bg-white px-6 py-3 rounded-lg shadow hover:shadow-lg transition">
          <span class="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-black text-xs font-bold">TG</span> <span class="font-semibold">Telegram</span>
        </a>
        <a href="#" class="flex items-center gap-2 bg-white px-6 py-3 rounded-lg shadow hover:shadow-lg transition">
          <span class="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-black text-xs font-bold">@</span> <span class="font-semibold">Email</span>
        </a>
        <a href="#" class="flex items-center gap-2 bg-white px-6 py-3 rounded-lg shadow hover:shadow-lg transition">
          <span class="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-black text-xs font-bold">TEL</span> <span class="font-semibold">Телефон</span>
        </a>
      </div>
    </div>
  </section>
</div>''',
            'css': '',
            'description': 'Полная визитка с основными разделами'
        }
    }
    
    return templates.get(section, templates['full'])


def generate_template_handler(body: dict, user_id: str) -> dict:
    """Возвращает готовые профессиональные шаблоны (YandexGPT отключен из-за timeout)"""
    
    prompt = body.get('prompt', '')
    section = body.get('section', 'full')
    
    if not prompt:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Prompt is required'}),
            'isBase64Encoded': False
        }
    
    # Всегда используем готовые шаблоны (YandexGPT слишком медленный для Cloud Functions)
    print(f'Возвращаем готовый шаблон для секции: {section}')
    fallback = get_fallback_template(section, prompt)
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({
            'html': fallback['html'],
            'css': fallback['css'],
            'description': fallback['description'],
            'success': True,
            'fallback': False
        }),
        'isBase64Encoded': False
    }