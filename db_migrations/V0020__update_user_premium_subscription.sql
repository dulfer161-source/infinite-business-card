-- Обновляем подписку пользователя dulfer161@yandex.ru на максимальный тариф "Бизнес"
UPDATE user_subscriptions 
SET 
  plan_id = 3,
  status = 'active',
  expires_at = '2027-01-05 23:59:59'
WHERE user_id = 2;
