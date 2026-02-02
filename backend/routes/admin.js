import express from 'express';
import pool from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { generateUUID } from '../utils/uuid.js';

const router = express.Router();

// All admin routes require authentication and admin access
router.use(authenticate);
router.use(isAdmin);

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const [orders] = await pool.execute(
      `SELECT o.id, o.user_id, o.order_number, o.items, o.subtotal, o.discount, 
              o.delivery_fee, o.total, o.affiliate_code, o.delivery_address,
              o.delivery_state, o.delivery_city, o.phone_number, o.whatsapp_number,
              o.payment_status, o.payment_reference, o.status, o.created_at, o.updated_at,
              p.full_name, p.email
       FROM orders o
       LEFT JOIN profiles p ON o.user_id = p.user_id
       ORDER BY o.created_at DESC`
    );

    const ordersWithParsedItems = orders.map(order => ({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
    }));

    res.json(ordersWithParsedItems);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Get all profiles
router.get('/profiles', async (req, res) => {
  try {
    const [profiles] = await pool.execute(
      `SELECT id, user_id, full_name, email, phone_number, whatsapp_number,
              address, state, city, created_at, updated_at
       FROM profiles 
       ORDER BY created_at DESC`
    );

    res.json(profiles);
  } catch (error) {
    console.error('Get profiles error:', error);
    res.status(500).json({ error: 'Failed to get profiles' });
  }
});

// Get all order status history
router.get('/order-history', async (req, res) => {
  try {
    const [history] = await pool.execute(
      `SELECT id, order_id, status, notes, created_at
       FROM order_status_history 
       ORDER BY created_at DESC`
    );

    res.json(history);
  } catch (error) {
    console.error('Get order history error:', error);
    res.status(500).json({ error: 'Failed to get order history' });
  }
});

// Update order
router.put('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, payment_status, note } = req.body;

    if (!status && !payment_status) {
      return res.status(400).json({ error: 'Status or payment_status is required' });
    }

    const updates = [];
    const values = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
    }

    if (payment_status) {
      updates.push('payment_status = ?');
      values.push(payment_status);
    }

    updates.push('updated_at = NOW()');
    values.push(orderId);

    await pool.execute(
      `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Add status history entry
    if (status || note) {
      await pool.execute(
        `INSERT INTO order_status_history (id, order_id, status, notes, created_at)
         VALUES (UUID(), ?, ?, ?, NOW())`,
        [orderId, status || 'updated', note || `Updated by ${req.user.email}`]
      );
    }

    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Products management (if products table exists)
router.get('/products', async (req, res) => {
  try {
    // Check if products table exists
    const [tables] = await pool.execute(
      "SHOW TABLES LIKE 'products'"
    );

    if (tables.length === 0) {
      return res.json([]);
    }

    const [products] = await pool.execute(
      `SELECT id, name, type, description, price, stock, image_url, created_at
       FROM products 
       ORDER BY created_at DESC`
    );

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

router.post('/products', async (req, res) => {
  try {
    const { name, type, description, price, stock, image_url } = req.body;

    if (!name || !type || price === undefined || stock === undefined) {
      return res.status(400).json({ error: 'Name, type, price, and stock are required' });
    }

    await pool.execute(
      `INSERT INTO products (id, name, type, description, price, stock, image_url, created_at)
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW())`,
      [name, type, description || null, price, stock, image_url || null]
    );

    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, type, description, price, stock, image_url } = req.body;

    await pool.execute(
      `UPDATE products 
       SET name = ?, type = ?, description = ?, price = ?, stock = ?, image_url = ?
       WHERE id = ?`,
      [name, type, description, price, stock, image_url, productId]
    );

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    await pool.execute('DELETE FROM products WHERE id = ?', [productId]);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
