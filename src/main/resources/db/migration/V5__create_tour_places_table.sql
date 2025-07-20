-- Create tour_places table
CREATE TABLE tour_places (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    category VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_tour_places_name (name),
    INDEX idx_tour_places_category (category),
    INDEX idx_tour_places_location (location),
    INDEX idx_tour_places_active (is_active)
);

-- Create tour_place_images table
CREATE TABLE tour_place_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tour_place_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(200),
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tour_place_id) REFERENCES tour_places(id) ON DELETE CASCADE,
    INDEX idx_tour_place_images_place_id (tour_place_id),
    INDEX idx_tour_place_images_primary (tour_place_id, is_primary),
    INDEX idx_tour_place_images_order (tour_place_id, display_order)
);

-- Insert sample data for tour places
INSERT INTO tour_places (name, description, location, category, is_active) VALUES
('Galle Fort', 'A historic fortress and UNESCO World Heritage Site built by the Portuguese and later fortified by the Dutch. The fort showcases colonial architecture and offers stunning ocean views.', 'Galle', 'Historical', TRUE),
('Unawatuna Beach', 'A beautiful crescent-shaped beach known for its golden sand, calm waters, and vibrant coral reefs. Perfect for swimming, snorkeling, and water sports.', 'Unawatuna', 'Beach', TRUE),
('Mirissa Beach', 'Famous for whale watching and its stunning curved bay. This beach offers excellent opportunities to see blue whales and dolphins.', 'Mirissa', 'Beach', TRUE),
('Yala National Park', 'Sri Lanka''s most famous national park, home to leopards, elephants, crocodiles, and over 200 bird species. Excellent for wildlife safaris.', 'Yala', 'Wildlife', TRUE),
('Ella Rock', 'A popular hiking destination offering breathtaking panoramic views of the surrounding hills, tea plantations, and valleys.', 'Ella', 'Adventure', TRUE),
('Sigiriya Rock Fortress', 'An ancient rock fortress and palace ruins, also known as Lion Rock. A UNESCO World Heritage Site with ancient frescoes and gardens.', 'Sigiriya', 'Historical', TRUE);

-- Insert sample images for tour places
INSERT INTO tour_place_images (tour_place_id, image_url, alt_text, is_primary, display_order) VALUES
-- Galle Fort images
(1, '/images/tour-places/galle-fort-1.jpg', 'Galle Fort entrance gate', TRUE, 0),
(1, '/images/tour-places/galle-fort-2.jpg', 'Galle Fort lighthouse', FALSE, 1),
(1, '/images/tour-places/galle-fort-3.jpg', 'Colonial architecture in Galle Fort', FALSE, 2),

-- Unawatuna Beach images
(2, '/images/tour-places/unawatuna-1.jpg', 'Unawatuna Beach panoramic view', TRUE, 0),
(2, '/images/tour-places/unawatuna-2.jpg', 'Crystal clear waters of Unawatuna', FALSE, 1),
(2, '/images/tour-places/unawatuna-3.jpg', 'Sunset at Unawatuna Beach', FALSE, 2),

-- Mirissa Beach images
(3, '/images/tour-places/mirissa-1.jpg', 'Mirissa Beach curved bay', TRUE, 0),
(3, '/images/tour-places/mirissa-2.jpg', 'Whale watching boat in Mirissa', FALSE, 1),
(3, '/images/tour-places/mirissa-3.jpg', 'Blue whale spotted near Mirissa', FALSE, 2),

-- Yala National Park images
(4, '/images/tour-places/yala-1.jpg', 'Sri Lankan leopard in Yala', TRUE, 0),
(4, '/images/tour-places/yala-2.jpg', 'Elephant herd in Yala National Park', FALSE, 1),
(4, '/images/tour-places/yala-3.jpg', 'Safari jeep in Yala', FALSE, 2),

-- Ella Rock images
(5, '/images/tour-places/ella-1.jpg', 'View from Ella Rock summit', TRUE, 0),
(5, '/images/tour-places/ella-2.jpg', 'Tea plantations around Ella', FALSE, 1),
(5, '/images/tour-places/ella-3.jpg', 'Hiking trail to Ella Rock', FALSE, 2),

-- Sigiriya images
(6, '/images/tour-places/sigiriya-1.jpg', 'Sigiriya Rock from base', TRUE, 0),
(6, '/images/tour-places/sigiriya-2.jpg', 'Ancient frescoes of Sigiriya', FALSE, 1),
(6, '/images/tour-places/sigiriya-3.jpg', 'View from top of Sigiriya', FALSE, 2);
