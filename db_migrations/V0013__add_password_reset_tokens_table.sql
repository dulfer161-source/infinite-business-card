CREATE TABLE IF NOT EXISTS t_p18253922_infinite_business_ca.password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_password_reset_token ON t_p18253922_infinite_business_ca.password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_user_id ON t_p18253922_infinite_business_ca.password_reset_tokens(user_id);
