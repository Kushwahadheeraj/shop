require('dotenv').config();
const mongoose = require('mongoose');
const Seller = require('./models/Seller');

async function testSellerList() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all sellers
    const sellers = await Seller.find({}, { password: 0 }).sort({ createdAt: -1 });
    
    console.log(`\n📊 Found ${sellers.length} sellers in database:`);
    
    sellers.forEach((seller, index) => {
      console.log(`\n${index + 1}. Seller Details:`);
      console.log(`   ID: ${seller._id}`);
      console.log(`   Username: ${seller.username || 'No Username'}`);
      console.log(`   Email: ${seller.email || 'No Email'}`);
      console.log(`   Role: ${seller.role || 'seller'}`);
      console.log(`   Status: ${seller.status || 'active'}`);
      console.log(`   Avatar: ${seller.avatar || 'No Avatar'}`);
      console.log(`   Created: ${seller.createdAt ? new Date(seller.createdAt).toLocaleDateString() : 'Unknown'}`);
    });

    if (sellers.length === 0) {
      console.log('\n⚠️  No sellers found in database');
      console.log('💡 You can create a test seller by registering at: http://localhost:5000/api/seller/register');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testSellerList(); 