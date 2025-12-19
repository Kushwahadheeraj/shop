const mongoose = require('mongoose');

// Get all products from all categories
const getAllProducts = async (req, res) => {
  try {
    const products = [];
    
    // List of all model names to search
    const modelNames = [
      'Adhesives', 'Brush', 'Cements', 'Cleaning', 'Dry', 'Fiber', 'Fitting', 
      'Hardware', 'HomeDecor', 'Uncategorized', 'WaterProofing',
      // Electrical models
      'Adaptors', 'CeilingRoses', 'Dimmer', 'DistributionBoards', 'DPswitch',
      'EarthingAccessories', 'ELCBsRCCBs', 'ElectricalFittings', 'Fan',
      'FlexibleConduit', 'FlexibleWires', 'FuseCarriers', 'Holders',
      'Indicator', 'InsulationTapes', 'Isolators', 'Jacks', 'KITKATFuses',
      'Lights', 'MainSwitch', 'MCB', 'ModularSurfaceBox', 'Motors',
      'MotorStarters', 'Others', 'PinTop', 'Plug', 'PowerStrips', 'PVCClips',
      'Regulators', 'RotarySwitch', 'Sockets', 'SwitchAndSocket', 'Switches',
      'SwitchPlates', 'TravelAdaptor', 'TVOutlets', 'UniSwitch', 'WaterHeater',
      'WiresAndCables',
      // Locks models
      'MorticeLocks', 'MortiseLockBody', 'PatchFittings',
      // Paint models
      'AcrylicDistemper', 'AcrylicEmulsionPaint', 'AcrylicPrimer', 'AcrylicWallPutty',
      'Adhesive', 'AspaPaints', 'AsianPaints', 'AgsarPaints', 'AutomotivePaints',
      'BlackBoardPaint', 'BrushesRollers', 'CementPrimer', 'CrackFillers',
      'DeskLight', 'Distemper', 'DoorAccessories', 'DoorHandles', 'DoorLocks',
      'DryWallGypsumScrews', 'ElectricalFittings', 'Enamel', 'ExteriorEmulsion',
      'ExteriorPrimer', 'FocusLight', 'GemPaints', 'GlassCoatings', 'GlossEnamel',
      'InteriorEmulsion', 'InteriorPrimer', 'JkWallPutty', 'KPFWallPutty',
      'Melamyne', 'MetalPrimer', 'NC', 'PaintingAccessories', 'PaintingTools',
      'Polish', 'PowderWallPutty', 'Primer', 'PU', 'Reflectors', 'RotatorySwitch',
      'SatinEnamel', 'Sealer', 'SolventPrimer', 'SpareMallets', 'SprayPaints',
      'Stainers', 'Stencils', 'SyntheticDistemper', 'SyntheticEnamel', 'Thinner',
      'TileGuard', 'UniversalStainers', 'Varnish', 'WallPutty', 'WallTexture',
      'WaterproofBasecoat', 'WoodFinishes', 'WoodPrimer', 'WoodPutty', 'WoodStainers',
      // Pipe models
      'AshirvadPipes', 'ApolloPipes', 'BirlaPipes', 'FinolexPipes', 'NepulPipes',
      'PrakashPipes', 'PrincePipes', 'SupremePipes', 'TataPipes', 'TSAPipes',
      // Roofer models
      'AluminiumSheet', 'AsbestosSheet', 'CementSheet', 'CorrugatedSheet',
      'GalvanizedSheet', 'GI', 'Roofer', 'SteelSheet',
      // Sanitary models (sample of main ones)
      'AcrylicProducts', 'Bathsense', 'CoralBathFixtures', 'Corsa', 'Essess',
      'Hindware', 'LeoBathFittings', 'Parryware', 'WaterTec',
      // Tools models (sample of main ones)
      'Abrasives', 'AllenKeys', 'CarpenterPincer', 'Chisels', 'Clamps', 'Cutters',
      'Files', 'GardenTools', 'GlueGun', 'GreaseGun', 'Hammer', 'Level',
      'Lubrications', 'Piler', 'PolishingAccessories', 'PowerTools', 'ScrewDriver',
      'SocketSet', 'Spanner', 'Wrench'
    ];

    // Get all models from mongoose
    const models = {};
    for (const modelName of modelNames) {
      try {
        // Try to get the model from mongoose
        const model = mongoose.model(modelName);
        if (model) {
          models[modelName] = model;
        }
      } catch (err) {
        // Model doesn't exist, skip
        continue;
      }
    }

    // Fetch products from all available models
    for (const [modelName, model] of Object.entries(models)) {
      try {
        const modelProducts = await model.find({}).limit(50); // Limit to 50 per category
        const productsWithCategory = modelProducts.map(product => ({
          ...product.toObject(),
          category: modelName,
          _id: product._id.toString()
        }));
        products.push(...productsWithCategory);
      } catch (err) {
        console.error(`Error fetching from ${modelName}:`, err.message);
        continue;
      }
    }

    // Shuffle and limit results
    const shuffledProducts = products.sort(() => 0.5 - Math.random());
    const limitedProducts = shuffledProducts.slice(0, 100); // Limit to 100 total products

    res.status(200).json(limitedProducts);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching products',
      error: error.message 
    });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!category) {
      return res.status(400).json({ 
        success: false, 
        message: 'Category parameter is required' 
      });
    }

    // Try to get the model
    let model;
    try {
      model = mongoose.model(category);
    } catch (err) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }

    const products = await model.find({}).limit(50);
    const productsWithCategory = products.map(product => ({
      ...product.toObject(),
      category: category,
      _id: product._id.toString()
    }));

    res.status(200).json(productsWithCategory);
  } catch (error) {
    console.error('Error fetching products by category:', error);
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

    // List of main model names to search
    const mainModels = [
      'Adhesives', 'Brush', 'Cements', 'Cleaning', 'Dry', 'Fiber', 'Fitting', 
      'Hardware', 'HomeDecor', 'Uncategorized', 'WaterProofing',
      'Adaptors', 'Lights', 'Fan', 'Switches', 'Sockets', 'MCB',
      'MorticeLocks', 'AcrylicEmulsionPaint', 'AshirvadPipes', 'AluminiumSheet',
      'AcrylicProducts', 'Abrasives'
    ];

    // Search in main models
    for (const modelName of mainModels) {
      try {
        const model = mongoose.model(modelName);
        const modelProducts = await model.find({
          $or: [
            { name: searchRegex },
            { description: searchRegex },
            { brand: searchRegex }
          ]
        }).limit(10);
        
        const productsWithCategory = modelProducts.map(product => ({
          ...product.toObject(),
          category: modelName,
          _id: product._id.toString()
        }));
        products.push(...productsWithCategory);
      } catch (err) {
        continue;
      }
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error searching products',
      error: error.message 
    });
  }
};

module.exports = {
  getAllProducts,
  getProductsByCategory,
  searchProducts
};
