-- Remove the old type column from rooms table since we now use room_type_id foreign key
ALTER TABLE rooms DROP COLUMN type;
