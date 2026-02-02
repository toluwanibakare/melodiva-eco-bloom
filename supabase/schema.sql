-- MySQL Schema converted from PostgreSQL migrations
-- Compatible with MySQL 5.7+ and MySQL 8.0+
-- Note: Row Level Security (RLS) and policies are PostgreSQL-specific
-- These should be implemented at the application level in MySQL

-- ============================================================================
-- USERS TABLE (auth.users equivalent)
-- ============================================================================
-- This table mimics Supabase's auth.users table structure.
-- In Supabase, auth.users is managed by Supabase Auth, but for MySQL
-- we need to create it manually to match the same structure.
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NULL,
  raw_user_meta_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  whatsapp_number TEXT,
  address TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  security_question TEXT NOT NULL,
  security_answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- CONTACT MESSAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id CHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- REVIEWS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id CHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  rating INT NOT NULL,
  comment TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_rating CHECK (rating >= 1 AND rating <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- AFFILIATES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS affiliates (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  affiliate_code TEXT NOT NULL UNIQUE,
  commission_rate DECIMAL(10, 2) NOT NULL DEFAULT 10.0,
  total_commission DECIMAL(10, 2) NOT NULL DEFAULT 0,
  current_balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_withdrawn DECIMAL(10, 2) NOT NULL DEFAULT 0,
  rules_agreed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- AFFILIATE REFERRALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS affiliate_referrals (
  id CHAR(36) PRIMARY KEY,
  affiliate_id CHAR(36) NOT NULL,
  referred_user_id CHAR(36),
  order_id TEXT,
  commission_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE,
  FOREIGN KEY (referred_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- AFFILIATE WITHDRAWALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS affiliate_withdrawals (
  id CHAR(36) PRIMARY KEY,
  affiliate_id CHAR(36) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  processed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- ORDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  order_number TEXT NOT NULL UNIQUE,
  items JSON NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  delivery_fee DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  affiliate_code TEXT,
  affiliate_id CHAR(36),
  delivery_address TEXT NOT NULL,
  delivery_state TEXT NOT NULL,
  delivery_city TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  whatsapp_number TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_reference TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- ORDER STATUS HISTORY TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS order_status_history (
  id CHAR(36) PRIMARY KEY,
  order_id CHAR(36) NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
-- Note: CREATE INDEX IF NOT EXISTS is MySQL 8.0+ only
-- For MySQL 5.7, remove IF NOT EXISTS or use separate CREATE INDEX statements
-- after checking if index exists via application code

-- MySQL 8.0+ syntax (commented for 5.7 compatibility)
-- CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
-- CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON affiliates(user_id);
-- CREATE INDEX IF NOT EXISTS idx_affiliates_affiliate_code ON affiliates(affiliate_code(255));
-- CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_affiliate_id ON affiliate_referrals(affiliate_id);
-- CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_referred_user_id ON affiliate_referrals(referred_user_id);
-- CREATE INDEX IF NOT EXISTS idx_affiliate_withdrawals_affiliate_id ON affiliate_withdrawals(affiliate_id);
-- CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
-- CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number(255));
-- CREATE INDEX IF NOT EXISTS idx_orders_affiliate_id ON orders(affiliate_id);
-- CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);

-- MySQL 5.7+ compatible syntax (may fail if index already exists)
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX idx_affiliates_affiliate_code ON affiliates(affiliate_code(255));
CREATE INDEX idx_affiliate_referrals_affiliate_id ON affiliate_referrals(affiliate_id);
CREATE INDEX idx_affiliate_referrals_referred_user_id ON affiliate_referrals(referred_user_id);
CREATE INDEX idx_affiliate_withdrawals_affiliate_id ON affiliate_withdrawals(affiliate_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number(255));
CREATE INDEX idx_orders_affiliate_id ON orders(affiliate_id);
CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);

-- ============================================================================
-- TRIGGERS FOR UUID GENERATION (MySQL 5.7 compatibility)
-- ============================================================================
-- Note: MySQL 5.7 doesn't support DEFAULT (UUID()) for non-timestamp columns
-- These triggers automatically generate UUIDs for id columns on INSERT
-- For MySQL 8.0+, you can optionally use DEFAULT (UUID()) instead

DELIMITER $$

-- Trigger for profiles table
DROP TRIGGER IF EXISTS trg_profiles_before_insert$$
CREATE TRIGGER trg_profiles_before_insert
BEFORE INSERT ON profiles
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$

-- Trigger for contact_messages table
DROP TRIGGER IF EXISTS trg_contact_messages_before_insert$$
CREATE TRIGGER trg_contact_messages_before_insert
BEFORE INSERT ON contact_messages
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$

-- Trigger for reviews table
DROP TRIGGER IF EXISTS trg_reviews_before_insert$$
CREATE TRIGGER trg_reviews_before_insert
BEFORE INSERT ON reviews
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$

-- Trigger for affiliates table
DROP TRIGGER IF EXISTS trg_affiliates_before_insert$$
CREATE TRIGGER trg_affiliates_before_insert
BEFORE INSERT ON affiliates
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$

-- Trigger for affiliate_referrals table
DROP TRIGGER IF EXISTS trg_affiliate_referrals_before_insert$$
CREATE TRIGGER trg_affiliate_referrals_before_insert
BEFORE INSERT ON affiliate_referrals
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$

-- Trigger for affiliate_withdrawals table
DROP TRIGGER IF EXISTS trg_affiliate_withdrawals_before_insert$$
CREATE TRIGGER trg_affiliate_withdrawals_before_insert
BEFORE INSERT ON affiliate_withdrawals
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$

-- Trigger for orders table
DROP TRIGGER IF EXISTS trg_orders_before_insert$$
CREATE TRIGGER trg_orders_before_insert
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$

-- Trigger for order_status_history table
DROP TRIGGER IF EXISTS trg_order_status_history_before_insert$$
CREATE TRIGGER trg_order_status_history_before_insert
BEFORE INSERT ON order_status_history
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$

-- Trigger to auto-create profile when new user is created (matches Supabase handle_new_user)
DROP TRIGGER IF EXISTS trg_users_after_insert$$
CREATE TRIGGER trg_users_after_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
  INSERT INTO profiles (
    user_id,
    full_name,
    email,
    phone_number,
    whatsapp_number,
    address,
    state,
    city,
    security_question,
    security_answer
  )
  VALUES (
    NEW.id,
    COALESCE(JSON_UNQUOTE(JSON_EXTRACT(NEW.raw_user_meta_data, '$.full_name')), ''),
    NEW.email,
    COALESCE(JSON_UNQUOTE(JSON_EXTRACT(NEW.raw_user_meta_data, '$.phone_number')), ''),
    COALESCE(JSON_UNQUOTE(JSON_EXTRACT(NEW.raw_user_meta_data, '$.whatsapp_number')), NULL),
    COALESCE(JSON_UNQUOTE(JSON_EXTRACT(NEW.raw_user_meta_data, '$.address')), ''),
    COALESCE(JSON_UNQUOTE(JSON_EXTRACT(NEW.raw_user_meta_data, '$.state')), ''),
    COALESCE(JSON_UNQUOTE(JSON_EXTRACT(NEW.raw_user_meta_data, '$.city')), ''),
    COALESCE(JSON_UNQUOTE(JSON_EXTRACT(NEW.raw_user_meta_data, '$.security_question')), ''),
    COALESCE(JSON_UNQUOTE(JSON_EXTRACT(NEW.raw_user_meta_data, '$.security_answer')), '')
  );
END$$

DELIMITER ;

-- ============================================================================
-- STORED PROCEDURES AND FUNCTIONS
-- ============================================================================

-- Function to generate order number
-- Note: MySQL doesn't support functions that return values directly in the same way as PostgreSQL
-- This is a stored procedure that uses an OUT parameter
DELIMITER $$

DROP PROCEDURE IF EXISTS generate_order_number$$

CREATE PROCEDURE generate_order_number(OUT new_order_number TEXT)
BEGIN
  DECLARE new_number TEXT;
  DECLARE exists_check INT DEFAULT 1;
  
  order_loop: LOOP
    SET new_number = CONCAT('ORD-', LPAD(FLOOR(RAND() * 999999), 6, '0'));
    
    SELECT COUNT(*) INTO exists_check
    FROM orders
    WHERE order_number = new_number;
    
    IF exists_check = 0 THEN
      SET new_order_number = new_number;
      LEAVE order_loop;
    END IF;
  END LOOP;
END$$

DELIMITER ;

-- ============================================================================
-- NOTES ON POSTGRESQL TO MYSQL CONVERSION
-- ============================================================================

-- AUTH SETUP:
-- The 'users' table mimics Supabase's auth.users table structure.
-- In Supabase, auth.users is managed by Supabase Auth, but in MySQL
-- you need to manage it manually. The table includes:
-- - id: CHAR(36) matching UUID format
-- - email: User's email address
-- - raw_user_meta_data: JSON field for storing user metadata (matches Supabase)
-- - created_at/updated_at: Timestamps
--
-- The trigger 'trg_users_after_insert' automatically creates a profile
-- when a new user is inserted, matching Supabase's handle_new_user function.
-- This extracts data from raw_user_meta_data JSON field.

-- ROW LEVEL SECURITY (RLS):
-- PostgreSQL RLS policies have been removed as MySQL doesn't support RLS.
-- Implement access control at the application level using:
-- - Application-level authentication/authorization
-- - Stored procedures with security checks
-- - Views with WHERE clauses based on user context

-- AUTH.UID() FUNCTION:
-- The PostgreSQL auth.uid() function is Supabase-specific.
-- In MySQL, you'll need to:
-- - Pass user_id as a parameter to queries
-- - Use application-level session management
-- - Create views or stored procedures that accept user_id as parameter

-- TRIGGERS:
-- The updated_at triggers are handled automatically using MySQL's
-- ON UPDATE CURRENT_TIMESTAMP clause in the table definitions.
-- UUID generation is handled via BEFORE INSERT triggers for MySQL 5.7 compatibility.
-- The handle_new_user functionality is implemented via trg_users_after_insert trigger
-- which automatically creates a profile when a new user is inserted, matching
-- Supabase's behavior. It extracts user metadata from raw_user_meta_data JSON field.

-- JSONB vs JSON:
-- Converted jsonb to JSON. MySQL 5.7.8+ supports JSON type with
-- similar functionality to PostgreSQL's jsonb.

-- UUID GENERATION:
-- UUIDs are generated via BEFORE INSERT triggers for MySQL 5.7 compatibility.
-- MySQL 8.0+ supports DEFAULT (UUID()) syntax, but triggers work for all versions.
-- Alternative: Generate UUIDs at the application level before INSERT.

-- TIME ZONE HANDLING:
-- MySQL TIMESTAMP type handles time zones automatically.
-- If you need explicit timezone support, consider using DATETIME
-- and handling timezones at the application level.

-- CHECK CONSTRAINTS:
-- CHECK constraints are defined but enforcement varies by MySQL version:
-- - MySQL 8.0.16+: CHECK constraints are enforced
-- - MySQL 5.7 - 8.0.15: CHECK constraints are parsed but not enforced
-- - MySQL < 5.7: CHECK constraints are ignored
-- For older versions, implement validation at the application level.

-- INDEXES:
-- Index creation statements may fail if indexes already exist.
-- For MySQL 8.0+, you can use CREATE INDEX IF NOT EXISTS.
-- For MySQL 5.7, either:
-- - Remove existing indexes first, or
-- - Use application-level checks before creating indexes, or
-- - Ignore errors if indexes already exist

-- MYSQL VERSION COMPATIBILITY:
-- This schema is compatible with:
-- - MySQL 5.7.8+ (minimum for JSON support)
-- - MySQL 8.0+ (full feature support)
-- 
-- Key version-specific features:
-- - JSON type: MySQL 5.7.8+
-- - CHECK constraint enforcement: MySQL 8.0.16+
-- - CREATE INDEX IF NOT EXISTS: MySQL 8.0+
-- - UUID() function: MySQL 5.7+ (but not in DEFAULT for non-timestamps until 8.0.13+)
