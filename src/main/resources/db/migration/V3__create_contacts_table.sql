-- Create contacts table
CREATE TABLE contacts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster searches
CREATE INDEX idx_contacts_email ON contacts(email);

-- Create index on created_at for date-based queries
CREATE INDEX idx_contacts_created_at ON contacts(created_at);

-- Create index on names for search functionality
CREATE INDEX idx_contacts_names ON contacts(first_name, last_name);
