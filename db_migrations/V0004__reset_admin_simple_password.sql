-- Обновление пароля администратора на простой (пароль: 123456)
-- Хеш: bcrypt для '123456' с cost=12
UPDATE users 
SET password_hash = '$2b$12$8fvlC.LTJPjVrxVEtOjZuO3MXKF5oQH9VJqKZJz8JyYTnxQZWJYdy',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'admin@example.com';