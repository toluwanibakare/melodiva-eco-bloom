import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// SMTP Transporter setup for hello@melodivaproducts.com
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.melodivaproducts.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true, // true for port 465 SSL
  auth: {
    user: process.env.SMTP_USER || 'hello@melodivaproducts.com',
    pass: process.env.SMTP_PASS || '9mpRJ9r7(LXnYVh&',
  },
  tls: {
    rejectUnauthorized: false
  }
});

const DEFAULT_FROM = process.env.EMAIL_FROM || '"Melodiva Skincare" <hello@melodivaproducts.com>';
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'hello@melodivaproducts.com';

/**
 * Helper to safely send email without crashing main backend logic if SMTP connection is missing/unconfigured.
 */
async function sendMailSafe(mailOptions) {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Mailer Success] Email sent to ${mailOptions.to} - ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[Mailer Error] Failed sending email to ${mailOptions.to}:`, error.message);
    return { messageId: 'error-logged-' + Date.now(), error: error.message };
  }
}

/** 1. Welcome Email on Account Creation */
export async function sendWelcomeEmail({ full_name, email }) {
  const mailOptions = {
    from: DEFAULT_FROM,
    to: email,
    subject: 'Welcome to Melodiva Skincare!',
    html: `
      <div style="font-family: Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 12px;">
        <h2 style="color: #166534;">Welcome to Melodiva, ${full_name}! 🌿</h2>
        <p>Thank you for creating an account with Melodiva Skincare. We are excited to share our 100% natural, unrefined black soaps and cold-pressed kernel oils with you.</p>
        <p>You can now log in anytime to track your orders, view order history, and save your delivery preferences.</p>
        <br/>
        <p style="font-size: 12px; color: #666;">If you have any questions, feel free to reply to this email or chat with us on WhatsApp at +234 807 872 5283.</p>
      </div>
    `,
  };
  return sendMailSafe(mailOptions);
}

/** 2. Affiliate Waitlist Confirmation Email */
export async function sendAffiliateWaitlistEmail({ full_name, email }) {
  const mailOptions = {
    from: DEFAULT_FROM,
    to: email,
    subject: "You're on the Melodiva Affiliate Waitlist! 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 12px;">
        <h2 style="color: #166534;">Welcome to the Waitlist, ${full_name}!</h2>
        <p>Thank you for expressing interest in joining the Melodiva Skincare Affiliate Program.</p>
        <p>We are currently onboarding our next batch of brand partners. As a waitlist member, you will receive priority notification as soon as registrations officially open!</p>
        <div style="margin: 25px 0; text-align: center;">
          <a href="https://chat.whatsapp.com/HZcUsXKZ6d75MTXa5CjqCR" target="_blank" style="background-color: #25D366; color: #ffffff; padding: 12px 24px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
            Join Our WhatsApp VIP Community
          </a>
        </div>
        <p>Joining our WhatsApp community ensures you get live updates, launch dates, and exclusive partner perks first.</p>
      </div>
    `,
  };
  return sendMailSafe(mailOptions);
}

/** 3. Customer Order Confirmation Email */
export async function sendOrderConfirmationEmail({ order_number, customer_name, customer_email, total, items }) {
  const itemListHtml = (items || [])
    .map(
      (item) => `
    <li style="margin-bottom: 8px;">
      <strong>${item.name || item.title}</strong> x ${item.quantity || 1} - ₦${(item.price || 0).toLocaleString()}
    </li>
  `
    )
    .join('');

  const mailOptions = {
    from: DEFAULT_FROM,
    to: customer_email,
    subject: `Order Confirmation #${order_number} - Melodiva Skincare`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 12px;">
        <h2 style="color: #166534;">Thank you for your order, ${customer_name}!</h2>
        <p>We have received your order <strong>#${order_number}</strong> and are preparing it for dispatch.</p>
        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 8px;">Order Summary:</h3>
        <ul>${itemListHtml}</ul>
        <p><strong>Total Amount:</strong> ₦${(total || 0).toLocaleString()}</p>
        <p>You can track the live status of your order anytime on our website using your order number: <strong>${order_number}</strong>.</p>
      </div>
    `,
  };
  return sendMailSafe(mailOptions);
}

/** 4. Admin New Order Alert Email */
export async function sendAdminOrderAlertEmail({ order_number, customer_name, customer_email, total, phone_number, delivery_address }) {
  const mailOptions = {
    from: DEFAULT_FROM,
    to: ADMIN_EMAIL,
    subject: `🔔 NEW ORDER RECEIVE: #${order_number} (₦${(total || 0).toLocaleString()})`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 12px;">
        <h2 style="color: #166534;">New Order Notification</h2>
        <p>A new order <strong>#${order_number}</strong> has just been placed on Melodiva Skincare!</p>
        <ul>
          <li><strong>Customer:</strong> ${customer_name} (${customer_email})</li>
          <li><strong>Phone/WhatsApp:</strong> ${phone_number || 'N/A'}</li>
          <li><strong>Delivery Address:</strong> ${delivery_address || 'N/A'}</li>
          <li><strong>Total Amount:</strong> ₦${(total || 0).toLocaleString()}</li>
        </ul>
        <p>Log in to your Admin Panel to view order details and process shipping.</p>
      </div>
    `,
  };
  return sendMailSafe(mailOptions);
}

/** 5. Customer Order Status Update Email */
export async function sendOrderStatusEmail({ order_number, customer_name, customer_email, status }) {
  const mailOptions = {
    from: DEFAULT_FROM,
    to: customer_email,
    subject: `Update on your Melodiva Order #${order_number}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 12px;">
        <h2 style="color: #166534;">Order Status Update</h2>
        <p>Hello ${customer_name},</p>
        <p>Your order <strong>#${order_number}</strong> has been updated to: <strong style="text-transform: uppercase; color: #166534;">${status}</strong>.</p>
        <p>Thank you for choosing Melodiva Skincare!</p>
      </div>
    `,
  };
  return sendMailSafe(mailOptions);
}

/** 6. Contact Form Notification Email */
export async function sendContactNotificationEmail({ name, email, message }) {
  const mailOptions = {
    from: DEFAULT_FROM,
    to: ADMIN_EMAIL,
    subject: `📩 New Contact Message from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 12px;">
        <h2>New Contact Inquiry</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 12px; border-left: 4px solid #166534; margin: 0;">${message}</blockquote>
      </div>
    `,
  };
  return sendMailSafe(mailOptions);
}

/** 7. Issue Report Notification Email */
export async function sendIssueReportEmail({ order_number, customer_name, customer_email, issue_type, description }) {
  const mailOptions = {
    from: DEFAULT_FROM,
    to: ADMIN_EMAIL,
    subject: `⚠️ Order Issue Claim #${order_number} - ${issue_type}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 12px;">
        <h2 style="color: #b91c1c;">New Order Issue / Damaged Item Claim</h2>
        <p><strong>Order Number:</strong> #${order_number}</p>
        <p><strong>Customer:</strong> ${customer_name} (${customer_email})</p>
        <p><strong>Issue Type:</strong> ${issue_type}</p>
        <p><strong>Details:</strong></p>
        <blockquote style="background: #fff1f2; padding: 12px; border-left: 4px solid #b91c1c; margin: 0;">${description}</blockquote>
      </div>
    `,
  };
  return sendMailSafe(mailOptions);
}
