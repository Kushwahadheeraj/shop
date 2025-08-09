const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shop');

// Import the ElectricalModels
const ElectricalModels = require('../backend/models/ElectricalModels');

async function fixDoorBellsCategory() {
  try {
    console.log('🔧 Fixing DoorBells category names...\n');

    // Find all products with the wrong category name
    const wrongCategoryProducts = await ElectricalModels.find({ category: 'Doorbells' });
    console.log(`Found ${wrongCategoryProducts.length} products with wrong category 'Doorbells'`);

    if (wrongCategoryProducts.length > 0) {
      // Update them to the correct category name
      const result = await ElectricalModels.updateMany(
        { category: 'Doorbells' },
        { $set: { category: 'DoorBells' } }
      );
      console.log(`✅ Updated ${result.modifiedCount} products to correct category 'DoorBells'`);
    }

    // Check for products with correct category
    const correctCategoryProducts = await ElectricalModels.find({ category: 'DoorBells' });
    console.log(`Found ${correctCategoryProducts.length} products with correct category 'DoorBells'`);

    console.log('\n📊 Summary:');
    console.log(`- Products with wrong category: ${wrongCategoryProducts.length}`);
    console.log(`- Products with correct category: ${correctCategoryProducts.length}`);
    console.log(`- Total DoorBells products: ${wrongCategoryProducts.length + correctCategoryProducts.length}`);

  } catch (error) {
    console.error('❌ Error fixing DoorBells category:', error);
  } finally {
    mongoose.connection.close();
  }
}

fixDoorBellsCategory();
