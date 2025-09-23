const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createClient,
  listClients,
  getClient,
  updateClient,
  deleteClient
} = require('../controllers/clientsController');

router.use(auth);

router.post('/', createClient);
router.get('/', listClients);
router.get('/:id', getClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

module.exports = router;


