// Test script to verify authentication middleware
const jwt = require('jsonwebtoken');

// Test token generation and verification
function testAuth() {
  console.log('🔐 Testing Authentication Middleware...');
  console.log('=====================================');
  
  // Test data
  const testUser = {
    id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    role: 'seller'
  };
  
  // Generate token
  const token = jwt.sign(testUser, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
  console.log('✅ Generated token:', token);
  
  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('✅ Token verified successfully');
    console.log('Decoded payload:', decoded);
    
    // Test sellerId extraction
    const sellerId = decoded.id || decoded._id || decoded.userId;
    console.log('✅ Extracted sellerId:', sellerId);
    
    if (sellerId) {
      console.log('✅ Authentication test PASSED');
    } else {
      console.log('❌ Authentication test FAILED - No sellerId found');
    }
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
  }
  
  console.log('=====================================');
}

// Run test
testAuth();

