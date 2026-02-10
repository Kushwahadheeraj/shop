const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure multer for handling FormData with files
const storage = multer.memoryStorage();
const upload = multer({ storage });

const finolexPipes = require('../controllers/pipe/finolexPipesController');
const ashirvadPipes = require('../controllers/pipe/ashirvadPipesController');
const apolloPipes = require('../controllers/pipe/apolloPipesController');
const nepulPipes = require('../controllers/pipe/nepulPipesController');
const birlaPipes = require('../controllers/pipe/birlaPipesControllers');
const princePipes = require('../controllers/pipe/princePipesControllers');
const prakashPipes = require('../controllers/pipe/prakashPipesControllers');
const supremePipes = require('../controllers/pipe/supremePipesControllers');
const tataPipes = require('../controllers/pipe/tataPipesControllers');
const tsaPipes = require('../controllers/pipe/tsaPipesControllers');
const prinziaPipes = require('../controllers/pipe/prinziaPipesController');
const otherPipes = require('../controllers/pipe/otherPipesControllers');
const gardenPipes = require('../controllers/pipe/gardenPipesController');
const deliveryPipes = require('../controllers/pipe/deliveryPipesController');

// Helper to register CRUD routes for a controller
function registerCrudRoutes(basePath, controller, name) {
  router.post(`/${basePath}/create`, upload.array('photos', 5), controller[`create${name}`]);
  router.get(`/${basePath}/get`, controller[`getAll${name}`]);
  router.get(`/${basePath}/getOne/:id`, controller[`getOne${name}`]);
  router.put(`/${basePath}/Update/:id`, upload.array('photos', 5), controller[`update${name}`]);
  router.delete(`/${basePath}/delete/:id`, controller[`delete${name}`]);
}

registerCrudRoutes('finolex-pipes', finolexPipes, 'FinolexPipes');
registerCrudRoutes('ashirvad-pipes', ashirvadPipes, 'AshirvadPipes');
registerCrudRoutes('apollo-pipes', apolloPipes, 'ApolloPipes');
registerCrudRoutes('nepul-pipes', nepulPipes, 'NepulPipes');
registerCrudRoutes('birla-pipes', birlaPipes, 'BirlaPipes');
registerCrudRoutes('prince-pipes', princePipes, 'PrincePipes');
registerCrudRoutes('prakash-pipes', prakashPipes, 'PrakashPipes');
registerCrudRoutes('supreme-pipes', supremePipes, 'SupremePipes');
registerCrudRoutes('tata-pipes', tataPipes, 'TataPipes');
registerCrudRoutes('tsa-pipes', tsaPipes, 'TsaPipes');
registerCrudRoutes('prinzia-pipes', prinziaPipes, 'PrinziaPipes');
registerCrudRoutes('other-pipes', otherPipes, 'OtherPipes');
registerCrudRoutes('garden-pipe', gardenPipes, 'GardenPipe');
registerCrudRoutes('delivery-pipe', deliveryPipes, 'DeliveryPipe');







// General route to get all pipe products
router.get('/', async (req, res) => {
  try {
    const PipeModels = require('../models/PipeModels');
    const products = await PipeModels.find({});
    res.json(products);
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 
