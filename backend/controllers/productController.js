const mongoose = require('mongoose');
const path = require('path');

// Map of Mongoose Model Name -> File Name (without .js)
// This ensures we can load models if they aren't registered yet
const productModelsMap = {
  'AdhesivesModels': 'AdhesivesModels',
  'BrushModels': 'BrushModels',
  'CementsModels': 'CementsModels',
  'CleaningModels': 'CleaningModels',
  'DryModels': 'DryModels',
  'ElectricalModels': 'ElectricalModels',
  'FiberModels': 'FiberModels',
  'FittingModels': 'FittingModels',
  'HardwareModels': 'HardwareModels',
  'HomeDecorModels': 'HomeDecorModels',
  'LightingModels': 'LightingModels',
  'LocksModels': 'LocksModels',
  'PaintModels': 'PaintModels',
  'PipeModels': 'PipeModels',
  'RooferModels': 'RooferModels',
  'SanitaryModels': 'SanitaryModels',
  'SheetModels': 'SheetModels',
  'ToolsModels': 'ToolsModels',
  'UncategorizedModels': 'UncategorizedModels',
  'WaterProofingModels': 'WaterProofingModels',
  'HomeElectrical': 'HomeElectricalModel',
  'HomePaints': 'HomePaintsModel',
  'ProductTools': 'ProductToolsModel',
  'PvcMatsModels': 'PvcMatsModels'
};

// Helper to get all product models
const getModels = () => {
  const models = [];
  for (const [modelName, fileName] of Object.entries(productModelsMap)) {
    try {
      // Try to get existing model
      if (mongoose.models[modelName]) {
        models.push(mongoose.model(modelName));
      } else {
        // Try to load from file
        try {
          // Check if file exists in ../models/
          // Note: using relative path from this controller file
          const model = require(`../models/${fileName}`);
          if (model) models.push(model);
        } catch (requireErr) {
                  }
      }
    } catch (err) {
          }
  }
  return models;
};

// Get all products from all categories
const getAllProducts = async (req, res) => {
  try {
    const products = [];
    const models = getModels();
    
    // Fetch products from all available models
    for (const model of models) {
      try {
        const modelProducts = await model.find({}).limit(20); // Limit per model to avoid massive response
        const productsWithCategory = modelProducts.map(product => ({
          ...product.toObject(),
          // Use existing category or fallback to model name if missing
          category: product.category || model.modelName,
          _id: product._id.toString()
        }));
        products.push(...productsWithCategory);
      } catch (err) {
                continue;
      }
    }

    // Shuffle and limit results
    const shuffledProducts = products.sort(() => 0.5 - Math.random());
    const limitedProducts = shuffledProducts.slice(0, 100); // Limit to 100 total products

    res.status(200).json(limitedProducts);
  } catch (error) {
        res.status(500).json({ 
      success: false, 
      message: 'Error fetching products',
      error: error.message 
    });
  }
};

// Get products by category (This might need adjustment if 'category' param matches model name or internal category field)
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!category) {
      return res.status(400).json({ 
        success: false, 
        message: 'Category parameter is required' 
      });
    }

    // Strategy: Search in ALL models for products with this category field
    // OR check if 'category' matches a Model Name
    
    const models = getModels();
    const products = [];

    // 1. Check if category matches a Model Name directly
    const directModel = models.find(m => m.modelName === category || m.modelName === category + 'Models');
    if (directModel) {
       const modelProducts = await directModel.find({}).limit(50);
       return res.status(200).json(modelProducts);
    }

    // 2. Search all models for `category` field match
    for (const model of models) {
      try {
        const found = await model.find({ category: category }).limit(50);
        products.push(...found);
      } catch (err) {
        continue;
      }
    }

    res.status(200).json(products);
  } catch (error) {
        res.status(500).json({ 
      success: false, 
      message: 'Error fetching products',
      error: error.message 
    });
  }
};

// Search products
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query is required' 
      });
    }

    const products = [];
    const searchRegex = new RegExp(q, 'i');
    const models = getModels();

    // Search in all models
    for (const model of models) {
      try {
        const modelProducts = await model.find({
          $or: [
            { name: searchRegex },
            { description: searchRegex },
            { brand: searchRegex },
            { category: searchRegex }
          ]
        }).limit(20); // Limit per model to keep response fast but diverse
        
        const productsWithCategory = modelProducts.map(product => ({
          ...product.toObject(),
          category: product.category || model.modelName,
          _id: product._id.toString()
        }));
        products.push(...productsWithCategory);
      } catch (err) {
        continue;
      }
    }

    res.status(200).json(products);
  } catch (error) {
        res.status(500).json({ 
      success: false, 
      message: 'Error searching products',
      error: error.message 
    });
  }
};

// Get specific products by IDs (searching across all models)
const getProductsByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(200).json([]);
    }

    const foundProducts = [];
    let idsToFind = [...new Set(ids)]; // Deduplicate
    const models = getModels();

    for (const model of models) {
      if (idsToFind.length === 0) break;

      try {
        const products = await model.find({ _id: { $in: idsToFind } });
        
        if (products.length > 0) {
          const productsWithCategory = products.map(product => ({
            ...product.toObject(),
            category: product.category || model.modelName,
            _id: product._id.toString()
          }));
          foundProducts.push(...productsWithCategory);
          
          // Remove found IDs
          const foundIds = products.map(p => p._id.toString());
          idsToFind = idsToFind.filter(id => !foundIds.includes(id));
        }
      } catch (err) {
        continue;
      }
    }

    res.status(200).json(foundProducts);
  } catch (error) {
        res.status(500).json({ 
      success: false, 
      message: 'Error fetching products details',
      error: error.message 
    });
  }
};

module.exports = {
  getAllProducts,
  getProductsByCategory,
  searchProducts,
  getProductsByIds
};
