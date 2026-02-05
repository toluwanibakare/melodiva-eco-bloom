import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import { generateUUID } from '../utils/uuid.js';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../utils/email.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const {
      email,
      password,
      full_name,
      phone_number,
      whatsapp_number,
      address,
      state,
      city,
      security_question,
      security_answer
    } = req.body;

    if (!email || !password || !full_name || !phone_number || !address || !state || !city || !security_question || !security_answer) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generateUUID();

    // Create user with all profile data
    await pool.execute(
      `INSERT INTO users (
        id, email, password_hash, full_name, phone_number, whatsapp_number, 
        address, state, city, security_question, security_answer, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        userId,
        email.toLowerCase(),
        hashedPassword,
        full_name,
        phone_number,
        whatsapp_number || null,
        address,
        state,
        city,
        security_question,
        security_answer.toLowerCase()
      ]
    );

    // Generate token
    const token = generateToken({ userId, email: email.toLowerCase() });

    // Send welcome email (async, don't wait)
    sendWelcomeEmail(email, full_name).catch(console.error);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: userId,
        email: email.toLowerCase()
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Sign In
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user with password hash
    const [users] = await pool.execute(
      'SELECT id, email, password_hash FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // Check if password_hash exists (for existing users without password)
    if (!user.password_hash) {
      return res.status(401).json({ error: 'Please reset your password' });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    res.json({
      message: 'Sign in successful',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

// Get current session
router.get('/session', authenticate, async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT id, email, full_name, phone_number, whatsapp_number, 
              address, state, city, created_at 
       FROM users WHERE id = ?`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: users[0]
    });
  } catch (error) {
    console.error('Session error:', error);
    res.status(500).json({ error: 'Failed to get session' });
  }
});

// Forgot Password - Step 1: Verify security question
router.post('/forgot-password/verify', async (req, res) => {
  try {
    const { email, full_name, security_question, security_answer } = req.body;

    if (!email || !full_name || !security_question || !security_answer) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const [users] = await pool.execute(
      `SELECT id, security_question, security_answer 
       FROM users 
       WHERE email = ? AND full_name = ? AND security_question = ?`,
      [email.toLowerCase(), full_name, security_question]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Could not find account with provided information' });
    }

    const profile = users[0];

    if (profile.security_answer.toLowerCase() !== security_answer.toLowerCase()) {
      return res.status(401).json({ error: 'Security answer is incorrect' });
    }

    // Generate reset token
    const resetToken = generateToken({ userId: profile.id, type: 'password_reset' });

    // Store reset token in user metadata or create a separate table
    // For simplicity, we'll use a temporary approach
    // In production, you might want a password_reset_tokens table

    res.json({
      message: 'Security question verified',
      resetToken
    });
  } catch (error) {
    console.error('Forgot password verify error:', error);
    res.status(500).json({ error: 'Failed to verify security question' });
  }
});

// Forgot Password - Step 2: Reset password
router.post('/forgot-password/reset', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Verify token
    const { verifyToken } = await import('../utils/jwt.js');
    const decoded = verifyToken(resetToken);

    if (!decoded || decoded.type !== 'password_reset') {
      return res.status(401).json({ error: 'Invalid or expired reset token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hashedPassword, decoded.userId]
    );

    res.json({
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Change Password
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    // Get user with password hash
    const [users] = await pool.execute(
      'SELECT password_hash FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    // Verify old password
    if (!user.password_hash) {
      return res.status(400).json({ error: 'Please use forgot password to set your password' });
    }

    const isValid = await bcrypt.compare(oldPassword, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Old password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hashedPassword, req.user.id]
    );

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Sign Out (client-side token removal, but we can add token blacklisting here if needed)
router.post('/signout', authenticate, (req, res) => {
  res.json({ message: 'Signed out successfully' });
});

export default router;
