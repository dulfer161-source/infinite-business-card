-- Добавляем поля для хранения HTML/CSS макетов секций визиток

ALTER TABLE t_p18253922_infinite_business_ca.business_cards 
  ADD COLUMN IF NOT EXISTS hero_html TEXT,
  ADD COLUMN IF NOT EXISTS hero_css TEXT,
  ADD COLUMN IF NOT EXISTS about_html TEXT,
  ADD COLUMN IF NOT EXISTS about_css TEXT,
  ADD COLUMN IF NOT EXISTS services_html TEXT,
  ADD COLUMN IF NOT EXISTS services_css TEXT,
  ADD COLUMN IF NOT EXISTS contacts_html TEXT,
  ADD COLUMN IF NOT EXISTS contacts_css TEXT,
  ADD COLUMN IF NOT EXISTS full_html TEXT,
  ADD COLUMN IF NOT EXISTS full_css TEXT;

COMMENT ON COLUMN t_p18253922_infinite_business_ca.business_cards.hero_html IS 'HTML код для hero секции (шапка визитки)';
COMMENT ON COLUMN t_p18253922_infinite_business_ca.business_cards.hero_css IS 'CSS стили для hero секции';
COMMENT ON COLUMN t_p18253922_infinite_business_ca.business_cards.about_html IS 'HTML код для секции "О себе"';
COMMENT ON COLUMN t_p18253922_infinite_business_ca.business_cards.about_css IS 'CSS стили для секции "О себе"';
COMMENT ON COLUMN t_p18253922_infinite_business_ca.business_cards.services_html IS 'HTML код для секции услуг';
COMMENT ON COLUMN t_p18253922_infinite_business_ca.business_cards.services_css IS 'CSS стили для секции услуг';
COMMENT ON COLUMN t_p18253922_infinite_business_ca.business_cards.contacts_html IS 'HTML код для секции контактов';
COMMENT ON COLUMN t_p18253922_infinite_business_ca.business_cards.contacts_css IS 'CSS стили для секции контактов';
COMMENT ON COLUMN t_p18253922_infinite_business_ca.business_cards.full_html IS 'HTML код для полной визитки';
COMMENT ON COLUMN t_p18253922_infinite_business_ca.business_cards.full_css IS 'CSS стили для полной визитки';