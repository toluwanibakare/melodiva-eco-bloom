// One-off DB connectivity check for cPanel "Run JS script" -> db:test
// Exits immediately with clear output (never hangs like `npm start` does).
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'melodiva_skincare',
  port: process.env.DB_PORT || 3306,
  connectTimeout: 10000
};

console.log('Melodiva DB connectivity test');
console.log(`Host: ${config.host} | User: ${config.user} | DB: ${config.database} | Port: ${config.port}`);

try {
  const conn = await mysql.createConnection(config);
  console.log('Connection: OK');

  const [rows] = await conn.query('SELECT 1 AS ok');
  console.log('Query SELECT 1:', rows[0].ok === 1 ? 'OK' : 'UNEXPECTED RESULT');

  try {
    const [tables] = await conn.query('SHOW TABLES');
    console.log(`Tables in database: ${tables.length}`);
    const [users] = await conn.query('SELECT COUNT(*) AS n FROM users');
    console.log(`users table rows: ${users[0].n}`);
  } catch (e) {
    console.log('Schema check: USERS TABLE MISSING OR INACCESSIBLE - ' + e.message);
    console.log('Fix: import melodiva_skincare.sql via phpMyAdmin, then add password_hash column if needed.');
  }

  await conn.end();
  console.log('DB TEST PASSED');
  process.exit(0);
} catch (e) {
  console.log('Connection: FAILED - ' + e.message);
  if (e.code === 'ER_ACCESS_DENIED_ERROR') {
    console.log('Fix: check DB_USER / DB_PASSWORD in .env, and add the user to the database with ALL PRIVILEGES in cPanel MySQL Databases.');
  } else if (e.code === 'ECONNREFUSED' || e.code === 'ENOTFOUND') {
    console.log('Fix: DB_HOST must be localhost on cPanel.');
  } else if (e.code === 'ER_BAD_DB_ERROR') {
    console.log('Fix: create the database first in cPanel MySQL Databases.');
  }
  console.log('DB TEST FAILED');
  process.exit(1);
}
