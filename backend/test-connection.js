const mongoose = require('mongoose');

// Test database connection
async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Try local MongoDB first
    await mongoose.connect('mongodb://localhost:27017/shop', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to local MongoDB');
    
    // Test if we can create a simple document
    const testSchema = new mongoose.Schema({
      name: String,
      test: Boolean
    });
    
    const TestModel = mongoose.model('Test', testSchema);
    
    // Clear any existing test data
    await TestModel.deleteMany({});
    
    // Create a test document
    const testDoc = new TestModel({
      name: 'Test Document',
      test: true
    });
    
    await testDoc.save();
    console.log('✅ Test document created successfully');
    
    // Find the document
    const foundDoc = await TestModel.findOne({ name: 'Test Document' });
    console.log('✅ Test document found:', foundDoc);
    
    // Clean up
    await TestModel.deleteMany({});
    console.log('✅ Test data cleaned up');
    
    console.log('🎉 Database connection test successful!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // If local MongoDB fails, try to start it
    console.log('💡 Try starting MongoDB with: mongod');
    console.log('💡 Or install MongoDB if not installed');
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

testConnection();
