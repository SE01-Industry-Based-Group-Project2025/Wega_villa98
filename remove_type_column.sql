-- Remove the old type column from rooms table
USE wega_villa_db;

ALTER TABLE rooms DROP COLUMN type;

-- Verify the change
DESCRIBE rooms;
