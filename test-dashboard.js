// Simple test script to verify dashboard API
const fetch = require('node-fetch');

async function testDashboardAPI() {
  try {
    console.log('Testing Dashboard API...');
    
    // Test user analytics
    const userResponse = await fetch('http://localhost:5000/api/dashboard/analytics?view=user&period=30', {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ User Analytics API working:', userData.success);
      console.log('User data:', userData.data?.users);
    } else {
      console.log('❌ User Analytics API failed:', userResponse.status);
    }
    
    // Test product analytics
    const productResponse = await fetch('http://localhost:5000/api/dashboard/analytics?view=product&period=30', {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });
    
    if (productResponse.ok) {
      const productData = await productResponse.json();
      console.log('✅ Product Analytics API working:', productData.success);
      console.log('Product data:', productData.data?.products);
    } else {
      console.log('❌ Product Analytics API failed:', productResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDashboardAPI();
