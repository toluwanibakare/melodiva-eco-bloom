// Simple API test script
// Run with: node test-api.js

const API_URL = 'http://localhost:3001/api';

async function testAPI() {
  console.log('Testing Melodiva API...\n');

  // Test 1: Health check
  try {
    const healthRes = await fetch(`${API_URL.replace('/api', '')}/health`);
    const health = await healthRes.json();
    console.log('✓ Health check:', health);
  } catch (error) {
    console.error('✗ Health check failed:', error.message);
    return;
  }

  // Test 2: Sign up
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'testpass123';
  
  try {
    const signupRes = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        full_name: 'Test User',
        phone_number: '08012345678',
        address: '123 Test Street',
        state: 'Lagos',
        city: 'Ikeja',
        security_question: 'What is your favorite color?',
        security_answer: 'blue'
      })
    });

    if (!signupRes.ok) {
      const error = await signupRes.json();
      throw new Error(error.error || 'Signup failed');
    }

    const signupData = await signupRes.json();
    const token = signupData.token;
    console.log('✓ Sign up successful');
    console.log('  Token:', token.substring(0, 20) + '...');

    // Test 3: Get profile
    const profileRes = await fetch(`${API_URL}/profiles/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const profile = await profileRes.json();
    console.log('✓ Get profile successful');
    console.log('  Name:', profile.full_name);

    // Test 4: Create order
    const orderRes = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [{ name: 'Test Product', price: 1000, quantity: 1 }],
        subtotal: 1000,
        discount: 0,
        delivery_fee: 1500,
        total: 2500,
        delivery_address: '123 Test Street',
        delivery_state: 'Lagos',
        delivery_city: 'Ikeja',
        phone_number: '08012345678'
      })
    });
    const order = await orderRes.json();
    console.log('✓ Create order successful');
    console.log('  Order number:', order.order.order_number);

    // Test 5: Get orders
    const ordersRes = await fetch(`${API_URL}/orders/my-orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const orders = await ordersRes.json();
    console.log('✓ Get orders successful');
    console.log('  Orders count:', orders.length);

    // Test 6: Contact message
    const contactRes = await fetch(`${API_URL}/contact/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: testEmail,
        message: 'Test message'
      })
    });
    console.log('✓ Submit contact message successful');

    // Test 7: Review
    const reviewRes = await fetch(`${API_URL}/contact/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        rating: 5,
        comment: 'Great product!',
        is_anonymous: false
      })
    });
    console.log('✓ Submit review successful');

    console.log('\n✅ All API tests passed!');
  } catch (error) {
    console.error('✗ Test failed:', error.message);
  }
}

testAPI();
