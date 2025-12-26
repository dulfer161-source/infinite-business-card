-- Таблица для white-label клиентов (компаний)
CREATE TABLE IF NOT EXISTS t_p18253922_infinite_business_ca.white_label_clients (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE,
    custom_domain VARCHAR(255) UNIQUE,
    
    logo_url VARCHAR(500),
    primary_color VARCHAR(20) DEFAULT '#FFD700',
    secondary_color VARCHAR(20) DEFAULT '#000000',
    background_color VARCHAR(20) DEFAULT '#FFFFFF',
    font_family VARCHAR(100) DEFAULT 'Inter',
    
    contact_name VARCHAR(255),
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    
    max_users INTEGER DEFAULT 10,
    max_cards_per_user INTEGER DEFAULT 5,
    features JSONB DEFAULT '{}',
    
    monthly_price DECIMAL(10,2) DEFAULT 0,
    contract_start_date DATE,
    contract_end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Связь пользователей с white-label клиентами
ALTER TABLE t_p18253922_infinite_business_ca.users 
ADD COLUMN IF NOT EXISTS white_label_client_id INTEGER,
ADD COLUMN IF NOT EXISTS is_white_label_admin BOOLEAN DEFAULT FALSE;

-- Связь визиток с white-label клиентами
ALTER TABLE t_p18253922_infinite_business_ca.business_cards 
ADD COLUMN IF NOT EXISTS white_label_client_id INTEGER;

-- Таблица для отслеживания использования ресурсов
CREATE TABLE IF NOT EXISTS t_p18253922_infinite_business_ca.white_label_usage (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_users INTEGER DEFAULT 0,
    total_cards INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_wl_clients_subdomain ON t_p18253922_infinite_business_ca.white_label_clients(subdomain);
CREATE INDEX IF NOT EXISTS idx_wl_clients_domain ON t_p18253922_infinite_business_ca.white_label_clients(custom_domain);
CREATE INDEX IF NOT EXISTS idx_users_wl_client ON t_p18253922_infinite_business_ca.users(white_label_client_id);
CREATE INDEX IF NOT EXISTS idx_cards_wl_client ON t_p18253922_infinite_business_ca.business_cards(white_label_client_id);