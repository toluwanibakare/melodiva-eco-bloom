import express from 'express';
import pool from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { generateUUID } from '../utils/uuid.js';

const router = express.Router();

// Check if user is affiliate
router.get('/check', authenticate, async (req, res) => {
  try {
    const [affiliates] = await pool.execute(
      'SELECT id FROM affiliates WHERE user_id = ?',
      [req.user.id]
    );

    res.json({ isAffiliate: affiliates.length > 0 });
  } catch (error) {
    console.error('Check affiliate error:', error);
    res.status(500).json({ error: 'Failed to check affiliate status' });
  }
});

// Join affiliate program
router.post('/join', authenticate, async (req, res) => {
  try {
    // Check if already an affiliate
    const [existing] = await pool.execute(
      'SELECT id FROM affiliates WHERE user_id = ?',
      [req.user.id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Already an affiliate' });
    }

    // Generate unique affiliate code
    const generateCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    let affiliateCode;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      affiliateCode = generateCode();
      const [codes] = await pool.execute(
        'SELECT id FROM affiliates WHERE affiliate_code = ?',
        [affiliateCode]
      );
      isUnique = codes.length === 0;
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ error: 'Failed to generate unique affiliate code' });
    }

    // Create affiliate
    await pool.execute(
      `INSERT INTO affiliates (
        id, user_id, affiliate_code, commission_rate, total_commission,
        current_balance, total_withdrawn, rules_agreed_at, created_at, updated_at
      ) VALUES (UUID(), ?, ?, 10.0, 0, 0, 0, NOW(), NOW(), NOW())`,
      [req.user.id, affiliateCode]
    );

    res.status(201).json({
      message: 'Successfully joined affiliate program',
      affiliate_code: affiliateCode
    });
  } catch (error) {
    console.error('Join affiliate error:', error);
    res.status(500).json({ error: 'Failed to join affiliate program' });
  }
});

// Get affiliate dashboard data
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const [affiliates] = await pool.execute(
      `SELECT id, affiliate_code, commission_rate, total_commission,
              current_balance, total_withdrawn, created_at
       FROM affiliates 
       WHERE user_id = ?`,
      [req.user.id]
    );

    if (affiliates.length === 0) {
      return res.status(404).json({ error: 'Not an affiliate' });
    }

    const affiliate = affiliates[0];

    // Get referrals
    const [referrals] = await pool.execute(
      `SELECT id, order_id, commission_amount, status, created_at
       FROM affiliate_referrals 
       WHERE affiliate_id = ? 
       ORDER BY created_at DESC`,
      [affiliate.id]
    );

    // Get withdrawals
    const [withdrawals] = await pool.execute(
      `SELECT id, amount, bank_name, account_number, account_name, status, 
              processed_at, created_at
       FROM affiliate_withdrawals 
       WHERE affiliate_id = ? 
       ORDER BY created_at DESC`,
      [affiliate.id]
    );

    res.json({
      affiliate,
      referrals,
      withdrawals
    });
  } catch (error) {
    console.error('Get affiliate dashboard error:', error);
    res.status(500).json({ error: 'Failed to get affiliate dashboard' });
  }
});

// Create withdrawal request
router.post('/withdrawals', authenticate, async (req, res) => {
  try {
    const { amount, bank_name, account_number, account_name } = req.body;

    if (!amount || !bank_name || !account_number || !account_name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Get affiliate
    const [affiliates] = await pool.execute(
      'SELECT id, current_balance FROM affiliates WHERE user_id = ?',
      [req.user.id]
    );

    if (affiliates.length === 0) {
      return res.status(404).json({ error: 'Not an affiliate' });
    }

    const affiliate = affiliates[0];

    if (affiliate.current_balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    if (amount < 5000) {
      return res.status(400).json({ error: 'Minimum withdrawal amount is ₦5,000' });
    }

    // Create withdrawal request
    await pool.execute(
      `INSERT INTO affiliate_withdrawals (
        id, affiliate_id, amount, bank_name, account_number, account_name,
        status, created_at
      ) VALUES (UUID(), ?, ?, ?, ?, ?, 'pending', NOW())`,
      [affiliate.id, amount, bank_name, account_number, account_name]
    );

    res.status(201).json({
      message: 'Withdrawal request submitted successfully'
    });
  } catch (error) {
    console.error('Create withdrawal error:', error);
    res.status(500).json({ error: 'Failed to create withdrawal request' });
  }
});

// Verify affiliate code (public endpoint for checkout)
router.get('/verify/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const [affiliates] = await pool.execute(
      'SELECT id, affiliate_code, commission_rate FROM affiliates WHERE affiliate_code = ?',
      [code.toUpperCase()]
    );

    if (affiliates.length === 0) {
      return res.status(404).json({ error: 'Invalid affiliate code' });
    }

    res.json({
      valid: true,
      code: affiliates[0].affiliate_code,
      commission_rate: affiliates[0].commission_rate
    });
  } catch (error) {
    console.error('Verify affiliate code error:', error);
    res.status(500).json({ error: 'Failed to verify affiliate code' });
  }
});

export default router;
