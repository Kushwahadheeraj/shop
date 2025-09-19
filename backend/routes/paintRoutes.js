const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure multer for handling FormData with files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files
  }
});

const acrylicEmulsionPaintController = require('../controllers/paint/acrylicEmulsionPaintController');
const AdhesiveThinnerAdhesiveController = require('../controllers/paint/AdhesiveThinner/adhesiveController.js');
const AdhesiveThinnerThinnerController = require('../controllers/paint/AdhesiveThinner/thinnerController.js');
const aspaPaintsController = require('../controllers/paint/aspaPaintsController.js');
const AutomativePaintsAspaPaintsController = require('../controllers/paint/AutomativePaints/aspaPaintsController.js');
const BrushesRollersPaintBrushesController = require('../controllers/paint/BrushesRollers/paintBrushesController.js');
const BrushesRollersRollersController = require('../controllers/paint/BrushesRollers/rollersController.js');
const BrushesRollersSprayPaintsController = require('../controllers/paint/BrushesRollers/sprayPaintsController.js');
const DistemperAcrylicDistemperController = require('../controllers/paint/Distemper/acrylicDistemperController.js');
const DistemperSyntheticDistemperController = require('../controllers/paint/Distemper/syntheticDistemperController.js');
const EmulsionExteriorEmulsionController = require('../controllers/paint/Emulsion/exteriorEmulsionController.js');
const EmulsionInteriorEmulsionController = require('../controllers/paint/Emulsion/interiorEmulsionController.js');
const EmulsionTileGuardController = require('../controllers/paint/Emulsion/tileGuardController.js');
const EmulsionWallTextureController = require('../controllers/paint/Emulsion/wallTextureController.js');
const EnamelGlossEnamelController = require('../controllers/paint/Enamel/glossEnamelController.js');
const EnamelSatinEnamelController = require('../controllers/paint/Enamel/satinEnamelController.js');
const EnamelSyntheticEnamelController = require('../controllers/paint/Enamel/syntheticEnamelController.js');
const exteriorPaintsController = require('../controllers/paint/exteriorPaintsController.js');
const floorPaintsController = require('../controllers/paint/floorPaintsController.js');
const industrialCoatingsController = require('../controllers/paint/industrialCoatingsController.js');
const interiorPaintsController = require('../controllers/paint/interiorPaintsController.js');
const PaintingAccessoriesPaintingToolsController = require('../controllers/paint/PaintingAccessories/paintingToolsController.js');
const PaintingAccessoriesSandpaperRollsController = require('../controllers/paint/PaintingAccessories/sandpaperRollsController.js');
const PaintingAccessoriesStencilsController = require('../controllers/paint/PaintingAccessories/stencilsController.js');
const paintingToolsController = require('../controllers/paint/paintingToolsController.js');
const PrimerAcrylicPrimerController = require('../controllers/paint/Primer/acrylicPrimerController.js');
const PrimerCementPrimerController = require('../controllers/paint/Primer/cementPrimerController.js');
const PrimerExteriorPrimerController = require('../controllers/paint/Primer/exteriorPrimerController.js');
const PrimerInteriorPrimerController = require('../controllers/paint/Primer/interiorPrimerController.js');
const PrimerMetalPrimerController = require('../controllers/paint/Primer/metalPrimerController.js');
const PrimerSolventPrimerController = require('../controllers/paint/Primer/solventPrimerController.js');
const PrimerWoodPrimerController = require('../controllers/paint/Primer/woodPrimerController.js');
const primerAndWallPuttyController = require('../controllers/paint/primerAndWallPuttyController.js');
const sanitizerController = require('../controllers/paint/sanitizerController.js');
const sprayPaintsController = require('../controllers/paint/sprayPaintsController.js');
const StainersUniversalStainersController = require('../controllers/paint/Stainers/universalStainersController.js');
const StainersWoodStainersController = require('../controllers/paint/Stainers/woodStainersController.js');
const stainersThinnersController = require('../controllers/paint/stainersThinnersController.js');
const stencilsController = require('../controllers/paint/stencilsController.js');
const tileGuardController = require('../controllers/paint/tileGuardController.js');
const TopBrandsDulexPaintsController = require('../controllers/paint/TopBrands/dulexPaintsController.js');
const TopBrandsAsianPaintsController = require('../controllers/paint/TopBrands/asianPaintsController.js');
const TopBrandsNerolocPaintsController = require('../controllers/paint/TopBrands/nerolocPaintsController.js');
const TopBrandsJkWallPuttyController = require('../controllers/paint/TopBrands/jkWallPuttyController.js');
const WallPuttyAcrylicWallPuttyController = require('../controllers/paint/WallPutty/acrylicWallPuttyController.js');
const WallPuttyKpfWallPuttyController = require('../controllers/paint/WallPutty/kpfWallPuttyController.js');
const WallPuttyPowderWallPuttyController = require('../controllers/paint/WallPutty/powderWallPuttyController.js');
const wallStickersWallpapersController = require('../controllers/paint/wallStickersWallpapersController.js');
const WaterproofingCrackFillersController = require('../controllers/paint/Waterproofing/crackFillersController.js');
const WaterproofingWaterproofBasecoatController = require('../controllers/paint/Waterproofing/waterproofBasecoatController.js');
const WoodFinishesGlassCoatingsController = require('../controllers/paint/WoodFinishes/glassCoatingsController.js');
const WoodFinishesMelamyneController = require('../controllers/paint/WoodFinishes/melamyneController.js');
const WoodFinishesNcController = require('../controllers/paint/WoodFinishes/ncController.js');
const WoodFinishesPolishController = require('../controllers/paint/WoodFinishes/polishController.js');
const WoodFinishesPuController = require('../controllers/paint/WoodFinishes/puController.js');
const WoodFinishesSealerController = require('../controllers/paint/WoodFinishes/sealerController.js');
const WoodFinishesVarnishBlackBoardPaintController = require('../controllers/paint/WoodFinishes/varnishBlackBoardPaintController.js');
const WoodFinishesWoodPuttyController = require('../controllers/paint/WoodFinishes/woodPuttyController.js');
const woodMetalController = require('../controllers/paint/woodMetalController.js');

// acrylic-emulsion-paint endpoints
router.post('/acrylic-emulsion-paint/create',upload.array('photos', 5), acrylicEmulsionPaintController.createAcrylicEmulsionPaint);
router.get('/acrylic-emulsion-paint/get', acrylicEmulsionPaintController.getAllAcrylicEmulsionPaint);
router.get('/acrylic-emulsion-paint/getOne/:id', acrylicEmulsionPaintController.getOneAcrylicEmulsionPaint);
router.put('/acrylic-emulsion-paint/Update/:id',upload.array('photos', 5), acrylicEmulsionPaintController.updateAcrylicEmulsionPaint);
router.delete('/acrylic-emulsion-paint/delete/:id', acrylicEmulsionPaintController.deleteAcrylicEmulsionPaint);

// adhesive-thinner-adhesive endpoints
router.post('/adhesive-thinner-adhesive/create',upload.array('photos', 5), AdhesiveThinnerAdhesiveController.createAdhesive);
router.get('/adhesive-thinner-adhesive/get', AdhesiveThinnerAdhesiveController.getAllAdhesive);
router.get('/adhesive-thinner-adhesive/getOne/:id', AdhesiveThinnerAdhesiveController.getOneAdhesive);
router.put('/adhesive-thinner-adhesive/Update/:id',upload.array('photos', 5), AdhesiveThinnerAdhesiveController.updateAdhesive);
router.delete('/adhesive-thinner-adhesive/delete/:id', AdhesiveThinnerAdhesiveController.deleteAdhesive);

// adhesive-thinner-thinner endpoints
router.post('/adhesive-thinner-thinner/create',upload.array('photos', 5), AdhesiveThinnerThinnerController.createThinner);
router.get('/adhesive-thinner-thinner/get', AdhesiveThinnerThinnerController.getAllThinner);
router.get('/adhesive-thinner-thinner/getOne/:id', AdhesiveThinnerThinnerController.getOneThinner);
router.put('/adhesive-thinner-thinner/Update/:id',upload.array('photos', 5), AdhesiveThinnerThinnerController.updateThinner);
router.delete('/adhesive-thinner-thinner/delete/:id', AdhesiveThinnerThinnerController.deleteThinner);

// aspa-paints endpoints
router.post('/aspa-paints/create',upload.array('photos', 5), aspaPaintsController.createAspaPaints);
router.get('/aspa-paints/get', aspaPaintsController.getAllAspaPaints);
router.get('/aspa-paints/getOne/:id', aspaPaintsController.getOneAspaPaints);
router.put('/aspa-paints/Update/:id',upload.array('photos', 5), aspaPaintsController.updateAspaPaints);
router.delete('/aspa-paints/delete/:id', aspaPaintsController.deleteAspaPaints);

// automative-paints-aspa-paints endpoints
router.post('/automative-paints-aspa-paints/create',upload.array('photos', 5), AutomativePaintsAspaPaintsController.createAspaPaints);
router.get('/automative-paints-aspa-paints/get', AutomativePaintsAspaPaintsController.getAllAspaPaints);
router.get('/automative-paints-aspa-paints/getOne/:id', AutomativePaintsAspaPaintsController.getOneAspaPaints);
router.put('/automative-paints-aspa-paints/Update/:id',upload.array('photos', 5), AutomativePaintsAspaPaintsController.updateAspaPaints);
router.delete('/automative-paints-aspa-paints/delete/:id', AutomativePaintsAspaPaintsController.deleteAspaPaints);

// brushes-rollers-paint-brushes endpoints
router.post('/brushes-rollers-paint-brushes/create',upload.array('photos', 5), BrushesRollersPaintBrushesController.createPaintBrushes);
router.get('/brushes-rollers-paint-brushes/get', BrushesRollersPaintBrushesController.getAllPaintBrushes);
router.get('/brushes-rollers-paint-brushes/getOne/:id', BrushesRollersPaintBrushesController.getOnePaintBrushes);
router.put('/brushes-rollers-paint-brushes/Update/:id',upload.array('photos', 5),  BrushesRollersPaintBrushesController.updatePaintBrushes);
router.delete('/brushes-rollers-paint-brushes/delete/:id', BrushesRollersPaintBrushesController.deletePaintBrushes);

// brushes-rollers-rollers endpoints
router.post('/brushes-rollers-rollers/create',upload.array('photos', 5), BrushesRollersRollersController.createRollers);
router.get('/brushes-rollers-rollers/get', BrushesRollersRollersController.getAllRollers);
router.get('/brushes-rollers-rollers/getOne/:id', BrushesRollersRollersController.getOneRollers);
router.put('/brushes-rollers-rollers/Update/:id',upload.array('photos', 5),  BrushesRollersRollersController.updateRollers);
router.delete('/brushes-rollers-rollers/delete/:id', BrushesRollersRollersController.deleteRollers);

// brushes-rollers-spray-paints endpoints
router.post('/brushes-rollers-spray-paints/create',upload.array('photos', 5), BrushesRollersSprayPaintsController.createSprayPaints);
router.get('/brushes-rollers-spray-paints/get', BrushesRollersSprayPaintsController.getAllSprayPaints);
router.get('/brushes-rollers-spray-paints/getOne/:id', BrushesRollersSprayPaintsController.getOneSprayPaints);
router.put('/brushes-rollers-spray-paints/Update/:id',upload.array('photos', 5), BrushesRollersSprayPaintsController.updateSprayPaints);
router.delete('/brushes-rollers-spray-paints/delete/:id', BrushesRollersSprayPaintsController.deleteSprayPaints);

// distemper-acrylic-distemper endpoints
router.post('/distemper-acrylic-distemper/create',upload.array('photos', 5), DistemperAcrylicDistemperController.createAcrylicDistemper);
router.get('/distemper-acrylic-distemper/get', DistemperAcrylicDistemperController.getAllAcrylicDistemper);
router.get('/distemper-acrylic-distemper/getOne/:id', DistemperAcrylicDistemperController.getOneAcrylicDistemper);
router.put('/distemper-acrylic-distemper/Update/:id',upload.array('photos', 5), DistemperAcrylicDistemperController.updateAcrylicDistemper);
router.delete('/distemper-acrylic-distemper/delete/:id', DistemperAcrylicDistemperController.deleteAcrylicDistemper);

// distemper-synthetic-distemper endpoints
router.post('/distemper-synthetic-distemper/create',upload.array('photos', 5), DistemperSyntheticDistemperController.createSyntheticDistemper);
router.get('/distemper-synthetic-distemper/get', DistemperSyntheticDistemperController.getAllSyntheticDistemper);
router.get('/distemper-synthetic-distemper/getOne/:id', DistemperSyntheticDistemperController.getOneSyntheticDistemper);
router.put('/distemper-synthetic-distemper/Update/:id',upload.array('photos', 5), DistemperSyntheticDistemperController.updateSyntheticDistemper);
router.delete('/distemper-synthetic-distemper/delete/:id', DistemperSyntheticDistemperController.deleteSyntheticDistemper);

// emulsion-exterior-emulsion endpoints
router.post('/emulsion-exterior-emulsion/create',upload.array('photos', 5), EmulsionExteriorEmulsionController.createExteriorEmulsion);
router.get('/emulsion-exterior-emulsion/get', EmulsionExteriorEmulsionController.getAllExteriorEmulsion);
router.get('/emulsion-exterior-emulsion/getOne/:id', EmulsionExteriorEmulsionController.getOneExteriorEmulsion);
router.put('/emulsion-exterior-emulsion/Update/:id',upload.array('photos', 5), EmulsionExteriorEmulsionController.updateExteriorEmulsion);
router.delete('/emulsion-exterior-emulsion/delete/:id', EmulsionExteriorEmulsionController.deleteExteriorEmulsion);

// emulsion-interior-emulsion endpoints
router.post('/emulsion-interior-emulsion/create',upload.array('photos', 5), EmulsionInteriorEmulsionController.createInteriorEmulsion);
router.get('/emulsion-interior-emulsion/get', EmulsionInteriorEmulsionController.getAllInteriorEmulsion);
router.get('/emulsion-interior-emulsion/getOne/:id', EmulsionInteriorEmulsionController.getOneInteriorEmulsion);
router.put('/emulsion-interior-emulsion/Update/:id',upload.array('photos', 5), EmulsionInteriorEmulsionController.updateInteriorEmulsion);
router.delete('/emulsion-interior-emulsion/delete/:id', EmulsionInteriorEmulsionController.deleteInteriorEmulsion);

// emulsion-tile-guard endpoints
router.post('/emulsion-tile-guard/create',upload.array('photos', 5), EmulsionTileGuardController.createTileGuard);
router.get('/emulsion-tile-guard/get', EmulsionTileGuardController.getAllTileGuard);
router.get('/emulsion-tile-guard/getOne/:id', EmulsionTileGuardController.getOneTileGuard);
router.put('/emulsion-tile-guard/Update/:id',upload.array('photos', 5), EmulsionTileGuardController.updateTileGuard);
router.delete('/emulsion-tile-guard/delete/:id', EmulsionTileGuardController.deleteTileGuard);

// emulsion-wall-texture endpoints
router.post('/emulsion-wall-texture/create',upload.array('photos', 5), EmulsionWallTextureController.createWallTexture);
router.get('/emulsion-wall-texture/get', EmulsionWallTextureController.getAllWallTexture);
router.get('/emulsion-wall-texture/getOne/:id', EmulsionWallTextureController.getOneWallTexture);
router.put('/emulsion-wall-texture/Update/:id',upload.array('photos', 5), EmulsionWallTextureController.updateWallTexture);
router.delete('/emulsion-wall-texture/delete/:id', EmulsionWallTextureController.deleteWallTexture);

// enamel-gloss-enamel endpoints
router.post('/enamel-gloss-enamel/create',upload.array('photos', 5), EnamelGlossEnamelController.createGlossEnamel);
router.get('/enamel-gloss-enamel/get', EnamelGlossEnamelController.getAllGlossEnamel);
router.get('/enamel-gloss-enamel/getOne/:id', EnamelGlossEnamelController.getOneGlossEnamel);
router.put('/enamel-gloss-enamel/Update/:id',upload.array('photos', 5), EnamelGlossEnamelController.updateGlossEnamel);
router.delete('/enamel-gloss-enamel/delete/:id', EnamelGlossEnamelController.deleteGlossEnamel);

// enamel-satin-enamel endpoints
router.post('/enamel-satin-enamel/create',upload.array('photos', 5), EnamelSatinEnamelController.createSatinEnamel);
router.get('/enamel-satin-enamel/get', EnamelSatinEnamelController.getAllSatinEnamel);
router.get('/enamel-satin-enamel/getOne/:id', EnamelSatinEnamelController.getOneSatinEnamel);
router.put('/enamel-satin-enamel/Update/:id',upload.array('photos', 5), EnamelSatinEnamelController.updateSatinEnamel);
router.delete('/enamel-satin-enamel/delete/:id', EnamelSatinEnamelController.deleteSatinEnamel);

// enamel-synthetic-enamel endpoints
router.post('/enamel-synthetic-enamel/create',upload.array('photos', 5), EnamelSyntheticEnamelController.createSyntheticEnamel);
router.get('/enamel-synthetic-enamel/get', EnamelSyntheticEnamelController.getAllSyntheticEnamel);
router.get('/enamel-synthetic-enamel/getOne/:id', EnamelSyntheticEnamelController.getOneSyntheticEnamel);
router.put('/enamel-synthetic-enamel/Update/:id',upload.array('photos', 5), EnamelSyntheticEnamelController.updateSyntheticEnamel);
router.delete('/enamel-synthetic-enamel/delete/:id', EnamelSyntheticEnamelController.deleteSyntheticEnamel);

// exterior-paints endpoints
router.post('/exterior-paints/create',upload.array('photos', 5), exteriorPaintsController.createExteriorPaints);
router.get('/exterior-paints/get', exteriorPaintsController.getAllExteriorPaints);
router.get('/exterior-paints/getOne/:id', exteriorPaintsController.getOneExteriorPaints);
router.put('/exterior-paints/Update/:id',upload.array('photos', 5), exteriorPaintsController.updateExteriorPaints);
router.delete('/exterior-paints/delete/:id', exteriorPaintsController.deleteExteriorPaints);

// floor-paints endpoints
router.post('/floor-paints/create',upload.array('photos', 5), floorPaintsController.createFloorPaints);
router.get('/floor-paints/get', floorPaintsController.getAllFloorPaints);
router.get('/floor-paints/getOne/:id', floorPaintsController.getOneFloorPaints);
router.put('/floor-paints/Update/:id',upload.array('photos', 5), floorPaintsController.updateFloorPaints);
router.delete('/floor-paints/delete/:id', floorPaintsController.deleteFloorPaints);

// industrial-coatings endpoints
router.post('/industrial-coatings/create',upload.array('photos', 5), industrialCoatingsController.createIndustrialCoatings);
router.get('/industrial-coatings/get', industrialCoatingsController.getAllIndustrialCoatings);
router.get('/industrial-coatings/getOne/:id', industrialCoatingsController.getOneIndustrialCoatings);
router.put('/industrial-coatings/Update/:id',upload.array('photos', 5), industrialCoatingsController.updateIndustrialCoatings);
router.delete('/industrial-coatings/delete/:id', industrialCoatingsController.deleteIndustrialCoatings);

// interior-paints endpoints
router.post('/interior-paints/create',upload.array('photos', 5), interiorPaintsController.createInteriorPaints);
router.get('/interior-paints/get', interiorPaintsController.getAllInteriorPaints);
router.get('/interior-paints/getOne/:id', interiorPaintsController.getOneInteriorPaints);
router.put('/interior-paints/Update/:id',upload.array('photos', 5), interiorPaintsController.updateInteriorPaints);
router.delete('/interior-paints/delete/:id', interiorPaintsController.deleteInteriorPaints);

// painting-accessories-painting-tools endpoints
router.post('/painting-accessories-painting-tools/create',upload.array('photos', 5), PaintingAccessoriesPaintingToolsController.createPaintingTools);
router.get('/painting-accessories-painting-tools/get', PaintingAccessoriesPaintingToolsController.getAllPaintingTools);
router.get('/painting-accessories-painting-tools/getOne/:id', PaintingAccessoriesPaintingToolsController.getOnePaintingTools);
router.put('/painting-accessories-painting-tools/Update/:id',upload.array('photos', 5), PaintingAccessoriesPaintingToolsController.updatePaintingTools);
router.delete('/painting-accessories-painting-tools/delete/:id', PaintingAccessoriesPaintingToolsController.deletePaintingTools);

// painting-accessories-sandpaper-rolls endpoints
router.post('/painting-accessories-sandpaper-rolls/create',upload.array('photos', 5), PaintingAccessoriesSandpaperRollsController.createSandpaperRolls);
router.get('/painting-accessories-sandpaper-rolls/get', PaintingAccessoriesSandpaperRollsController.getAllSandpaperRolls);
router.get('/painting-accessories-sandpaper-rolls/getOne/:id', PaintingAccessoriesSandpaperRollsController.getOneSandpaperRolls);
router.put('/painting-accessories-sandpaper-rolls/Update/:id',upload.array('photos', 5), PaintingAccessoriesSandpaperRollsController.updateSandpaperRolls);
router.delete('/painting-accessories-sandpaper-rolls/delete/:id', PaintingAccessoriesSandpaperRollsController.deleteSandpaperRolls);

// painting-accessories-stencils endpoints
router.post('/painting-accessories-stencils/create',upload.array('photos', 5), PaintingAccessoriesStencilsController.createStencils);
router.get('/painting-accessories-stencils/get', PaintingAccessoriesStencilsController.getAllStencils);
router.get('/painting-accessories-stencils/getOne/:id', PaintingAccessoriesStencilsController.getOneStencils);
router.put('/painting-accessories-stencils/Update/:id',upload.array('photos', 5), PaintingAccessoriesStencilsController.updateStencils);
router.delete('/painting-accessories-stencils/delete/:id', PaintingAccessoriesStencilsController.deleteStencils);

// painting-tools endpoints
router.post('/painting-tools/create',upload.array('photos', 5), paintingToolsController.createPaintingTools);
router.get('/painting-tools/get', paintingToolsController.getAllPaintingTools);
router.get('/painting-tools/getOne/:id', paintingToolsController.getOnePaintingTools);
router.put('/painting-tools/Update/:id',upload.array('photos', 5), paintingToolsController.updatePaintingTools);
router.delete('/painting-tools/delete/:id', paintingToolsController.deletePaintingTools);

// primer-acrylic-primer endpoints
router.post('/primer-acrylic-primer/create',upload.array('photos', 5), PrimerAcrylicPrimerController.createAcrylicPrimer);
router.get('/primer-acrylic-primer/get', PrimerAcrylicPrimerController.getAllAcrylicPrimer);
router.get('/primer-acrylic-primer/getOne/:id', PrimerAcrylicPrimerController.getOneAcrylicPrimer);
router.put('/primer-acrylic-primer/Update/:id',upload.array('photos', 5), PrimerAcrylicPrimerController.updateAcrylicPrimer);
router.delete('/primer-acrylic-primer/delete/:id', PrimerAcrylicPrimerController.deleteAcrylicPrimer);

// primer-cement-primer endpoints
router.post('/primer-cement-primer/create',upload.array('photos', 5), PrimerCementPrimerController.createCementPrimer);
router.get('/primer-cement-primer/get', PrimerCementPrimerController.getAllCementPrimer);
router.get('/primer-cement-primer/getOne/:id', PrimerCementPrimerController.getOneCementPrimer);
router.put('/primer-cement-primer/Update/:id',upload.array('photos', 5), PrimerCementPrimerController.updateCementPrimer);
router.delete('/primer-cement-primer/delete/:id', PrimerCementPrimerController.deleteCementPrimer);

// primer-exterior-primer endpoints
router.post('/primer-exterior-primer/create',upload.array('photos', 5), PrimerExteriorPrimerController.createExteriorPrimer);
router.get('/primer-exterior-primer/get', PrimerExteriorPrimerController.getAllExteriorPrimer);
router.get('/primer-exterior-primer/getOne/:id', PrimerExteriorPrimerController.getOneExteriorPrimer);
router.put('/primer-exterior-primer/Update/:id',upload.array('photos', 5), PrimerExteriorPrimerController.updateExteriorPrimer);
router.delete('/primer-exterior-primer/delete/:id', PrimerExteriorPrimerController.deleteExteriorPrimer);

// primer-interior-primer endpoints
router.post('/primer-interior-primer/create',upload.array('photos', 5), PrimerInteriorPrimerController.createInteriorPrimer);
router.get('/primer-interior-primer/get', PrimerInteriorPrimerController.getAllInteriorPrimer);
router.get('/primer-interior-primer/getOne/:id', PrimerInteriorPrimerController.getOneInteriorPrimer);
router.put('/primer-interior-primer/Update/:id',upload.array('photos', 5), PrimerInteriorPrimerController.updateInteriorPrimer);
router.delete('/primer-interior-primer/delete/:id', PrimerInteriorPrimerController.deleteInteriorPrimer);

// primer-metal-primer endpoints
router.post('/primer-metal-primer/create',upload.array('photos', 5), PrimerMetalPrimerController.createMetalPrimer);
router.get('/primer-metal-primer/get', PrimerMetalPrimerController.getAllMetalPrimer);
router.get('/primer-metal-primer/getOne/:id', PrimerMetalPrimerController.getOneMetalPrimer);
router.put('/primer-metal-primer/Update/:id',upload.array('photos', 5), PrimerMetalPrimerController.updateMetalPrimer);
router.delete('/primer-metal-primer/delete/:id', PrimerMetalPrimerController.deleteMetalPrimer);

// primer-solvent-primer endpoints
router.post('/primer-solvent-primer/create',upload.array('photos', 5), PrimerSolventPrimerController.createSolventPrimer);
router.get('/primer-solvent-primer/get', PrimerSolventPrimerController.getAllSolventPrimer);
router.get('/primer-solvent-primer/getOne/:id', PrimerSolventPrimerController.getOneSolventPrimer);
router.put('/primer-solvent-primer/Update/:id',upload.array('photos', 5), PrimerSolventPrimerController.updateSolventPrimer);
router.delete('/primer-solvent-primer/delete/:id', PrimerSolventPrimerController.deleteSolventPrimer);

// primer-wood-primer endpoints
router.post('/primer-wood-primer/create',upload.array('photos', 5), upload.array('photos', 5), PrimerWoodPrimerController.createWoodPrimer);
router.get('/primer-wood-primer/get', PrimerWoodPrimerController.getAllWoodPrimer);
router.get('/primer-wood-primer/getOne/:id', PrimerWoodPrimerController.getOneWoodPrimer);
router.put('/primer-wood-primer/Update/:id',upload.array('photos', 5), upload.array('photos', 5), PrimerWoodPrimerController.updateWoodPrimer);
router.delete('/primer-wood-primer/delete/:id', PrimerWoodPrimerController.deleteWoodPrimer);

// primer-and-wall-putty endpoints
router.post('/primer-and-wall-putty/create',upload.array('photos', 5), primerAndWallPuttyController.createPrimerAndWallPutty);
router.get('/primer-and-wall-putty/get', primerAndWallPuttyController.getAllPrimerAndWallPutty);
router.get('/primer-and-wall-putty/getOne/:id', primerAndWallPuttyController.getOnePrimerAndWallPutty);
router.put('/primer-and-wall-putty/Update/:id',upload.array('photos', 5), primerAndWallPuttyController.updatePrimerAndWallPutty);
router.delete('/primer-and-wall-putty/delete/:id', primerAndWallPuttyController.deletePrimerAndWallPutty);

// sanitizer endpoints
router.post('/sanitizer/create',upload.array('photos', 5), sanitizerController.createSanitizer);
router.get('/sanitizer/get', sanitizerController.getAllSanitizer);
router.get('/sanitizer/getOne/:id', sanitizerController.getOneSanitizer);
router.put('/sanitizer/Update/:id',upload.array('photos', 5), sanitizerController.updateSanitizer);
router.delete('/sanitizer/delete/:id', sanitizerController.deleteSanitizer);

// spray-paints endpoints
router.post('/spray-paints/create',upload.array('photos', 5), sprayPaintsController.createSprayPaints);
router.get('/spray-paints/get', sprayPaintsController.getAllSprayPaints);
router.get('/spray-paints/getOne/:id', sprayPaintsController.getOneSprayPaints);
router.put('/spray-paints/Update/:id',upload.array('photos', 5), sprayPaintsController.updateSprayPaints);
router.delete('/spray-paints/delete/:id', sprayPaintsController.deleteSprayPaints);

// stainers-universal-stainers endpoints
router.post('/stainers-universal-stainers/create',upload.array('photos', 5), StainersUniversalStainersController.createUniversalStainers);
router.get('/stainers-universal-stainers/get', StainersUniversalStainersController.getAllUniversalStainers);
router.get('/stainers-universal-stainers/getOne/:id', StainersUniversalStainersController.getOneUniversalStainers);
router.put('/stainers-universal-stainers/Update/:id',upload.array('photos', 5), StainersUniversalStainersController.updateUniversalStainers);
router.delete('/stainers-universal-stainers/delete/:id', StainersUniversalStainersController.deleteUniversalStainers);

// stainers-wood-stainers endpoints
router.post('/stainers-wood-stainers/create',upload.array('photos', 5), StainersWoodStainersController.createWoodStainers);
router.get('/stainers-wood-stainers/get', StainersWoodStainersController.getAllWoodStainers);
router.get('/stainers-wood-stainers/getOne/:id', StainersWoodStainersController.getOneWoodStainers);
router.put('/stainers-wood-stainers/Update/:id',upload.array('photos', 5), StainersWoodStainersController.updateWoodStainers);
router.delete('/stainers-wood-stainers/delete/:id', StainersWoodStainersController.deleteWoodStainers);

// stainers-thinners endpoints
router.post('/stainers-thinners/create',upload.array('photos', 5), stainersThinnersController.createStainersThinners);
router.get('/stainers-thinners/get', stainersThinnersController.getAllStainersThinners);
router.get('/stainers-thinners/getOne/:id', stainersThinnersController.getOneStainersThinners);
router.put('/stainers-thinners/Update/:id',upload.array('photos', 5), stainersThinnersController.updateStainersThinners);
router.delete('/stainers-thinners/delete/:id', stainersThinnersController.deleteStainersThinners);

// stencils endpoints
router.post('/stencils/create',upload.array('photos', 5), stencilsController.createStencils);
router.get('/stencils/get', stencilsController.getAllStencils);
router.get('/stencils/getOne/:id', stencilsController.getOneStencils);
router.put('/stencils/Update/:id',upload.array('photos', 5), stencilsController.updateStencils);
router.delete('/stencils/delete/:id', stencilsController.deleteStencils);

// tile-guard endpoints
router.post('/tile-guard/create',upload.array('photos', 5), tileGuardController.createTileGuard);
router.get('/tile-guard/get', tileGuardController.getAllTileGuard);
router.get('/tile-guard/getOne/:id', tileGuardController.getOneTileGuard);
router.put('/tile-guard/Update/:id',upload.array('photos', 5), tileGuardController.updateTileGuard);
router.delete('/tile-guard/delete/:id', tileGuardController.deleteTileGuard);

// top-brands-agsar-paints endpoints
router.post('/top-brands-dulex-paints/create',upload.array('photos', 5), TopBrandsDulexPaintsController.createDulexPaints);
router.get('/top-brands-dulex-paints/get', TopBrandsDulexPaintsController.getAllDulexPaints);
router.get('/top-brands-dulex-paints/getOne/:id', TopBrandsDulexPaintsController.getOneDulexPaints);
router.put('/top-brands-dulex-paints/Update/:id',upload.array('photos', 5), TopBrandsDulexPaintsController.updateDulexPaints);
router.delete('/top-brands-dulex-paints/delete/:id', TopBrandsDulexPaintsController.deleteDulexPaints);

// top-brands-asian-paints endpoints
router.post('/top-brands-asian-paints/create',upload.array('photos', 5), TopBrandsAsianPaintsController.createAsianPaints);
router.get('/top-brands-asian-paints/get', TopBrandsAsianPaintsController.getAllAsianPaints);
router.get('/top-brands-asian-paints/getOne/:id', TopBrandsAsianPaintsController.getOneAsianPaints);
router.put('/top-brands-asian-paints/Update/:id',upload.array('photos', 5), TopBrandsAsianPaintsController.updateAsianPaints);
router.delete('/top-brands-asian-paints/delete/:id', TopBrandsAsianPaintsController.deleteAsianPaints);

// top-brands-gem-paints endpoints
router.post('/top-brands-neroloc-paints/create',upload.array('photos', 5), TopBrandsNerolocPaintsController.createNerolocPaints);
router.get('/top-brands-neroloc-paints/get', TopBrandsNerolocPaintsController.getAllNerolocPaints);
router.get('/top-brands-neroloc-paints/getOne/:id', TopBrandsNerolocPaintsController.getOneNerolocPaints);
router.put('/top-brands-neroloc-paints/Update/:id',upload.array('photos', 5), TopBrandsNerolocPaintsController.updateNerolocPaints);
router.delete('/top-brands-neroloc-paints/delete/:id', TopBrandsNerolocPaintsController.deleteNerolocPaints);

// top-brands-jk-wall-putty endpoints
router.post('/top-brands-jk-wall-putty/create',upload.array('photos', 5), TopBrandsJkWallPuttyController.createJkWallPutty);
router.get('/top-brands-jk-wall-putty/get', TopBrandsJkWallPuttyController.getAllJkWallPutty);
router.get('/top-brands-jk-wall-putty/getOne/:id', TopBrandsJkWallPuttyController.getOneJkWallPutty);
router.put('/top-brands-jk-wall-putty/Update/:id',upload.array('photos', 5), TopBrandsJkWallPuttyController.updateJkWallPutty);
router.delete('/top-brands-jk-wall-putty/delete/:id', TopBrandsJkWallPuttyController.deleteJkWallPutty);

// wall-putty-acrylic-wall-putty endpoints
router.post('/wall-putty-acrylic-wall-putty/create',upload.array('photos', 5), WallPuttyAcrylicWallPuttyController.createAcrylicWallPutty);
router.get('/wall-putty-acrylic-wall-putty/get', WallPuttyAcrylicWallPuttyController.getAllAcrylicWallPutty);
router.get('/wall-putty-acrylic-wall-putty/getOne/:id', WallPuttyAcrylicWallPuttyController.getOneAcrylicWallPutty);
router.put('/wall-putty-acrylic-wall-putty/Update/:id',upload.array('photos', 5), WallPuttyAcrylicWallPuttyController.updateAcrylicWallPutty);
router.delete('/wall-putty-acrylic-wall-putty/delete/:id', WallPuttyAcrylicWallPuttyController.deleteAcrylicWallPutty);

// wall-putty-kpf-wall-putty endpoints
router.post('/wall-putty-kpf-wall-putty/create',upload.array('photos', 5), WallPuttyKpfWallPuttyController.createKpfWallPutty);
router.get('/wall-putty-kpf-wall-putty/get', WallPuttyKpfWallPuttyController.getAllKpfWallPutty);
router.get('/wall-putty-kpf-wall-putty/getOne/:id', WallPuttyKpfWallPuttyController.getOneKpfWallPutty);
router.put('/wall-putty-kpf-wall-putty/Update/:id',upload.array('photos', 5), WallPuttyKpfWallPuttyController.updateKpfWallPutty);
router.delete('/wall-putty-kpf-wall-putty/delete/:id', WallPuttyKpfWallPuttyController.deleteKpfWallPutty);

// wall-putty-powder-wall-putty endpoints
router.post('/wall-putty-powder-wall-putty/create',upload.array('photos', 5), WallPuttyPowderWallPuttyController.createPowderWallPutty);
router.get('/wall-putty-powder-wall-putty/get', WallPuttyPowderWallPuttyController.getAllPowderWallPutty);
router.get('/wall-putty-powder-wall-putty/getOne/:id', WallPuttyPowderWallPuttyController.getOnePowderWallPutty);
router.put('/wall-putty-powder-wall-putty/Update/:id',upload.array('photos', 5), WallPuttyPowderWallPuttyController.updatePowderWallPutty);
router.delete('/wall-putty-powder-wall-putty/delete/:id', WallPuttyPowderWallPuttyController.deletePowderWallPutty);

// wall-stickers-wallpapers endpoints
router.post('/wall-stickers-wallpapers/create',upload.array('photos', 5), wallStickersWallpapersController.createWallStickersWallpapers);
router.get('/wall-stickers-wallpapers/get', wallStickersWallpapersController.getAllWallStickersWallpapers);
router.get('/wall-stickers-wallpapers/getOne/:id', wallStickersWallpapersController.getOneWallStickersWallpapers);
router.put('/wall-stickers-wallpapers/Update/:id',upload.array('photos', 5), wallStickersWallpapersController.updateWallStickersWallpapers);
router.delete('/wall-stickers-wallpapers/delete/:id', wallStickersWallpapersController.deleteWallStickersWallpapers);

// waterproofing-crack-fillers endpoints
router.post('/waterproofing-crack-fillers/create',upload.array('photos', 5), WaterproofingCrackFillersController.createCrackFillers);
router.get('/waterproofing-crack-fillers/get', WaterproofingCrackFillersController.getAllCrackFillers);
router.get('/waterproofing-crack-fillers/getOne/:id', WaterproofingCrackFillersController.getOneCrackFillers);
router.put('/waterproofing-crack-fillers/Update/:id',upload.array('photos', 5), WaterproofingCrackFillersController.updateCrackFillers);
router.delete('/waterproofing-crack-fillers/delete/:id', WaterproofingCrackFillersController.deleteCrackFillers);

// waterproofing-waterproof-basecoat endpoints
router.post('/waterproofing-waterproof-basecoat/create',upload.array('photos', 5), WaterproofingWaterproofBasecoatController.createWaterproofBasecoat);
router.get('/waterproofing-waterproof-basecoat/get', WaterproofingWaterproofBasecoatController.getAllWaterproofBasecoat);
router.get('/waterproofing-waterproof-basecoat/getOne/:id', WaterproofingWaterproofBasecoatController.getOneWaterproofBasecoat);
router.put('/waterproofing-waterproof-basecoat/Update/:id',upload.array('photos', 5), WaterproofingWaterproofBasecoatController.updateWaterproofBasecoat);
router.delete('/waterproofing-waterproof-basecoat/delete/:id', WaterproofingWaterproofBasecoatController.deleteWaterproofBasecoat);

// wood-finishes-glass-coatings endpoints
router.post('/wood-finishes-glass-coatings/create',upload.array('photos', 5), WoodFinishesGlassCoatingsController.createGlassCoatings);
router.get('/wood-finishes-glass-coatings/get', WoodFinishesGlassCoatingsController.getAllGlassCoatings);
router.get('/wood-finishes-glass-coatings/getOne/:id', WoodFinishesGlassCoatingsController.getOneGlassCoatings);
router.put('/wood-finishes-glass-coatings/Update/:id',upload.array('photos', 5), WoodFinishesGlassCoatingsController.updateGlassCoatings);
router.delete('/wood-finishes-glass-coatings/delete/:id', WoodFinishesGlassCoatingsController.deleteGlassCoatings);

// wood-finishes-melamyne endpoints
router.post('/wood-finishes-melamyne/create',upload.array('photos', 5), WoodFinishesMelamyneController.createMelamyne);
router.get('/wood-finishes-melamyne/get', WoodFinishesMelamyneController.getAllMelamyne);
router.get('/wood-finishes-melamyne/getOne/:id', WoodFinishesMelamyneController.getOneMelamyne);
router.put('/wood-finishes-melamyne/Update/:id',upload.array('photos', 5), WoodFinishesMelamyneController.updateMelamyne);
router.delete('/wood-finishes-melamyne/delete/:id', WoodFinishesMelamyneController.deleteMelamyne);

// wood-finishes-nc endpoints
router.post('/wood-finishes-nc/create',upload.array('photos', 5), WoodFinishesNcController.createNc);
router.get('/wood-finishes-nc/get', WoodFinishesNcController.getAllNc);
router.get('/wood-finishes-nc/getOne/:id', WoodFinishesNcController.getOneNc);
router.put('/wood-finishes-nc/Update/:id',upload.array('photos', 5), WoodFinishesNcController.updateNc);
router.delete('/wood-finishes-nc/delete/:id', WoodFinishesNcController.deleteNc);

// wood-finishes-polish endpoints
router.post('/wood-finishes-polish/create',upload.array('photos', 5), WoodFinishesPolishController.createPolish);
router.get('/wood-finishes-polish/get', WoodFinishesPolishController.getAllPolish);
router.get('/wood-finishes-polish/getOne/:id', WoodFinishesPolishController.getOnePolish);
router.put('/wood-finishes-polish/Update/:id',upload.array('photos', 5), WoodFinishesPolishController.updatePolish);
router.delete('/wood-finishes-polish/delete/:id', WoodFinishesPolishController.deletePolish);

// wood-finishes-pu endpoints
router.post('/wood-finishes-pu/create',upload.array('photos', 5), WoodFinishesPuController.createPu);
router.get('/wood-finishes-pu/get', WoodFinishesPuController.getAllPu);
router.get('/wood-finishes-pu/getOne/:id', WoodFinishesPuController.getOnePu);
router.put('/wood-finishes-pu/Update/:id',upload.array('photos', 5), WoodFinishesPuController.updatePu);
router.delete('/wood-finishes-pu/delete/:id', WoodFinishesPuController.deletePu);

// wood-finishes-sealer endpoints
router.post('/wood-finishes-sealer/create',upload.array('photos', 5), WoodFinishesSealerController.createSealer);
router.get('/wood-finishes-sealer/get', WoodFinishesSealerController.getAllSealer);
router.get('/wood-finishes-sealer/getOne/:id', WoodFinishesSealerController.getOneSealer);
router.put('/wood-finishes-sealer/Update/:id',upload.array('photos', 5), WoodFinishesSealerController.updateSealer);
router.delete('/wood-finishes-sealer/delete/:id', WoodFinishesSealerController.deleteSealer);

// wood-finishes-varnish-black-board-paint endpoints
router.post('/wood-finishes-varnish-black-board-paint/create',upload.array('photos', 5), WoodFinishesVarnishBlackBoardPaintController.createVarnishBlackBoardPaint);
router.get('/wood-finishes-varnish-black-board-paint/get', WoodFinishesVarnishBlackBoardPaintController.getAllVarnishBlackBoardPaint);
router.get('/wood-finishes-varnish-black-board-paint/getOne/:id', WoodFinishesVarnishBlackBoardPaintController.getOneVarnishBlackBoardPaint);
router.put('/wood-finishes-varnish-black-board-paint/Update/:id',upload.array('photos', 5), WoodFinishesVarnishBlackBoardPaintController.updateVarnishBlackBoardPaint);
router.delete('/wood-finishes-varnish-black-board-paint/delete/:id', WoodFinishesVarnishBlackBoardPaintController.deleteVarnishBlackBoardPaint);

// wood-finishes-wood-putty endpoints
router.post('/wood-finishes-wood-putty/create',upload.array('photos', 5), WoodFinishesWoodPuttyController.createWoodPutty);
router.get('/wood-finishes-wood-putty/get', WoodFinishesWoodPuttyController.getAllWoodPutty);
router.get('/wood-finishes-wood-putty/getOne/:id', WoodFinishesWoodPuttyController.getOneWoodPutty);
router.put('/wood-finishes-wood-putty/Update/:id',upload.array('photos', 5), WoodFinishesWoodPuttyController.updateWoodPutty);
router.delete('/wood-finishes-wood-putty/delete/:id', WoodFinishesWoodPuttyController.deleteWoodPutty);

// wood-metal endpoints
router.post('/wood-metal/create',upload.array('photos', 5), woodMetalController.createWoodMetal);
router.get('/wood-metal/get', woodMetalController.getAllWoodMetal);
router.get('/wood-metal/getOne/:id', woodMetalController.getOneWoodMetal);
router.put('/wood-metal/Update/:id',upload.array('photos', 5), woodMetalController.updateWoodMetal);
router.delete('/wood-metal/delete/:id', woodMetalController.deleteWoodMetal);


// General route to get all paint products
router.get('/', async (req, res) => {
  try {
    const PaintModels = require('../models/PaintModels');
    const products = await PaintModels.find({});
    res.json(products);
  } catch (error) {
    console.error('Error fetching paint products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
