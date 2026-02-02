import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html, text = '') => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const subject = 'Welcome to Melodiva!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Welcome to Melodiva, ${name}!</h1>
      <p>Thank you for joining our community. We're excited to have you!</p>
      <p>Start shopping for premium skincare products today.</p>
      <a href="${process.env.FRONTEND_URL}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">Visit Store</a>
    </div>
  `;
  return await sendEmail(email, subject, html);
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const subject = 'Password Reset Request - Melodiva';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Password Reset Request</h1>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    </div>
  `;
  return await sendEmail(email, subject, html);
};

export const sendOrderConfirmationEmail = async (email, orderNumber, orderDetails) => {
  const subject = `Order Confirmation - ${orderNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Order Confirmed!</h1>
      <p>Thank you for your order. Your order number is: <strong>${orderNumber}</strong></p>
      <h2>Order Details:</h2>
      <p>Total: ₦${orderDetails.total.toLocaleString()}</p>
      <p>Status: ${orderDetails.status}</p>
      <p>We'll notify you when your order ships.</p>
    </div>
  `;
  return await sendEmail(email, subject, html);
};

export const sendContactMessageEmail = async (name, email, message) => {
  const subject = `New Contact Message from ${name}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Contact Message</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    </div>
  `;
  const adminEmail = process.env.EMAIL_USER;
  return await sendEmail(adminEmail, subject, html);
};
