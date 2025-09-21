const express = require('express');
const mongoose = require('mongoose');
const Bill = require('./models/Bill');
const Shop = require('./models/Shop');

const app = express();

// Use the same connection as server.js
require('dotenv').config();
const connectDB = require('./config/db');

async function addSampleData() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    
    // Connect to database
    await connectDB();
    
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    await Bill.deleteMany({});
    await Shop.deleteMany({});
    console.log('🗑️ Cleared existing data');
    
    // Add sample shop
    const shop = new Shop({
      name: 'Kushwaha Hardware Store',
      address: '123 Main Street, Delhi',
      contact: {
        phone: '9876543210',
        email: 'kushwaha@hardware.com'
      },
      business: {
        gstNumber: 'GST123456789',
        panNumber: 'PAN123456789'
      },
      financial: {
        creditLimit: 100000,
        paymentTerms: '30 days'
      },
      createdBy: '507f1f77bcf86cd799439011' // Sample ObjectId
    });
    
    await shop.save();
    console.log('✅ Added sample shop:', shop.name);
    
    // Add sample bill
    const bill = new Bill({
      billNumber: 'BILL-000001',
      shopId: shop._id,
      shopName: shop.name,
      shopAddress: shop.address,
      items: [
        {
          name: 'Screwdriver Set',
          quantity: 2,
          unitPrice: 500,
          totalPrice: 1000,
          category: 'Tools',
          description: 'Professional screwdriver set'
        },
        {
          name: 'Wire Cable',
          quantity: 10,
          unitPrice: 25,
          totalPrice: 250,
          category: 'Electrical',
          description: 'Copper wire cable'
        }
      ],
      pricing: {
        subtotal: 1250,
        gstRate: 18,
        gstAmount: 225,
        totalAmount: 1475,
        discount: 0
      },
      payment: {
        method: 'cash',
        status: 'pending',
        paidAmount: 0,
        remainingAmount: 1475
      },
      billDate: new Date(),
      description: 'Sample bill for testing',
      status: 'draft',
      createdBy: '507f1f77bcf86cd799439011' // Sample ObjectId
    });
    
    await bill.save();
    console.log('✅ Added sample bill:', bill.billNumber);
    
    // Check data
    const shops = await Shop.find();
    const bills = await Bill.find();
    
    console.log('📊 Final data:');
    console.log('Shops:', shops.length);
    console.log('Bills:', bills.length);
    console.log('Bill details:', bills.map(b => ({
      billNumber: b.billNumber,
      shopName: b.shopName,
      totalAmount: b.pricing.totalAmount
    })));
    
    console.log('✅ Sample data added successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

addSampleData();
