-- Таблица шаблонов визиток
CREATE TABLE IF NOT EXISTS t_p18253922_infinite_business_ca.card_templates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p18253922_infinite_business_ca.users(id),
    card_id INTEGER REFERENCES t_p18253922_infinite_business_ca.business_cards(id),
    template_type VARCHAR(50) NOT NULL CHECK (template_type IN ('uploaded', 'generated', 'default')),
    template_url TEXT NOT NULL,
    preview_url TEXT,
    is_active BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица рекламных зон
CREATE TABLE IF NOT EXISTS t_p18253922_infinite_business_ca.ad_zones (
    id SERIAL PRIMARY KEY,
    card_id INTEGER REFERENCES t_p18253922_infinite_business_ca.business_cards(id),
    zone_name VARCHAR(100) NOT NULL,
    zone_position VARCHAR(50) NOT NULL CHECK (zone_position IN ('header', 'footer', 'sidebar', 'content')),
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица рекламных размещений
CREATE TABLE IF NOT EXISTS t_p18253922_infinite_business_ca.ad_placements (
    id SERIAL PRIMARY KEY,
    ad_zone_id INTEGER REFERENCES t_p18253922_infinite_business_ca.ad_zones(id),
    advertiser_name VARCHAR(255),
    advertiser_email VARCHAR(255),
    ad_content TEXT NOT NULL,
    ad_image_url TEXT,
    ad_link_url TEXT,
    price_per_month DECIMAL(10,2) DEFAULT 0,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'expired')),
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Обновление тарифов (features как JSONB array)
UPDATE t_p18253922_infinite_business_ca.subscription_plans 
SET features = '["Регистрация визитки", "QR-код", "Шеринг в мессенджеры", "Просмотр статистики", "Загрузка макетов", "Генерация макетов с ИИ"]'::jsonb
WHERE name = 'Базовый';

UPDATE t_p18253922_infinite_business_ca.subscription_plans 
SET features = '["Всё из Базового", "Безлимитные макеты с ИИ", "Продажа рекламы на визитке", "Управление рекламными зонами", "Приоритетная поддержка", "Расширенная аналитика"]'::jsonb
WHERE name = 'Премиум';

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_card_templates_card_id ON t_p18253922_infinite_business_ca.card_templates(card_id);
CREATE INDEX IF NOT EXISTS idx_card_templates_user_id ON t_p18253922_infinite_business_ca.card_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_zones_card_id ON t_p18253922_infinite_business_ca.ad_zones(card_id);
CREATE INDEX IF NOT EXISTS idx_ad_placements_zone_id ON t_p18253922_infinite_business_ca.ad_placements(ad_zone_id);
CREATE INDEX IF NOT EXISTS idx_ad_placements_status ON t_p18253922_infinite_business_ca.ad_placements(status);