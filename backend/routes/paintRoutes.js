const express = require('express');
const router = express.Router();
const acrylicEmulsionPaintController = require('../../controllers/paint/acrylicEmulsionPaintController.js');
const AdhesiveThinnerAdhesiveController = require('../../controllers/paint/AdhesiveThinner/adhesiveController.js');
const AdhesiveThinnerThinnerController = require('../../controllers/paint/AdhesiveThinner/thinnerController.js');
const aspaPaintsController = require('../../controllers/paint/aspaPaintsController.js');
const AutomativePaintsAspaPaintsController = require('../../controllers/paint/AutomativePaints/aspaPaintsController.js');
const BrushesRollersPaintBrushesController = require('../../controllers/paint/BrushesRollers/paintBrushesController.js');
const BrushesRollersRollersController = require('../../controllers/paint/BrushesRollers/rollersController.js');
const BrushesRollersSprayPaintsController = require('../../controllers/paint/BrushesRollers/sprayPaintsController.js');
const DistemperAcrylicDistemperController = require('../../controllers/paint/Distemper/acrylicDistemperController.js');
const DistemperSyntheticDistemperController = require('../../controllers/paint/Distemper/syntheticDistemperController.js');
const EmulsionExteriorEmulsionController = require('../../controllers/paint/Emulsion/exteriorEmulsionController.js');
const EmulsionInteriorEmulsionController = require('../../controllers/paint/Emulsion/interiorEmulsionController.js');
const EmulsionTileGuardController = require('../../controllers/paint/Emulsion/tileGuardController.js');
const EmulsionWallTextureController = require('../../controllers/paint/Emulsion/wallTextureController.js');
const EnamelGlossEnamelController = require('../../controllers/paint/Enamel/glossEnamelController.js');
const EnamelSatinEnamelController = require('../../controllers/paint/Enamel/satinEnamelController.js');
const EnamelSyntheticEnamelController = require('../../controllers/paint/Enamel/syntheticEnamelController.js');
const exteriorPaintsController = require('../../controllers/paint/exteriorPaintsController.js');
const floorPaintsController = require('../../controllers/paint/floorPaintsController.js');
const industrialCoatingsController = require('../../controllers/paint/industrialCoatingsController.js');
const interiorPaintsController = require('../../controllers/paint/interiorPaintsController.js');
const PaintingAccessoriesPaintingToolsController = require('../../controllers/paint/PaintingAccessories/paintingToolsController.js');
const PaintingAccessoriesSandpaperRollsController = require('../../controllers/paint/PaintingAccessories/sandpaperRollsController.js');
const PaintingAccessoriesStencilsController = require('../../controllers/paint/PaintingAccessories/stencilsController.js');
const paintingToolsController = require('../../controllers/paint/paintingToolsController.js');
const PrimerAcrylicPrimerController = require('../../controllers/paint/Primer/acrylicPrimerController.js');
const PrimerCementPrimerController = require('../../controllers/paint/Primer/cementPrimerController.js');
const PrimerExteriorPrimerController = require('../../controllers/paint/Primer/exteriorPrimerController.js');
const PrimerInteriorPrimerController = require('../../controllers/paint/Primer/interiorPrimerController.js');
const PrimerMetalPrimerController = require('../../controllers/paint/Primer/metalPrimerController.js');
const PrimerSolventPrimerController = require('../../controllers/paint/Primer/solventPrimerController.js');
const PrimerWoodPrimerController = require('../../controllers/paint/Primer/woodPrimerController.js');
const primerAndWallPuttyController = require('../../controllers/paint/primerAndWallPuttyController.js');
const sanitizerController = require('../../controllers/paint/sanitizerController.js');
const sprayPaintsController = require('../../controllers/paint/sprayPaintsController.js');
const StainersUniversalStainersController = require('../../controllers/paint/Stainers/universalStainersController.js');
const StainersWoodStainersController = require('../../controllers/paint/Stainers/woodStainersController.js');
const stainersThinnersController = require('../../controllers/paint/stainersThinnersController.js');
const stencilsController = require('../../controllers/paint/stencilsController.js');
const tileGuardController = require('../../controllers/paint/tileGuardController.js');
const TopBrandsAgsarPaintsController = require('../../controllers/paint/TopBrands/agsarPaintsController.js');
const TopBrandsAsianPaintsController = require('../../controllers/paint/TopBrands/asianPaintsController.js');
const TopBrandsGemPaintsController = require('../../controllers/paint/TopBrands/gemPaintsController.js');
const TopBrandsJkWallPuttyController = require('../../controllers/paint/TopBrands/jkWallPuttyController.js');
const WallPuttyAcrylicWallPuttyController = require('../../controllers/paint/WallPutty/acrylicWallPuttyController.js');
const WallPuttyKpfWallPuttyController = require('../../controllers/paint/WallPutty/kpfWallPuttyController.js');
const WallPuttyPowderWallPuttyController = require('../../controllers/paint/WallPutty/powderWallPuttyController.js');
const wallStickersWallpapersController = require('../../controllers/paint/wallStickersWallpapersController.js');
const WaterproofingCrackFillersController = require('../../controllers/paint/Waterproofing/crackFillersController.js');
const WaterproofingWaterproofBasecoatController = require('../../controllers/paint/Waterproofing/waterproofBasecoatController.js');
const WoodFinishesGlassCoatingsController = require('../../controllers/paint/WoodFinishes/glassCoatingsController.js');
const WoodFinishesMelamyneController = require('../../controllers/paint/WoodFinishes/melamyneController.js');
const WoodFinishesNcController = require('../../controllers/paint/WoodFinishes/ncController.js');
const WoodFinishesPolishController = require('../../controllers/paint/WoodFinishes/polishController.js');
const WoodFinishesPuController = require('../../controllers/paint/WoodFinishes/puController.js');
const WoodFinishesSealerController = require('../../controllers/paint/WoodFinishes/sealerController.js');
const WoodFinishesVarnishBlackBoardPaintController = require('../../controllers/paint/WoodFinishes/varnishBlackBoardPaintController.js');
const WoodFinishesWoodPuttyController = require('../../controllers/paint/WoodFinishes/woodPuttyController.js');
const woodMetalController = require('../../controllers/paint/woodMetalController.js');

// acrylic-emulsion-paint endpoints
router.post('/acrylic-emulsion-paint', acrylicEmulsionPaintController.createAcrylicEmulsionPaint);
router.get('/acrylic-emulsion-paint', acrylicEmulsionPaintController.getAllAcrylicEmulsionPaint);
router.get('/acrylic-emulsion-paint/:id', acrylicEmulsionPaintController.getOneAcrylicEmulsionPaint);
router.put('/acrylic-emulsion-paint/:id', acrylicEmulsionPaintController.updateAcrylicEmulsionPaint);
router.delete('/acrylic-emulsion-paint/:id', acrylicEmulsionPaintController.deleteAcrylicEmulsionPaint);

// adhesive-thinner-adhesive endpoints
router.post('/adhesive-thinner-adhesive', AdhesiveThinnerAdhesiveController.createAdhesive);
router.get('/adhesive-thinner-adhesive', AdhesiveThinnerAdhesiveController.getAllAdhesive);
router.get('/adhesive-thinner-adhesive/:id', AdhesiveThinnerAdhesiveController.getOneAdhesive);
router.put('/adhesive-thinner-adhesive/:id', AdhesiveThinnerAdhesiveController.updateAdhesive);
router.delete('/adhesive-thinner-adhesive/:id', AdhesiveThinnerAdhesiveController.deleteAdhesive);

// adhesive-thinner-thinner endpoints
router.post('/adhesive-thinner-thinner', AdhesiveThinnerThinnerController.createThinner);
router.get('/adhesive-thinner-thinner', AdhesiveThinnerThinnerController.getAllThinner);
router.get('/adhesive-thinner-thinner/:id', AdhesiveThinnerThinnerController.getOneThinner);
router.put('/adhesive-thinner-thinner/:id', AdhesiveThinnerThinnerController.updateThinner);
router.delete('/adhesive-thinner-thinner/:id', AdhesiveThinnerThinnerController.deleteThinner);

// aspa-paints endpoints
router.post('/aspa-paints', aspaPaintsController.createAspaPaints);
router.get('/aspa-paints', aspaPaintsController.getAllAspaPaints);
router.get('/aspa-paints/:id', aspaPaintsController.getOneAspaPaints);
router.put('/aspa-paints/:id', aspaPaintsController.updateAspaPaints);
router.delete('/aspa-paints/:id', aspaPaintsController.deleteAspaPaints);

// automative-paints-aspa-paints endpoints
router.post('/automative-paints-aspa-paints', AutomativePaintsAspaPaintsController.createAspaPaints);
router.get('/automative-paints-aspa-paints', AutomativePaintsAspaPaintsController.getAllAspaPaints);
router.get('/automative-paints-aspa-paints/:id', AutomativePaintsAspaPaintsController.getOneAspaPaints);
router.put('/automative-paints-aspa-paints/:id', AutomativePaintsAspaPaintsController.updateAspaPaints);
router.delete('/automative-paints-aspa-paints/:id', AutomativePaintsAspaPaintsController.deleteAspaPaints);

// brushes-rollers-paint-brushes endpoints
router.post('/brushes-rollers-paint-brushes', BrushesRollersPaintBrushesController.createPaintBrushes);
router.get('/brushes-rollers-paint-brushes', BrushesRollersPaintBrushesController.getAllPaintBrushes);
router.get('/brushes-rollers-paint-brushes/:id', BrushesRollersPaintBrushesController.getOnePaintBrushes);
router.put('/brushes-rollers-paint-brushes/:id', BrushesRollersPaintBrushesController.updatePaintBrushes);
router.delete('/brushes-rollers-paint-brushes/:id', BrushesRollersPaintBrushesController.deletePaintBrushes);

// brushes-rollers-rollers endpoints
router.post('/brushes-rollers-rollers', BrushesRollersRollersController.createRollers);
router.get('/brushes-rollers-rollers', BrushesRollersRollersController.getAllRollers);
router.get('/brushes-rollers-rollers/:id', BrushesRollersRollersController.getOneRollers);
router.put('/brushes-rollers-rollers/:id', BrushesRollersRollersController.updateRollers);
router.delete('/brushes-rollers-rollers/:id', BrushesRollersRollersController.deleteRollers);

// brushes-rollers-spray-paints endpoints
router.post('/brushes-rollers-spray-paints', BrushesRollersSprayPaintsController.createSprayPaints);
router.get('/brushes-rollers-spray-paints', BrushesRollersSprayPaintsController.getAllSprayPaints);
router.get('/brushes-rollers-spray-paints/:id', BrushesRollersSprayPaintsController.getOneSprayPaints);
router.put('/brushes-rollers-spray-paints/:id', BrushesRollersSprayPaintsController.updateSprayPaints);
router.delete('/brushes-rollers-spray-paints/:id', BrushesRollersSprayPaintsController.deleteSprayPaints);

// distemper-acrylic-distemper endpoints
router.post('/distemper-acrylic-distemper', DistemperAcrylicDistemperController.createAcrylicDistemper);
router.get('/distemper-acrylic-distemper', DistemperAcrylicDistemperController.getAllAcrylicDistemper);
router.get('/distemper-acrylic-distemper/:id', DistemperAcrylicDistemperController.getOneAcrylicDistemper);
router.put('/distemper-acrylic-distemper/:id', DistemperAcrylicDistemperController.updateAcrylicDistemper);
router.delete('/distemper-acrylic-distemper/:id', DistemperAcrylicDistemperController.deleteAcrylicDistemper);

// distemper-synthetic-distemper endpoints
router.post('/distemper-synthetic-distemper', DistemperSyntheticDistemperController.createSyntheticDistemper);
router.get('/distemper-synthetic-distemper', DistemperSyntheticDistemperController.getAllSyntheticDistemper);
router.get('/distemper-synthetic-distemper/:id', DistemperSyntheticDistemperController.getOneSyntheticDistemper);
router.put('/distemper-synthetic-distemper/:id', DistemperSyntheticDistemperController.updateSyntheticDistemper);
router.delete('/distemper-synthetic-distemper/:id', DistemperSyntheticDistemperController.deleteSyntheticDistemper);

// emulsion-exterior-emulsion endpoints
router.post('/emulsion-exterior-emulsion', EmulsionExteriorEmulsionController.createExteriorEmulsion);
router.get('/emulsion-exterior-emulsion', EmulsionExteriorEmulsionController.getAllExteriorEmulsion);
router.get('/emulsion-exterior-emulsion/:id', EmulsionExteriorEmulsionController.getOneExteriorEmulsion);
router.put('/emulsion-exterior-emulsion/:id', EmulsionExteriorEmulsionController.updateExteriorEmulsion);
router.delete('/emulsion-exterior-emulsion/:id', EmulsionExteriorEmulsionController.deleteExteriorEmulsion);

// emulsion-interior-emulsion endpoints
router.post('/emulsion-interior-emulsion', EmulsionInteriorEmulsionController.createInteriorEmulsion);
router.get('/emulsion-interior-emulsion', EmulsionInteriorEmulsionController.getAllInteriorEmulsion);
router.get('/emulsion-interior-emulsion/:id', EmulsionInteriorEmulsionController.getOneInteriorEmulsion);
router.put('/emulsion-interior-emulsion/:id', EmulsionInteriorEmulsionController.updateInteriorEmulsion);
router.delete('/emulsion-interior-emulsion/:id', EmulsionInteriorEmulsionController.deleteInteriorEmulsion);

// emulsion-tile-guard endpoints
router.post('/emulsion-tile-guard', EmulsionTileGuardController.createTileGuard);
router.get('/emulsion-tile-guard', EmulsionTileGuardController.getAllTileGuard);
router.get('/emulsion-tile-guard/:id', EmulsionTileGuardController.getOneTileGuard);
router.put('/emulsion-tile-guard/:id', EmulsionTileGuardController.updateTileGuard);
router.delete('/emulsion-tile-guard/:id', EmulsionTileGuardController.deleteTileGuard);

// emulsion-wall-texture endpoints
router.post('/emulsion-wall-texture', EmulsionWallTextureController.createWallTexture);
router.get('/emulsion-wall-texture', EmulsionWallTextureController.getAllWallTexture);
router.get('/emulsion-wall-texture/:id', EmulsionWallTextureController.getOneWallTexture);
router.put('/emulsion-wall-texture/:id', EmulsionWallTextureController.updateWallTexture);
router.delete('/emulsion-wall-texture/:id', EmulsionWallTextureController.deleteWallTexture);

// enamel-gloss-enamel endpoints
router.post('/enamel-gloss-enamel', EnamelGlossEnamelController.createGlossEnamel);
router.get('/enamel-gloss-enamel', EnamelGlossEnamelController.getAllGlossEnamel);
router.get('/enamel-gloss-enamel/:id', EnamelGlossEnamelController.getOneGlossEnamel);
router.put('/enamel-gloss-enamel/:id', EnamelGlossEnamelController.updateGlossEnamel);
router.delete('/enamel-gloss-enamel/:id', EnamelGlossEnamelController.deleteGlossEnamel);

// enamel-satin-enamel endpoints
router.post('/enamel-satin-enamel', EnamelSatinEnamelController.createSatinEnamel);
router.get('/enamel-satin-enamel', EnamelSatinEnamelController.getAllSatinEnamel);
router.get('/enamel-satin-enamel/:id', EnamelSatinEnamelController.getOneSatinEnamel);
router.put('/enamel-satin-enamel/:id', EnamelSatinEnamelController.updateSatinEnamel);
router.delete('/enamel-satin-enamel/:id', EnamelSatinEnamelController.deleteSatinEnamel);

// enamel-synthetic-enamel endpoints
router.post('/enamel-synthetic-enamel', EnamelSyntheticEnamelController.createSyntheticEnamel);
router.get('/enamel-synthetic-enamel', EnamelSyntheticEnamelController.getAllSyntheticEnamel);
router.get('/enamel-synthetic-enamel/:id', EnamelSyntheticEnamelController.getOneSyntheticEnamel);
router.put('/enamel-synthetic-enamel/:id', EnamelSyntheticEnamelController.updateSyntheticEnamel);
router.delete('/enamel-synthetic-enamel/:id', EnamelSyntheticEnamelController.deleteSyntheticEnamel);

// exterior-paints endpoints
router.post('/exterior-paints', exteriorPaintsController.createExteriorPaints);
router.get('/exterior-paints', exteriorPaintsController.getAllExteriorPaints);
router.get('/exterior-paints/:id', exteriorPaintsController.getOneExteriorPaints);
router.put('/exterior-paints/:id', exteriorPaintsController.updateExteriorPaints);
router.delete('/exterior-paints/:id', exteriorPaintsController.deleteExteriorPaints);

// floor-paints endpoints
router.post('/floor-paints', floorPaintsController.createFloorPaints);
router.get('/floor-paints', floorPaintsController.getAllFloorPaints);
router.get('/floor-paints/:id', floorPaintsController.getOneFloorPaints);
router.put('/floor-paints/:id', floorPaintsController.updateFloorPaints);
router.delete('/floor-paints/:id', floorPaintsController.deleteFloorPaints);

// industrial-coatings endpoints
router.post('/industrial-coatings', industrialCoatingsController.createIndustrialCoatings);
router.get('/industrial-coatings', industrialCoatingsController.getAllIndustrialCoatings);
router.get('/industrial-coatings/:id', industrialCoatingsController.getOneIndustrialCoatings);
router.put('/industrial-coatings/:id', industrialCoatingsController.updateIndustrialCoatings);
router.delete('/industrial-coatings/:id', industrialCoatingsController.deleteIndustrialCoatings);

// interior-paints endpoints
router.post('/interior-paints', interiorPaintsController.createInteriorPaints);
router.get('/interior-paints', interiorPaintsController.getAllInteriorPaints);
router.get('/interior-paints/:id', interiorPaintsController.getOneInteriorPaints);
router.put('/interior-paints/:id', interiorPaintsController.updateInteriorPaints);
router.delete('/interior-paints/:id', interiorPaintsController.deleteInteriorPaints);

// painting-accessories-painting-tools endpoints
router.post('/painting-accessories-painting-tools', PaintingAccessoriesPaintingToolsController.createPaintingTools);
router.get('/painting-accessories-painting-tools', PaintingAccessoriesPaintingToolsController.getAllPaintingTools);
router.get('/painting-accessories-painting-tools/:id', PaintingAccessoriesPaintingToolsController.getOnePaintingTools);
router.put('/painting-accessories-painting-tools/:id', PaintingAccessoriesPaintingToolsController.updatePaintingTools);
router.delete('/painting-accessories-painting-tools/:id', PaintingAccessoriesPaintingToolsController.deletePaintingTools);

// painting-accessories-sandpaper-rolls endpoints
router.post('/painting-accessories-sandpaper-rolls', PaintingAccessoriesSandpaperRollsController.createSandpaperRolls);
router.get('/painting-accessories-sandpaper-rolls', PaintingAccessoriesSandpaperRollsController.getAllSandpaperRolls);
router.get('/painting-accessories-sandpaper-rolls/:id', PaintingAccessoriesSandpaperRollsController.getOneSandpaperRolls);
router.put('/painting-accessories-sandpaper-rolls/:id', PaintingAccessoriesSandpaperRollsController.updateSandpaperRolls);
router.delete('/painting-accessories-sandpaper-rolls/:id', PaintingAccessoriesSandpaperRollsController.deleteSandpaperRolls);

// painting-accessories-stencils endpoints
router.post('/painting-accessories-stencils', PaintingAccessoriesStencilsController.createStencils);
router.get('/painting-accessories-stencils', PaintingAccessoriesStencilsController.getAllStencils);
router.get('/painting-accessories-stencils/:id', PaintingAccessoriesStencilsController.getOneStencils);
router.put('/painting-accessories-stencils/:id', PaintingAccessoriesStencilsController.updateStencils);
router.delete('/painting-accessories-stencils/:id', PaintingAccessoriesStencilsController.deleteStencils);

// painting-tools endpoints
router.post('/painting-tools', paintingToolsController.createPaintingTools);
router.get('/painting-tools', paintingToolsController.getAllPaintingTools);
router.get('/painting-tools/:id', paintingToolsController.getOnePaintingTools);
router.put('/painting-tools/:id', paintingToolsController.updatePaintingTools);
router.delete('/painting-tools/:id', paintingToolsController.deletePaintingTools);

// primer-acrylic-primer endpoints
router.post('/primer-acrylic-primer', PrimerAcrylicPrimerController.createAcrylicPrimer);
router.get('/primer-acrylic-primer', PrimerAcrylicPrimerController.getAllAcrylicPrimer);
router.get('/primer-acrylic-primer/:id', PrimerAcrylicPrimerController.getOneAcrylicPrimer);
router.put('/primer-acrylic-primer/:id', PrimerAcrylicPrimerController.updateAcrylicPrimer);
router.delete('/primer-acrylic-primer/:id', PrimerAcrylicPrimerController.deleteAcrylicPrimer);

// primer-cement-primer endpoints
router.post('/primer-cement-primer', PrimerCementPrimerController.createCementPrimer);
router.get('/primer-cement-primer', PrimerCementPrimerController.getAllCementPrimer);
router.get('/primer-cement-primer/:id', PrimerCementPrimerController.getOneCementPrimer);
router.put('/primer-cement-primer/:id', PrimerCementPrimerController.updateCementPrimer);
router.delete('/primer-cement-primer/:id', PrimerCementPrimerController.deleteCementPrimer);

// primer-exterior-primer endpoints
router.post('/primer-exterior-primer', PrimerExteriorPrimerController.createExteriorPrimer);
router.get('/primer-exterior-primer', PrimerExteriorPrimerController.getAllExteriorPrimer);
router.get('/primer-exterior-primer/:id', PrimerExteriorPrimerController.getOneExteriorPrimer);
router.put('/primer-exterior-primer/:id', PrimerExteriorPrimerController.updateExteriorPrimer);
router.delete('/primer-exterior-primer/:id', PrimerExteriorPrimerController.deleteExteriorPrimer);

// primer-interior-primer endpoints
router.post('/primer-interior-primer', PrimerInteriorPrimerController.createInteriorPrimer);
router.get('/primer-interior-primer', PrimerInteriorPrimerController.getAllInteriorPrimer);
router.get('/primer-interior-primer/:id', PrimerInteriorPrimerController.getOneInteriorPrimer);
router.put('/primer-interior-primer/:id', PrimerInteriorPrimerController.updateInteriorPrimer);
router.delete('/primer-interior-primer/:id', PrimerInteriorPrimerController.deleteInteriorPrimer);

// primer-metal-primer endpoints
router.post('/primer-metal-primer', PrimerMetalPrimerController.createMetalPrimer);
router.get('/primer-metal-primer', PrimerMetalPrimerController.getAllMetalPrimer);
router.get('/primer-metal-primer/:id', PrimerMetalPrimerController.getOneMetalPrimer);
router.put('/primer-metal-primer/:id', PrimerMetalPrimerController.updateMetalPrimer);
router.delete('/primer-metal-primer/:id', PrimerMetalPrimerController.deleteMetalPrimer);

// primer-solvent-primer endpoints
router.post('/primer-solvent-primer', PrimerSolventPrimerController.createSolventPrimer);
router.get('/primer-solvent-primer', PrimerSolventPrimerController.getAllSolventPrimer);
router.get('/primer-solvent-primer/:id', PrimerSolventPrimerController.getOneSolventPrimer);
router.put('/primer-solvent-primer/:id', PrimerSolventPrimerController.updateSolventPrimer);
router.delete('/primer-solvent-primer/:id', PrimerSolventPrimerController.deleteSolventPrimer);

// primer-wood-primer endpoints
router.post('/primer-wood-primer', PrimerWoodPrimerController.createWoodPrimer);
router.get('/primer-wood-primer', PrimerWoodPrimerController.getAllWoodPrimer);
router.get('/primer-wood-primer/:id', PrimerWoodPrimerController.getOneWoodPrimer);
router.put('/primer-wood-primer/:id', PrimerWoodPrimerController.updateWoodPrimer);
router.delete('/primer-wood-primer/:id', PrimerWoodPrimerController.deleteWoodPrimer);

// primer-and-wall-putty endpoints
router.post('/primer-and-wall-putty', primerAndWallPuttyController.createPrimerAndWallPutty);
router.get('/primer-and-wall-putty', primerAndWallPuttyController.getAllPrimerAndWallPutty);
router.get('/primer-and-wall-putty/:id', primerAndWallPuttyController.getOnePrimerAndWallPutty);
router.put('/primer-and-wall-putty/:id', primerAndWallPuttyController.updatePrimerAndWallPutty);
router.delete('/primer-and-wall-putty/:id', primerAndWallPuttyController.deletePrimerAndWallPutty);

// sanitizer endpoints
router.post('/sanitizer', sanitizerController.createSanitizer);
router.get('/sanitizer', sanitizerController.getAllSanitizer);
router.get('/sanitizer/:id', sanitizerController.getOneSanitizer);
router.put('/sanitizer/:id', sanitizerController.updateSanitizer);
router.delete('/sanitizer/:id', sanitizerController.deleteSanitizer);

// spray-paints endpoints
router.post('/spray-paints', sprayPaintsController.createSprayPaints);
router.get('/spray-paints', sprayPaintsController.getAllSprayPaints);
router.get('/spray-paints/:id', sprayPaintsController.getOneSprayPaints);
router.put('/spray-paints/:id', sprayPaintsController.updateSprayPaints);
router.delete('/spray-paints/:id', sprayPaintsController.deleteSprayPaints);

// stainers-universal-stainers endpoints
router.post('/stainers-universal-stainers', StainersUniversalStainersController.createUniversalStainers);
router.get('/stainers-universal-stainers', StainersUniversalStainersController.getAllUniversalStainers);
router.get('/stainers-universal-stainers/:id', StainersUniversalStainersController.getOneUniversalStainers);
router.put('/stainers-universal-stainers/:id', StainersUniversalStainersController.updateUniversalStainers);
router.delete('/stainers-universal-stainers/:id', StainersUniversalStainersController.deleteUniversalStainers);

// stainers-wood-stainers endpoints
router.post('/stainers-wood-stainers', StainersWoodStainersController.createWoodStainers);
router.get('/stainers-wood-stainers', StainersWoodStainersController.getAllWoodStainers);
router.get('/stainers-wood-stainers/:id', StainersWoodStainersController.getOneWoodStainers);
router.put('/stainers-wood-stainers/:id', StainersWoodStainersController.updateWoodStainers);
router.delete('/stainers-wood-stainers/:id', StainersWoodStainersController.deleteWoodStainers);

// stainers-thinners endpoints
router.post('/stainers-thinners', stainersThinnersController.createStainersThinners);
router.get('/stainers-thinners', stainersThinnersController.getAllStainersThinners);
router.get('/stainers-thinners/:id', stainersThinnersController.getOneStainersThinners);
router.put('/stainers-thinners/:id', stainersThinnersController.updateStainersThinners);
router.delete('/stainers-thinners/:id', stainersThinnersController.deleteStainersThinners);

// stencils endpoints
router.post('/stencils', stencilsController.createStencils);
router.get('/stencils', stencilsController.getAllStencils);
router.get('/stencils/:id', stencilsController.getOneStencils);
router.put('/stencils/:id', stencilsController.updateStencils);
router.delete('/stencils/:id', stencilsController.deleteStencils);

// tile-guard endpoints
router.post('/tile-guard', tileGuardController.createTileGuard);
router.get('/tile-guard', tileGuardController.getAllTileGuard);
router.get('/tile-guard/:id', tileGuardController.getOneTileGuard);
router.put('/tile-guard/:id', tileGuardController.updateTileGuard);
router.delete('/tile-guard/:id', tileGuardController.deleteTileGuard);

// top-brands-agsar-paints endpoints
router.post('/top-brands-agsar-paints', TopBrandsAgsarPaintsController.createAgsarPaints);
router.get('/top-brands-agsar-paints', TopBrandsAgsarPaintsController.getAllAgsarPaints);
router.get('/top-brands-agsar-paints/:id', TopBrandsAgsarPaintsController.getOneAgsarPaints);
router.put('/top-brands-agsar-paints/:id', TopBrandsAgsarPaintsController.updateAgsarPaints);
router.delete('/top-brands-agsar-paints/:id', TopBrandsAgsarPaintsController.deleteAgsarPaints);

// top-brands-asian-paints endpoints
router.post('/top-brands-asian-paints', TopBrandsAsianPaintsController.createAsianPaints);
router.get('/top-brands-asian-paints', TopBrandsAsianPaintsController.getAllAsianPaints);
router.get('/top-brands-asian-paints/:id', TopBrandsAsianPaintsController.getOneAsianPaints);
router.put('/top-brands-asian-paints/:id', TopBrandsAsianPaintsController.updateAsianPaints);
router.delete('/top-brands-asian-paints/:id', TopBrandsAsianPaintsController.deleteAsianPaints);

// top-brands-gem-paints endpoints
router.post('/top-brands-gem-paints', TopBrandsGemPaintsController.createGemPaints);
router.get('/top-brands-gem-paints', TopBrandsGemPaintsController.getAllGemPaints);
router.get('/top-brands-gem-paints/:id', TopBrandsGemPaintsController.getOneGemPaints);
router.put('/top-brands-gem-paints/:id', TopBrandsGemPaintsController.updateGemPaints);
router.delete('/top-brands-gem-paints/:id', TopBrandsGemPaintsController.deleteGemPaints);

// top-brands-jk-wall-putty endpoints
router.post('/top-brands-jk-wall-putty', TopBrandsJkWallPuttyController.createJkWallPutty);
router.get('/top-brands-jk-wall-putty', TopBrandsJkWallPuttyController.getAllJkWallPutty);
router.get('/top-brands-jk-wall-putty/:id', TopBrandsJkWallPuttyController.getOneJkWallPutty);
router.put('/top-brands-jk-wall-putty/:id', TopBrandsJkWallPuttyController.updateJkWallPutty);
router.delete('/top-brands-jk-wall-putty/:id', TopBrandsJkWallPuttyController.deleteJkWallPutty);

// wall-putty-acrylic-wall-putty endpoints
router.post('/wall-putty-acrylic-wall-putty', WallPuttyAcrylicWallPuttyController.createAcrylicWallPutty);
router.get('/wall-putty-acrylic-wall-putty', WallPuttyAcrylicWallPuttyController.getAllAcrylicWallPutty);
router.get('/wall-putty-acrylic-wall-putty/:id', WallPuttyAcrylicWallPuttyController.getOneAcrylicWallPutty);
router.put('/wall-putty-acrylic-wall-putty/:id', WallPuttyAcrylicWallPuttyController.updateAcrylicWallPutty);
router.delete('/wall-putty-acrylic-wall-putty/:id', WallPuttyAcrylicWallPuttyController.deleteAcrylicWallPutty);

// wall-putty-kpf-wall-putty endpoints
router.post('/wall-putty-kpf-wall-putty', WallPuttyKpfWallPuttyController.createKpfWallPutty);
router.get('/wall-putty-kpf-wall-putty', WallPuttyKpfWallPuttyController.getAllKpfWallPutty);
router.get('/wall-putty-kpf-wall-putty/:id', WallPuttyKpfWallPuttyController.getOneKpfWallPutty);
router.put('/wall-putty-kpf-wall-putty/:id', WallPuttyKpfWallPuttyController.updateKpfWallPutty);
router.delete('/wall-putty-kpf-wall-putty/:id', WallPuttyKpfWallPuttyController.deleteKpfWallPutty);

// wall-putty-powder-wall-putty endpoints
router.post('/wall-putty-powder-wall-putty', WallPuttyPowderWallPuttyController.createPowderWallPutty);
router.get('/wall-putty-powder-wall-putty', WallPuttyPowderWallPuttyController.getAllPowderWallPutty);
router.get('/wall-putty-powder-wall-putty/:id', WallPuttyPowderWallPuttyController.getOnePowderWallPutty);
router.put('/wall-putty-powder-wall-putty/:id', WallPuttyPowderWallPuttyController.updatePowderWallPutty);
router.delete('/wall-putty-powder-wall-putty/:id', WallPuttyPowderWallPuttyController.deletePowderWallPutty);

// wall-stickers-wallpapers endpoints
router.post('/wall-stickers-wallpapers', wallStickersWallpapersController.createWallStickersWallpapers);
router.get('/wall-stickers-wallpapers', wallStickersWallpapersController.getAllWallStickersWallpapers);
router.get('/wall-stickers-wallpapers/:id', wallStickersWallpapersController.getOneWallStickersWallpapers);
router.put('/wall-stickers-wallpapers/:id', wallStickersWallpapersController.updateWallStickersWallpapers);
router.delete('/wall-stickers-wallpapers/:id', wallStickersWallpapersController.deleteWallStickersWallpapers);

// waterproofing-crack-fillers endpoints
router.post('/waterproofing-crack-fillers', WaterproofingCrackFillersController.createCrackFillers);
router.get('/waterproofing-crack-fillers', WaterproofingCrackFillersController.getAllCrackFillers);
router.get('/waterproofing-crack-fillers/:id', WaterproofingCrackFillersController.getOneCrackFillers);
router.put('/waterproofing-crack-fillers/:id', WaterproofingCrackFillersController.updateCrackFillers);
router.delete('/waterproofing-crack-fillers/:id', WaterproofingCrackFillersController.deleteCrackFillers);

// waterproofing-waterproof-basecoat endpoints
router.post('/waterproofing-waterproof-basecoat', WaterproofingWaterproofBasecoatController.createWaterproofBasecoat);
router.get('/waterproofing-waterproof-basecoat', WaterproofingWaterproofBasecoatController.getAllWaterproofBasecoat);
router.get('/waterproofing-waterproof-basecoat/:id', WaterproofingWaterproofBasecoatController.getOneWaterproofBasecoat);
router.put('/waterproofing-waterproof-basecoat/:id', WaterproofingWaterproofBasecoatController.updateWaterproofBasecoat);
router.delete('/waterproofing-waterproof-basecoat/:id', WaterproofingWaterproofBasecoatController.deleteWaterproofBasecoat);

// wood-finishes-glass-coatings endpoints
router.post('/wood-finishes-glass-coatings', WoodFinishesGlassCoatingsController.createGlassCoatings);
router.get('/wood-finishes-glass-coatings', WoodFinishesGlassCoatingsController.getAllGlassCoatings);
router.get('/wood-finishes-glass-coatings/:id', WoodFinishesGlassCoatingsController.getOneGlassCoatings);
router.put('/wood-finishes-glass-coatings/:id', WoodFinishesGlassCoatingsController.updateGlassCoatings);
router.delete('/wood-finishes-glass-coatings/:id', WoodFinishesGlassCoatingsController.deleteGlassCoatings);

// wood-finishes-melamyne endpoints
router.post('/wood-finishes-melamyne', WoodFinishesMelamyneController.createMelamyne);
router.get('/wood-finishes-melamyne', WoodFinishesMelamyneController.getAllMelamyne);
router.get('/wood-finishes-melamyne/:id', WoodFinishesMelamyneController.getOneMelamyne);
router.put('/wood-finishes-melamyne/:id', WoodFinishesMelamyneController.updateMelamyne);
router.delete('/wood-finishes-melamyne/:id', WoodFinishesMelamyneController.deleteMelamyne);

// wood-finishes-nc endpoints
router.post('/wood-finishes-nc', WoodFinishesNcController.createNc);
router.get('/wood-finishes-nc', WoodFinishesNcController.getAllNc);
router.get('/wood-finishes-nc/:id', WoodFinishesNcController.getOneNc);
router.put('/wood-finishes-nc/:id', WoodFinishesNcController.updateNc);
router.delete('/wood-finishes-nc/:id', WoodFinishesNcController.deleteNc);

// wood-finishes-polish endpoints
router.post('/wood-finishes-polish', WoodFinishesPolishController.createPolish);
router.get('/wood-finishes-polish', WoodFinishesPolishController.getAllPolish);
router.get('/wood-finishes-polish/:id', WoodFinishesPolishController.getOnePolish);
router.put('/wood-finishes-polish/:id', WoodFinishesPolishController.updatePolish);
router.delete('/wood-finishes-polish/:id', WoodFinishesPolishController.deletePolish);

// wood-finishes-pu endpoints
router.post('/wood-finishes-pu', WoodFinishesPuController.createPu);
router.get('/wood-finishes-pu', WoodFinishesPuController.getAllPu);
router.get('/wood-finishes-pu/:id', WoodFinishesPuController.getOnePu);
router.put('/wood-finishes-pu/:id', WoodFinishesPuController.updatePu);
router.delete('/wood-finishes-pu/:id', WoodFinishesPuController.deletePu);

// wood-finishes-sealer endpoints
router.post('/wood-finishes-sealer', WoodFinishesSealerController.createSealer);
router.get('/wood-finishes-sealer', WoodFinishesSealerController.getAllSealer);
router.get('/wood-finishes-sealer/:id', WoodFinishesSealerController.getOneSealer);
router.put('/wood-finishes-sealer/:id', WoodFinishesSealerController.updateSealer);
router.delete('/wood-finishes-sealer/:id', WoodFinishesSealerController.deleteSealer);

// wood-finishes-varnish-black-board-paint endpoints
router.post('/wood-finishes-varnish-black-board-paint', WoodFinishesVarnishBlackBoardPaintController.createVarnishBlackBoardPaint);
router.get('/wood-finishes-varnish-black-board-paint', WoodFinishesVarnishBlackBoardPaintController.getAllVarnishBlackBoardPaint);
router.get('/wood-finishes-varnish-black-board-paint/:id', WoodFinishesVarnishBlackBoardPaintController.getOneVarnishBlackBoardPaint);
router.put('/wood-finishes-varnish-black-board-paint/:id', WoodFinishesVarnishBlackBoardPaintController.updateVarnishBlackBoardPaint);
router.delete('/wood-finishes-varnish-black-board-paint/:id', WoodFinishesVarnishBlackBoardPaintController.deleteVarnishBlackBoardPaint);

// wood-finishes-wood-putty endpoints
router.post('/wood-finishes-wood-putty', WoodFinishesWoodPuttyController.createWoodPutty);
router.get('/wood-finishes-wood-putty', WoodFinishesWoodPuttyController.getAllWoodPutty);
router.get('/wood-finishes-wood-putty/:id', WoodFinishesWoodPuttyController.getOneWoodPutty);
router.put('/wood-finishes-wood-putty/:id', WoodFinishesWoodPuttyController.updateWoodPutty);
router.delete('/wood-finishes-wood-putty/:id', WoodFinishesWoodPuttyController.deleteWoodPutty);

// wood-metal endpoints
router.post('/wood-metal', woodMetalController.createWoodMetal);
router.get('/wood-metal', woodMetalController.getAllWoodMetal);
router.get('/wood-metal/:id', woodMetalController.getOneWoodMetal);
router.put('/wood-metal/:id', woodMetalController.updateWoodMetal);
router.delete('/wood-metal/:id', woodMetalController.deleteWoodMetal);


module.exports = router;
