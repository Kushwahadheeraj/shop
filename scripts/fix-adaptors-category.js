const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shop');

// Import the model
const ElectricalModels = require('../backend/models/ElectricalModels');

async function fixAdaptorsCategory() {
  try {
    console.log('Fixing Adaptors category...');
    
    // Find all products with category 'adaptors' (lowercase)
    const products = await ElectricalModels.find({ category: 'adaptors' });
    console.log(`Found ${products.length} products with lowercase 'adaptors' category`);
    
    if (products.length > 0) {
      // Update them to 'Adaptors' (capitalized)
      const result = await ElectricalModels.updateMany(
        { category: 'adaptors' },
        { $set: { category: 'Adaptors' } }
      );
      console.log(`Updated ${result.modifiedCount} products to 'Adaptors' category`);
    }
    
    // Also check for any products with 'Adaptors' category
    const adaptorsProducts = await ElectricalModels.find({ category: 'Adaptors' });
    console.log(`Total products with 'Adaptors' category: ${adaptorsProducts.length}`);
    
    console.log('Category fix completed!');
  } catch (error) {
    console.error('Error fixing category:', error);
  } finally {
    mongoose.disconnect();
  }
}

fixAdaptorsCategory();
