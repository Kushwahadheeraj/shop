require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Seller = require('./models/Seller');

async function checkSellers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all sellers
    const allSellers = await Seller.find({}, { password: 0 });
    
    console.log(`\n📊 Found ${allSellers.length} users in database:`);
    console.log('='.repeat(60));
    
    allSellers.forEach((seller, index) => {
      console.log(`${index + 1}. Email: ${seller.email}`);
      console.log(`   Username: ${seller.username}`);
      console.log(`   Role: ${seller.role || 'user'}`);
      console.log(`   Status: ${seller.status || 'active'}`);
      console.log(`   Created: ${seller.createdAt}`);
      console.log('');
    });

    // Test admin login specifically
    console.log('🔍 Testing admin login...');
    const adminUser = await Seller.findOne({ email: 'kushwahadheeraj245@gmail.com' });
    if (adminUser) {
      const testPassword = '@Dkushwaha123';
      const isPasswordCorrect = await bcrypt.compare(testPassword, adminUser.password);
      console.log(`✅ Admin password test: ${isPasswordCorrect}`);
    }

    // Check if there are any regular sellers
    const regularSellers = allSellers.filter(s => s.role === 'seller' && s.email !== 'kushwahadheeraj245@gmail.com');
    console.log(`\n👥 Regular sellers (excluding admin): ${regularSellers.length}`);
    
    if (regularSellers.length > 0) {
      console.log('Regular sellers found:');
      regularSellers.forEach(seller => {
        console.log(`- ${seller.email} (${seller.username})`);
      });
    } else {
      console.log('❌ No regular sellers found in database');
      console.log('💡 You may need to register some sellers first');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkSellers(); 