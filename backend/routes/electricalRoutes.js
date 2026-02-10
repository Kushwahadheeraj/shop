const express = require('express');
const router = express.Router();
const multer = require('multer');

const adaptors = require('../controllers/electrical/AdaptorsController.js');
const ceilingRoses = require('../controllers/electrical/ceilingRosesController.js');
const wiresAndCables = require('../controllers/electrical/WiresAndCablesController.js');
const waterHeater = require('../controllers/electrical/waterHeaterController.js');
const uniSwitch = require('../controllers/electrical/uniSwitchController.js');
const tVOutlets = require('../controllers/electrical/tVOutletsController.js');
const travelAdaptor = require('../controllers/electrical/travelAdaptorController.js');
const switchPlates = require('../controllers/electrical/switchPlatesController.js');
const switches = require('../controllers/electrical/switchesController.js');
const switchAndSocket = require('../controllers/electrical/switchAndSocketController.js');
const sockets = require('../controllers/electrical/socketsController.js');
const rotarySwitch = require('../controllers/electrical/rotarySwitchController.js');
const regulators = require('../controllers/electrical/regulatorsController.js');
const pvCClips = require('../controllers/electrical/pvCClipsController.js');
const powerStrips = require('../controllers/electrical/powerStripsController.js');
const plug = require('../controllers/electrical/plugController.js');
const pinTop = require('../controllers/electrical/pinTopController.js');
const others = require('../controllers/electrical/othersController.js');
const motorStarters = require('../controllers/electrical/motorStartersController.js');
const motors = require('../controllers/electrical/motorsController.js');
const modularSurfaceBox = require('../controllers/electrical/modularSurfaceBoxController.js');
const mCB = require('../controllers/electrical/mCBController.js');
const mainSwitch = require('../controllers/electrical/mainSwitchController.js');
const lights = require('../controllers/electrical/lightsController.js');
const kITKATFuses = require('../controllers/electrical/kITKATFusesController.js');
const jacks = require('../controllers/electrical/jacksController.js');
const isolators = require('../controllers/electrical/isolatorsController.js');
const insulationTapes = require('../controllers/electrical/insulationTapesController.js');
const indicator = require('../controllers/electrical/indicatorController.js');
const holders = require('../controllers/electrical/holdersController.js');
const fuseCarriers = require('../controllers/electrical/fuseCarriersController.js');
const flexibleWires = require('../controllers/electrical/flexibleWiresController.js');
const flexibleConduit = require('../controllers/electrical/flexibleConduitController.js');
const fan = require('../controllers/electrical/fanController.js');
const electricalFittings = require('../controllers/electrical/electricalFittingsController.js');
const eLCBsRCCBs = require('../controllers/electrical/eLCBsRCCBsController.js');
const earthingAccessories = require('../controllers/electrical/earthingAccessoriesController.js');
const dPswitch = require('../controllers/electrical/dPswitchController.js');
const doorBells = require('../controllers/electrical/doorBellsController.js');
const distributionBoards = require('../controllers/electrical/distributionBoardsController.js');
const dimmer = require('../controllers/electrical/dimmerController.js');
const aggregate = require('../controllers/electrical/aggregateController.js');

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
crudRoutes('pVCClips', pvCClips);
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

// General route to get all electrical products
router.get('/', async (req, res) => {
  try {
    const ElectricalModels = require('../models/ElectricalModels');
    const products = await ElectricalModels.find({});
    res.json(products);
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
// Aggregate endpoints
router.get('/categories', aggregate.getElectricalCategoriesWithData);
router.post('/first-by-categories', aggregate.getFirstByCategories);
