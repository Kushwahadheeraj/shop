// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const router = express.Router();

// Import all home component routes
const serviceRoutes = require('./home/serviceRoutes');
const itemsRoutes = require('./home/itemsRoutes');
const categoriesRoutes = require('./home/categoriesRoutes');
const cardSliderRoutes = require('./home/cardSliderRoutes');
const cardRoutes = require('./home/cardRoutes');
const toolsRoutes = require('./home/toolsRoutes');
const productToolsRoutes = require('./home/productToolsRoutes');
const brandsRoutes = require('./home/brandsRoutes');
const popularProductsRoutes = require('./home/popularProductsRoutes');
const homeElectricalRoutes = require('./home/homeElectricalRoutes');
const homePaintsRoutes = require('./home/homePaintsRoutes');

// Import ImageSlider subfolder routes
const paintsImageRoutes = require('./home/paintsImageRoutes');
const toolsImageRoutes = require('./home/toolsImageRoutes');
const sanitaryImageRoutes = require('./home/sanitaryImageRoutes');
const faucetImageRoutes = require('./home/faucetImageRoutes');
const electricImageRoutes = require('./home/electricImageRoutes');

// Use all home component routes
router.use('/service', serviceRoutes);
router.use('/items', itemsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/cardslider', cardSliderRoutes);
router.use('/card', cardRoutes);
router.use('/tools', toolsRoutes);
router.use('/producttools', productToolsRoutes);
router.use('/brands', brandsRoutes);
router.use('/popularproducts', popularProductsRoutes);
router.use('/electrical', homeElectricalRoutes);
router.use('/paints', homePaintsRoutes);
// Use ImageSlider subfolder routes
router.use('/imageslider/paintsimage', paintsImageRoutes);
router.use('/imageslider/toolsimage', toolsImageRoutes);
router.use('/imageslider/sanitaryimage', sanitaryImageRoutes);
router.use('/imageslider/faucetimage', faucetImageRoutes);
router.use('/imageslider/electricimage', electricImageRoutes);

module.exports = router;
