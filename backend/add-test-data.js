const mongoose = require('mongoose');
const Bill = require('./models/Bill');
const Shop = require('./models/Shop');

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shop';

async function addTestData() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    await Bill.deleteMany({});
    await Shop.deleteMany({});
    console.log('🗑️ Cleared existing data');
    
    // Add test shop
    const shop = new Shop({
      name: 'Test Electronics Store',
      address: '123 Main Street, Mumbai',
      contact: {
        phone: '9876543210',
        email: 'test@electronics.com'
      },
      businessInfo: {
        gstNumber: 'GST123456789',
        panNumber: 'PAN123456789'
      },
      financialInfo: {
        creditLimit: 100000,
        currentBalance: 0
      }
    });
    
    await shop.save();
    console.log('✅ Test shop created:', shop.name);
    
    // Add test bills
    const bills = [
      {
        shop: shop._id,
        shopName: shop.name,
        billNumber: 'BILL-001',
        billDate: new Date(),
        items: [
          {
            name: 'Laptop',
            quantity: 1,
            unitPrice: 50000,
            category: 'Electronics',
            description: 'Dell Laptop'
          }
        ],
        pricing: {
          subtotal: 50000,
          gstRate: 18,
          gstAmount: 9000,
          totalAmount: 59000,
          discount: 0
        },
        payment: {
          method: 'cash',
          status: 'partial',
          paidAmount: 30000,
          remainingAmount: 29000
        },
        description: 'Laptop purchase',
        notes: 'Customer paid partial amount'
      },
      {
        shop: shop._id,
        shopName: shop.name,
        billNumber: 'BILL-002',
        billDate: new Date(),
        items: [
          {
            name: 'Mobile Phone',
            quantity: 2,
            unitPrice: 15000,
            category: 'Electronics',
            description: 'Samsung Mobile'
          }
        ],
        pricing: {
          subtotal: 30000,
          gstRate: 18,
          gstAmount: 5400,
          totalAmount: 35400,
          discount: 0
        },
        payment: {
          method: 'upi',
          status: 'paid',
          paidAmount: 35400,
          remainingAmount: 0
        },
        description: 'Mobile phone purchase',
        notes: 'Fully paid via UPI'
      }
    ];
    
    for (const billData of bills) {
      const bill = new Bill(billData);
      await bill.save();
      console.log('✅ Test bill created:', bill.billNumber);
    }
    
    // Calculate totals
    const allBills = await Bill.find({});
    const totalBills = allBills.length;
    const totalAmount = allBills.reduce((sum, bill) => sum + (bill.pricing?.totalAmount || 0), 0);
    const paidAmount = allBills.reduce((sum, bill) => sum + (bill.payment?.paidAmount || 0), 0);
    const remainingAmount = allBills.reduce((sum, bill) => sum + (bill.payment?.remainingAmount || 0), 0);
    
    console.log('📊 Test Data Summary:');
    console.log(`  - Total Bills: ${totalBills}`);
    console.log(`  - Total Amount: ₹${totalAmount}`);
    console.log(`  - Paid Amount: ₹${paidAmount}`);
    console.log(`  - Remaining Amount: ₹${remainingAmount}`);
    
    console.log('🎉 Test data added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding test data:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

addTestData();
