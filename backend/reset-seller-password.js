require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Seller = require('./models/Seller');

async function resetSellerPassword() {
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
    
    // Set new password
    const newPassword = 'seller123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password directly in database to avoid pre-save hook
    await Seller.updateOne(
      { _id: seller._id },
      { 
        $set: {
          password: hashedPassword,
          role: 'seller',
          status: 'active'
        }
      }
    );
    
    console.log('✅ Password updated successfully');
    
    // Test the new password
    const updatedSeller = await Seller.findById(seller._id);
    const isPasswordCorrect = await bcrypt.compare(newPassword, updatedSeller.password);
    console.log(`✅ New password test: ${isPasswordCorrect}`);
    
    if (isPasswordCorrect) {
      console.log('\n🎯 Seller Login Credentials:');
      console.log('📧 Email: dheeraj01072001@gmail.com');
      console.log('🔑 Password: seller123');
      console.log('🔑 Role: seller');
      console.log('📊 Status: active');
    } else {
      console.log('❌ Password update failed!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

resetSellerPassword(); 