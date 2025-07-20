-- Create guide_profiles table
CREATE TABLE guide_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    guide_id BIGINT NOT NULL UNIQUE,
    image_url VARCHAR(500),
    phone_number VARCHAR(20) NOT NULL,
    gender VARCHAR(20),
    bio TEXT,
    address TEXT,
    experience_years INT,
    ratings DOUBLE DEFAULT 0.0,
    total_tours INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (guide_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create guide_languages table for many-to-many relationship
CREATE TABLE guide_languages (
    guide_profile_id BIGINT NOT NULL,
    language VARCHAR(20) NOT NULL,
    PRIMARY KEY (guide_profile_id, language),
    FOREIGN KEY (guide_profile_id) REFERENCES guide_profiles(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_guide_profiles_guide_id ON guide_profiles(guide_id);
CREATE INDEX idx_guide_profiles_ratings ON guide_profiles(ratings);
CREATE INDEX idx_guide_profiles_experience ON guide_profiles(experience_years);
CREATE INDEX idx_guide_languages_language ON guide_languages(language);
