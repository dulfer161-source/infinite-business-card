# 🔐 Настройка VK авторизации

## 📋 Что это даёт

VK OAuth позволяет пользователям входить на сайт через VKontakte:
- ✅ Быстрая регистрация в 1 клик
- ✅ Автоматическое получение имени и email
- ✅ Не нужно запоминать пароли
- ✅ Надёжная защита через VK

---

## 🚀 Быстрый старт (5 минут)

### Шаг 1: Создать VK приложение

1. Перейти на https://dev.vk.com/
2. Нажать **"Создать приложение"**
3. Заполнить:
   - **Название:** Infinite Business Card (или ваше)
   - **Платформа:** Сайт
   - **Адрес сайта:** `https://visitka.site`
   - **Базовый домен:** `visitka.site`

4. После создания скопировать:
   - **ID приложения** (например: 51234567)
   - **Защищённый ключ** (в настройках приложения)

### Шаг 2: Добавить секреты в проект

Секреты уже созданы в проекте, нужно только заполнить значения:

1. В редакторе poehali.dev: **Меню → Secrets**
2. Найти и заполнить:
   - `VK_APP_ID` = ваш ID приложения (например: `51234567`)
   - `VK_SECRET_KEY` = ваш защищённый ключ (например: `abc123XYZ...`)

### Шаг 3: Настроить Redirect URI в VK

1. В настройках VK приложения → **Настройки**
2. **Authorized redirect URIs** → добавить:
   ```
   https://visitka.site/auth/vk
   ```
3. Сохранить изменения

### Шаг 4: Деплой функции

Backend функция уже готова, нужно только задеплоить:

```bash
# Функция vk-auth автоматически задеплоится при следующем коммите
```

Или попросить меня задеплоить: "Юра, задеплой vk-auth функцию"

---

## 🎯 Как это работает

### Архитектура

```
┌─────────┐      ┌──────┐      ┌─────────────┐      ┌──────────┐
│ Клиент  │──1───│  VK  │──2───│ vk-auth API │──3───│ Database │
│ (React) │      │ OAuth│      │  (Backend)  │      │ (Users)  │
└─────────┘      └──────┘      └─────────────┘      └──────────┘
     │                                  │                    │
     └──────────────4───────────────────┘                    │
                (JWT Token)                                  │
     └──────────────────5────────────────────────────────────┘
                  (User Data)
```

### Пошаговый процесс

1. **Клиент запрашивает auth URL:**
   ```javascript
   GET /vk-auth?redirect_uri=https://visitka.site/auth/vk
   
   Response:
   {
     "auth_url": "https://oauth.vk.com/authorize?client_id=..."
   }
   ```

2. **Пользователь переходит по auth_url:**
   - Открывается страница VK
   - Пользователь нажимает "Разрешить"
   - VK редиректит на `https://visitka.site/auth/vk?code=ABC123...`

3. **Клиент отправляет code на backend:**
   ```javascript
   POST /vk-auth
   Body: {
     "code": "ABC123...",
     "redirect_uri": "https://visitka.site/auth/vk"
   }
   ```

4. **Backend обменивает code на access_token:**
   - Запрос к VK API: `https://oauth.vk.com/access_token`
   - Получает: `access_token`, `user_id`, `email`

5. **Backend получает данные пользователя:**
   - Запрос к VK API: `https://api.vk.com/method/users.get`
   - Получает: `first_name`, `last_name`, `photo_200`

6. **Backend создаёт/находит пользователя в БД:**
   ```sql
   SELECT id, email FROM users WHERE vk_id = '12345678';
   -- Если нет, создаём:
   INSERT INTO users (email, name, vk_id) VALUES (...);
   ```

7. **Backend генерирует JWT токен:**
   ```javascript
   jwt.encode({
     user_id: 42,
     email: "user@vk.com",
     exp: now + 30 days
   }, JWT_SECRET)
   ```

8. **Backend возвращает токен и данные:**
   ```javascript
   Response:
   {
     "token": "eyJhbGciOiJIUzI1NiIs...",
     "user": {
       "id": 42,
       "email": "user@vk.com",
       "name": "Иван Иванов"
     }
   }
   ```

9. **Клиент сохраняет токен:**
   ```javascript
   localStorage.setItem('auth_token', token);
   // Теперь можно делать авторизованные запросы
   ```

---

## 💻 Frontend интеграция

### Компонент VK Login

```typescript
// src/components/VKLogin.tsx
import { useState } from 'react';

export default function VKLogin() {
  const [loading, setLoading] = useState(false);

  const handleVKLogin = async () => {
    setLoading(true);
    
    try {
      // 1. Получить auth URL
      const urlResponse = await fetch(
        'https://functions.poehali.dev/YOUR_VK_AUTH_FUNCTION_ID?redirect_uri=' + 
        encodeURIComponent(window.location.origin + '/auth/vk')
      );
      const { auth_url } = await urlResponse.json();
      
      // 2. Редирект на VK
      window.location.href = auth_url;
      
    } catch (error) {
      console.error('VK login failed:', error);
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleVKLogin}
      disabled={loading}
      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
    >
      {loading ? 'Загрузка...' : 'Войти через VK'}
    </button>
  );
}
```

### Обработка callback

```typescript
// src/pages/VKCallback.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function VKCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (!code) {
      setError('Код авторизации не получен');
      return;
    }

    const handleCallback = async () => {
      try {
        const response = await fetch(
          'https://functions.poehali.dev/YOUR_VK_AUTH_FUNCTION_ID',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code,
              redirect_uri: window.location.origin + '/auth/vk'
            })
          }
        );

        const data = await response.json();

        if (data.error) {
          setError(data.error);
          return;
        }

        // Сохранить токен
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Редирект на главную
        navigate('/');

      } catch (err) {
        setError('Ошибка авторизации');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg">
          <h2 className="text-red-600 font-bold mb-2">Ошибка авторизации</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Авторизация через VK...</p>
      </div>
    </div>
  );
}
```

### Добавить роуты

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VKCallback from './pages/VKCallback';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ваши существующие роуты */}
        <Route path="/auth/vk" element={<VKCallback />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 🔒 Безопасность

### ✅ Что уже настроено

1. **SSL/TLS:** Все запросы через HTTPS
2. **CORS:** Правильно настроен для фронтенда
3. **JWT токены:** С истечением через 30 дней
4. **Database:** Parameterized queries (защита от SQL injection)
5. **Секреты:** В environment variables (не в коде)
6. **Error handling:** Безопасные сообщения без утечки данных

### 🛡️ Best practices

1. **Никогда не логировать:**
   - `access_token` от VK
   - `JWT_SECRET`
   - `VK_SECRET_KEY`

2. **Валидация на backend:**
   - Проверка code перед обменом
   - Проверка redirect_uri
   - Проверка ответов от VK API

3. **Frontend безопасность:**
   - Токен в localStorage (не в cookies для SPA)
   - HTTPS-only для production
   - Не хранить sensitive data в localStorage

---

## 📊 Мониторинг

### Проверка работы VK auth

Security Monitor автоматически проверяет VK авторизацию каждые 6 часов:

```bash
# Проверить вручную:
curl https://functions.poehali.dev/YOUR_SECURITY_MONITOR_ID

# Результат:
{
  "checks": [
    {
      "name": "VK auth URL generation",
      "status": "passed",  # Теперь должно быть passed вместо warning
      "message": "VK OAuth configured correctly"
    }
  ]
}
```

### Логи

Проверить логи VK auth функции:

```bash
# В poehali.dev редакторе:
Menu → Logs → Backend → vk-auth

# Или через API (если настроен доступ)
```

---

## 🧪 Тестирование

### Тест 1: Получение auth URL

```bash
curl "https://functions.poehali.dev/YOUR_VK_AUTH_FUNCTION_ID?redirect_uri=https://visitka.site/auth/vk"

# Ожидаемый ответ:
{
  "auth_url": "https://oauth.vk.com/authorize?client_id=51234567&..."
}
```

### Тест 2: Callback обработка

1. Открыть auth_url в браузере
2. Нажать "Разрешить"
3. VK должен редиректнуть на `https://visitka.site/auth/vk?code=...`
4. Frontend должен отправить POST запрос с code
5. Backend должен вернуть JWT токен и user данные

### Тест 3: Интеграция с БД

Проверить что пользователь создался:

```sql
SELECT * FROM t_p18253922_infinite_business_ca.users 
WHERE vk_id IS NOT NULL 
ORDER BY created_at DESC 
LIMIT 5;
```

---

## 🐛 Troubleshooting

### Проблема: "VK credentials not configured"

**Причина:** Секреты не заполнены или заполнены неправильно.

**Решение:**
1. Проверить секреты в poehali.dev: Menu → Secrets
2. `VK_APP_ID` должен быть числом (без кавычек): `51234567`
3. `VK_SECRET_KEY` должен быть строкой: `abc123XYZ...`
4. После изменения секретов задеплоить функцию заново

### Проблема: "Authorization code required"

**Причина:** Frontend не отправляет `code` в POST запросе.

**Решение:**
```javascript
// Проверить что code передаётся:
const code = new URLSearchParams(window.location.search).get('code');
console.log('VK code:', code); // Должен быть строкой

// Отправить на backend:
fetch('/vk-auth', {
  method: 'POST',
  body: JSON.stringify({ code, redirect_uri: '...' })
});
```

### Проблема: "Invalid redirect_uri"

**Причина:** redirect_uri не совпадает в разных местах.

**Решение:** Убедиться что redirect_uri одинаковый:
1. В настройках VK приложения: `https://visitka.site/auth/vk`
2. В GET запросе на получение auth_url: `?redirect_uri=https://visitka.site/auth/vk`
3. В POST запросе с code: `{"redirect_uri": "https://visitka.site/auth/vk"}`

### Проблема: "Failed to get user info"

**Причина:** VK API не отдаёт данные пользователя.

**Решение:**
1. Проверить что в VK приложении включены нужные scope:
   - Settings → Permissions → Email (включить)
2. Проверить версию VK API (должна быть 5.131 или выше)
3. Проверить что access_token валидный

---

## 📈 Статистика использования

### Отслеживание VK логинов

Добавить в analytics функцию:

```python
# backend/analytics/index.py

# При логине через VK:
cur.execute("""
    INSERT INTO analytics_events (event_type, user_id, data)
    VALUES ('vk_login', %s, %s)
""", (user_id, json.dumps({'source': 'vk', 'timestamp': datetime.now()})))
```

### Метрики

```sql
-- Сколько пользователей зарегистрировано через VK:
SELECT COUNT(*) FROM users WHERE vk_id IS NOT NULL;

-- Последние VK регистрации:
SELECT email, name, created_at 
FROM users 
WHERE vk_id IS NOT NULL 
ORDER BY created_at DESC 
LIMIT 10;

-- Соотношение VK vs Email регистраций:
SELECT 
  CASE 
    WHEN vk_id IS NOT NULL THEN 'VK'
    ELSE 'Email'
  END as auth_type,
  COUNT(*) as count
FROM users
GROUP BY auth_type;
```

---

## 🎯 Следующие шаги

### После настройки VK auth:

1. **Добавить другие OAuth провайдеры:**
   - Google OAuth (похожая схема)
   - Yandex OAuth
   - Mail.ru OAuth

2. **Улучшить UX:**
   - Добавить иконку VK на кнопку
   - Loading состояния
   - Error messages для пользователя

3. **Расширить функционал:**
   - Получать фото профиля VK
   - Синхронизировать друзей VK
   - Постинг в VK из приложения

---

## 📞 Поддержка

**Документация VK API:** https://dev.vk.com/ru/api/overview  
**VK OAuth гайд:** https://dev.vk.com/ru/api/access-token/implicit-flow-user  
**Сообщество poehali.dev:** https://t.me/+QgiLIa1gFRY4Y2Iy  

---

*Последнее обновление: 2025-12-17*  
*Commit: 4d4bc49*  
*Status: ✅ Ready for production*
