
-- Update subscription prices to match frontend
UPDATE t_p18253922_infinite_business_ca.subscriptions
SET price = 490.00
WHERE name = 'Продвинутый';

UPDATE t_p18253922_infinite_business_ca.subscriptions
SET price = 990.00
WHERE name = 'Бизнес';
