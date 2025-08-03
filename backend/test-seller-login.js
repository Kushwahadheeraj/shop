require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Seller = require('./models/Seller');

async function testSellerLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find the seller
    const seller = await Seller.findOne({ email: 'dheeraj01072001@gmail.com' });
    
    if (!seller) {
      console.log('❌ Seller NOT FOUND');
      return;
    }

    console.log('✅ Seller FOUND');
    console.log('📧 Email:', seller.email);
    console.log('👤 Username:', seller.username);
    console.log('🔑 Role:', seller.role);
    console.log('📊 Status:', seller.status);
    
    // Test different passwords
    const testPasswords = ['test123', 'password', '123456', 'dheeraj', 'kushwaha'];
    
    console.log('\n🔍 Testing different passwords...');
    for (const testPassword of testPasswords) {
      const isPasswordCorrect = await bcrypt.compare(testPassword, seller.password);
      console.log(`🔑 "${testPassword}": ${isPasswordCorrect ? '✅ CORRECT' : '❌ wrong'}`);
    }

    // If none work, let's reset the password
    console.log('\n💡 If no password works, we can reset it');
    console.log('📧 Email: dheeraj01072001@gmail.com');
    console.log('🔑 Suggested password: seller123');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testSellerLogin(); 