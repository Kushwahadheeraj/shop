require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Seller = require('./models/Seller');

async function updateAdminPassword() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const adminUser = await Seller.findOne({ email: 'kushwahadheeraj245@gmail.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found. Creating new admin user...');
      
      // Create new admin user
      const hashedPassword = await bcrypt.hash('@Dkushwaha123', 10);
      const newAdmin = new Seller({
        email: 'kushwahadheeraj245@gmail.com',
        password: hashedPassword,
        username: 'Admin',
        role: 'admin',
        status: 'active'
      });
      
      await newAdmin.save();
      console.log('✅ New admin user created successfully');
      console.log('📧 Email: kushwahadheeraj245@gmail.com');
      console.log('🔑 Password: @Dkushwaha123');
    } else {
      console.log('✅ Admin user found. Updating password...');
      
      // Update password
      const hashedPassword = await bcrypt.hash('@Dkushwaha123', 10);
      adminUser.password = hashedPassword;
      adminUser.role = 'admin'; // Ensure role is admin
      adminUser.status = 'active'; // Ensure status is active
      
      await adminUser.save();
      console.log('✅ Admin password updated successfully');
      console.log('📧 Email: kushwahadheeraj245@gmail.com');
      console.log('🔑 Password: @Dkushwaha123');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

updateAdminPassword(); 