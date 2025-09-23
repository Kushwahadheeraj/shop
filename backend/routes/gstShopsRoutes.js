const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createGSTShop,
  getGSTShops,
  getGSTShop,
  updateGSTShop,
  deleteGSTShop
} = require('../controllers/gstShopsController');

router.use(auth);

router.post('/', createGSTShop);
router.get('/', getGSTShops);
router.get('/:id', getGSTShop);
router.put('/:id', updateGSTShop);
router.delete('/:id', deleteGSTShop);

module.exports = router;


