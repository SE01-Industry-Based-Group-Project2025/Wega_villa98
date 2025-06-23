-- Flyway migration: create initial roles, privileges, and admin user
INSERT INTO privileges (name) VALUES ('READ_PRIVILEGE'), ('WRITE_PRIVILEGE') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO roles (name) VALUES ('ADMIN'), ('USER'), ('TOUR_GUIDE'), ('MANAGER') ON DUPLICATE KEY UPDATE name=name;
-- You can add more inserts for role_privileges and users as needed
