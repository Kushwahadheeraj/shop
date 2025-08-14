const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure multer for handling FormData with files
const storage = multer.memoryStorage();
const upload = multer({ storage });

const finolexPipes = require('../controllers/pipe/finolexPipesController');
const ashirvadPipes = require('../controllers/pipe/ashirvadPipesController');
const astralPipes = require('../controllers/pipe/astralPipesController');
const nepulPipes = require('../controllers/pipe/nepulPipesController');
const birlaPipes = require('../controllers/pipe/birlaPipesControllers');
const princePipes = require('../controllers/pipe/princePipesControllers');
const prakashPipes = require('../controllers/pipe/prakashPipesControllers');
const supremePipes = require('../controllers/pipe/supremePipesControllers');
const tataPipes = require('../controllers/pipe/tataPipesControllers');
const tsaPipes = require('../controllers/pipe/tsaPipesControllers');

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
registerCrudRoutes('astral-pipes', astralPipes, 'AstralPipes');
registerCrudRoutes('nepul-pipes', nepulPipes, 'NepulPipes');
registerCrudRoutes('birla-pipes', birlaPipes, 'BirlaPipes');
registerCrudRoutes('prince-pipes', princePipes, 'PrincePipes');
registerCrudRoutes('prakash-pipes', prakashPipes, 'PrakashPipes');
registerCrudRoutes('supreme-pipes', supremePipes, 'SupremePipes');
registerCrudRoutes('tata-pipes', tataPipes, 'TataPipes');
registerCrudRoutes('tsa-pipes', tsaPipes, 'TsaPipes');







module.exports = router; 