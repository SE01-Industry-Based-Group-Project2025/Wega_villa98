-- Create room_types table first
CREATE TABLE room_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(200),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create rooms table with foreign key to room_types
CREATE TABLE rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_type_id BIGINT NOT NULL,
    room_no VARCHAR(10) NOT NULL UNIQUE,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE RESTRICT
);

-- Create indexes for better performance
CREATE INDEX idx_rooms_room_type_id ON rooms(room_type_id);
CREATE INDEX idx_rooms_available ON rooms(available);
CREATE INDEX idx_rooms_room_type_available ON rooms(room_type_id, available);

-- Insert sample room types
INSERT INTO room_types (name, description) VALUES
('Single', 'Single occupancy room with one bed'),
('Double', 'Double occupancy room with two beds or one double bed'),
('Suite', 'Luxury suite with separate living area'),
('Deluxe', 'Deluxe room with premium amenities'),
('Standard', 'Standard room with basic amenities'),
('Economy', 'Budget-friendly room');

-- Insert some sample rooms
INSERT INTO rooms (room_type_id, room_no, available) VALUES
(1, 'S001', true),  -- Single
(1, 'S002', true),  -- Single
(1, 'S003', false), -- Single
(2, 'D001', true),  -- Double
(2, 'D002', true),  -- Double
(2, 'D003', true),  -- Double
(3, 'SU001', true), -- Suite
(3, 'SU002', false),-- Suite
(4, 'DX001', true), -- Deluxe
(4, 'DX002', true); -- Deluxe
