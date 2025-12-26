-- Добавляем настройки брендинга в визитки
ALTER TABLE t_p18253922_infinite_business_ca.business_cards 
ADD COLUMN IF NOT EXISTS custom_branding JSONB DEFAULT '{"enabled": false}';

ALTER TABLE t_p18253922_infinite_business_ca.business_cards 
ADD COLUMN IF NOT EXISTS hide_platform_branding BOOLEAN DEFAULT FALSE;

-- Обновляем существующие подписки для поддержки брендирования
ALTER TABLE t_p18253922_infinite_business_ca.subscriptions 
ADD COLUMN IF NOT EXISTS can_remove_branding BOOLEAN DEFAULT FALSE;

-- Обновляем тарифы
UPDATE t_p18253922_infinite_business_ca.subscriptions 
SET can_remove_branding = TRUE 
WHERE name IN ('Продвинутый', 'Бизнес');