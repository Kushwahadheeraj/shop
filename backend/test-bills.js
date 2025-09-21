const mongoose = require('mongoose');
const Bill = require('./models/Bill');
const Shop = require('./models/Shop');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testData() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connection.once('open', () => {
      console.log('✅ Connected to MongoDB');
    });
    
    console.log('🔍 Checking database data...');
    
    // Check shops
    const shops = await Shop.find();
    console.log('📊 Shops count:', shops.length);
    console.log('📊 Shops:', shops.map(s => ({ id: s._id, name: s.name })));
    
    // Check bills
    const bills = await Bill.find();
    console.log('📊 Bills count:', bills.length);
    console.log('📊 Bills:', bills.map(b => ({ 
      id: b._id, 
      billNumber: b.billNumber, 
      shopName: b.shopName,
      totalAmount: b.pricing?.totalAmount 
    })));
    
    // Check if there are any bills for a specific seller
    const sellerBills = await Bill.find({ createdBy: { $exists: true } });
    console.log('📊 Bills with createdBy:', sellerBills.length);
    
    if (sellerBills.length > 0) {
      console.log('📊 First bill createdBy:', sellerBills[0].createdBy);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testData();
