-- Add name column to users table
ALTER TABLE users ADD COLUMN name VARCHAR(255);

-- Update existing users to have a default name (using part before @ from username)
UPDATE users SET name = SUBSTRING_INDEX(username, '@', 1) WHERE name IS NULL;

-- Make name column NOT NULL after updating existing records
ALTER TABLE users MODIFY COLUMN name VARCHAR(255) NOT NULL;
