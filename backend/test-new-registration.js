require('dotenv').config();
const mongoose = require('mongoose');
const Seller = require('./models/Seller');

async function testNewRegistration() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Test data for new registration
    const testUser = {
      username: 'TestSeller2024',
      email: 'testseller2024@example.com',
      mobile: '9876543210',
      shopName: 'Test Shop 2024',
      gstNumber: '27AAPFU0939F1Z5',
      password: 'StrongPass123!',
      role: 'seller',
      status: 'active'
    };

    console.log('🧪 Testing new registration with all fields...');
    console.log('📧 Email:', testUser.email);
    console.log('📱 Mobile:', testUser.mobile);
    console.log('👤 Username:', testUser.username);
    console.log('🏪 Shop Name:', testUser.shopName);
    console.log('📋 GST Number:', testUser.gstNumber);

    // Check if user already exists
    const existingUser = await Seller.findOne({ 
      $or: [{ email: testUser.email }, { mobile: testUser.mobile }, { gstNumber: testUser.gstNumber }] 
    });

    if (existingUser) {
      console.log('⚠️  Test user already exists, skipping creation');
      console.log('📧 Existing email:', existingUser.email);
      console.log('📱 Existing mobile:', existingUser.mobile);
      console.log('🏪 Existing shop name:', existingUser.shopName);
      console.log('📋 Existing GST number:', existingUser.gstNumber);
    } else {
      // Create new user
      const newSeller = new Seller(testUser);
      await newSeller.save();
      console.log('✅ Test user created successfully');
    }

    // Show all users with mobile numbers
    const allUsers = await Seller.find({}, { password: 0 });
    console.log('\n📊 All users in database:');
    console.log('='.repeat(80));
    
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Mobile: ${user.mobile || 'Not set'}`);
      console.log(`   Shop Name: ${user.shopName || 'Not set'}`);
      console.log(`   GST Number: ${user.gstNumber || 'Not set'}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.status}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testNewRegistration(); 