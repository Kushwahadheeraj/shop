require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Seller = require('./models/Seller');

async function fixAdminPassword() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const adminUser = await Seller.findOne({ email: 'kushwahadheeraj245@gmail.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user NOT FOUND - Creating new admin user...');
      
      // Create new admin user with hashed password
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
      
    } else {
      console.log('✅ Admin user FOUND');
      console.log('📧 Email:', adminUser.email);
      console.log('👤 Username:', adminUser.username);
      console.log('🔑 Role:', adminUser.role);
      console.log('📊 Status:', adminUser.status);
      
      // Test current password
      const testPassword = '@Dkushwaha123';
      const isPasswordCorrect = await bcrypt.compare(testPassword, adminUser.password);
      
      console.log('\n🔍 Testing current password...');
      console.log('🔑 Test password:', testPassword);
      console.log('✅ Password correct:', isPasswordCorrect);
      
      if (!isPasswordCorrect) {
        console.log('❌ Password is incorrect - Updating password...');
        
        // Hash the password manually
        const newHashedPassword = await bcrypt.hash('@Dkushwaha123', 10);
        
        // Update directly in database to avoid pre-save hook
        await Seller.updateOne(
          { _id: adminUser._id },
          { 
            $set: {
              password: newHashedPassword,
              role: 'admin',
              status: 'active'
            }
          }
        );
        
        console.log('✅ Password updated successfully');
        
        // Fetch updated user and test again
        const updatedUser = await Seller.findById(adminUser._id);
        const isNewPasswordCorrect = await bcrypt.compare(testPassword, updatedUser.password);
        console.log('✅ New password test:', isNewPasswordCorrect);
        
        if (isNewPasswordCorrect) {
          console.log('🎉 Password update successful!');
        } else {
          console.log('❌ Password update failed!');
        }
      }
    }

    console.log('\n🎯 Admin Login Credentials:');
    console.log('📧 Email: kushwahadheeraj245@gmail.com');
    console.log('🔑 Password: @Dkushwaha123');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

fixAdminPassword(); 