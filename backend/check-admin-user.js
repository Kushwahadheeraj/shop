require('dotenv').config();
const mongoose = require('mongoose');
const Seller = require('./models/Seller');

async function checkAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const adminUser = await Seller.findOne({ email: 'kushwahadheeraj245@gmail.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user NOT FOUND');
      console.log('📧 Looking for email: kushwahadheeraj245@gmail.com');
      
      // Show all users in database
      const allUsers = await Seller.find({}, { password: 0 });
      console.log('\n📊 All users in database:');
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}, Role: ${user.role}, Status: ${user.status}`);
      });
      
    } else {
      console.log('✅ Admin user FOUND');
      console.log('📧 Email:', adminUser.email);
      console.log('👤 Username:', adminUser.username);
      console.log('🔑 Role:', adminUser.role);
      console.log('📊 Status:', adminUser.status);
      console.log('📅 Created:', adminUser.createdAt);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkAdminUser(); 