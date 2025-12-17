-- Обновление пароля администратора (пароль: admin123)
-- Хеш сгенерирован через Python bcrypt.hashpw(b'admin123', bcrypt.gensalt())
UPDATE users 
SET password_hash = '$2b$12$vZY5mXJ3MQ3YQ3F8KqZ8FeLQGZz0sJKxKvW2QGBqGKH9lJ9N2iVEG',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'admin@example.com';