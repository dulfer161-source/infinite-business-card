# Настройка ESLint правила для z-index

## Автоматическая проверка z-index слоёв

В проекте создано кастомное ESLint правило для проверки использования z-index.

---

## Файлы

- `.eslintrc.z-index.js` — само правило
- `docs/z-index-layers.md` — документация по слоям

---

## Что проверяет правило

Правило `z-index/enforce-layers` отслеживает все использования z-index в `className` и проверяет:

1. ✅ Используется ли разрешённый уровень (50, 60, 70, 80, 90, 100)
2. ❌ Запрещает произвольные значения (например, `z-[999]`, `z-[75]`)
3. ⚠️ Предупреждает о недокументированных значениях

---

## Установка (опционально)

### Шаг 1: Подключить правило

Откройте `eslint.config.js` и добавьте:

```js
import zIndexRule from './.eslintrc.z-index.js';

export default tseslint.config(
  // ...существующая конфигурация
  {
    plugins: {
      // ...существующие плагины
      'z-index': zIndexRule,
    },
    rules: {
      // ...существующие правила
      'z-index/enforce-layers': 'error', // или 'warn' для предупреждений
    },
  }
);
```

### Шаг 2: Запустить проверку

```bash
npm run lint
```

---

## Примеры работы правила

### ✅ Правильно (разрешённые z-index)

```tsx
<div className="z-[100]">Toast</div>
<div className="z-[90]">Modal</div>
<div className="z-[80]">Dropdown</div>
<div className="z-[70]">Tour</div>
<div className="z-[60]">Notification</div>
<div className="z-[50]">Header</div>
```

### ❌ Ошибка (недопустимые z-index)

```tsx
<div className="z-[999]">❌ Слишком большой z-index</div>
<div className="z-[75]">❌ Недокументированный уровень</div>
<div className="z-[1]">❌ Слишком маленький z-index</div>
```

**Сообщение:**
```
error: Недопустимый z-index: 999. Используйте только: 50, 60, 70, 80, 90, 100
```

### ⚠️ Предупреждение (неожиданный z-index)

```tsx
<div className="z-[55]">⚠️ Значение между слоями</div>
```

**Сообщение:**
```
warning: z-index 55 не задокументирован. См. docs/z-index-layers.md
```

---

## Разрешённые уровни

| Z-Index | Назначение |
|---------|------------|
| `z-[100]` | Toast, Toaster |
| `z-[90]` | Dialog, Sheet, AlertDialog |
| `z-[80]` | Dropdown, Popover, Select |
| `z-[70]` | Tour tooltips |
| `z-[60]` | InstallPrompt, WelcomeNotification |
| `z-[50]` | Header, Navigation |

---

## Добавление нового уровня

Если нужно добавить новый z-index уровень:

1. Обновите `ALLOWED_Z_INDEX` в `.eslintrc.z-index.js`:
   ```js
   const ALLOWED_Z_INDEX = {
     // ...существующие
     40: 'NewComponent (описание)',
   };
   ```

2. Обновите документацию в `docs/z-index-layers.md`

3. Запустите `npm run lint` для проверки

---

## Отключение правила (не рекомендуется)

Если в редком случае нужно использовать кастомный z-index:

```tsx
{/* eslint-disable-next-line z-index/enforce-layers */}
<div className="z-[75]">Исключение</div>
```

**⚠️ Используйте только в крайнем случае и обязательно добавьте комментарий с объяснением!**

---

## CI/CD интеграция

Правило автоматически запускается при:
- `npm run lint` — локальная проверка
- Pre-commit hooks (если настроены)
- GitHub Actions (в CI pipeline)

---

## Преимущества

✅ Предотвращает конфликты z-index  
✅ Поддерживает порядок в проекте  
✅ Упрощает онбординг новых разработчиков  
✅ Документирует систему слоёв в коде  

---

**Последнее обновление:** 2025-12-14  
**Автор:** Юра (poehali.dev)
