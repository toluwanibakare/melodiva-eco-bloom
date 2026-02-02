import express from 'express';
import pool from '../config/database.js';
import { generateUUID } from '../utils/uuid.js';
import { sendContactMessageEmail } from '../utils/email.js';

const router = express.Router();

// Submit contact message
router.post('/messages', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await pool.execute(
      'INSERT INTO contact_messages (id, name, email, message, created_at) VALUES (UUID(), ?, ?, ?, NOW())',
      [name, email, message]
    );

    // Send email notification (async)
    sendContactMessageEmail(name, email, message).catch(console.error);

    res.status(201).json({
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Submit contact message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Submit review
router.post('/reviews', async (req, res) => {
  try {
    const { name, rating, comment, is_anonymous } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required' });
    }

    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const displayName = is_anonymous ? 'Anonymous' : (name || 'Anonymous');

    await pool.execute(
      `INSERT INTO reviews (id, name, rating, comment, is_anonymous, created_at)
       VALUES (UUID(), ?, ?, ?, ?, NOW())`,
      [displayName, ratingNum, comment, is_anonymous || false]
    );

    res.status(201).json({
      message: 'Review submitted successfully'
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// Get reviews (public)
router.get('/reviews', async (req, res) => {
  try {
    const [reviews] = await pool.execute(
      `SELECT id, name, rating, comment, is_anonymous, created_at
       FROM reviews 
       ORDER BY created_at DESC 
       LIMIT 50`
    );

    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
});

export default router;
