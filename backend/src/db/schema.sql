-- Users table (both staff and customers)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    role ENUM('admin', 'staff', 'customer') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Email Verification Tokens
CREATE TABLE email_verification_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(100) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_token (token),
    INDEX idx_user_token (user_id, token)
);

-- Password Reset Tokens
CREATE TABLE password_reset_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(100) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_token (token),
    INDEX idx_user_token (user_id, token)
);

-- Customer profiles with additional details
CREATE TABLE customer_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    company_name VARCHAR(100),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    address_line1 VARCHAR(100),
    address_line2 VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(2),
    tax_id VARCHAR(50),
    created_by INT NULL,  -- staff/admin who created this customer
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- API Plans table (both predefined and custom)
CREATE TABLE api_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    is_custom BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_by INT NULL,  -- staff/admin who created this plan
    FOREIGN KEY (created_by) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Customer Plan Subscriptions
CREATE TABLE customer_subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    plan_id INT NOT NULL,
    starts_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ends_at TIMESTAMP NULL,  -- NULL for unlimited
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT NULL,  -- staff/admin who created this subscription
    FOREIGN KEY (customer_id) REFERENCES customer_profiles(id),
    FOREIGN KEY (plan_id) REFERENCES api_plans(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- API Limits table
CREATE TABLE api_limits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    plan_id INT NOT NULL,
    limit_type ENUM('per_minute', 'per_day', 'per_month') NOT NULL,
    limit_value INT,  -- NULL means unlimited
    can_bypass_cache BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (plan_id) REFERENCES api_plans(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_plan_limit (plan_id, limit_type)
);

-- API Keys table
CREATE TABLE api_keys (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    api_key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,  -- descriptive name for the key
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NULL,
    created_by INT NOT NULL,  -- user who created this key (can be customer or staff)
    FOREIGN KEY (customer_id) REFERENCES customer_profiles(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- API Usage tracking
CREATE TABLE api_usage (
    id INT PRIMARY KEY AUTO_INCREMENT,
    api_key_id INT NOT NULL,
    endpoint VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_time INT,  -- in milliseconds
    status_code INT,
    ip_address VARCHAR(45),  -- IPv6 compatible
    user_agent TEXT,
    FOREIGN KEY (api_key_id) REFERENCES api_keys(id)
);

-- API Usage Aggregates for quick limit checking
CREATE TABLE api_usage_aggregates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    api_key_id INT NOT NULL,
    period_type ENUM('minute', 'day', 'month') NOT NULL,
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    request_count INT DEFAULT 0,
    FOREIGN KEY (api_key_id) REFERENCES api_keys(id),
    UNIQUE KEY unique_key_period (api_key_id, period_type, period_start)
);

-- Insert default admin user (password needs to be hashed)
INSERT INTO users (email, password_hash, role, email_verified) 
VALUES ('admin@example.com', 'HASH_TO_BE_REPLACED', 'admin', TRUE);

-- Insert default plans
INSERT INTO api_plans (name, is_custom, description) VALUES
('Free', FALSE, 'Free tier with basic limits'),
('Pay-as-you-go', FALSE, 'Flexible usage-based plan'),
('Business', FALSE, '50,000 requests per month'),
('Enterprise', FALSE, 'Unlimited requests with highest rate limits');

-- Insert default limits for plans
INSERT INTO api_limits (plan_id, limit_type, limit_value, can_bypass_cache)
SELECT 
    p.id,
    'per_day',
    CASE 
        WHEN p.name = 'Free' THEN 500
        WHEN p.name = 'Business' THEN 1667  -- 50,000/30 rounded up
        ELSE NULL  -- Unlimited for Pay-as-you-go and Enterprise
    END,
    p.name != 'Free'
FROM api_plans p;

INSERT INTO api_limits (plan_id, limit_type, limit_value, can_bypass_cache)
SELECT 
    p.id,
    'per_minute',
    CASE 
        WHEN p.name = 'Free' THEN 10
        WHEN p.name = 'Pay-as-you-go' THEN 30
        WHEN p.name = 'Business' THEN 60
        WHEN p.name = 'Enterprise' THEN 120
    END,
    p.name != 'Free'
FROM api_plans p;

-- Create indexes for performance
CREATE INDEX idx_api_usage_timestamp ON api_usage(timestamp);
CREATE INDEX idx_api_usage_api_key_id_timestamp ON api_usage(api_key_id, timestamp);
CREATE INDEX idx_api_usage_aggregates_period ON api_usage_aggregates(api_key_id, period_type, period_start, period_end);
CREATE INDEX idx_customer_email ON users(email);
CREATE INDEX idx_api_keys_key ON api_keys(api_key);

-- Create event to clean up old usage data (keeps last 3 months)
DELIMITER //
CREATE EVENT cleanup_old_usage_data
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
    DELETE FROM api_usage WHERE timestamp < DATE_SUB(NOW(), INTERVAL 3 MONTH);
    DELETE FROM api_usage_aggregates WHERE period_end < DATE_SUB(NOW(), INTERVAL 3 MONTH);
END //
DELIMITER ;
