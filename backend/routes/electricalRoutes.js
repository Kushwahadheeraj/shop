const express = require('express');
const router = express.Router();
const multer = require('multer');

const adaptors = require('../controllers/electrical/adaptorsController');
const ceilingRoses = require('../controllers/electrical/ceilingRosesController');
const wiresAndCables = require('../controllers/electrical/wiresAndCablesController');
const waterHeater = require('../controllers/electrical/waterHeaterController');
const uniSwitch = require('../controllers/electrical/uniSwitchController');
const tVOutlets = require('../controllers/electrical/tVOutletsController');
const travelAdaptor = require('../controllers/electrical/travelAdaptorController');
const switchPlates = require('../controllers/electrical/switchPlatesController');
const switches = require('../controllers/electrical/switchesController');
const switchAndSocket = require('../controllers/electrical/switchAndSocketController');
const sockets = require('../controllers/electrical/socketsController');
const rotarySwitch = require('../controllers/electrical/rotarySwitchController');
const regulators = require('../controllers/electrical/regulatorsController');
const pvCClips = require('../controllers/electrical/pvCClipsController');
const powerStrips = require('../controllers/electrical/powerStripsController');
const plug = require('../controllers/electrical/plugController');
const pinTop = require('../controllers/electrical/pinTopController');
const others = require('../controllers/electrical/othersController');
const motorStarters = require('../controllers/electrical/motorStartersController');
const motors = require('../controllers/electrical/motorsController');
const modularSurfaceBox = require('../controllers/electrical/modularSurfaceBoxController');
const mCB = require('../controllers/electrical/mCBController');
const mainSwitch = require('../controllers/electrical/mainSwitchController');
const lights = require('../controllers/electrical/lightsController');
const kITKATFuses = require('../controllers/electrical/kITKATFusesController');
const jacks = require('../controllers/electrical/jacksController');
const isolators = require('../controllers/electrical/isolatorsController');
const insulationTapes = require('../controllers/electrical/insulationTapesController');
const indicator = require('../controllers/electrical/indicatorController');
const holders = require('../controllers/electrical/holdersController');
const fuseCarriers = require('../controllers/electrical/fuseCarriersController');
const flexibleWires = require('../controllers/electrical/flexibleWiresController');
const flexibleConduit = require('../controllers/electrical/flexibleConduitController');
const fan = require('../controllers/electrical/fanController');
const electricalFittings = require('../controllers/electrical/electricalFittingsController');
const eLCBsRCCBs = require('../controllers/electrical/eLCBsRCCBsController');
const earthingAccessories = require('../controllers/electrical/earthingAccessoriesController');
const dPswitch = require('../controllers/electrical/dPswitchController');
const doorBells = require('../controllers/electrical/doorBellsController');
const distributionBoards = require('../controllers/electrical/distributionBoardsController');
const dimmer = require('../controllers/electrical/dimmerController');
const aggregate = require('../controllers/electrical/aggregateController');

// --- LIGHTS CONTROLLERS IMPORTS ---
const ceilinglight = require('../controllers/electrical/Lights/CeilinglightController.js');
const cFL = require('../controllers/electrical/Lights/CFLController.js');
const deskLight = require('../controllers/electrical/Lights/DeskLightController.js');
const focusLight = require('../controllers/electrical/Lights/FocusLightController.js');
const gardenLight = require('../controllers/electrical/Lights/GardenLightController.js');
const gateLight = require('../controllers/electrical/Lights/GateLightController.js');
const gLS = require('../controllers/electrical/Lights/GLSController.js');
const home = require('../controllers/electrical/Lights/HomeController.js');
const lamps = require('../controllers/electrical/Lights/LampsController.js');
const lEDBatten = require('../controllers/electrical/Lights/LEDBattenController.js');
const lEDBulbs = require('../controllers/electrical/Lights/LEDBulbsController.js');
const ledDownLightersSpotLight = require('../controllers/electrical/Lights/LedDownLightersSpotLightController.js');
const lEDLuminaires = require('../controllers/electrical/Lights/LEDLuminairesController.js');
const lEDPanelLight = require('../controllers/electrical/Lights/LEDPanelLightController.js');
const lEDSpotlight = require('../controllers/electrical/Lights/LEDSpotlightController.js');
const lEDStreetLight = require('../controllers/electrical/Lights/LEDStreetLightController.js');
const lEDStrips = require('../controllers/electrical/Lights/LEDStripsController.js');
const ledSurfaceLight = require('../controllers/electrical/Lights/LedSurfaceLightController.js');
const lightElectronics = require('../controllers/electrical/Lights/LightElectronicsController.js');
const mirrorLight = require('../controllers/electrical/Lights/MirrorLightController.js');
const reflections = require('../controllers/electrical/Lights/ReflectionsController.js');
const standardIncandescent = require('../controllers/electrical/Lights/StandardIncandescentController.js');
const tBulb = require('../controllers/electrical/Lights/TBulbController.js');
const tubeLight = require('../controllers/electrical/Lights/TubeLightController.js');
const underWaterLights = require('../controllers/electrical/Lights/UnderWaterLightsController.js');
const wallLight = require('../controllers/electrical/Lights/WallLightController.js');

// --- FANS CONTROLLERS IMPORTS ---
const cabinFans = require('../controllers/electrical/Fans/CabinFansController.js');
const ceilingFans = require('../controllers/electrical/Fans/CeilingFansController.js');
const pedestalfans = require('../controllers/electrical/Fans/PedestalfansController.js');
const tableFans = require('../controllers/electrical/Fans/TableFansController.js');
const ventilationExhaustfans = require('../controllers/electrical/Fans/VentilationExhaustfansController.js');
const wallMountingfans = require('../controllers/electrical/Fans/WallMountingfansController.js');

// --- ELECTRICALFITTINGS CONTROLLERS IMPORTS ---
const accessories = require('../controllers/electrical/ElectricalFittings/accessoriesControllers.js');
const circularDeepBox = require('../controllers/electrical/ElectricalFittings/circularDeepBoxControllers.js');
const circularSurfaceBox = require('../controllers/electrical/ElectricalFittings/circularSurfaceBoxControllers.js');
const rigidType = require('../controllers/electrical/ElectricalFittings/rigidTypeControllers.js');

const storage = multer.memoryStorage();
const upload = multer({ storage });

function crudRoutes(resource, controller) {
  const createHandler = controller && controller[`create${capitalize(resource)}`];
  const getAllHandler = controller && controller[`getAll${capitalize(resource)}`];
  const getOneHandler = controller && controller[`getOne${capitalize(resource)}`];
  const updateHandler = controller && controller[`update${capitalize(resource)}`];
  const deleteHandler = controller && controller[`delete${capitalize(resource)}`];

  if (!createHandler || !getAllHandler || !getOneHandler || !updateHandler || !deleteHandler) {
    console.error(
      `Missing handler for resource: ${resource}\n` +
      `create: ${!!createHandler}, getAll: ${!!getAllHandler}, getOne: ${!!getOneHandler}, update: ${!!updateHandler}, delete: ${!!deleteHandler}`
    );
    return;
  }

  router.post(`/${resource}/create`, upload.array('photos', 5), createHandler);
  router.get(`/${resource}/get`, getAllHandler);
  router.get(`/${resource}/getOne/:id`, getOneHandler);
  router.put(`/${resource}/Update/:id`, upload.array('photos', 5), updateHandler);
  router.delete(`/${resource}/delete/:id`, deleteHandler);
}

function crudRoutesSimple(resource, controller) {
  const createHandler = controller && controller.create;
  const getAllHandler = controller && controller.getAll;
  const getOneHandler = controller && controller.getOne;
  const updateHandler = controller && controller.update;
  const deleteHandler = controller && controller.delete;

  if (!createHandler || !getAllHandler || !getOneHandler || !updateHandler || !deleteHandler) {
    console.error(
      `Missing handler for resource: ${resource}\n` +
      `create: ${!!createHandler}, getAll: ${!!getAllHandler}, getOne: ${!!getOneHandler}, update: ${!!updateHandler}, delete: ${!!deleteHandler}`
    );
    return;
  }

  router.post(`/${resource}/create`, upload.array('photos', 5), createHandler);
  router.get(`/${resource}/get`, getAllHandler);
  router.get(`/${resource}/getOne/:id`, getOneHandler);
  router.put(`/${resource}/Update/:id`, upload.array('photos', 5), updateHandler);
  router.delete(`/${resource}/delete/:id`, deleteHandler);
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

crudRoutes('adaptors', adaptors);
crudRoutes('ceilingRoses', ceilingRoses);
crudRoutes('wiresAndCables', wiresAndCables);
crudRoutes('waterHeater', waterHeater);
crudRoutes('uniSwitch', uniSwitch);
crudRoutes('tVOutlets', tVOutlets);
crudRoutes('travelAdaptor', travelAdaptor);
crudRoutes('switchPlates', switchPlates);
crudRoutes('switches', switches);
crudRoutes('switchAndSocket', switchAndSocket);
crudRoutes('sockets', sockets);
crudRoutes('rotarySwitch', rotarySwitch);
crudRoutes('regulators', regulators);
crudRoutes('pvCClips', pvCClips);
crudRoutes('powerStrips', powerStrips);
crudRoutes('plug', plug);
crudRoutes('pinTop', pinTop);
crudRoutes('others', others);
crudRoutes('motorStarters', motorStarters);
crudRoutes('motors', motors);
crudRoutes('modularSurfaceBox', modularSurfaceBox);
crudRoutes('mCB', mCB);
crudRoutes('mainSwitch', mainSwitch);
crudRoutes('lights', lights);
crudRoutes('kITKATFuses', kITKATFuses);
crudRoutes('jacks', jacks);
crudRoutes('isolators', isolators);
crudRoutes('insulationTapes', insulationTapes);
crudRoutes('indicator', indicator);
crudRoutes('holders', holders);
crudRoutes('fuseCarriers', fuseCarriers);
crudRoutes('flexibleWires', flexibleWires);
crudRoutes('flexibleConduit', flexibleConduit);
crudRoutes('fan', fan);
crudRoutes('electricalFittings', electricalFittings);
crudRoutes('eLCBsRCCBs', eLCBsRCCBs);
crudRoutes('earthingAccessories', earthingAccessories);
crudRoutes('dPswitch', dPswitch);
crudRoutes('doorBells', doorBells);
crudRoutes('distributionBoards', distributionBoards);
crudRoutes('dimmer', dimmer);

// --- LIGHTS CONTROLLERS ROUTES ---
crudRoutesSimple('ceilinglight', ceilinglight);
crudRoutesSimple('cfl', cFL);
crudRoutesSimple('desklight', deskLight);
crudRoutesSimple('focuslight', focusLight);
crudRoutesSimple('gardenlight', gardenLight);
crudRoutesSimple('gatelight', gateLight);
crudRoutesSimple('gls', gLS);
crudRoutesSimple('home', home);
crudRoutesSimple('lamps', lamps);
crudRoutesSimple('ledbatten', lEDBatten);
crudRoutesSimple('ledbulbs', lEDBulbs);
crudRoutesSimple('leddownlightersspotlight', ledDownLightersSpotLight);
crudRoutesSimple('ledluminaires', lEDLuminaires);
crudRoutesSimple('ledpanellight', lEDPanelLight);
crudRoutesSimple('ledspotlight', lEDSpotlight);
crudRoutesSimple('ledstreetlight', lEDStreetLight);
crudRoutesSimple('ledstrips', lEDStrips);
crudRoutesSimple('ledsurfacelight', ledSurfaceLight);
crudRoutesSimple('lightelectronics', lightElectronics);
crudRoutesSimple('mirrorlight', mirrorLight);
crudRoutesSimple('reflections', reflections);
crudRoutesSimple('standardincandescent', standardIncandescent);
crudRoutesSimple('tbulb', tBulb);
crudRoutesSimple('tubelight', tubeLight);
crudRoutesSimple('underwaterlights', underWaterLights);
crudRoutesSimple('walllight', wallLight);

// --- FANS CONTROLLERS ROUTES ---
crudRoutesSimple('cabinfans', cabinFans);
crudRoutesSimple('ceilingfans', ceilingFans);
crudRoutesSimple('pedestalfans', pedestalfans);
crudRoutesSimple('tablefans', tableFans);
crudRoutesSimple('ventilationexhaustfans', ventilationExhaustfans);
crudRoutesSimple('wallmountingfans', wallMountingfans);

// --- ELECTRICALFITTINGS CONTROLLERS ROUTES ---
crudRoutesSimple('accessories', accessories);
crudRoutesSimple('circulardeepbox', circularDeepBox);
crudRoutesSimple('circularsurfacebox', circularSurfaceBox);
crudRoutesSimple('rigidtype', rigidType);

module.exports = router;
// Aggregate endpoints
router.get('/categories', aggregate.getElectricalCategoriesWithData);
router.post('/first-by-categories', aggregate.getFirstByCategories);
