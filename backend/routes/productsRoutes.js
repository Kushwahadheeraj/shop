const express = require('express');
const router = express.Router();

// Import all product models
const ElectricalModels = require('../models/ElectricalModels');
const PaintModels = require('../models/PaintModels');
const SanitaryModels = require('../models/SanitaryModels');
const ToolsModels = require('../models/ToolsModels');
const AdhesivesModels = require('../models/AdhesivesModels');
const CementsModels = require('../models/CementsModels');
const CleaningModels = require('../models/CleaningModels');
const DryModels = require('../models/DryModels');
const FiberModels = require('../models/FiberModels');
const FittingModels = require('../models/FittingModels');
const HardwareModels = require('../models/HardwareModels');
const HomeDecorModels = require('../models/HomeDecorModels');
const LocksModels = require('../models/LocksModels');
const PipeModels = require('../models/PipeModels');
const PvcMatsModels = require('../models/PvcMatsModels');
const RooferModels = require('../models/RooferModels');
const UncategorizedModels = require('../models/UncategorizedModels');
const WaterProofingModels = require('../models/WaterProofingModels');

// Search products across all categories
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json({ products: [] });
    }

    const searchRegex = new RegExp(q.trim(), 'i');
    const searchFields = ['name', 'description', 'brand', 'category', 'subcategory'];

    // Create search query for each field
    const searchQuery = {
      $or: searchFields.map(field => ({
        [field]: searchRegex
      }))
    };

    // Search across all product collections
    const [
      electricalProducts,
      paintProducts,
      sanitaryProducts,
      toolsProducts,
      adhesivesProducts,
      cementsProducts,
      cleaningProducts,
      dryProducts,
      fiberProducts,
      fittingProducts,
      hardwareProducts,
      homeDecorProducts,
      locksProducts,
      pipeProducts,
      pvcMatsProducts,
      rooferProducts,
      uncategorizedProducts,
      waterProofingProducts
    ] = await Promise.all([
      ElectricalModels.find(searchQuery).limit(10),
      PaintModels.find(searchQuery).limit(10),
      SanitaryModels.find(searchQuery).limit(10),
      ToolsModels.find(searchQuery).limit(10),
      AdhesivesModels.find(searchQuery).limit(10),
      CementsModels.find(searchQuery).limit(10),
      CleaningModels.find(searchQuery).limit(10),
      DryModels.find(searchQuery).limit(10),
      FiberModels.find(searchQuery).limit(10),
      FittingModels.find(searchQuery).limit(10),
      HardwareModels.find(searchQuery).limit(10),
      HomeDecorModels.find(searchQuery).limit(10),
      LocksModels.find(searchQuery).limit(10),
      PipeModels.find(searchQuery).limit(10),
      PvcMatsModels.find(searchQuery).limit(10),
      RooferModels.find(searchQuery).limit(10),
      UncategorizedModels.find(searchQuery).limit(10),
      WaterProofingModels.find(searchQuery).limit(10)
    ]);

    // Combine all results
    const allProducts = [
      ...electricalProducts,
      ...paintProducts,
      ...sanitaryProducts,
      ...toolsProducts,
      ...adhesivesProducts,
      ...cementsProducts,
      ...cleaningProducts,
      ...dryProducts,
      ...fiberProducts,
      ...fittingProducts,
      ...hardwareProducts,
      ...homeDecorProducts,
      ...locksProducts,
      ...pipeProducts,
      ...pvcMatsProducts,
      ...rooferProducts,
      ...uncategorizedProducts,
      ...waterProofingProducts
    ];

    // Sort by relevance (exact name matches first, then partial matches)
    const sortedProducts = allProducts.sort((a, b) => {
      const aName = (a.name || '').toLowerCase();
      const bName = (b.name || '').toLowerCase();
      const searchTerm = q.toLowerCase();
      
      // Exact match first
      if (aName === searchTerm && bName !== searchTerm) return -1;
      if (bName === searchTerm && aName !== searchTerm) return 1;
      
      // Starts with search term
      if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm)) return -1;
      if (bName.startsWith(searchTerm) && !aName.startsWith(searchTerm)) return 1;
      
      // Contains search term
      if (aName.includes(searchTerm) && !bName.includes(searchTerm)) return -1;
      if (bName.includes(searchTerm) && !aName.includes(searchTerm)) return 1;
      
      return 0;
    });

    // Limit to 20 results
    const limitedProducts = sortedProducts.slice(0, 20);

    res.json({ products: limitedProducts });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
