// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

// Import all controllers
const wrenchController = require('../controllers/tools/wrenchController');
const woodItemsController = require('../controllers/tools/woodItemsController');
const varioustoolbitsController = require('../controllers/tools/varioustoolbitsController');
const woodChiselController = require('../controllers/tools/woodChiselController');
const toolkitsetController = require('../controllers/tools/toolkitsetController');
const toolCompartmentsController = require('../controllers/tools/toolCompartmentsController');
const spareMaletsController = require('../controllers/tools/spareMaletsController');
const socketsetController = require('../controllers/tools/socketsetController');
const spannersController = require('../controllers/tools/spannersController');
const siliconGunController = require('../controllers/tools/siliconGunController');
const sawController = require('../controllers/tools/sawController');
const screwDriverController = require('../controllers/tools/screwDriverController');
const powertoolsController = require('../controllers/tools/powertoolsController');
const polishingAccessoriesController = require('../controllers/tools/polishingAccessoriesController');
const plierController = require('../controllers/tools/plierController');
const multimeterController = require('../controllers/tools/multimeterController');
const measuringTapeController = require('../controllers/tools/measuringTapeController');
const measurementScaleController = require('../controllers/tools/measurementScaleController');
const lubricationsController = require('../controllers/tools/lubricationsController');
const levelController = require('../controllers/tools/levelController');
const handtoolsController = require('../controllers/tools/handtoolsController');
const hammerDrillsController = require('../controllers/tools/hammerDrillsController');
const hammerController = require('../controllers/tools/hammerController');
const hacksawBladesController = require('../controllers/tools/hacksawBladesController');
const greaseGunController = require('../controllers/tools/greaseGunController');
const gluegunController = require('../controllers/tools/gluegunController');
const glassCutterController = require('../controllers/tools/glassCutterController');
const gearPullersController = require('../controllers/tools/gearPullersController');
const gardenToolsController = require('../controllers/tools/gardenToolsController');
const filesController = require('../controllers/tools/filesController');
const cuttersController = require('../controllers/tools/cuttersController');
const crowbarController = require('../controllers/tools/crowbarController');
const clampsController = require('../controllers/tools/clampsController');
const chiselsController = require('../controllers/tools/chiselsController');
const centrePunchesController = require('../controllers/tools/centrePunchesController');
const carpenterPincerController = require('../controllers/tools/carpenterPincerController');
const brushController = require('../controllers/tools/brushController');
const allenKeysController = require('../controllers/tools/allenKeysController');
const abrasivesController = require('../controllers/tools/abrasivesController');
// ...add imports for any additional controllers or subfolders

// Helper to convert camelCase to kebab-case for route paths
function toKebab(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// Register all routes
router.post('/wrench/create', upload.array('photos', 5), wrenchController.createWrench);
router.get('/wrench/get', wrenchController.getAllWrench);
router.get('/wrench/getOne:id', wrenchController.getOneWrench);
router.put('/wrench/Update:id', upload.array('photos', 5), wrenchController.updateWrench);
router.delete('/wrench/delete:id', wrenchController.deleteWrench);

router.post('/wood-items/create', upload.array('photos', 5), woodItemsController.createWoodItems);
router.get('/wood-items/get', woodItemsController.getAllWoodItems);
router.get('/wood-items/getOne:id', woodItemsController.getOneWoodItems);
router.put('/wood-items/Update:id', upload.array('photos', 5), woodItemsController.updateWoodItems);
router.delete('/wood-items/delete:id', woodItemsController.deleteWoodItems);

router.post('/various-tool-bits/create', upload.array('photos', 5), varioustoolbitsController.createVarioustoolbits);
router.get('/various-tool-bits/get', varioustoolbitsController.getAllVarioustoolbits);
router.get('/various-tool-bits/getOne:id', varioustoolbitsController.getOneVarioustoolbits);
router.put('/various-tool-bits/Update:id', upload.array('photos', 5), varioustoolbitsController.updateVarioustoolbits);
router.delete('/various-tool-bits/delete:id', varioustoolbitsController.deleteVarioustoolbits);

router.post('/wood-chisel/create', upload.array('photos', 5), woodChiselController.createWoodChisel);
router.get('/wood-chisel/get', woodChiselController.getAllWoodChisel);
router.get('/wood-chisel/getOne:id', woodChiselController.getOneWoodChisel);
router.put('/wood-chisel/Update:id', upload.array('photos', 5), woodChiselController.updateWoodChisel);
router.delete('/wood-chisel/delete:id', woodChiselController.deleteWoodChisel);

router.post('/toolkitset/create', upload.array('photos', 5), toolkitsetController.createToolkitset);
router.get('/toolkitset/get', toolkitsetController.getAllToolkitset);
router.get('/toolkitset/getOne:id', toolkitsetController.getOneToolkitset);
router.put('/toolkitset/Update:id', upload.array('photos', 5), toolkitsetController.updateToolkitset);
router.delete('/toolkitset/delete:id', toolkitsetController.deleteToolkitset);

router.post('/tool-compartments/create', upload.array('photos', 5), toolCompartmentsController.createToolCompartments);
router.get('/tool-compartments/get', toolCompartmentsController.getAllToolCompartments);
router.get('/tool-compartments/getOne:id', toolCompartmentsController.getOneToolCompartments);
router.put('/tool-compartments/Update:id', upload.array('photos', 5), toolCompartmentsController.updateToolCompartments);
router.delete('/tool-compartments/delete:id', toolCompartmentsController.deleteToolCompartments);

router.post('/spare-malets/create', upload.array('photos', 5), spareMaletsController.createSpareMalets);
router.get('/spare-malets/get', spareMaletsController.getAllSpareMalets);
router.get('/spare-malets/getOne:id', spareMaletsController.getOneSpareMalets);
router.put('/spare-malets/Update:id', upload.array('photos', 5), spareMaletsController.updateSpareMalets);
router.delete('/spare-malets/delete:id', spareMaletsController.deleteSpareMalets);

router.post('/spanners/create', upload.array('photos', 5), spannersController.createSpanners);
router.get('/spanners/get', spannersController.getAllSpanners);
router.get('/spanners/getOne:id', spannersController.getOneSpanners);
router.put('/spanners/Update:id', upload.array('photos', 5), spannersController.updateSpanners);
router.delete('/spanners/delete:id', spannersController.deleteSpanners);

router.post('/socketset/create', upload.array('photos', 5), socketsetController.createSocketset);
router.get('/socketset/get', socketsetController.getAllSocketset);
router.get('/socketset/getOne:id', socketsetController.getOneSocketset);
router.put('/socketset/Update:id', upload.array('photos', 5), socketsetController.updateSocketset);
router.delete('/socketset/delete:id', socketsetController.deleteSocketset);

router.post('/silicon-gun/create', upload.array('photos', 5), siliconGunController.createSiliconGun);
router.get('/silicon-gun/get', siliconGunController.getAllSiliconGun);
router.get('/silicon-gun/getOne:id', siliconGunController.getOneSiliconGun);
router.put('/silicon-gun/Update:id', upload.array('photos', 5), siliconGunController.updateSiliconGun);
router.delete('/silicon-gun/delete:id', siliconGunController.deleteSiliconGun);

router.post('/screw-driver/create', upload.array('photos', 5), screwDriverController.createScrewDriver);
router.get('/screw-driver/get', screwDriverController.getAllScrewDriver);
router.get('/screw-driver/getOne:id', screwDriverController.getOneScrewDriver);
router.put('/screw-driver/Update:id', upload.array('photos', 5), screwDriverController.updateScrewDriver);
router.delete('/screw-driver/delete:id', screwDriverController.deleteScrewDriver);

router.post('/saw/create', upload.array('photos', 5), sawController.createSaw);
router.get('/saw/get', sawController.getAllSaw);
router.get('/saw/getOne:id', sawController.getOneSaw);
router.put('/saw/Update:id', upload.array('photos', 5), sawController.updateSaw);
router.delete('/saw/delete:id', sawController.deleteSaw);

router.post('/powertools/create', upload.array('photos', 5), powertoolsController.createPowertools);
router.get('/powertools/get', powertoolsController.getAllPowertools);
router.get('/powertools/getOne:id', powertoolsController.getOnePowertools);
router.put('/powertools/Update:id', upload.array('photos', 5), powertoolsController.updatePowertools);
router.delete('/powertools/delete:id', powertoolsController.deletePowertools);

router.post('/polishing-accessories/create', upload.array('photos', 5), polishingAccessoriesController.createPolishingAccessories);
router.get('/polishing-accessories/get', polishingAccessoriesController.getAllPolishingAccessories);
router.get('/polishing-accessories/getOne:id', polishingAccessoriesController.getOnePolishingAccessories);
router.put('/polishing-accessories/Update:id', upload.array('photos', 5), polishingAccessoriesController.updatePolishingAccessories);
router.delete('/polishing-accessories/delete:id', polishingAccessoriesController.deletePolishingAccessories);

router.post('/plier/create', upload.array('photos', 5), plierController.createPlier);
router.get('/plier/get', plierController.getAllPlier);
router.get('/plier/getOne:id', plierController.getOnePlier);
router.put('/plier/Update:id', upload.array('photos', 5), plierController.updatePlier);
router.delete('/plier/delete:id', plierController.deletePlier);

router.post('/multimeter/create', upload.array('photos', 5), multimeterController.createMultimeter);
router.get('/multimeter/get', multimeterController.getAllMultimeter);
router.get('/multimeter/getOne:id', multimeterController.getOneMultimeter);
router.put('/multimeter/Update:id', upload.array('photos', 5), multimeterController.updateMultimeter);
router.delete('/multimeter/delete:id', multimeterController.deleteMultimeter);

router.post('/measuring-tape/create', upload.array('photos', 5), measuringTapeController.createMeasuringTape);
router.get('/measuring-tape/get', measuringTapeController.getAllMeasuringTape);
router.get('/measuring-tape/getOne:id', measuringTapeController.getOneMeasuringTape);
router.put('/measuring-tape/Update:id', upload.array('photos', 5), measuringTapeController.updateMeasuringTape);
router.delete('/measuring-tape/delete:id', measuringTapeController.deleteMeasuringTape);

router.post('/measurement-scale/create', upload.array('photos', 5), measurementScaleController.createMeasurementScale);
router.get('/measurement-scale/get', measurementScaleController.getAllMeasurementScale);
router.get('/measurement-scale/getOne:id', measurementScaleController.getOneMeasurementScale);
router.put('/measurement-scale/Update:id', upload.array('photos', 5), measurementScaleController.updateMeasurementScale);
router.delete('/measurement-scale/delete:id', measurementScaleController.deleteMeasurementScale);

router.post('/lubrications/create', upload.array('photos', 5), lubricationsController.createLubrications);
router.get('/lubrications/get', lubricationsController.getAllLubrications);
router.get('/lubrications/getOne:id', lubricationsController.getOneLubrications);
router.put('/lubrications/Update:id', upload.array('photos', 5), lubricationsController.updateLubrications);
router.delete('/lubrications/delete:id', lubricationsController.deleteLubrications);

router.post('/level/create', upload.array('photos', 5), levelController.createLevel);
router.get('/level/get', levelController.getAllLevel);
router.get('/level/getOne:id', levelController.getOneLevel);
router.put('/level/Update:id', upload.array('photos', 5), levelController.updateLevel);
router.delete('/level/delete:id', levelController.deleteLevel);

router.post('/handtools/create', upload.array('photos', 5), handtoolsController.createHandtools);
router.get('/handtools/get', handtoolsController.getAllHandtools);
router.get('/handtools/getOne:id', handtoolsController.getOneHandtools);
router.put('/handtools/Update:id', upload.array('photos', 5), handtoolsController.updateHandtools);
router.delete('/handtools/delete:id', handtoolsController.deleteHandtools);

router.post('/hammer-drills/create', upload.array('photos', 5), hammerDrillsController.createHammerDrills);
router.get('/hammer-drills/get', hammerDrillsController.getAllHammerDrills);
router.get('/hammer-drills/getOne:id', hammerDrillsController.getOneHammerDrills);
router.put('/hammer-drills/Update:id', upload.array('photos', 5), hammerDrillsController.updateHammerDrills);
router.delete('/hammer-drills/delete:id', hammerDrillsController.deleteHammerDrills);

router.post('/hammer/create', upload.array('photos', 5), hammerController.createHammer);
router.get('/hammer/get', hammerController.getAllHammer);
router.get('/hammer/getOne:id', hammerController.getOneHammer);
router.put('/hammer/Update:id', upload.array('photos', 5), hammerController.updateHammer);
router.delete('/hammer/delete:id', hammerController.deleteHammer);

router.post('/hacksaw-blades/create', upload.array('photos', 5), hacksawBladesController.createHacksawBlades);
router.get('/hacksaw-blades/get', hacksawBladesController.getAllHacksawBlades);
router.get('/hacksaw-blades/getOne:id', hacksawBladesController.getOneHacksawBlades);
router.put('/hacksaw-blades/Update:id', upload.array('photos', 5), hacksawBladesController.updateHacksawBlades);
router.delete('/hacksaw-blades/delete:id', hacksawBladesController.deleteHacksawBlades);

router.post('/grease-gun/create', upload.array('photos', 5), greaseGunController.createGreaseGun);
router.get('/grease-gun/get', greaseGunController.getAllGreaseGun);
router.get('/grease-gun/getOne:id', greaseGunController.getOneGreaseGun);
router.put('/grease-gun/Update:id', upload.array('photos', 5), greaseGunController.updateGreaseGun);
router.delete('/grease-gun/delete:id', greaseGunController.deleteGreaseGun);

router.post('/gluegun/create', upload.array('photos', 5), gluegunController.createGluegun);
router.get('/gluegun/get', gluegunController.getAllGluegun);
router.get('/gluegun/getOne:id', gluegunController.getOneGluegun);
router.put('/gluegun/Update:id', upload.array('photos', 5), gluegunController.updateGluegun);
router.delete('/gluegun/delete:id', gluegunController.deleteGluegun);

router.post('/glass-cutter/create', upload.array('photos', 5), glassCutterController.createGlassCutter);
router.get('/glass-cutter/get', glassCutterController.getAllGlassCutter);
router.get('/glass-cutter/getOne:id', glassCutterController.getOneGlassCutter);
router.put('/glass-cutter/Update:id', upload.array('photos', 5), glassCutterController.updateGlassCutter);
router.delete('/glass-cutter/delete:id', glassCutterController.deleteGlassCutter);

router.post('/gear-pullers/create', upload.array('photos', 5), gearPullersController.createGearPullers);
router.get('/gear-pullers/get', gearPullersController.getAllGearPullers);
router.get('/gear-pullers/getOne:id', gearPullersController.getOneGearPullers);
router.put('/gear-pullers/Update:id', upload.array('photos', 5), gearPullersController.updateGearPullers);
router.delete('/gear-pullers/delete:id', gearPullersController.deleteGearPullers);

router.post('/garden-tools/create', upload.array('photos', 5), gardenToolsController.createGardenTools);
router.get('/garden-tools/get', gardenToolsController.getAllGardenTools);
router.get('/garden-tools/getOne:id', gardenToolsController.getOneGardenTools);
router.put('/garden-tools/Update:id', upload.array('photos', 5), gardenToolsController.updateGardenTools);
router.delete('/garden-tools/delete:id', gardenToolsController.deleteGardenTools);

router.post('/files/create', upload.array('photos', 5), filesController.createFiles);
router.get('/files/get', filesController.getAllFiles);
router.get('/files/getOne:id', filesController.getOneFiles);
router.put('/files/Update:id', upload.array('photos', 5), filesController.updateFiles);
router.delete('/files/delete:id', filesController.deleteFiles);

router.post('/cutters/create', upload.array('photos', 5), cuttersController.createCutters);
router.get('/cutters/get', cuttersController.getAllCutters);
router.get('/cutters/getOne:id', cuttersController.getOneCutters);
router.put('/cutters/Update:id', upload.array('photos', 5), cuttersController.updateCutters);
router.delete('/cutters/delete:id', cuttersController.deleteCutters);

router.post('/crowbar/create', upload.array('photos', 5), crowbarController.createCrowbar);
router.get('/crowbar/get', crowbarController.getAllCrowbar);
router.get('/crowbar/getOne:id', crowbarController.getOneCrowbar);
router.put('/crowbar/Update:id', upload.array('photos', 5), crowbarController.updateCrowbar);
router.delete('/crowbar/delete:id', crowbarController.deleteCrowbar);

router.post('/clamps/create', upload.array('photos', 5), clampsController.createClamps);
router.get('/clamps/get', clampsController.getAllClamps);
router.get('/clamps/getOne:id', clampsController.getOneClamps);
router.put('/clamps/Update:id', upload.array('photos', 5), clampsController.updateClamps);
router.delete('/clamps/delete:id', clampsController.deleteClamps);

router.post('/chisels/create', upload.array('photos', 5), chiselsController.createChisels);
router.get('/chisels/get', chiselsController.getAllChisels);
router.get('/chisels/getOne:id', chiselsController.getOneChisels);
router.put('/chisels/Update:id', upload.array('photos', 5), chiselsController.updateChisels);
router.delete('/chisels/delete:id', chiselsController.deleteChisels);

router.post('/centre-punches/create', upload.array('photos', 5), centrePunchesController.createCentrePunches);
router.get('/centre-punches/get', centrePunchesController.getAllCentrePunches);
router.get('/centre-punches/getOne:id', centrePunchesController.getOneCentrePunches);
router.put('/centre-punches/Update:id', upload.array('photos', 5), centrePunchesController.updateCentrePunches);
router.delete('/centre-punches/delete:id', centrePunchesController.deleteCentrePunches);

router.post('/carpenter-pincer/create', upload.array('photos', 5), carpenterPincerController.createCarpenterPincer);
router.get('/carpenter-pincer/get', carpenterPincerController.getAllCarpenterPincer);
router.get('/carpenter-pincer/getOne:id', carpenterPincerController.getOneCarpenterPincer);
router.put('/carpenter-pincer/Update:id', upload.array('photos', 5), carpenterPincerController.updateCarpenterPincer);
router.delete('/carpenter-pincer/delete:id', carpenterPincerController.deleteCarpenterPincer);

router.post('/brush/create', upload.array('photos', 5), brushController.createBrush);
router.get('/brush/get', brushController.getAllBrush);
router.get('/brush/getOne:id', brushController.getOneBrush);
router.put('/brush/Update:id', upload.array('photos', 5), brushController.updateBrush);
router.delete('/brush/delete:id', brushController.deleteBrush);

router.post('/allen-keys/create', upload.array('photos', 5), allenKeysController.createAllenKeys);
router.get('/allen-keys/get', allenKeysController.getAllAllenKeys);
router.get('/allen-keys/getOne:id', allenKeysController.getOneAllenKeys);
router.put('/allen-keys/Update:id', upload.array('photos', 5), allenKeysController.updateAllenKeys);
router.delete('/allen-keys/delete:id', allenKeysController.deleteAllenKeys);

router.post('/abrasives/create', upload.array('photos', 5), abrasivesController.createAbrasives);
router.get('/abrasives/get', abrasivesController.getAllAbrasives);
router.get('/abrasives/getOne:id', abrasivesController.getOneAbrasives);
router.put('/abrasives/Update:id', upload.array('photos', 5), abrasivesController.updateAbrasives);
router.delete('/abrasives/delete:id', abrasivesController.deleteAbrasives);

module.exports = router;
