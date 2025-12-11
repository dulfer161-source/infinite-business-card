-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    period VARCHAR(50),
    features JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    plan_id INTEGER REFERENCES subscription_plans(id),
    status VARCHAR(50) DEFAULT 'active',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create business_cards table
CREATE TABLE IF NOT EXISTS business_cards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    company VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    description TEXT,
    logo_url VARCHAR(500),
    qr_code_url VARCHAR(500),
    view_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create media_assets table (for uploaded images/logos)
CREATE TABLE IF NOT EXISTS media_assets (
    id SERIAL PRIMARY KEY,
    card_id INTEGER REFERENCES business_cards(id),
    user_id INTEGER REFERENCES users(id),
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    payment_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'RUB',
    payment_type VARCHAR(50),
    payment_provider VARCHAR(50),
    provider_payment_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_business_cards_user_id ON business_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_card_id ON media_assets(card_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, price, period, features) VALUES
('Базовый', 0, NULL, '["Регистрация визитки", "QR-код", "Шеринг в мессенджеры", "Просмотр статистики"]'),
('Премиум', 790, 'year', '["AI-генерация изображений", "Безлимитные макеты с ИИ", "Приоритетная поддержка", "Расширенная аналитика"]'),
('Корпоративный', 970, 'year', '["20 регистраций сотрудников", "Единый дизайн компании", "Корпоративные макеты", "Персональный менеджер"]')
ON CONFLICT DO NOTHING;