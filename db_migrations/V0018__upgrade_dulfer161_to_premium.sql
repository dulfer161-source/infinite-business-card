-- Обновление подписки пользователя dulfer161@yandex.ru на Премиум тариф
UPDATE t_p18253922_infinite_business_ca.user_subscriptions 
SET 
    plan_id = 2,
    status = 'active',
    started_at = NOW(),
    expires_at = NOW() + INTERVAL '1 year'
WHERE user_id = 2;