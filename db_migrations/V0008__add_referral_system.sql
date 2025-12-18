-- Добавляем колонку referral_code в таблицу users
ALTER TABLE t_p18253922_infinite_business_ca.users 
ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) UNIQUE;

-- Добавляем колонку referred_by в таблицу users
ALTER TABLE t_p18253922_infinite_business_ca.users 
ADD COLUMN IF NOT EXISTS referred_by INTEGER REFERENCES t_p18253922_infinite_business_ca.users(id);

-- Создаем индекс для быстрого поиска по referral_code
CREATE INDEX IF NOT EXISTS idx_users_referral_code 
ON t_p18253922_infinite_business_ca.users(referral_code);

-- Генерируем уникальные реферальные коды для существующих пользователей
UPDATE t_p18253922_infinite_business_ca.users 
SET referral_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT || id::TEXT) FROM 1 FOR 8))
WHERE referral_code IS NULL;