# Frontend-Backend Integration Test Guide

## Prerequisites

1. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Backend Environment:**
   - Copy `backend/.env.example` to `backend/.env`
   - Fill in your database credentials and email settings

3. **Database Setup:**
   - Run the MySQL schema from `schema.sql`
   - Ensure the `password_hash` column exists in the `users` table

4. **Frontend Setup:**
   - Create `.env` file in root with:
     ```
     VITE_API_URL=http://localhost:3001/api
     ```

## Starting the Services

### Terminal 1 - Backend:
```bash
cd backend
npm start
# Server should start on http://localhost:3001
```

### Terminal 2 - Frontend:
```bash
npm run dev
# Frontend should start on http://localhost:8080 (or configured port)
```

## Test Checklist

### 1. Authentication Tests

#### Sign Up
- [ ] Navigate to `/auth`
- [ ] Fill in all sign up fields
- [ ] Submit form
- [ ] Verify: User is logged in and redirected to home
- [ ] Verify: Profile is created automatically
- [ ] Check backend logs for user creation

#### Sign In
- [ ] Sign out if logged in
- [ ] Navigate to `/auth`
- [ ] Enter email and password
- [ ] Submit form
- [ ] Verify: User is logged in and redirected to home

#### Forgot Password
- [ ] Click "Forgot Password"
- [ ] Enter email, full name, security question, and answer
- [ ] Enter new password and confirm
- [ ] Submit form
- [ ] Verify: Password is reset successfully
- [ ] Sign in with new password

#### Change Password
- [ ] Sign in
- [ ] Navigate to `/profile`
- [ ] Scroll to "Change Password" section
- [ ] Enter old password, new password, confirm password
- [ ] Submit form
- [ ] Verify: Password is changed
- [ ] Sign out and sign in with new password

### 2. Profile Tests

- [ ] Navigate to `/profile`
- [ ] Verify: Profile information is displayed
- [ ] Verify: All fields are populated correctly

### 3. Order Tests

#### Create Order
- [ ] Add items to cart
- [ ] Navigate to `/checkout`
- [ ] Fill in delivery information
- [ ] Complete payment (or test mode)
- [ ] Verify: Order is created in database
- [ ] Verify: Order confirmation message appears
- [ ] Verify: Cart is cleared

#### View Order History
- [ ] Navigate to `/order-history`
- [ ] Verify: All orders are displayed
- [ ] Verify: Order details are correct

#### Track Order
- [ ] Click on an order from order history
- [ ] Verify: Order details page loads
- [ ] Verify: Order status is displayed
- [ ] Verify: Order items are shown

### 4. Affiliate Tests

#### Join Affiliate Program
- [ ] Sign in
- [ ] Navigate to `/affiliate`
- [ ] Read and agree to terms
- [ ] Click "Get Started"
- [ ] Verify: Affiliate account is created
- [ ] Verify: Redirected to affiliate dashboard
- [ ] Verify: Affiliate code is displayed

#### Affiliate Dashboard
- [ ] Navigate to `/affiliate-dashboard`
- [ ] Verify: Dashboard loads with stats
- [ ] Verify: Affiliate code is displayed
- [ ] Copy affiliate code
- [ ] Verify: Code is copied to clipboard

#### Withdrawal Request
- [ ] Navigate to affiliate dashboard
- [ ] Click withdrawal button
- [ ] Fill in bank details
- [ ] Enter withdrawal amount (minimum ₦5,000)
- [ ] Submit request
- [ ] Verify: Request is submitted

### 5. Contact & Reviews Tests

#### Submit Contact Message
- [ ] Navigate to `/contact`
- [ ] Fill in contact form
- [ ] Submit message
- [ ] Verify: Success message appears
- [ ] Check backend logs for email notification

#### Submit Review
- [ ] Navigate to `/contact`
- [ ] Scroll to review section
- [ ] Fill in review form
- [ ] Select rating
- [ ] Submit review
- [ ] Verify: Success message appears

### 6. Admin Panel Tests

#### Access Admin Panel
- [ ] Sign in with admin email
- [ ] Navigate to `/admin`
- [ ] Verify: Admin panel loads
- [ ] Verify: All tabs are accessible

#### View Orders
- [ ] Click "Orders" tab
- [ ] Verify: All orders are displayed
- [ ] Verify: Order details are shown

#### Update Order Status
- [ ] Select an order
- [ ] Change status
- [ ] Add a note (optional)
- [ ] Click "Update Order"
- [ ] Verify: Order is updated
- [ ] Verify: Status history is updated

#### Manage Products
- [ ] Click "Products" tab
- [ ] Create a new product
- [ ] Verify: Product is created
- [ ] Edit a product
- [ ] Verify: Product is updated
- [ ] Delete a product
- [ ] Verify: Product is deleted

#### View Profiles
- [ ] Click "Profiles" tab
- [ ] Verify: All user profiles are displayed

### 7. API Endpoint Tests

Run the test script:
```bash
cd backend
node test-api.js
```

This will test:
- Health check
- Sign up
- Get profile
- Create order
- Get orders
- Contact message
- Review submission

## Common Issues & Solutions

### Issue: CORS Error
**Solution:** Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL

### Issue: Authentication Fails
**Solution:** 
- Check JWT_SECRET is set in backend `.env`
- Verify token is stored in localStorage
- Check browser console for errors

### Issue: Database Connection Error
**Solution:**
- Verify database credentials in backend `.env`
- Ensure MySQL server is running
- Check database name matches

### Issue: Email Not Sending
**Solution:**
- Verify email credentials in backend `.env`
- For Gmail, use App Password (not regular password)
- Check backend logs for email errors

## Performance Checks

- [ ] Page load times are acceptable
- [ ] API responses are fast (< 1 second)
- [ ] No console errors
- [ ] No network errors in browser DevTools

## Security Checks

- [ ] JWT tokens are stored securely
- [ ] Passwords are hashed (check database)
- [ ] Admin routes require authentication
- [ ] Users can only access their own data
- [ ] CORS is properly configured

## Final Verification

- [ ] All features work end-to-end
- [ ] No errors in browser console
- [ ] No errors in backend logs
- [ ] Database records are created correctly
- [ ] Email notifications are sent (if configured)
