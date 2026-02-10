const fs = require('fs');
const path = require('path');

// Define the mapping of category keys to their folder names
const categoryFolderMap = {
  'adhesives': 'Adhesives',
  'brush': 'Brush', 
  'cements': 'Cements',
  'cleaning': 'Cleaning',
  'dry': 'Dry',
  'electrical': 'Electrical',
  'fiber': 'Fiber',
  'fitting': 'Fitting',
  'hardware': 'Hardware',
  'home': 'Home',
  'homedecor': 'HomeDecor',
  'locks': 'Locks',
  'paint': 'Paint',
  'pipe': 'Pipe',
  'pvcmats': 'PvcMats',
  'roofer': 'Roofer',
  'sanitary': 'Sanitary',
  'tools': 'Tools',
  'uncategorized': 'Uncategorized',
  'waterproofing': 'WaterProofing'
};

// Function to count files recursively in a directory
const countFilesRecursively = (dirPath) => {
  let count = 0;
  
  try {
    if (!fs.existsSync(dirPath)) {
      return 0;
    }
    
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        count += countFilesRecursively(itemPath);
      } else if (item.endsWith('.jsx') || item.endsWith('.js')) {
        // Count only .jsx and .js files (excluding page.js files)
        if (item !== 'page.js') {
          count++;
        }
      }
    }
  } catch (error) {
      }
  
  return count;
};

// Function to count actual products by reading ProductList.jsx files
const countActualProducts = (dirPath) => {
  let count = 0;
  
  try {
    if (!fs.existsSync(dirPath)) {
      return 0;
    }
    
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        count += countActualProducts(itemPath);
      } else if (item === 'ProductList.jsx') {
        // Read the ProductList.jsx file to count actual products
        try {
          const content = fs.readFileSync(itemPath, 'utf8');
          // Count products by looking for product objects or arrays
          const productMatches = content.match(/const\s+products\s*=\s*\[/g) || 
                                content.match(/const\s+data\s*=\s*\[/g) ||
                                content.match(/export\s+const\s+products\s*=\s*\[/g);
          
          if (productMatches) {
            // Try to extract the array content
            const arrayMatch = content.match(/\[([\s\S]*?)\];/);
            if (arrayMatch) {
              const arrayContent = arrayMatch[1];
              // Count objects in the array (rough estimation)
              const objectMatches = arrayContent.match(/\{/g);
              if (objectMatches) {
                count += objectMatches.length;
              } else {
                // If no objects found, assume at least 1 product
                count += 1;
              }
            } else {
              count += 1; // At least 1 product if file exists
            }
          } else {
            count += 1; // At least 1 product if file exists
          }
        } catch (readError) {
          count += 1; // At least 1 product if file exists
        }
      }
    }
  } catch (error) {
      }
  
  return count;
};

// Get product count for a specific category
exports.getCategoryCount = async (req, res) => {
  try {
    const { categoryKey } = req.params;
    
    if (!categoryFolderMap[categoryKey]) {
      return res.status(400).json({ error: 'Invalid category key' });
    }
    
    const folderName = categoryFolderMap[categoryKey];
    const productListPath = path.join(__dirname, '../../app/Dashboard/ProductList', folderName);
    const productAddPath = path.join(__dirname, '../../app/Dashboard/ProductAdd', folderName);
    
    // Count files in both ProductList and ProductAdd folders
    const productListCount = countFilesRecursively(productListPath);
    const productAddCount = countFilesRecursively(productAddPath);
    
    const totalCount = productListCount + productAddCount;
    
    res.json({
      ok: true,
      data: {
        category: categoryKey,
        productListCount,
        productAddCount,
        totalCount
      }
    });
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all category counts
exports.getAllCategoryCounts = async (req, res) => {
  try {
    const counts = {};
    
    for (const [categoryKey, folderName] of Object.entries(categoryFolderMap)) {
      try {
        // Import the appropriate model based on category
        let Model;
        switch (categoryKey) {
          case 'electrical':
            Model = require('../models/ElectricalModels');
            break;
          case 'locks':
            Model = require('../models/LocksModels');
            break;
          case 'paint':
            Model = require('../models/PaintModels');
            break;
          case 'sanitary':
            Model = require('../models/SanitaryModels');
            break;
          case 'tools':
            Model = require('../models/ToolsModels');
            break;
          case 'home':
            Model = require('../models/HomeModels');
            break;
          case 'adhesives':
            Model = require('../models/AdhesivesModels');
            break;
          case 'brush':
            Model = require('../models/BrushModels');
            break;
          case 'cements':
            Model = require('../models/CementsModels');
            break;
          case 'cleaning':
            Model = require('../models/CleaningModels');
            break;
          case 'dry':
            Model = require('../models/DryModels');
            break;
          case 'fiber':
            Model = require('../models/FiberModels');
            break;
          case 'fitting':
            Model = require('../models/FittingModels');
            break;
          case 'hardware':
            Model = require('../models/HardwareModels');
            break;
          case 'homedecor':
            Model = require('../models/HomeDecorModels');
            break;
          case 'pipe':
            Model = require('../models/PipeModels');
            break;
          case 'pvcmats':
            Model = require('../models/PvcMatsModels');
            break;
          case 'roofer':
            Model = require('../models/RooferModels');
            break;
          case 'uncategorized':
            Model = require('../models/UncategorizedModels');
            break;
          case 'waterproofing':
            Model = require('../models/WaterProofingModels');
            break;
          default:
            counts[categoryKey] = 0;
            continue;
        }
        
        // Get count from database
        const count = await Model.countDocuments({});
        counts[categoryKey] = count;
      } catch (modelError) {
                counts[categoryKey] = 0;
      }
    }
    
    res.json({
      ok: true,
      data: counts
    });
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
};

// Get subcategories for a specific category
exports.getCategorySubcategories = async (req, res) => {
  try {
    const { categoryKey } = req.params;
    
    if (!categoryFolderMap[categoryKey]) {
      return res.status(400).json({ error: 'Invalid category key' });
    }
    
    // Import the appropriate model based on category
    let Model;
    try {
      switch (categoryKey) {
        case 'electrical':
          Model = require('../models/ElectricalModels');
          break;
        case 'locks':
          Model = require('../models/LocksModels');
          break;
        case 'paint':
          Model = require('../models/PaintModels');
          break;
        case 'sanitary':
          Model = require('../models/SanitaryModels');
          break;
        case 'tools':
          Model = require('../models/ToolsModels');
          break;
        case 'home':
          Model = require('../models/HomeModels');
          break;
        case 'adhesives':
          Model = require('../models/AdhesivesModels');
          break;
        case 'brush':
          Model = require('../models/BrushModels');
          break;
        case 'cements':
          Model = require('../models/CementsModels');
          break;
        case 'cleaning':
          Model = require('../models/CleaningModels');
          break;
        case 'dry':
          Model = require('../models/DryModels');
          break;
        case 'fiber':
          Model = require('../models/FiberModels');
          break;
        case 'fitting':
          Model = require('../models/FittingModels');
          break;
        case 'hardware':
          Model = require('../models/HardwareModels');
          break;
        case 'homedecor':
          Model = require('../models/HomeDecorModels');
          break;
        case 'pipe':
          Model = require('../models/PipeModels');
          break;
        case 'pvcmats':
          Model = require('../models/PvcMatsModels');
          break;
        case 'roofer':
          Model = require('../models/RooferModels');
          break;
        case 'uncategorized':
          Model = require('../models/UncategorizedModels');
          break;
        case 'waterproofing':
          Model = require('../models/WaterProofingModels');
          break;
        default:
          return res.status(400).json({ error: 'Invalid category' });
      }
    } catch (modelError) {
            return res.status(500).json({ error: 'Model not found' });
    }
    
    // Get all products from database for this category
    const allProducts = await Model.find({});
    
    // Group products by subcategory
    const subcategoryMap = {};
    
    allProducts.forEach(product => {
      const subcategory = product.subcategory || product.category || 'General';
      if (!subcategoryMap[subcategory]) {
        subcategoryMap[subcategory] = 0;
      }
      subcategoryMap[subcategory]++;
    });
    
    // Convert to array format
    const subcategories = Object.entries(subcategoryMap).map(([name, count]) => ({
      name,
      count
    }));
    
    // Sort subcategories by name
    subcategories.sort((a, b) => a.name.localeCompare(b.name));
    
    res.json({
      ok: true,
      data: subcategories
    });
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
};
