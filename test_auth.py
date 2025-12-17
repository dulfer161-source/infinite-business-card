#!/usr/bin/env python3
import requests
import json

AUTH_URL = "https://functions.poehali.dev/063b09be-f07e-478c-a626-807980d111e1"

print("🔍 Проверка авторизации...\n")

# Тест 1: Регистрация нового пользователя
print("1️⃣ Тест регистрации:")
test_email = f"test_{hash('test')}@example.com"
register_data = {
    "action": "register",
    "email": test_email,
    "password": "testPassword123",
    "name": "Test User"
}

try:
    response = requests.post(AUTH_URL, json=register_data, timeout=10)
    print(f"   Статус: {response.status_code}")
    print(f"   Ответ: {response.text[:200]}")
    
    if response.status_code == 200:
        data = response.json()
        if 'token' in data:
            print("   ✅ Регистрация работает! JWT токен получен")
            token = data['token']
        else:
            print("   ❌ Токен не получен")
    elif response.status_code == 409:
        print("   ℹ️ Пользователь уже существует (это нормально)")
    elif response.status_code == 500:
        error_data = response.json()
        if 'Server configuration error' in error_data.get('error', ''):
            print("   ❌ JWT_SECRET не настроен в проекте!")
        else:
            print(f"   ❌ Ошибка сервера: {error_data}")
    else:
        print(f"   ⚠️ Неожиданный статус: {response.status_code}")
except requests.exceptions.Timeout:
    print("   ❌ Таймаут запроса")
except Exception as e:
    print(f"   ❌ Ошибка: {str(e)[:100]}")

print("\n" + "="*60 + "\n")

# Тест 2: Вход с неверными данными
print("2️⃣ Тест валидации (неверный email):")
invalid_data = {
    "action": "register",
    "email": "invalid-email",
    "password": "test123",
    "name": "Test"
}

try:
    response = requests.post(AUTH_URL, json=invalid_data, timeout=10)
    print(f"   Статус: {response.status_code}")
    if response.status_code == 400:
        print("   ✅ Валидация email работает!")
    else:
        print(f"   Ответ: {response.text[:200]}")
except Exception as e:
    print(f"   ❌ Ошибка: {str(e)[:100]}")

print("\n" + "="*60 + "\n")

# Тест 3: Rate limiting
print("3️⃣ Тест rate limiting (6 запросов подряд):")
for i in range(6):
    try:
        response = requests.post(AUTH_URL, json=register_data, timeout=10)
        if response.status_code == 429:
            print(f"   ✅ Rate limiting сработал на запросе #{i+1}")
            print(f"   Retry-After: {response.headers.get('Retry-After', 'N/A')} секунд")
            break
        else:
            print(f"   Запрос #{i+1}: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Ошибка на запросе #{i+1}: {str(e)[:50]}")
        break

print("\n✅ Проверка завершена!")
