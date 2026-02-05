
import pool from './backend/config/database.js';

async function migrate() {
    try {
        console.log('Running coupon migration...');
        // Create coupons table
        await pool.execute(`
      CREATE TABLE IF NOT EXISTS coupons (
        id CHAR(36) PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        amount DECIMAL(10,2) NOT NULL,
        status ENUM('active', 'used') NOT NULL DEFAULT 'active',
        user_id CHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        used_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

        // Add index
        try {
            await pool.execute('CREATE INDEX idx_coupons_code ON coupons(code)');
        } catch (e) {
            // Ignore if exists
        }

        console.log('Migration successful');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
