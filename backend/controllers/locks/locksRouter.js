const express = require('express');
const router = express.Router();

// Import all controllers from main directory
const patchFittingsController = require('./patchFittingsControllers');
const mortiseLockBodyController = require('./mortiseLockBodyController');
const morticeLocksController = require('./morticeLocksController');
const foldingBracketsController = require('./foldingBracketsController');

// Import controllers from doorAccessories
const concealedHingesController = require('./doorAccessories/ConcealedHingesController');
const doorEyeController = require('./doorAccessories/DoorEyeController');
const doorStopperController = require('./doorAccessories/DoorStopperController');
const hingesController = require('./doorAccessories/HingesController');
const magneticDoorStoppersController = require('./doorAccessories/MagneticDoorStoppersController');
const woodenSlidingDoorFittingsController = require('./doorAccessories/WoodenSlidingDoorFittingsController');
const ballBearingDoorHingesController = require('./doorAccessories/BallBearingDoorHingesController');

// Import controllers from doorControls
const doorCloserControllers = require('./doorControls/DoorCloserControllers');
const doorStopperController2 = require('./doorControls/DoorStopperController');
const hydraulicDoorClosersController = require('./doorControls/HydraulicDoorClosersController');

// Import controllers from doorHandles
const doorKingsController = require('./doorHandles/doorKingsController');
const doorPullsController = require('./doorHandles/DoorPullsController');

// Import controllers from doorLocks
const dimpleKeyController = require('./doorLocks/DimpleKeyController');
const diamantPadlocksController = require('./doorLocks/DiamantPadlocksController');
const deadLocksController = require('./doorLocks/DeadLocksController');
const cylindricalLocksController = require('./doorLocks/CylindricalLocksController');
const cupboardLocksController = require('./doorLocks/CupboardLocksController');
const centreShutterLocksController = require('./doorLocks/CentreShutterLocksController');
const triBoltLocksController = require('./doorLocks/TriBoltLocksController');
const smartKeyController = require('./doorLocks/SmartKeyController');
const sideLockController = require('./doorLocks/SideLockController');
const rimDeadLockController = require('./doorLocks/RimDeadLockController');
const pullHandlesForMainDoorsController = require('./doorLocks/PullHandlesForMainDoorsController');
const nightLatchController = require('./doorLocks/NightLatchController');
const mainDoorLockController = require('./doorLocks/MainDoorLockController');
const knobLocksController = require('./doorLocks/KnobLocksController');
const jemmyProofDoorLockController = require('./doorLocks/JemmyProofDoorLockController');
const drawerLockController = require('./doorLocks/DrawerLockController');
const discPadLocksController = require('./doorLocks/DiscPadLocksController');

// Import controllers from furnitureFittings
const nuvoController = require('./furnitureFittings/NuvoController');
const multiPurposeLockController = require('./furnitureFittings/MultiPurposeLockController');
const furnitureFittingsController = require('./furnitureFittings/furnitureFittingsController');
const drawerLocksController = require('./furnitureFittings/DrawerLocksController');
const drawerCupboardLockController = require('./furnitureFittings/DrawerCupboardLockController');
const curvoController = require('./furnitureFittings/CurvoController');
const supernovaController = require('./furnitureFittings/SupernovaController');
const tableLockController = require('./furnitureFittings/TableLockController');

// Import controllers from foldingBrackets
const thickDoorHingeController = require('./foldingBrackets/ThickDoorHingeController');
const softCloseDrawerChannelController = require('./foldingBrackets/SoftCloseDrawerChannelController');
const slipOnHingeController = require('./foldingBrackets/SlipOnHingeController');
const heavyDutyDrawerSlidesController = require('./foldingBrackets/HeavyDutyDrawerSlidesController');
const foldingBracketsController = require('./foldingBrackets/foldingBracketsController');
const drawerChannelsController = require('./foldingBrackets/DrawerChannelsController');
const clipOnSoftHingeController = require('./foldingBrackets/ClipOnSoftHingeController');
const clipOnSoftHinge4HoleController = require('./foldingBrackets/ClipOnSoftHinge4HoleController');
const cabinetHingeController = require('./foldingBrackets/CabinetHingeController');
const blindCornerHingeController = require('./foldingBrackets/BlindCornerHingeController');

// Import controllers from popularMortiseSeries
const victoriaController = require('./popularMortiseSeries/VictoriaController');
const towyLowHeightDesignController = require('./popularMortiseSeries/TowyLowHeightDesignController');
const ssdTypeTubeLeverController = require('./popularMortiseSeries/SSDTypeTubeLeverController');
const pullHandlesController = require('./popularMortiseSeries/PullHandlesController');
const popularMortiseSeriesController = require('./popularMortiseSeries/popularMortiseSeriesController');
const oliverController = require('./popularMortiseSeries/OliverController');
const neh16Controller = require('./popularMortiseSeries/NEH16Controller');
const neh15LowHeightDesignController = require('./popularMortiseSeries/NEH15LowHeightDesignController');
const neh14Controller = require('./popularMortiseSeries/NEH14Controller');
const neh13Controller = require('./popularMortiseSeries/NEH13Controller');
const neh12Controller = require('./popularMortiseSeries/NEH12Controller');
const neh06Controller = require('./popularMortiseSeries/NEH06Controller');
const neh11Controller = require('./popularMortiseSeries/NEH11Controller');
const neh10Controller = require('./popularMortiseSeries/NEH10Controller');
const neh09Controller = require('./popularMortiseSeries/NEH09Controller');
const neh08Controller = require('./popularMortiseSeries/NEH08Controller');
const neh07Controller = require('./popularMortiseSeries/NEH07Controller');
const neh05Controller = require('./popularMortiseSeries/NEH05Controller');
const neh04Controller = require('./popularMortiseSeries/NEH04Controller');
const matizController = require('./popularMortiseSeries/MatizController');
const mainDoorSetController = require('./popularMortiseSeries/MainDoorSetController');
const gloriaController = require('./popularMortiseSeries/GloriaController');
const cylindricalLocksController2 = require('./popularMortiseSeries/CylindricalLocksController');
const cornerFetchSeriesController = require('./popularMortiseSeries/CornerFetchSeriesController');
const combiSetController = require('./popularMortiseSeries/CombiSetController');
const classicLockController = require('./popularMortiseSeries/ClassicLockController');
const bm06Controller = require('./popularMortiseSeries/BM06Controller');
const bm04Controller = require('./popularMortiseSeries/BM04Controller');
const bm02Controller = require('./popularMortiseSeries/BM02Controller');
const bm01Controller = require('./popularMortiseSeries/BM01Controller');

// Import controllers from premiumMortiseSeries
const sehSeriesController = require('./premiumMortiseSeries/SEHSeriesController');
const premiumMortiseSeriesController = require('./premiumMortiseSeries/premiumMortiseSeriesController');
const phoenixController = require('./premiumMortiseSeries/PhoenixController');
const orbitController = require('./premiumMortiseSeries/OrbitController');
const mercuryController = require('./premiumMortiseSeries/MercuryController');
const evva3KSRegalisMortiseController = require('./premiumMortiseSeries/Evva3KSRegalisMortiseController');
const europrofileBrassHandleSet240mmController = require('./premiumMortiseSeries/EuroprofileBrassHandleSet240mmController');
const combipackWith240mmEuroMortiseLockController = require('./premiumMortiseSeries/CombipackWith240mmEuroMortiseLockController');
const allureRossetteSeriesController = require('./premiumMortiseSeries/AllureRossetteSeriesController');

// Import controllers from leverMortiseLocks
const leverMortiseLocksController = require('./leverMortiseLocks/leverMortiseLocksController');
const exshiSecurityCylindersController = require('./leverMortiseLocks/EXSHISecurityCylindersController');
const europrofileMortisePinCylinderWithMasterKeyController = require('./leverMortiseLocks/EuroprofileMortisePinCylinderWithMasterKeyController');
const europrofileMortisePinCylinderController = require('./leverMortiseLocks/EuroprofileMortisePinCylinderController');
const europrofileMortiseLockBodiesController = require('./leverMortiseLocks/EuroprofileMortiseLockBodiesController');
const combipackWith6LeverMortiseLockController = require('./leverMortiseLocks/CombipackWith6LeverMortiseLockController');

// Import controllers from glassHardware
const slidingSystemController = require('./glassHardware/SlidingSystemController');
const showerCubicleHingeController = require('./glassHardware/ShowerCubicleHingeController');
const glassHardwareController = require('./glassHardware/glassHardwareController');
const glassDoorPullHandleController = require('./glassHardware/GlassDoorPullHandleController');
const glassDoorLockController = require('./glassHardware/GlassDoorLockController');
const glassDoorFittingController = require('./glassHardware/GlassDoorFittingController');
const floorSpringController = require('./glassHardware/FloorSpringController');
const floorSpringComboSetController = require('./glassHardware/FloorSpringComboSetController');

// Import controllers from rimLocks
const ultraXLVertiboltController = require('./rimLocks/UltraXLVertiboltController');
const ultraXLTwinboltController = require('./rimLocks/UltraXLTwinboltController');
const ultraXLTriboltController = require('./rimLocks/UltraXLTriboltController');
const ultraXLRimDeadboltController = require('./rimLocks/UltraXLRimDeadboltController');
const ultraVertiboltController = require('./rimLocks/UltraVertiboltController');
const ultraTriboltController = require('./rimLocks/UltraTriboltController');
const ultraRetrofitAdaptorController = require('./rimLocks/UltraRetrofitAdaptorController');
const ultraLatchboltCartonController = require('./rimLocks/UltraLatchboltCartonController');
const rimLocksController = require('./rimLocks/rimLocksController');
const pinCylinderRimLocksController = require('./rimLocks/PinCylinderRimLocksController');
const pentaboltAriesController = require('./rimLocks/PentaboltAriesController');
const nightLatch7LeverController = require('./rimLocks/NightLatch7LeverController');
const exsAstroController = require('./rimLocks/EXSAstroController');
const exsAltrixController = require('./rimLocks/EXSAltrixController');

// Import controllers from padlocks
const ultraShutterLocksController = require('./padlocks/UltraShutterLocksController');
const squareTypePadlockController = require('./padlocks/SquareTypePadlockController');
const roundTypePadlockController = require('./padlocks/RoundTypePadlockController');
const premiumPadlocksController = require('./padlocks/PremiumPadlocksController');
const padlocksController = require('./padlocks/padlocksController');
const discPadlocksController = require('./padlocks/DiscPadlocksController');

// Helper function to register CRUD routes
function registerCrudRoutes(path, controller, controllerName) {
  router.post(`/${path}`, controller[`create${controllerName}`]);
  router.get(`/${path}`, controller[`getAll${controllerName}`]);
  router.get(`/${path}/:id`, controller[`get${controllerName}ById`]);
  router.put(`/${path}/:id`, controller[`update${controllerName}`]);
  router.delete(`/${path}/:id`, controller[`delete${controllerName}`]);
}

// Register all routes
// Main directory controllers
registerCrudRoutes('patch-fittings', patchFittingsController, 'PatchFittings');
registerCrudRoutes('mortise-lock-body', mortiseLockBodyController, 'MortiseLockBody');
registerCrudRoutes('mortice-locks', morticeLocksController, 'MorticeLocks');
registerCrudRoutes('folding-brackets', foldingBracketsController, 'FoldingBrackets');

// Door Accessories
registerCrudRoutes('door-accessories/concealed-hinges', concealedHingesController, 'ConcealedHinges');
registerCrudRoutes('door-accessories/door-eye', doorEyeController, 'DoorEye');
registerCrudRoutes('door-accessories/door-stopper', doorStopperController, 'DoorStopper');
registerCrudRoutes('door-accessories/hinges', hingesController, 'Hinges');
registerCrudRoutes('door-accessories/magnetic-door-stoppers', magneticDoorStoppersController, 'MagneticDoorStoppers');
registerCrudRoutes('door-accessories/wooden-sliding-door-fittings', woodenSlidingDoorFittingsController, 'WoodenSlidingDoorFittings');
registerCrudRoutes('door-accessories/ball-bearing-door-hinges', ballBearingDoorHingesController, 'BallBearingDoorHinges');

// Door Controls
registerCrudRoutes('door-controls/door-closer', doorCloserControllers, 'DoorCloser');
registerCrudRoutes('door-controls/door-stopper', doorStopperController2, 'DoorStopper');
registerCrudRoutes('door-controls/hydraulic-door-closers', hydraulicDoorClosersController, 'HydraulicDoorClosers');

// Door Handles
registerCrudRoutes('door-handles/door-kings', doorKingsController, 'DoorKings');
registerCrudRoutes('door-handles/door-pulls', doorPullsController, 'DoorPulls');

// Door Locks
registerCrudRoutes('door-locks/dimple-key', dimpleKeyController, 'DimpleKey');
registerCrudRoutes('door-locks/diamant-padlocks', diamantPadlocksController, 'DiamantPadlocks');
registerCrudRoutes('door-locks/dead-locks', deadLocksController, 'DeadLocks');
registerCrudRoutes('door-locks/cylindrical-locks', cylindricalLocksController, 'CylindricalLocks');
registerCrudRoutes('door-locks/cupboard-locks', cupboardLocksController, 'CupboardLocks');
registerCrudRoutes('door-locks/centre-shutter-locks', centreShutterLocksController, 'CentreShutterLocks');
registerCrudRoutes('door-locks/tri-bolt-locks', triBoltLocksController, 'TriBoltLocks');
registerCrudRoutes('door-locks/smart-key', smartKeyController, 'SmartKey');
registerCrudRoutes('door-locks/side-lock', sideLockController, 'SideLock');
registerCrudRoutes('door-locks/rim-dead-lock', rimDeadLockController, 'RimDeadLock');
registerCrudRoutes('door-locks/pull-handles-for-main-doors', pullHandlesForMainDoorsController, 'PullHandlesForMainDoors');
registerCrudRoutes('door-locks/night-latch', nightLatchController, 'NightLatch');
registerCrudRoutes('door-locks/main-door-lock', mainDoorLockController, 'MainDoorLock');
registerCrudRoutes('door-locks/knob-locks', knobLocksController, 'KnobLocks');
registerCrudRoutes('door-locks/jemmy-proof-door-lock', jemmyProofDoorLockController, 'JemmyProofDoorLock');
registerCrudRoutes('door-locks/drawer-lock', drawerLockController, 'DrawerLock');
registerCrudRoutes('door-locks/disc-pad-locks', discPadLocksController, 'DiscPadLocks');

// Furniture Fittings
registerCrudRoutes('furniture-fittings/nuvo', nuvoController, 'Nuvo');
registerCrudRoutes('furniture-fittings/multi-purpose-lock', multiPurposeLockController, 'MultiPurposeLock');
registerCrudRoutes('furniture-fittings/furniture-fittings', furnitureFittingsController, 'FurnitureFittings');
registerCrudRoutes('furniture-fittings/drawer-locks', drawerLocksController, 'DrawerLocks');
registerCrudRoutes('furniture-fittings/drawer-cupboard-lock', drawerCupboardLockController, 'DrawerCupboardLock');
registerCrudRoutes('furniture-fittings/curvo', curvoController, 'Curvo');
registerCrudRoutes('furniture-fittings/supernova', supernovaController, 'Supernova');
registerCrudRoutes('furniture-fittings/table-lock', tableLockController, 'TableLock');

// Folding Brackets
registerCrudRoutes('folding-brackets/thick-door-hinge', thickDoorHingeController, 'ThickDoorHinge');
registerCrudRoutes('folding-brackets/soft-close-drawer-channel', softCloseDrawerChannelController, 'SoftCloseDrawerChannel');
registerCrudRoutes('folding-brackets/slip-on-hinge', slipOnHingeController, 'SlipOnHinge');
registerCrudRoutes('folding-brackets/heavy-duty-drawer-slides', heavyDutyDrawerSlidesController, 'HeavyDutyDrawerSlides');
registerCrudRoutes('folding-brackets/folding-brackets', foldingBracketsController, 'FoldingBrackets');
registerCrudRoutes('folding-brackets/drawer-channels', drawerChannelsController, 'DrawerChannels');
registerCrudRoutes('folding-brackets/clip-on-soft-hinge', clipOnSoftHingeController, 'ClipOnSoftHinge');
registerCrudRoutes('folding-brackets/clip-on-soft-hinge-4-hole', clipOnSoftHinge4HoleController, 'ClipOnSoftHinge4Hole');
registerCrudRoutes('folding-brackets/cabinet-hinge', cabinetHingeController, 'CabinetHinge');
registerCrudRoutes('folding-brackets/blind-corner-hinge', blindCornerHingeController, 'BlindCornerHinge');

// Popular Mortise Series
registerCrudRoutes('popular-mortise-series/victoria', victoriaController, 'Victoria');
registerCrudRoutes('popular-mortise-series/towy-low-height-design', towyLowHeightDesignController, 'TowyLowHeightDesign');
registerCrudRoutes('popular-mortise-series/ssd-type-tube-lever', ssdTypeTubeLeverController, 'SSDTypeTubeLever');
registerCrudRoutes('popular-mortise-series/pull-handles', pullHandlesController, 'PullHandles');
registerCrudRoutes('popular-mortise-series/popular-mortise-series', popularMortiseSeriesController, 'PopularMortiseSeries');
registerCrudRoutes('popular-mortise-series/oliver', oliverController, 'Oliver');
registerCrudRoutes('popular-mortise-series/neh16', neh16Controller, 'NEH16');
registerCrudRoutes('popular-mortise-series/neh15-low-height-design', neh15LowHeightDesignController, 'NEH15LowHeightDesign');
registerCrudRoutes('popular-mortise-series/neh14', neh14Controller, 'NEH14');
registerCrudRoutes('popular-mortise-series/neh13', neh13Controller, 'NEH13');
registerCrudRoutes('popular-mortise-series/neh12', neh12Controller, 'NEH12');
registerCrudRoutes('popular-mortise-series/neh06', neh06Controller, 'NEH06');
registerCrudRoutes('popular-mortise-series/neh11', neh11Controller, 'NEH11');
registerCrudRoutes('popular-mortise-series/neh10', neh10Controller, 'NEH10');
registerCrudRoutes('popular-mortise-series/neh09', neh09Controller, 'NEH09');
registerCrudRoutes('popular-mortise-series/neh08', neh08Controller, 'NEH08');
registerCrudRoutes('popular-mortise-series/neh07', neh07Controller, 'NEH07');
registerCrudRoutes('popular-mortise-series/neh05', neh05Controller, 'NEH05');
registerCrudRoutes('popular-mortise-series/neh04', neh04Controller, 'NEH04');
registerCrudRoutes('popular-mortise-series/matiz', matizController, 'Matiz');
registerCrudRoutes('popular-mortise-series/main-door-set', mainDoorSetController, 'MainDoorSet');
registerCrudRoutes('popular-mortise-series/gloria', gloriaController, 'Gloria');
registerCrudRoutes('popular-mortise-series/cylindrical-locks', cylindricalLocksController2, 'CylindricalLocks');
registerCrudRoutes('popular-mortise-series/corner-fetch-series', cornerFetchSeriesController, 'CornerFetchSeries');
registerCrudRoutes('popular-mortise-series/combi-set', combiSetController, 'CombiSet');
registerCrudRoutes('popular-mortise-series/classic-lock', classicLockController, 'ClassicLock');
registerCrudRoutes('popular-mortise-series/bm06', bm06Controller, 'BM06');
registerCrudRoutes('popular-mortise-series/bm04', bm04Controller, 'BM04');
registerCrudRoutes('popular-mortise-series/bm02', bm02Controller, 'BM02');
registerCrudRoutes('popular-mortise-series/bm01', bm01Controller, 'BM01');

// Premium Mortise Series
registerCrudRoutes('premium-mortise-series/seh-series', sehSeriesController, 'SEHSeries');
registerCrudRoutes('premium-mortise-series/premium-mortise-series', premiumMortiseSeriesController, 'PremiumMortiseSeries');
registerCrudRoutes('premium-mortise-series/phoenix', phoenixController, 'Phoenix');
registerCrudRoutes('premium-mortise-series/orbit', orbitController, 'Orbit');
registerCrudRoutes('premium-mortise-series/mercury', mercuryController, 'Mercury');
registerCrudRoutes('premium-mortise-series/evva3ks-regalis-mortise', evva3KSRegalisMortiseController, 'Evva3KSRegalisMortise');
registerCrudRoutes('premium-mortise-series/europrofile-brass-handle-set-240mm', europrofileBrassHandleSet240mmController, 'EuroprofileBrassHandleSet240mm');
registerCrudRoutes('premium-mortise-series/combipack-with-240mm-euro-mortise-lock', combipackWith240mmEuroMortiseLockController, 'CombipackWith240mmEuroMortiseLock');
registerCrudRoutes('premium-mortise-series/allure-rossette-series', allureRossetteSeriesController, 'AllureRossetteSeries');

// Lever Mortise Locks
registerCrudRoutes('lever-mortise-locks/lever-mortise-locks', leverMortiseLocksController, 'LeverMortiseLocks');
registerCrudRoutes('lever-mortise-locks/exshi-security-cylinders', exshiSecurityCylindersController, 'EXSHISecurityCylinders');
registerCrudRoutes('lever-mortise-locks/europrofile-mortise-pin-cylinder-with-master-key', europrofileMortisePinCylinderWithMasterKeyController, 'EuroprofileMortisePinCylinderWithMasterKey');
registerCrudRoutes('lever-mortise-locks/europrofile-mortise-pin-cylinder', europrofileMortisePinCylinderController, 'EuroprofileMortisePinCylinder');
registerCrudRoutes('lever-mortise-locks/europrofile-mortise-lock-bodies', europrofileMortiseLockBodiesController, 'EuroprofileMortiseLockBodies');
registerCrudRoutes('lever-mortise-locks/combipack-with-6-lever-mortise-lock', combipackWith6LeverMortiseLockController, 'CombipackWith6LeverMortiseLock');

// Glass Hardware
registerCrudRoutes('glass-hardware/sliding-system', slidingSystemController, 'SlidingSystem');
registerCrudRoutes('glass-hardware/shower-cubicle-hinge', showerCubicleHingeController, 'ShowerCubicleHinge');
registerCrudRoutes('glass-hardware/glass-hardware', glassHardwareController, 'GlassHardware');
registerCrudRoutes('glass-hardware/glass-door-pull-handle', glassDoorPullHandleController, 'GlassDoorPullHandle');
registerCrudRoutes('glass-hardware/glass-door-lock', glassDoorLockController, 'GlassDoorLock');
registerCrudRoutes('glass-hardware/glass-door-fitting', glassDoorFittingController, 'GlassDoorFitting');
registerCrudRoutes('glass-hardware/floor-spring', floorSpringController, 'FloorSpring');
registerCrudRoutes('glass-hardware/floor-spring-combo-set', floorSpringComboSetController, 'FloorSpringComboSet');

// Rim Locks
registerCrudRoutes('rim-locks/ultra-xl-vertibolt', ultraXLVertiboltController, 'UltraXLVertibolt');
registerCrudRoutes('rim-locks/ultra-xl-twinbolt', ultraXLTwinboltController, 'UltraXLTwinbolt');
registerCrudRoutes('rim-locks/ultra-xl-tribolt', ultraXLTriboltController, 'UltraXLTribolt');
registerCrudRoutes('rim-locks/ultra-xl-rim-deadbolt', ultraXLRimDeadboltController, 'UltraXLRimDeadbolt');
registerCrudRoutes('rim-locks/ultra-vertibolt', ultraVertiboltController, 'UltraVertibolt');
registerCrudRoutes('rim-locks/ultra-tribolt', ultraTriboltController, 'UltraTribolt');
registerCrudRoutes('rim-locks/ultra-retrofit-adaptor', ultraRetrofitAdaptorController, 'UltraRetrofitAdaptor');
registerCrudRoutes('rim-locks/ultra-latchbolt-carton', ultraLatchboltCartonController, 'UltraLatchboltCarton');
registerCrudRoutes('rim-locks/rim-locks', rimLocksController, 'RimLocks');
registerCrudRoutes('rim-locks/pin-cylinder-rim-locks', pinCylinderRimLocksController, 'PinCylinderRimLocks');
registerCrudRoutes('rim-locks/pentabolt-aries', pentaboltAriesController, 'PentaboltAries');
registerCrudRoutes('rim-locks/night-latch-7-lever', nightLatch7LeverController, 'NightLatch7Lever');
registerCrudRoutes('rim-locks/exs-astro', exsAstroController, 'EXSAstro');
registerCrudRoutes('rim-locks/exs-altrix', exsAltrixController, 'EXSAltrix');

// Padlocks
registerCrudRoutes('padlocks/ultra-shutter-locks', ultraShutterLocksController, 'UltraShutterLocks');
registerCrudRoutes('padlocks/square-type-padlock', squareTypePadlockController, 'SquareTypePadlock');
registerCrudRoutes('padlocks/round-type-padlock', roundTypePadlockController, 'RoundTypePadlock');
registerCrudRoutes('padlocks/premium-padlocks', premiumPadlocksController, 'PremiumPadlocks');
registerCrudRoutes('padlocks/padlocks', padlocksController, 'Padlocks');
registerCrudRoutes('padlocks/disc-padlocks', discPadlocksController, 'DiscPadlocks');

module.exports = router; 