-- Создание таблицы auth_tokens для хранения токенов сессий
CREATE TABLE IF NOT EXISTS t_p18253922_infinite_business_ca.auth_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auth_tokens_token ON t_p18253922_infinite_business_ca.auth_tokens(token);
CREATE INDEX idx_auth_tokens_user_id ON t_p18253922_infinite_business_ca.auth_tokens(user_id);
CREATE INDEX idx_auth_tokens_expires_at ON t_p18253922_infinite_business_ca.auth_tokens(expires_at);