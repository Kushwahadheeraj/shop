const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const controllers = require('../controllers/electrical');
const adaptorsController = require('../controllers/electrical/AdaptorsController');

router.post('/:type', upload.array('photos', 5), (req, res) => {
  const ctrl = controllers[req.params.type.toLowerCase()];
  if (ctrl && ctrl.create) return ctrl.create(req, res);
  res.status(404).json({ error: 'Controller not found' });
});

router.post('/adaptors', upload.array('photos', 5), adaptorsController.create);
router.get('/adaptors', adaptorsController.getAll);

// ...and similar for PUT, DELETE, GET, etc.

module.exports = router;
