const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import all controllers from main directory
const patchFittingsController = require('../controllers/locks/patchFittingsControllers');
const mortiseLockBodyController = require('../controllers/locks/mortiseLockBodyController');
const morticeLocksController = require('../controllers/locks/morticeLocksController');

// Import controllers from doorAccessories
const concealedHingesController = require('../controllers/locks/doorAccessories/ConcealedHingesController');
const doorEyeController = require('../controllers/locks/doorAccessories/DoorEyeController');
const doorStopperController = require('../controllers/locks/doorAccessories/DoorStopperController');
const hingesController = require('../controllers/locks//doorAccessories/HingesController');
const magneticDoorStoppersController = require('../controllers/locks/doorAccessories/MagneticDoorStoppersController');
const woodenSlidingDoorFittingsController = require('../controllers/locks/doorAccessories/WoodenSlidingDoorFittingsController');
const ballBearingDoorHingesController = require('../controllers/locks/doorAccessories/BallBearingDoorHingesController');
const aluminiumTowerBoltController = require('../controllers/locks/doorAccessories/AluminiumTowerBolt');

// Import controllers from doorControls
const doorCloserControllers = require('../controllers/locks/doorControls/DoorCloserControllers');
const doorStopperController2 = require('../controllers/locks/doorControls/DoorStopperController');
const hydraulicDoorClosersController = require('../controllers/locks/doorControls/HydraulicDoorClosersController');

// Import controllers from doorHandles
const doorKingsController = require('../controllers/locks/doorHandles/doorKingsController');
const doorPullsController = require('../controllers/locks/doorHandles/DoorPullsController');

// Import controllers from doorLocks
const dimpleKeyController = require('../controllers/locks/doorLocks/DimpleKeyController');
const diamantPadlocksController = require('../controllers/locks/doorLocks/DiamantPadlocksController');
const deadLocksController = require('../controllers/locks/doorLocks/DeadLocksController');
const cylindricalLocksController = require('../controllers/locks/doorLocks/CylindricalLocksController');
const cupboardLocksController = require('../controllers/locks/doorLocks/CupboardLocksController');
const centreShutterLocksController = require('../controllers/locks/doorLocks/CentreShutterLocksController');
const triBoltLocksController = require('../controllers/locks/doorLocks/TriBoltLocksController');
const smartKeyController = require('../controllers/locks/doorLocks/SmartKeyController');
const sideLockController = require('../controllers/locks/doorLocks/SideLockController');
const rimDeadLockController = require('../controllers/locks/doorLocks/RimDeadLockController');
const pullHandlesForMainDoorsController = require('../controllers/locks/doorLocks/PullHandlesForMainDoorsController');
const nightLatchController = require('../controllers/locks/doorLocks/NightLatchController');
const mainDoorLockController = require('../controllers/locks/doorLocks/MainDoorLockController');
const knobLocksController = require('../controllers/locks/doorLocks/KnobLocksController');
const jemmyProofDoorLockController = require('../controllers/locks/doorLocks/JemmyProofDoorLockController');
const drawerLockController = require('../controllers/locks/doorLocks/DrawerLockController');
const discPadLocksController = require('../controllers/locks/doorLocks/DiscPadLocksController');

// Import controllers from furnitureFittings
const nuvoController = require('../controllers/locks/furnitureFittings/NuvoController');
const multiPurposeLockController = require('../controllers/locks/furnitureFittings/MultiPurposeLockController');
const furnitureFittingsController = require('../controllers/locks/furnitureFittings/furnitureFittingsController');
const drawerLocksController = require('../controllers/locks/furnitureFittings/DrawerLocksController');
const drawerCupboardLockController = require('../controllers/locks/furnitureFittings/DrawerCupboardLockController');
const curvoController = require('../controllers/locks/furnitureFittings/CurvoController');
const supernovaController = require('../controllers/locks/furnitureFittings/SupernovaController');
const tableLockController = require('../controllers/locks/furnitureFittings/TableLockController');

// Import controllers from foldingBrackets
const thickDoorHingeController = require('../controllers/locks/foldingBrackets/ThickDoorHingeController');
const softCloseDrawerChannelController = require('../controllers/locks/foldingBrackets/SoftCloseDrawerChannelController');
const slipOnHingeController = require('../controllers/locks/foldingBrackets/SlipOnHingeController');
const heavyDutyDrawerSlidesController = require('../controllers/locks/foldingBrackets/HeavyDutyDrawerSlidesController');
const foldingBracketsController = require('../controllers/locks/foldingBrackets/foldingBracketsController');
const drawerChannelsController = require('../controllers/locks/foldingBrackets/DrawerChannelsController');
const clipOnSoftHingeController = require('../controllers/locks/foldingBrackets/ClipOnSoftHingeController');
const clipOnSoftHinge4HoleController = require('../controllers/locks/foldingBrackets/ClipOnSoftHinge4HoleController');
const cabinetHingeController = require('../controllers/locks/foldingBrackets/CabinetHingeController');
const blindCornerHingeController = require('../controllers/locks/foldingBrackets/BlindCornerHingeController');

// Import controllers from popularMortiseSeries
const victoriaController = require('../controllers/locks/popularMortiseSeries/VictoriaController');
const towyLowHeightDesignController = require('../controllers/locks/popularMortiseSeries/TowyLowHeightDesignController');
const ssdTypeTubeLeverController = require('../controllers/locks/popularMortiseSeries/SSDTypeTubeLeverController');
const pullHandlesController = require('../controllers/locks/popularMortiseSeries/PullHandlesController');
const popularMortiseSeriesController = require('../controllers/locks/popularMortiseSeries/popularMortiseSeriesController');
const oliverController = require('../controllers/locks/popularMortiseSeries/OliverController');
const neh16Controller = require('../controllers/locks/popularMortiseSeries/NEH16Controller');
const neh15LowHeightDesignController = require('../controllers/locks/popularMortiseSeries/NEH15LowHeightDesignController');
const neh14Controller = require('../controllers/locks/popularMortiseSeries/NEH14Controller');
const neh13Controller = require('../controllers/locks/popularMortiseSeries/NEH13Controller');
const neh12Controller = require('../controllers/locks/popularMortiseSeries/NEH12Controller');
const neh06Controller = require('../controllers/locks/popularMortiseSeries/NEH06Controller');
const neh11Controller = require('../controllers/locks/popularMortiseSeries/NEH11Controller');
const neh10Controller = require('../controllers/locks/popularMortiseSeries/NEH10Controller');
const neh09Controller = require('../controllers/locks/popularMortiseSeries/NEH09Controller');
const neh08Controller = require('../controllers/locks/popularMortiseSeries/NEH08Controller');
const neh07Controller = require('../controllers/locks/popularMortiseSeries/NEH07Controller');
const neh05Controller = require('../controllers/locks/popularMortiseSeries/NEH05Controller');
const neh04Controller = require('../controllers/locks/popularMortiseSeries/NEH04Controller');
const matizController = require('../controllers/locks/popularMortiseSeries/MatizController');
const mainDoorSetController = require('../controllers/locks/popularMortiseSeries/MainDoorSetController');
const gloriaController = require('../controllers/locks/popularMortiseSeries/GloriaController');
const cylindricalLocksController2 = require('../controllers/locks/popularMortiseSeries/CylindricalLocksController');
const cornerFetchSeriesController = require('../controllers/locks/popularMortiseSeries/CornerFetchSeriesController');
const combiSetController = require('../controllers/locks/popularMortiseSeries/CombiSetController');
const classicLockController = require('../controllers/locks/popularMortiseSeries/ClassicLockController');
const bm06Controller = require('../controllers/locks/popularMortiseSeries/BM06Controller');
const bm04Controller = require('../controllers/locks/popularMortiseSeries/BM04Controller');
const bm02Controller = require('../controllers/locks/popularMortiseSeries/BM02Controller');
const bm01Controller = require('../controllers/locks/popularMortiseSeries/BM01Controller');

// Import controllers from premiumMortiseSeries
const sehSeriesController = require('../controllers/locks/premiumMortiseSeries/SEHSeriesController');
const premiumMortiseSeriesController = require('../controllers/locks/premiumMortiseSeries/premiumMortiseSeriesController');
const phoenixController = require('../controllers/locks/premiumMortiseSeries/PhoenixController');
const orbitController = require('../controllers/locks/premiumMortiseSeries/OrbitController');
const mercuryController = require('../controllers/locks/premiumMortiseSeries/MercuryController');
const evva3KSRegalisMortiseController = require('../controllers/locks/premiumMortiseSeries/Evva3KSRegalisMortiseController');
const europrofileBrassHandleSet240mmController = require('../controllers/locks/premiumMortiseSeries/EuroprofileBrassHandleSet240mmController');
const combipackWith240mmEuroMortiseLockController = require('../controllers/locks/premiumMortiseSeries/CombipackWith240mmEuroMortiseLockController');
const allureRossetteSeriesController = require('../controllers/locks/premiumMortiseSeries/AllureRossetteSeriesController');

// Import controllers from leverMortiseLocks
const leverMortiseLocksController = require('../controllers/locks/leverMortiseLocks/leverMortiseLocksController');
const exshiSecurityCylindersController = require('../controllers/locks/leverMortiseLocks/EXSHISecurityCylindersController');
const europrofileMortisePinCylinderWithMasterKeyController = require('../controllers/locks/leverMortiseLocks/EuroprofileMortisePinCylinderWithMasterKeyController');
const europrofileMortisePinCylinderController = require('../controllers/locks/leverMortiseLocks/EuroprofileMortisePinCylinderController');
const europrofileMortiseLockBodiesController = require('../controllers/locks/leverMortiseLocks/EuroprofileMortiseLockBodiesController');
const combipackWith6LeverMortiseLockController = require('../controllers/locks/leverMortiseLocks/CombipackWith6LeverMortiseLockController');

// Import controllers from glassHardware
const slidingSystemController = require('../controllers/locks/glassHardware/SlidingSystemController');
const showerCubicleHingeController = require('../controllers/locks/glassHardware/ShowerCubicleHingeController');
const glassHardwareController = require('../controllers/locks/glassHardware/glassHardwareController');
const glassDoorPullHandleController = require('../controllers/locks/glassHardware/GlassDoorPullHandleController');
const glassDoorLockController = require('../controllers/locks/glassHardware/GlassDoorLockController');
const glassDoorFittingController = require('../controllers/locks/glassHardware/GlassDoorFittingController');
const floorSpringController = require('../controllers/locks/glassHardware/FloorSpringController');
const floorSpringComboSetController = require('../controllers/locks/glassHardware/FloorSpringComboSetController');

// Import controllers from rimLocks
const ultraXLVertiboltController = require('../controllers/locks/rimLocks/UltraXLVertiboltController');
const ultraXLTwinboltController = require('../controllers/locks/rimLocks/UltraXLTwinboltController');
const ultraXLTriboltController = require('../controllers/locks/rimLocks/UltraXLTriboltController');
const ultraXLRimDeadboltController = require('../controllers/locks/rimLocks/UltraXLRimDeadboltController');
const ultraVertiboltController = require('../controllers/locks/rimLocks/UltraVertiboltController');
const ultraTriboltController = require('../controllers/locks/rimLocks/UltraTriboltController');
const ultraRetrofitAdaptorController = require('../controllers/locks/rimLocks/UltraRetrofitAdaptorController');
const ultraLatchboltCartonController = require('../controllers/locks/rimLocks/UltraLatchboltCartonController');
const rimLocksController = require('../controllers/locks/rimLocks/rimLocksController');
const pinCylinderRimLocksController = require('../controllers/locks/rimLocks/PinCylinderRimLocksController');
const pentaboltAriesController = require('../controllers/locks/rimLocks/PentaboltAriesController');
const nightLatch7LeverController = require('../controllers/locks/rimLocks/NightLatch7LeverController');
const exsAstroController = require('../controllers/locks/rimLocks/EXSAstroController');
const exsAltrixController = require('../controllers/locks/rimLocks/EXSAltrixController');

// Import controllers from padlocks
const ultraShutterLocksController = require('../controllers/locks/padlocks/UltraShutterLocksController');
const squareTypePadlockController = require('../controllers/locks/padlocks/SquareTypePadlockController');
const roundTypePadlockController = require('../controllers/locks/padlocks/RoundTypePadlockController');
const premiumPadlocksController = require('../controllers/locks/padlocks/PremiumPadlocksController');
const padlocksController = require('../controllers/locks/padlocks/padlocksController');
const discPadlocksController = require('../controllers/locks/padlocks/DiscPadlocksController');

// Helper for CRUD routes
function crudRoutes(resource, controller, resourceName) {
  router.post(`/${resource}/create`, upload.array('photos', 5), controller[`create${resourceName}`]);
  router.get(`/${resource}/get`, controller[`getAll${resourceName}`]);
  router.get(`/${resource}/getOne/:id`, controller[`getOne${resourceName}`]);
  router.put(`/${resource}/Update/:id`, upload.array('photos', 5), controller[`update${resourceName}`]);
  router.delete(`/${resource}/delete/:id`, controller[`delete${resourceName}`]);
}

// Register all routes
// Main directory controllers
crudRoutes('patch-fittings', patchFittingsController, 'PatchFittings');
crudRoutes('mortise-lock-body', mortiseLockBodyController, 'MortiseLockBody');
crudRoutes('mortice-locks', morticeLocksController, 'MorticeLocks');

// Door Accessories
crudRoutes('door-accessories/concealed-hinges', concealedHingesController, 'ConcealedHinges');
crudRoutes('door-accessories/door-eye', doorEyeController, 'DoorEye');
crudRoutes('door-accessories/door-stopper', doorStopperController, 'DoorStopper');
crudRoutes('door-accessories/hinges', hingesController, 'Hinges');
crudRoutes('door-accessories/magnetic-door-stoppers', magneticDoorStoppersController, 'MagneticDoorStoppers');
crudRoutes('door-accessories/wooden-sliding-door-fittings', woodenSlidingDoorFittingsController, 'WoodenSlidingDoorFittings');
crudRoutes('door-accessories/ball-bearing-door-hinges', ballBearingDoorHingesController, 'BallBearingDoorHinges');
crudRoutes('door-accessories/aluminium-tower-bolt', aluminiumTowerBoltController, 'AluminiumTowerBolt');

// Door Controls
crudRoutes('door-controls/door-closer', doorCloserControllers, 'DoorCloser');
crudRoutes('door-controls/door-stopper', doorStopperController2, 'DoorStopper');
crudRoutes('door-controls/hydraulic-door-closers', hydraulicDoorClosersController, 'HydraulicDoorClosers');

// Door Handles
crudRoutes('door-handles/door-kings', doorKingsController, 'DoorKings');
crudRoutes('door-handles/door-pulls', doorPullsController, 'DoorPulls');

// Door Locks
crudRoutes('door-locks/dimple-key', dimpleKeyController, 'DimpleKey');
crudRoutes('door-locks/diamant-padlocks', diamantPadlocksController, 'DiamantPadlocks');
crudRoutes('door-locks/dead-locks', deadLocksController, 'DeadLocks');
crudRoutes('door-locks/cylindrical-locks', cylindricalLocksController, 'CylindricalLocks');
crudRoutes('door-locks/cupboard-locks', cupboardLocksController, 'CupboardLocks');
crudRoutes('door-locks/centre-shutter-locks', centreShutterLocksController, 'CentreShutterLocks');
crudRoutes('door-locks/tri-bolt-locks', triBoltLocksController, 'TriBoltLocks');
crudRoutes('door-locks/smart-key', smartKeyController, 'SmartKey');
crudRoutes('door-locks/side-lock', sideLockController, 'SideLock');
crudRoutes('door-locks/rim-dead-lock', rimDeadLockController, 'RimDeadLock');
crudRoutes('door-locks/pull-handles-for-main-doors', pullHandlesForMainDoorsController, 'PullHandlesForMainDoors');
crudRoutes('door-locks/night-latch', nightLatchController, 'NightLatch');
crudRoutes('door-locks/main-door-lock', mainDoorLockController, 'MainDoorLock');
crudRoutes('door-locks/knob-locks', knobLocksController, 'KnobLocks');
crudRoutes('door-locks/jemmy-proof-door-lock', jemmyProofDoorLockController, 'JemmyProofDoorLock');
crudRoutes('door-locks/drawer-lock', drawerLockController, 'DrawerLock');
crudRoutes('door-locks/disc-pad-locks', discPadLocksController, 'DiscPadLocks');

// Furniture Fittings
crudRoutes('furniture-fittings/nuvo', nuvoController, 'Nuvo');
crudRoutes('furniture-fittings/multi-purpose-lock', multiPurposeLockController, 'MultiPurposeLock');
crudRoutes('furniture-fittings/furniture-fittings', furnitureFittingsController, 'FurnitureFittings');
crudRoutes('furniture-fittings/drawer-locks', drawerLocksController, 'DrawerLocks');
crudRoutes('furniture-fittings/drawer-cupboard-lock', drawerCupboardLockController, 'DrawerCupboardLock');
crudRoutes('furniture-fittings/curvo', curvoController, 'Curvo');
crudRoutes('furniture-fittings/supernova', supernovaController, 'Supernova');
crudRoutes('furniture-fittings/table-lock', tableLockController, 'TableLock');

// Folding Brackets
crudRoutes('folding-brackets/thick-door-hinge', thickDoorHingeController, 'ThickDoorHinge');
crudRoutes('folding-brackets/soft-close-drawer-channel', softCloseDrawerChannelController, 'SoftCloseDrawerChannel');
crudRoutes('folding-brackets/slip-on-hinge', slipOnHingeController, 'SlipOnHinge');
crudRoutes('folding-brackets/heavy-duty-drawer-slides', heavyDutyDrawerSlidesController, 'HeavyDutyDrawerSlides');
crudRoutes('folding-brackets/folding-brackets', foldingBracketsController, 'FoldingBrackets');
crudRoutes('folding-brackets/drawer-channels', drawerChannelsController, 'DrawerChannels');
crudRoutes('folding-brackets/clip-on-soft-hinge', clipOnSoftHingeController, 'ClipOnSoftHinge');
crudRoutes('folding-brackets/clip-on-soft-hinge-4-hole', clipOnSoftHinge4HoleController, 'ClipOnSoftHinge4Hole');
crudRoutes('folding-brackets/cabinet-hinge', cabinetHingeController, 'CabinetHinge');
crudRoutes('folding-brackets/blind-corner-hinge', blindCornerHingeController, 'BlindCornerHinge');

// Popular Mortise Series
crudRoutes('popular-mortise-series/victoria', victoriaController, 'Victoria');
crudRoutes('popular-mortise-series/towy-low-height-design', towyLowHeightDesignController, 'TowyLowHeightDesign');
crudRoutes('popular-mortise-series/ssd-type-tube-lever', ssdTypeTubeLeverController, 'SSDTypeTubeLever');
crudRoutes('popular-mortise-series/pull-handles', pullHandlesController, 'PullHandles');
crudRoutes('popular-mortise-series/popular-mortise-series', popularMortiseSeriesController, 'PopularMortiseSeries');
crudRoutes('popular-mortise-series/oliver', oliverController, 'Oliver');
crudRoutes('popular-mortise-series/neh16', neh16Controller, 'NEH16');
crudRoutes('popular-mortise-series/neh15-low-height-design', neh15LowHeightDesignController, 'NEH15LowHeightDesign');
crudRoutes('popular-mortise-series/neh14', neh14Controller, 'NEH14');
crudRoutes('popular-mortise-series/neh13', neh13Controller, 'NEH13');
crudRoutes('popular-mortise-series/neh12', neh12Controller, 'NEH12');
crudRoutes('popular-mortise-series/neh06', neh06Controller, 'NEH06');
crudRoutes('popular-mortise-series/neh11', neh11Controller, 'NEH11');
crudRoutes('popular-mortise-series/neh10', neh10Controller, 'NEH10');
crudRoutes('popular-mortise-series/neh09', neh09Controller, 'NEH09');
crudRoutes('popular-mortise-series/neh08', neh08Controller, 'NEH08');
crudRoutes('popular-mortise-series/neh07', neh07Controller, 'NEH07');
crudRoutes('popular-mortise-series/neh05', neh05Controller, 'NEH05');
crudRoutes('popular-mortise-series/neh04', neh04Controller, 'NEH04');
crudRoutes('popular-mortise-series/matiz', matizController, 'Matiz');
crudRoutes('popular-mortise-series/main-door-set', mainDoorSetController, 'MainDoorSet');
crudRoutes('popular-mortise-series/gloria', gloriaController, 'Gloria');
crudRoutes('popular-mortise-series/cylindrical-locks', cylindricalLocksController2, 'CylindricalLocks');
crudRoutes('popular-mortise-series/corner-fetch-series', cornerFetchSeriesController, 'CornerFetchSeries');
crudRoutes('popular-mortise-series/combi-set', combiSetController, 'CombiSet');
crudRoutes('popular-mortise-series/classic-lock', classicLockController, 'ClassicLock');
crudRoutes('popular-mortise-series/bm06', bm06Controller, 'BM06');
crudRoutes('popular-mortise-series/bm04', bm04Controller, 'BM04');
crudRoutes('popular-mortise-series/bm02', bm02Controller, 'BM02');
crudRoutes('popular-mortise-series/bm01', bm01Controller, 'BM01');

// Premium Mortise Series
crudRoutes('premium-mortise-series/seh-series', sehSeriesController, 'SEHSeries');
crudRoutes('premium-mortise-series/premium-mortise-series', premiumMortiseSeriesController, 'PremiumMortiseSeries');
crudRoutes('premium-mortise-series/phoenix', phoenixController, 'Phoenix');
crudRoutes('premium-mortise-series/orbit', orbitController, 'Orbit');
crudRoutes('premium-mortise-series/mercury', mercuryController, 'Mercury');
crudRoutes('premium-mortise-series/evva3ks-regalis-mortise', evva3KSRegalisMortiseController, 'Evva3KSRegalisMortise');
crudRoutes('premium-mortise-series/europrofile-brass-handle-set-240mm', europrofileBrassHandleSet240mmController, 'EuroprofileBrassHandleSet240mm');
crudRoutes('premium-mortise-series/combipack-with-240mm-euro-mortise-lock', combipackWith240mmEuroMortiseLockController, 'CombipackWith240mmEuroMortiseLock');
crudRoutes('premium-mortise-series/allure-rossette-series', allureRossetteSeriesController, 'AllureRossetteSeries');

// Lever Mortise Locks
crudRoutes('lever-mortise-locks/lever-mortise-locks', leverMortiseLocksController, 'LeverMortiseLocks');
crudRoutes('lever-mortise-locks/exshi-security-cylinders', exshiSecurityCylindersController, 'EXSHISecurityCylinders');
crudRoutes('lever-mortise-locks/europrofile-mortise-pin-cylinder-with-master-key', europrofileMortisePinCylinderWithMasterKeyController, 'EuroprofileMortisePinCylinderWithMasterKey');
crudRoutes('lever-mortise-locks/europrofile-mortise-pin-cylinder', europrofileMortisePinCylinderController, 'EuroprofileMortisePinCylinder');
crudRoutes('lever-mortise-locks/europrofile-mortise-lock-bodies', europrofileMortiseLockBodiesController, 'EuroprofileMortiseLockBodies');
crudRoutes('lever-mortise-locks/combipack-with-6-lever-mortise-lock', combipackWith6LeverMortiseLockController, 'CombipackWith6LeverMortiseLock');

// Glass Hardware
crudRoutes('glass-hardware/sliding-system', slidingSystemController, 'SlidingSystem');
crudRoutes('glass-hardware/shower-cubicle-hinge', showerCubicleHingeController, 'ShowerCubicleHinge');
crudRoutes('glass-hardware/glass-hardware', glassHardwareController, 'GlassHardware');
crudRoutes('glass-hardware/glass-door-pull-handle', glassDoorPullHandleController, 'GlassDoorPullHandle');
crudRoutes('glass-hardware/glass-door-lock', glassDoorLockController, 'GlassDoorLock');
crudRoutes('glass-hardware/glass-door-fitting', glassDoorFittingController, 'GlassDoorFitting');
crudRoutes('glass-hardware/floor-spring', floorSpringController, 'FloorSpring');
crudRoutes('glass-hardware/floor-spring-combo-set', floorSpringComboSetController, 'FloorSpringComboSet');

// Rim Locks
crudRoutes('rim-locks/ultra-xl-vertibolt', ultraXLVertiboltController, 'UltraXLVertibolt');
crudRoutes('rim-locks/ultra-xl-twinbolt', ultraXLTwinboltController, 'UltraXLTwinbolt');
crudRoutes('rim-locks/ultra-xl-tribolt', ultraXLTriboltController, 'UltraXLTribolt');
crudRoutes('rim-locks/ultra-xl-rim-deadbolt', ultraXLRimDeadboltController, 'UltraXLRimDeadbolt');
crudRoutes('rim-locks/ultra-vertibolt', ultraVertiboltController, 'UltraVertibolt');
crudRoutes('rim-locks/ultra-tribolt', ultraTriboltController, 'UltraTribolt');
crudRoutes('rim-locks/ultra-retrofit-adaptor', ultraRetrofitAdaptorController, 'UltraRetrofitAdaptor');
crudRoutes('rim-locks/ultra-latchbolt-carton', ultraLatchboltCartonController, 'UltraLatchboltCarton');
crudRoutes('rim-locks/rim-locks', rimLocksController, 'RimLocks');
crudRoutes('rim-locks/pin-cylinder-rim-locks', pinCylinderRimLocksController, 'PinCylinderRimLocks');
crudRoutes('rim-locks/pentabolt-aries', pentaboltAriesController, 'PentaboltAries');
crudRoutes('rim-locks/night-latch-7-lever', nightLatch7LeverController, 'NightLatch7Lever');
crudRoutes('rim-locks/exs-astro', exsAstroController, 'EXSAstro');
crudRoutes('rim-locks/exs-altrix', exsAltrixController, 'EXSAltrix');

// Padlocks
crudRoutes('padlocks/ultra-shutter-locks', ultraShutterLocksController, 'UltraShutterLocks');
crudRoutes('padlocks/square-type-padlock', squareTypePadlockController, 'SquareTypePadlock');
crudRoutes('padlocks/round-type-padlock', roundTypePadlockController, 'RoundTypePadlock');
crudRoutes('padlocks/premium-padlocks', premiumPadlocksController, 'PremiumPadlocks');
crudRoutes('padlocks/padlocks', padlocksController, 'Padlocks');
crudRoutes('padlocks/disc-padlocks', discPadlocksController, 'DiscPadlocks');

module.exports = router;