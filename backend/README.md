# Melodiva Backend API

Node.js/Express backend API for Melodiva E-commerce platform, replacing Supabase functionality.

## Features

- JWT-based authentication
- User management (signup, signin, password reset)
- Profile management
- Order management
- Affiliate program
- Contact messages and reviews
- Admin panel
- Email notifications (NodeMailer)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

Required environment variables:
- `DB_HOST` - MySQL host
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - Database name
- `DB_PORT` - MySQL port (default: 3306)
- `JWT_SECRET` - Secret key for JWT tokens
- `EMAIL_HOST` - SMTP host
- `EMAIL_USER` - Email address
- `EMAIL_PASS` - Email password/app password
- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:8080)
- `ADMIN_EMAILS` - Comma-separated admin emails

3. Database Setup:
Make sure your MySQL database is set up with the schema from `../schema.sql`.

**Important**: You need to add a `password_hash` column to the `users` table:
```sql
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL;
```

4. Run the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - Sign in
- `GET /api/auth/session` - Get current session (requires auth)
- `POST /api/auth/forgot-password/verify` - Verify security question
- `POST /api/auth/forgot-password/reset` - Reset password
- `POST /api/auth/change-password` - Change password (requires auth)
- `POST /api/auth/signout` - Sign out (requires auth)

### Profiles
- `GET /api/profiles/me` - Get own profile (requires auth)
- `PUT /api/profiles/me` - Update own profile (requires auth)

### Orders
- `POST /api/orders` - Create order (requires auth)
- `GET /api/orders/my-orders` - Get user's orders (requires auth)
- `GET /api/orders/:orderId` - Get single order (requires auth)
- `GET /api/orders/:orderId/history` - Get order status history (requires auth)

### Affiliates
- `GET /api/affiliates/check` - Check if user is affiliate (requires auth)
- `POST /api/affiliates/join` - Join affiliate program (requires auth)
- `GET /api/affiliates/dashboard` - Get affiliate dashboard (requires auth)
- `POST /api/affiliates/withdrawals` - Create withdrawal request (requires auth)
- `GET /api/affiliates/verify/:code` - Verify affiliate code (public)

### Contact
- `POST /api/contact/messages` - Submit contact message (public)
- `POST /api/contact/reviews` - Submit review (public)
- `GET /api/contact/reviews` - Get reviews (public)

### Admin
All admin routes require authentication and admin access:
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/profiles` - Get all profiles
- `GET /api/admin/order-history` - Get all order status history
- `PUT /api/admin/orders/:orderId` - Update order
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:productId` - Update product
- `DELETE /api/admin/products/:productId` - Delete product

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

Tokens are obtained from the signup or signin endpoints.

## Database Schema

The backend uses the MySQL schema defined in `../schema.sql`. Make sure to:

1. Run the schema SQL to create all tables
2. Add `password_hash` column to `users` table:
   ```sql
   ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL;
   ```

## Email Configuration

The backend uses NodeMailer for sending emails. Configure your SMTP settings in `.env`:

- For Gmail: Use an App Password (not your regular password)
- For other providers: Adjust `EMAIL_HOST` and `EMAIL_PORT` accordingly

## Error Handling

All errors return JSON in the format:
```json
{
  "error": "Error message"
}
```

## Development

The server runs on port 3001 by default. Make sure your frontend is configured to point to this API.

## Notes

- Passwords are hashed using bcryptjs
- JWT tokens expire in 7 days (configurable via `JWT_EXPIRES_IN`)
- Admin access is determined by email addresses in `ADMIN_EMAILS`
- If `ADMIN_EMAILS` is empty, all authenticated users have admin access
