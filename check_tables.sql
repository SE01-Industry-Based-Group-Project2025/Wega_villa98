-- Check current table structure
DESCRIBE users;
DESCRIBE roles;
DESCRIBE privileges;

-- Show table creation statements
SHOW CREATE TABLE users;
SHOW CREATE TABLE roles;
SHOW CREATE TABLE privileges;

-- Check if auto_increment is working
SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'wega_villa_db' AND TABLE_NAME = 'users';
SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'wega_villa_db' AND TABLE_NAME = 'roles';
SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'wega_villa_db' AND TABLE_NAME = 'privileges';
