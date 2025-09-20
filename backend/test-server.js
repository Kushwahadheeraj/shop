// Simple test to check if server can start without errors
require('dotenv').config();

console.log('Testing server startup...');

try {
  // Test if all routes can be loaded
  console.log('Loading routes...');
  
  const sellerRoutes = require('./routes/sellerRoutes');
  console.log('✅ sellerRoutes loaded successfully');
  
  const financialAuthRoutes = require('./routes/financialAuthRoutes');
  console.log('✅ financialAuthRoutes loaded successfully');
  
  const financialAccountRoutes = require('./routes/financialAccountRoutes');
  console.log('✅ financialAccountRoutes loaded successfully');
  
  const financialTransactionRoutes = require('./routes/financialTransactionRoutes');
  console.log('✅ financialTransactionRoutes loaded successfully');
  
  const financialBudgetRoutes = require('./routes/financialBudgetRoutes');
  console.log('✅ financialBudgetRoutes loaded successfully');
  
  console.log('✅ All routes loaded successfully!');
  console.log('✅ Server should start without errors now.');
  
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}
