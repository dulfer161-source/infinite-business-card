-- Таблица для хранения результатов прохождения тестов
CREATE TABLE IF NOT EXISTS quiz_sessions (
    id SERIAL PRIMARY KEY,
    video_title VARCHAR(255) NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    completion_time_seconds INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для хранения ответов на конкретные вопросы
CREATE TABLE IF NOT EXISTS quiz_answers (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    selected_answer_index INTEGER NOT NULL,
    correct_answer_index INTEGER NOT NULL,
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрой аналитики
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_video ON quiz_sessions(video_title);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_created ON quiz_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_session ON quiz_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_correct ON quiz_answers(is_correct);

-- Комментарии для документации
COMMENT ON TABLE quiz_sessions IS 'Сессии прохождения тестов пользователями';
COMMENT ON TABLE quiz_answers IS 'Детальные ответы пользователей на вопросы тестов';
COMMENT ON COLUMN quiz_sessions.completion_time_seconds IS 'Время прохождения теста в секундах';
