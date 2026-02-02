import express from 'express';
import pool from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/me', authenticate, async (req, res) => {
  try {
    const [profiles] = await pool.execute(
      `SELECT id, user_id, full_name, email, phone_number, whatsapp_number, 
              address, state, city, security_question, created_at, updated_at
       FROM profiles 
       WHERE user_id = ?`,
      [req.user.id]
    );

    if (profiles.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Don't send security_answer
    const profile = profiles[0];
    delete profile.security_answer;

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update profile (if needed - currently profiles are read-only in frontend)
router.put('/me', authenticate, async (req, res) => {
  try {
    const { full_name, phone_number, whatsapp_number, address, state, city } = req.body;

    await pool.execute(
      `UPDATE profiles 
       SET full_name = ?, phone_number = ?, whatsapp_number = ?, 
           address = ?, state = ?, city = ?, updated_at = NOW()
       WHERE user_id = ?`,
      [full_name, phone_number, whatsapp_number, address, state, city, req.user.id]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
