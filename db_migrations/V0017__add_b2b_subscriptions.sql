-- Добавляем корпоративные тарифы для white-label
INSERT INTO t_p18253922_infinite_business_ca.subscriptions (name, price, duration_days, features, can_remove_branding)
VALUES 
    ('White-Label Стартап', 9990, 30, '{"max_users": 50, "max_cards_per_user": 5, "custom_branding": true, "subdomain": true, "analytics": true, "email_support": true}', TRUE),
    ('White-Label Бизнес', 29990, 30, '{"max_users": 200, "max_cards_per_user": -1, "custom_branding": true, "subdomain": true, "custom_domain": true, "analytics": true, "priority_support": true, "api_access": true}', TRUE)
ON CONFLICT DO NOTHING;

-- Обновляем существующие тарифы для корректной работы
UPDATE t_p18253922_infinite_business_ca.subscriptions 
SET features = features || '{"display_order": 1}'::jsonb
WHERE name = 'Базовый';

UPDATE t_p18253922_infinite_business_ca.subscriptions 
SET features = features || '{"display_order": 2}'::jsonb
WHERE name = 'Продвинутый';

UPDATE t_p18253922_infinite_business_ca.subscriptions 
SET features = features || '{"display_order": 3}'::jsonb
WHERE name = 'Бизнес';

UPDATE t_p18253922_infinite_business_ca.subscriptions 
SET features = features || '{"display_order": 4}'::jsonb
WHERE name = 'White-Label Стартап';

UPDATE t_p18253922_infinite_business_ca.subscriptions 
SET features = features || '{"display_order": 5}'::jsonb
WHERE name = 'White-Label Бизнес';