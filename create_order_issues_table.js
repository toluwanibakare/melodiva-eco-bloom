import pool from './backend/config/database.js';

async function migrate() {
  try {
    console.log('Running order_issues and schema updates migration...');

    // 1. Ensure contact_messages has columns: phone, subject, status, reply, updated_at
    const alterCols = [
      { name: 'phone', query: 'ALTER TABLE contact_messages ADD COLUMN phone TEXT NULL' },
      { name: 'subject', query: 'ALTER TABLE contact_messages ADD COLUMN subject TEXT NULL' },
      { name: 'status', query: "ALTER TABLE contact_messages ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'pending'" },
      { name: 'reply', query: 'ALTER TABLE contact_messages ADD COLUMN reply TEXT NULL' },
      { name: 'updated_at', query: 'ALTER TABLE contact_messages ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
    ];

    for (const col of alterCols) {
      try {
        await pool.execute(col.query);
        console.log(`Added column ${col.name} to contact_messages.`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          // Column already exists
        } else {
          console.warn(`Column ${col.name} note:`, err.message);
        }
      }
    }

    // 2. Create order_issues table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS order_issues (
        id CHAR(36) PRIMARY KEY,
        order_id CHAR(36) NOT NULL,
        order_number VARCHAR(100) NOT NULL,
        user_id CHAR(36) NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT NULL,
        issue_type VARCHAR(50) NOT NULL DEFAULT 'damaged_item',
        description TEXT NOT NULL,
        media_urls JSON NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        admin_reply TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_order_issues_order_number (order_number),
        INDEX idx_order_issues_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Create delivery_pricing table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS delivery_pricing (
        id CHAR(36) PRIMARY KEY,
        location_type ENUM('state', 'city') NOT NULL,
        name VARCHAR(255) NOT NULL,
        parent_state VARCHAR(255) NULL,
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_location (location_type, name, parent_state)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('Order issues migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
