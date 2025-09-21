const mongoose = require('mongoose');
const Bill = require('./models/Bill');
const Shop = require('./models/Shop');

// Use a simple local MongoDB connection for testing
const MONGO_URI = 'mongodb://localhost:27017/shop';

async function checkDatabase() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    
    // Try local MongoDB first
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Check shops
    const shops = await Shop.find({});
    console.log('📊 Shops found:', shops.length);
    shops.forEach(shop => {
      console.log(`  - ${shop.name} (${shop._id})`);
    });
    
    // Check bills
    const bills = await Bill.find({});
    console.log('📊 Bills found:', bills.length);
    bills.forEach(bill => {
      console.log(`  - ${bill.billNumber} - ${bill.shopName} - ₹${bill.pricing?.totalAmount || 0}`);
    });
    
    // Calculate stats
    const totalBills = bills.length;
    const totalAmount = bills.reduce((sum, bill) => sum + (bill.pricing?.totalAmount || 0), 0);
    const paidAmount = bills.reduce((sum, bill) => sum + (bill.payment?.paidAmount || 0), 0);
    const remainingAmount = bills.reduce((sum, bill) => sum + (bill.payment?.remainingAmount || 0), 0);
    
    console.log('📈 Stats:');
    console.log(`  - Total Bills: ${totalBills}`);
    console.log(`  - Total Amount: ₹${totalAmount}`);
    console.log(`  - Paid Amount: ₹${paidAmount}`);
    console.log(`  - Remaining: ₹${remainingAmount}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // If local MongoDB fails, try to add some sample data
    console.log('🔧 Adding sample data...');
    
    try {
      // Clear existing data
      await Bill.deleteMany({});
      await Shop.deleteMany({});
      
      // Add sample shop
      const shop = new Shop({
        name: 'Sample Shop',
        address: '123 Sample Street',
        contact: {
          phone: '1234567890',
          email: 'sample@shop.com'
        },
        businessInfo: {
          gstNumber: 'GST123456789',
          panNumber: 'PAN123456789'
        }
      });
      await shop.save();
      console.log('✅ Sample shop added');
      
      // Add sample bill
      const bill = new Bill({
        shop: shop._id,
        shopName: shop.name,
        billNumber: 'BILL-001',
        billDate: new Date(),
        items: [
          {
            name: 'Sample Item 1',
            quantity: 2,
            unitPrice: 500,
            category: 'Electronics',
            description: 'Sample description'
          }
        ],
        pricing: {
          subtotal: 1000,
          gstRate: 18,
          gstAmount: 180,
          totalAmount: 1180,
          discount: 0
        },
        payment: {
          method: 'cash',
          status: 'partial',
          paidAmount: 500,
          remainingAmount: 680
        },
        description: 'Sample bill description',
        notes: 'Sample notes'
      });
      await bill.save();
      console.log('✅ Sample bill added');
      
      console.log('🎉 Sample data added successfully!');
      
    } catch (addError) {
      console.error('❌ Error adding sample data:', addError.message);
    }
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

checkDatabase();
