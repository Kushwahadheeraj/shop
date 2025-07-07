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
router.post('/wrench', upload.array('photos', 5), wrenchController.createWrench);
router.get('/wrench', wrenchController.getAllWrench);
router.get('/wrench/:id', wrenchController.getOneWrench);
router.put('/wrench/:id', upload.array('photos', 5), wrenchController.updateWrench);
router.delete('/wrench/:id', wrenchController.deleteWrench);

router.post('/wood-items', upload.array('photos', 5), woodItemsController.createWoodItems);
router.get('/wood-items', woodItemsController.getAllWoodItems);
router.get('/wood-items/:id', woodItemsController.getOneWoodItems);
router.put('/wood-items/:id', upload.array('photos', 5), woodItemsController.updateWoodItems);
router.delete('/wood-items/:id', woodItemsController.deleteWoodItems);

router.post('/various-tool-bits', upload.array('photos', 5), varioustoolbitsController.createVarioustoolbits);
router.get('/various-tool-bits', varioustoolbitsController.getAllVarioustoolbits);
router.get('/various-tool-bits/:id', varioustoolbitsController.getOneVarioustoolbits);
router.put('/various-tool-bits/:id', upload.array('photos', 5), varioustoolbitsController.updateVarioustoolbits);
router.delete('/various-tool-bits/:id', varioustoolbitsController.deleteVarioustoolbits);

router.post('/wood-chisel', upload.array('photos', 5), woodChiselController.createWoodChisel);
router.get('/wood-chisel', woodChiselController.getAllWoodChisel);
router.get('/wood-chisel/:id', woodChiselController.getOneWoodChisel);
router.put('/wood-chisel/:id', upload.array('photos', 5), woodChiselController.updateWoodChisel);
router.delete('/wood-chisel/:id', woodChiselController.deleteWoodChisel);

router.post('/toolkitset', upload.array('photos', 5), toolkitsetController.createToolkitset);
router.get('/toolkitset', toolkitsetController.getAllToolkitset);
router.get('/toolkitset/:id', toolkitsetController.getOneToolkitset);
router.put('/toolkitset/:id', upload.array('photos', 5), toolkitsetController.updateToolkitset);
router.delete('/toolkitset/:id', toolkitsetController.deleteToolkitset);

router.post('/tool-compartments', upload.array('photos', 5), toolCompartmentsController.createToolCompartments);
router.get('/tool-compartments', toolCompartmentsController.getAllToolCompartments);
router.get('/tool-compartments/:id', toolCompartmentsController.getOneToolCompartments);
router.put('/tool-compartments/:id', upload.array('photos', 5), toolCompartmentsController.updateToolCompartments);
router.delete('/tool-compartments/:id', toolCompartmentsController.deleteToolCompartments);

router.post('/spare-malets', upload.array('photos', 5), spareMaletsController.createSpareMalets);
router.get('/spare-malets', spareMaletsController.getAllSpareMalets);
router.get('/spare-malets/:id', spareMaletsController.getOneSpareMalets);
router.put('/spare-malets/:id', upload.array('photos', 5), spareMaletsController.updateSpareMalets);
router.delete('/spare-malets/:id', spareMaletsController.deleteSpareMalets);

router.post('/spanners', upload.array('photos', 5), spannersController.createSpanners);
router.get('/spanners', spannersController.getAllSpanners);
router.get('/spanners/:id', spannersController.getOneSpanners);
router.put('/spanners/:id', upload.array('photos', 5), spannersController.updateSpanners);
router.delete('/spanners/:id', spannersController.deleteSpanners);

router.post('/socketset', upload.array('photos', 5), socketsetController.createSocketset);
router.get('/socketset', socketsetController.getAllSocketset);
router.get('/socketset/:id', socketsetController.getOneSocketset);
router.put('/socketset/:id', upload.array('photos', 5), socketsetController.updateSocketset);
router.delete('/socketset/:id', socketsetController.deleteSocketset);

router.post('/silicon-gun', upload.array('photos', 5), siliconGunController.createSiliconGun);
router.get('/silicon-gun', siliconGunController.getAllSiliconGun);
router.get('/silicon-gun/:id', siliconGunController.getOneSiliconGun);
router.put('/silicon-gun/:id', upload.array('photos', 5), siliconGunController.updateSiliconGun);
router.delete('/silicon-gun/:id', siliconGunController.deleteSiliconGun);

router.post('/screw-driver', upload.array('photos', 5), screwDriverController.createScrewDriver);
router.get('/screw-driver', screwDriverController.getAllScrewDriver);
router.get('/screw-driver/:id', screwDriverController.getOneScrewDriver);
router.put('/screw-driver/:id', upload.array('photos', 5), screwDriverController.updateScrewDriver);
router.delete('/screw-driver/:id', screwDriverController.deleteScrewDriver);

router.post('/saw', upload.array('photos', 5), sawController.createSaw);
router.get('/saw', sawController.getAllSaw);
router.get('/saw/:id', sawController.getOneSaw);
router.put('/saw/:id', upload.array('photos', 5), sawController.updateSaw);
router.delete('/saw/:id', sawController.deleteSaw);

router.post('/powertools', upload.array('photos', 5), powertoolsController.createPowertools);
router.get('/powertools', powertoolsController.getAllPowertools);
router.get('/powertools/:id', powertoolsController.getOnePowertools);
router.put('/powertools/:id', upload.array('photos', 5), powertoolsController.updatePowertools);
router.delete('/powertools/:id', powertoolsController.deletePowertools);

router.post('/polishing-accessories', upload.array('photos', 5), polishingAccessoriesController.createPolishingAccessories);
router.get('/polishing-accessories', polishingAccessoriesController.getAllPolishingAccessories);
router.get('/polishing-accessories/:id', polishingAccessoriesController.getOnePolishingAccessories);
router.put('/polishing-accessories/:id', upload.array('photos', 5), polishingAccessoriesController.updatePolishingAccessories);
router.delete('/polishing-accessories/:id', polishingAccessoriesController.deletePolishingAccessories);

router.post('/plier', upload.array('photos', 5), plierController.createPlier);
router.get('/plier', plierController.getAllPlier);
router.get('/plier/:id', plierController.getOnePlier);
router.put('/plier/:id', upload.array('photos', 5), plierController.updatePlier);
router.delete('/plier/:id', plierController.deletePlier);

router.post('/multimeter', upload.array('photos', 5), multimeterController.createMultimeter);
router.get('/multimeter', multimeterController.getAllMultimeter);
router.get('/multimeter/:id', multimeterController.getOneMultimeter);
router.put('/multimeter/:id', upload.array('photos', 5), multimeterController.updateMultimeter);
router.delete('/multimeter/:id', multimeterController.deleteMultimeter);

router.post('/measuring-tape', upload.array('photos', 5), measuringTapeController.createMeasuringTape);
router.get('/measuring-tape', measuringTapeController.getAllMeasuringTape);
router.get('/measuring-tape/:id', measuringTapeController.getOneMeasuringTape);
router.put('/measuring-tape/:id', upload.array('photos', 5), measuringTapeController.updateMeasuringTape);
router.delete('/measuring-tape/:id', measuringTapeController.deleteMeasuringTape);

router.post('/measurement-scale', upload.array('photos', 5), measurementScaleController.createMeasurementScale);
router.get('/measurement-scale', measurementScaleController.getAllMeasurementScale);
router.get('/measurement-scale/:id', measurementScaleController.getOneMeasurementScale);
router.put('/measurement-scale/:id', upload.array('photos', 5), measurementScaleController.updateMeasurementScale);
router.delete('/measurement-scale/:id', measurementScaleController.deleteMeasurementScale);

router.post('/lubrications', upload.array('photos', 5), lubricationsController.createLubrications);
router.get('/lubrications', lubricationsController.getAllLubrications);
router.get('/lubrications/:id', lubricationsController.getOneLubrications);
router.put('/lubrications/:id', upload.array('photos', 5), lubricationsController.updateLubrications);
router.delete('/lubrications/:id', lubricationsController.deleteLubrications);

router.post('/level', upload.array('photos', 5), levelController.createLevel);
router.get('/level', levelController.getAllLevel);
router.get('/level/:id', levelController.getOneLevel);
router.put('/level/:id', upload.array('photos', 5), levelController.updateLevel);
router.delete('/level/:id', levelController.deleteLevel);

router.post('/handtools', upload.array('photos', 5), handtoolsController.createHandtools);
router.get('/handtools', handtoolsController.getAllHandtools);
router.get('/handtools/:id', handtoolsController.getOneHandtools);
router.put('/handtools/:id', upload.array('photos', 5), handtoolsController.updateHandtools);
router.delete('/handtools/:id', handtoolsController.deleteHandtools);

router.post('/hammer-drills', upload.array('photos', 5), hammerDrillsController.createHammerDrills);
router.get('/hammer-drills', hammerDrillsController.getAllHammerDrills);
router.get('/hammer-drills/:id', hammerDrillsController.getOneHammerDrills);
router.put('/hammer-drills/:id', upload.array('photos', 5), hammerDrillsController.updateHammerDrills);
router.delete('/hammer-drills/:id', hammerDrillsController.deleteHammerDrills);

router.post('/hammer', upload.array('photos', 5), hammerController.createHammer);
router.get('/hammer', hammerController.getAllHammer);
router.get('/hammer/:id', hammerController.getOneHammer);
router.put('/hammer/:id', upload.array('photos', 5), hammerController.updateHammer);
router.delete('/hammer/:id', hammerController.deleteHammer);

router.post('/hacksaw-blades', upload.array('photos', 5), hacksawBladesController.createHacksawBlades);
router.get('/hacksaw-blades', hacksawBladesController.getAllHacksawBlades);
router.get('/hacksaw-blades/:id', hacksawBladesController.getOneHacksawBlades);
router.put('/hacksaw-blades/:id', upload.array('photos', 5), hacksawBladesController.updateHacksawBlades);
router.delete('/hacksaw-blades/:id', hacksawBladesController.deleteHacksawBlades);

router.post('/grease-gun', upload.array('photos', 5), greaseGunController.createGreaseGun);
router.get('/grease-gun', greaseGunController.getAllGreaseGun);
router.get('/grease-gun/:id', greaseGunController.getOneGreaseGun);
router.put('/grease-gun/:id', upload.array('photos', 5), greaseGunController.updateGreaseGun);
router.delete('/grease-gun/:id', greaseGunController.deleteGreaseGun);

router.post('/gluegun', upload.array('photos', 5), gluegunController.createGluegun);
router.get('/gluegun', gluegunController.getAllGluegun);
router.get('/gluegun/:id', gluegunController.getOneGluegun);
router.put('/gluegun/:id', upload.array('photos', 5), gluegunController.updateGluegun);
router.delete('/gluegun/:id', gluegunController.deleteGluegun);

router.post('/glass-cutter', upload.array('photos', 5), glassCutterController.createGlassCutter);
router.get('/glass-cutter', glassCutterController.getAllGlassCutter);
router.get('/glass-cutter/:id', glassCutterController.getOneGlassCutter);
router.put('/glass-cutter/:id', upload.array('photos', 5), glassCutterController.updateGlassCutter);
router.delete('/glass-cutter/:id', glassCutterController.deleteGlassCutter);

router.post('/gear-pullers', upload.array('photos', 5), gearPullersController.createGearPullers);
router.get('/gear-pullers', gearPullersController.getAllGearPullers);
router.get('/gear-pullers/:id', gearPullersController.getOneGearPullers);
router.put('/gear-pullers/:id', upload.array('photos', 5), gearPullersController.updateGearPullers);
router.delete('/gear-pullers/:id', gearPullersController.deleteGearPullers);

router.post('/garden-tools', upload.array('photos', 5), gardenToolsController.createGardenTools);
router.get('/garden-tools', gardenToolsController.getAllGardenTools);
router.get('/garden-tools/:id', gardenToolsController.getOneGardenTools);
router.put('/garden-tools/:id', upload.array('photos', 5), gardenToolsController.updateGardenTools);
router.delete('/garden-tools/:id', gardenToolsController.deleteGardenTools);

router.post('/files', upload.array('photos', 5), filesController.createFiles);
router.get('/files', filesController.getAllFiles);
router.get('/files/:id', filesController.getOneFiles);
router.put('/files/:id', upload.array('photos', 5), filesController.updateFiles);
router.delete('/files/:id', filesController.deleteFiles);

router.post('/cutters', upload.array('photos', 5), cuttersController.createCutters);
router.get('/cutters', cuttersController.getAllCutters);
router.get('/cutters/:id', cuttersController.getOneCutters);
router.put('/cutters/:id', upload.array('photos', 5), cuttersController.updateCutters);
router.delete('/cutters/:id', cuttersController.deleteCutters);

router.post('/crowbar', upload.array('photos', 5), crowbarController.createCrowbar);
router.get('/crowbar', crowbarController.getAllCrowbar);
router.get('/crowbar/:id', crowbarController.getOneCrowbar);
router.put('/crowbar/:id', upload.array('photos', 5), crowbarController.updateCrowbar);
router.delete('/crowbar/:id', crowbarController.deleteCrowbar);

router.post('/clamps', upload.array('photos', 5), clampsController.createClamps);
router.get('/clamps', clampsController.getAllClamps);
router.get('/clamps/:id', clampsController.getOneClamps);
router.put('/clamps/:id', upload.array('photos', 5), clampsController.updateClamps);
router.delete('/clamps/:id', clampsController.deleteClamps);

router.post('/chisels', upload.array('photos', 5), chiselsController.createChisels);
router.get('/chisels', chiselsController.getAllChisels);
router.get('/chisels/:id', chiselsController.getOneChisels);
router.put('/chisels/:id', upload.array('photos', 5), chiselsController.updateChisels);
router.delete('/chisels/:id', chiselsController.deleteChisels);

router.post('/centre-punches', upload.array('photos', 5), centrePunchesController.createCentrePunches);
router.get('/centre-punches', centrePunchesController.getAllCentrePunches);
router.get('/centre-punches/:id', centrePunchesController.getOneCentrePunches);
router.put('/centre-punches/:id', upload.array('photos', 5), centrePunchesController.updateCentrePunches);
router.delete('/centre-punches/:id', centrePunchesController.deleteCentrePunches);

router.post('/carpenter-pincer', upload.array('photos', 5), carpenterPincerController.createCarpenterPincer);
router.get('/carpenter-pincer', carpenterPincerController.getAllCarpenterPincer);
router.get('/carpenter-pincer/:id', carpenterPincerController.getOneCarpenterPincer);
router.put('/carpenter-pincer/:id', upload.array('photos', 5), carpenterPincerController.updateCarpenterPincer);
router.delete('/carpenter-pincer/:id', carpenterPincerController.deleteCarpenterPincer);

router.post('/brush', upload.array('photos', 5), brushController.createBrush);
router.get('/brush', brushController.getAllBrush);
router.get('/brush/:id', brushController.getOneBrush);
router.put('/brush/:id', upload.array('photos', 5), brushController.updateBrush);
router.delete('/brush/:id', brushController.deleteBrush);

router.post('/allen-keys', upload.array('photos', 5), allenKeysController.createAllenKeys);
router.get('/allen-keys', allenKeysController.getAllAllenKeys);
router.get('/allen-keys/:id', allenKeysController.getOneAllenKeys);
router.put('/allen-keys/:id', upload.array('photos', 5), allenKeysController.updateAllenKeys);
router.delete('/allen-keys/:id', allenKeysController.deleteAllenKeys);

router.post('/abrasives', upload.array('photos', 5), abrasivesController.createAbrasives);
router.get('/abrasives', abrasivesController.getAllAbrasives);
router.get('/abrasives/:id', abrasivesController.getOneAbrasives);
router.put('/abrasives/:id', upload.array('photos', 5), abrasivesController.updateAbrasives);
router.delete('/abrasives/:id', abrasivesController.deleteAbrasives);

module.exports = router;
