import pool from '../config/database.js';

export const generateOrderNumber = async () => {
  let newNumber;
  let exists = true;
  let attempts = 0;
  const maxAttempts = 10;

  while (exists && attempts < maxAttempts) {
    const random = Math.floor(Math.random() * 999999);
    newNumber = `ORD-${String(random).padStart(6, '0')}`;
    
    const [orders] = await pool.execute(
      'SELECT id FROM orders WHERE order_number = ?',
      [newNumber]
    );
    
    exists = orders.length > 0;
    attempts++;
  }

  if (attempts >= maxAttempts) {
    // Fallback to timestamp-based number
    newNumber = `ORD-${Date.now()}`;
  }

  return newNumber;
};
