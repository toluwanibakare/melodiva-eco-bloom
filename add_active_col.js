
import pool from './backend/config/database.js';

async function migrate() {
    try {
        console.log('Running migration...');
        await pool.execute('ALTER TABLE affiliates ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE');
        console.log('Migration successful');
        process.exit(0);
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('Column already exists, skipping.');
            process.exit(0);
        }
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
