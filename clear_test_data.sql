-- ⚠️ ВНИМАНИЕ: Этот скрипт удалит ВСЕ данные из базы!
-- Используйте только для тестирования

-- 1. Удаляем зависимые записи (из-за foreign keys)
DELETE FROM t_p18253922_infinite_business_ca.auth_tokens;
DELETE FROM t_p18253922_infinite_business_ca.business_cards;
DELETE FROM t_p18253922_infinite_business_ca.card_leads;
DELETE FROM t_p18253922_infinite_business_ca.card_views;
DELETE FROM t_p18253922_infinite_business_ca.media_assets;
DELETE FROM t_p18253922_infinite_business_ca.password_reset_tokens;
DELETE FROM t_p18253922_infinite_business_ca.payments;
DELETE FROM t_p18253922_infinite_business_ca.quiz_answers;
DELETE FROM t_p18253922_infinite_business_ca.quiz_sessions;
DELETE FROM t_p18253922_infinite_business_ca.referrals;
DELETE FROM t_p18253922_infinite_business_ca.user_subscriptions;

-- 2. Удаляем всех пользователей
DELETE FROM t_p18253922_infinite_business_ca.users;

-- 3. Сбрасываем счётчики автоинкремента для чистого старта
ALTER SEQUENCE t_p18253922_infinite_business_ca.users_id_seq RESTART WITH 1;
ALTER SEQUENCE t_p18253922_infinite_business_ca.business_cards_id_seq RESTART WITH 1;
ALTER SEQUENCE t_p18253922_infinite_business_ca.auth_tokens_id_seq RESTART WITH 1;
ALTER SEQUENCE t_p18253922_infinite_business_ca.card_leads_id_seq RESTART WITH 1;
ALTER SEQUENCE t_p18253922_infinite_business_ca.card_views_id_seq RESTART WITH 1;
ALTER SEQUENCE t_p18253922_infinite_business_ca.media_assets_id_seq RESTART WITH 1;
ALTER SEQUENCE t_p18253922_infinite_business_ca.password_reset_tokens_id_seq RESTART WITH 1;
ALTER SEQUENCE t_p18253922_infinite_business_ca.payments_id_seq RESTART WITH 1;
ALTER SEQUENCE t_p18253922_infinite_business_ca.quiz_answers_id_seq RESTART WITH 1;
ALTER SEQUENCE t_p18253922_infinite_business_ca.quiz_sessions_id_seq RESTART WITH 1;
ALTER SEQUENCE t_p18253922_infinite_business_ca.referrals_id_seq RESTART WITH 1;
ALTER SEQUENCE t_p18253922_infinite_business_ca.user_subscriptions_id_seq RESTART WITH 1;

-- Готово! База данных очищена для нового тестирования
