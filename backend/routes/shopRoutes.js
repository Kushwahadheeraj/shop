const express = require('express');
const router = express.Router();
const {
  createShop,
  getShops,
  getShopById,
  updateShop,
  deleteShop,
  getShopStats
} = require('../controllers/shopController');
const auth = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(auth);

// Shop routes
router.post('/', createShop);
router.get('/', getShops);
router.get('/stats', getShopStats);
router.get('/:id', getShopById);
router.put('/:id', updateShop);
router.delete('/:id', deleteShop);

module.exports = router;
