const express = require('express');
const router = express.Router();

const finolexPipes = require('./finolexPipesController');
const ashirvadPipes = require('./ashirvadPipesController');
const astralPipes = require('./astralPipesController');
const nepulPipes = require('./nepulPipes');

// Helper to register CRUD routes for a controller
function registerCrudRoutes(basePath, controller, name) {
  router.post(`/${basePath}`, controller[`create${name}`]);
  router.get(`/${basePath}`, controller[`getAll${name}`]);
  router.get(`/${basePath}/:id`, controller[`getOne${name}`]);
  router.put(`/${basePath}/:id`, controller[`update${name}`]);
  router.delete(`/${basePath}/:id`, controller[`delete${name}`]);
}

registerCrudRoutes('finolex-pipes', finolexPipes, 'FinolexPipes');
registerCrudRoutes('ashirvad-pipes', ashirvadPipes, 'AshirvadPipes');
registerCrudRoutes('astral-pipes', astralPipes, 'AstralPipes');
registerCrudRoutes('nepul-pipes', nepulPipes, 'NepulPipes');

module.exports = router; 