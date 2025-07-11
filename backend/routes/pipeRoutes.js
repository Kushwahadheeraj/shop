const express = require('express');
const router = express.Router();

const finolexPipes = require('../controllers/pipe/finolexPipesController');
const ashirvadPipes = require('../controllers/pipe/ashirvadPipesController');
const astralPipes = require('../controllers/pipe/astralPipesController');
const nepulPipes = require('../controllers/pipe/nepulPipes');

// Helper to register CRUD routes for a controller
function registerCrudRoutes(basePath, controller, name) {
  router.post(`/${basePath}/create`, controller[`create${name}`]);
  router.get(`/${basePath}/get`, controller[`getAll${name}`]);
  router.get(`/${basePath}/getOne:id`, controller[`getOne${name}`]);
  router.put(`/${basePath}/Update:id`, controller[`update${name}`]);
  router.delete(`/${basePath}/delete:id`, controller[`delete${name}`]);
}

registerCrudRoutes('finolex-pipes', finolexPipes, 'FinolexPipes');
registerCrudRoutes('ashirvad-pipes', ashirvadPipes, 'AshirvadPipes');
registerCrudRoutes('astral-pipes', astralPipes, 'AstralPipes');
registerCrudRoutes('nepul-pipes', nepulPipes, 'NepulPipes');

module.exports = router; 