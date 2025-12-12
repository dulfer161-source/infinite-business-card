-- Добавление новых колонок для улучшенной функциональности
ALTER TABLE business_cards 
ADD COLUMN IF NOT EXISTS theme VARCHAR(50) DEFAULT 'classic',
ADD COLUMN IF NOT EXISTS short_url VARCHAR(100) UNIQUE;