require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Seller = require('./models/Seller');

async function testAdminLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const adminUser = await Seller.findOne({ email: 'kushwahadheeraj245@gmail.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user NOT FOUND');
      return;
    }

    console.log('✅ Admin user FOUND');
    console.log('📧 Email:', adminUser.email);
    console.log('👤 Username:', adminUser.username);
    console.log('🔑 Role:', adminUser.role);
    console.log('📊 Status:', adminUser.status);
    
    // Test password
    const testPassword = '@Dkushwaha123';
    const isPasswordCorrect = await bcrypt.compare(testPassword, adminUser.password);
    
    console.log('\n🔍 Testing login...');
    console.log('🔑 Test password:', testPassword);
    console.log('✅ Password correct:', isPasswordCorrect);
    
    if (isPasswordCorrect) {
      console.log('\n🎯 Login should work with:');
      console.log('📧 Email: kushwahadheeraj245@gmail.com');
      console.log('🔑 Password: @Dkushwaha123');
      console.log('🔑 Role: admin (with seller privileges)');
      console.log('📊 Status: active');
    } else {
      console.log('❌ Password is incorrect - need to update password');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testAdminLogin(); 