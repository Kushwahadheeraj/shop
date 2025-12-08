const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllBalanceEntries,
  createBalanceEntry,
  updateBalanceEntry,
  deleteBalanceEntry,
  deletePersonEntries
} = require('../controllers/balanceEntryController');

router.use(auth);

router.get('/', getAllBalanceEntries);
router.post('/', createBalanceEntry);
router.put('/:id', updateBalanceEntry);
router.delete('/:id', deleteBalanceEntry);
router.delete('/person/:phone', deletePersonEntries);

module.exports = router;

