import express from 'express';
import pool from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { generateOrderNumber } from '../utils/orderNumber.js';
import { generateUUID } from '../utils/uuid.js';
import { sendOrderConfirmationEmail } from '../utils/email.js';

const router = express.Router();

// Create order
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      order_number,
      items,
      subtotal,
      discount,
      delivery_fee,
      total,
      affiliate_code,
      delivery_address,
      delivery_state,
      delivery_city,
      phone_number,
      whatsapp_number,
      payment_reference,
      payment_status,
      status
    } = req.body;

    if (!items || !subtotal || !delivery_fee || !total || !delivery_address || !delivery_state || !delivery_city || !phone_number) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const orderId = generateUUID();
    const finalOrderNumber = order_number || await generateOrderNumber();

    // Find affiliate if code provided
    let affiliateId = null;
    if (affiliate_code) {
      const [affiliates] = await pool.execute(
        'SELECT id FROM affiliates WHERE affiliate_code = ?',
        [affiliate_code]
      );
      if (affiliates.length > 0) {
        affiliateId = affiliates[0].id;
      }
    }

    // Create order
    await pool.execute(
      `INSERT INTO orders (
        id, user_id, order_number, items, subtotal, discount, delivery_fee, total,
        affiliate_code, affiliate_id, delivery_address, delivery_state, delivery_city,
        phone_number, whatsapp_number, payment_status, payment_reference, status,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        orderId,
        req.user.id,
        finalOrderNumber,
        JSON.stringify(items),
        subtotal,
        discount || 0,
        delivery_fee,
        total,
        affiliate_code || null,
        affiliateId,
        delivery_address,
        delivery_state,
        delivery_city,
        phone_number,
        whatsapp_number || null,
        payment_status || 'pending',
        payment_reference || null,
        status || 'pending'
      ]
    );

    // Create initial status history
    await pool.execute(
      'INSERT INTO order_status_history (id, order_id, status, notes, created_at) VALUES (UUID(), ?, ?, ?, NOW())',
      [orderId, status || 'pending', 'Order created']
    );

    // Handle affiliate referral if applicable
    if (affiliateId && discount > 0) {
      try {
        const commissionRate = 10; // Default 10%
        const commissionAmount = (discount * commissionRate) / 100;

        await pool.execute(
          `INSERT INTO affiliate_referrals (
            id, affiliate_id, referred_user_id, order_id, commission_amount, status, created_at
          ) VALUES (UUID(), ?, ?, ?, ?, 'completed', NOW())`,
          [affiliateId, req.user.id, finalOrderNumber, commissionAmount]
        );

        // Update affiliate stats
        await pool.execute(
          `UPDATE affiliates 
           SET total_commission = total_commission + ?, 
               current_balance = current_balance + ?,
               updated_at = NOW()
           WHERE id = ?`,
          [commissionAmount, commissionAmount, affiliateId]
        );
      } catch (affiliateError) {
        console.error('Affiliate referral error:', affiliateError);
        // Don't fail the order if affiliate tracking fails
      }
    }

    // Get user email for confirmation
    const [profiles] = await pool.execute(
      'SELECT email, full_name FROM users WHERE id = ?',
      [req.user.id]
    );

    if (profiles.length > 0) {
      // Send order confirmation email (async)
      sendOrderConfirmationEmail(profiles[0].email, finalOrderNumber, {
        total,
        status: status || 'pending'
      }).catch(console.error);
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: orderId,
        order_number: finalOrderNumber
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user's orders
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const [orders] = await pool.execute(
      `SELECT id, order_number, items, subtotal, discount, delivery_fee, total,
              affiliate_code, delivery_address, delivery_state, delivery_city,
              phone_number, whatsapp_number, payment_status, payment_reference,
              status, created_at, updated_at
       FROM orders 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    // Parse JSON items
    const ordersWithParsedItems = orders.map(order => ({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
    }));

    res.json(ordersWithParsedItems);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Get single order
router.get('/:orderId', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;

    const [orders] = await pool.execute(
      `SELECT id, order_number, items, subtotal, discount, delivery_fee, total,
              affiliate_code, delivery_address, delivery_state, delivery_city,
              phone_number, whatsapp_number, payment_status, payment_reference,
              status, created_at, updated_at
       FROM orders 
       WHERE id = ? AND user_id = ?`,
      [orderId, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];
    order.items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
});

// Get order status history
router.get('/:orderId/history', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;

    // Verify order belongs to user
    const [orders] = await pool.execute(
      'SELECT id FROM orders WHERE id = ? AND user_id = ?',
      [orderId, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const [history] = await pool.execute(
      `SELECT id, order_id, status, notes, created_at
       FROM order_status_history 
       WHERE order_id = ? 
       ORDER BY created_at DESC`,
      [orderId]
    );

    res.json(history);
  } catch (error) {
    console.error('Get order history error:', error);
    res.status(500).json({ error: 'Failed to get order history' });
  }
});

export default router;
