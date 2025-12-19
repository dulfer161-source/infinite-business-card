-- Добавление полей для восстановления пароля
ALTER TABLE t_p18253922_infinite_business_ca.users 
ADD COLUMN IF NOT EXISTS reset_token TEXT,
ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP;