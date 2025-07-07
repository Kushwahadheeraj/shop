const express = require('express');
const router = express.Router();
const acrylicProductsController = require('../../controllers/sanitary/acrylicProductsController.js');
const bathroomAccessoriesController = require('../../controllers/sanitary/bathroomAccessoriesController.js');
const BathsenseCPfittingsFaucetsAltiusController = require('../../controllers/sanitary/Bathsense/CPfittingsFaucets/AltiusController.js');
const BathsenseCPfittingsFaucetsBathsenseEssentialsController = require('../../controllers/sanitary/Bathsense/CPfittingsFaucets/BathsenseEssentialsController.js');
const BathsenseCPfittingsFaucetsBathsenseShowersController = require('../../controllers/sanitary/Bathsense/CPfittingsFaucets/BathsenseShowersController.js');
const BathsenseCPfittingsFaucetsColossusController = require('../../controllers/sanitary/Bathsense/CPfittingsFaucets/ColossusController.js');
const BathsenseCPfittingsFaucetsInvictusController = require('../../controllers/sanitary/Bathsense/CPfittingsFaucets/InvictusController.js');
const BathsenseCPfittingsFaucetsMaximusController = require('../../controllers/sanitary/Bathsense/CPfittingsFaucets/MaximusController.js');
const BathsenseCPfittingsFaucetsSpryController = require('../../controllers/sanitary/Bathsense/CPfittingsFaucets/SpryController.js');
const BathsenseCPfittingsFaucetsThetaController = require('../../controllers/sanitary/Bathsense/CPfittingsFaucets/ThetaController.js');
const BathsenseSanitarywareEssentialsController = require('../../controllers/sanitary/Bathsense/Sanitaryware/essentialsController.js');
const BathsenseSanitarywarePedestalsController = require('../../controllers/sanitary/Bathsense/Sanitaryware/pedestalsController.js');
const BathsenseSanitarywareVenusController = require('../../controllers/sanitary/Bathsense/Sanitaryware/VenusController.js');
const BathsenseSanitarywareWashbasinsController = require('../../controllers/sanitary/Bathsense/Sanitaryware/washbasinsController.js');
const BathsenseSanitarywareWaterClosetController = require('../../controllers/sanitary/Bathsense/Sanitaryware/waterClosetController.js');
const closetsController = require('../../controllers/sanitary/closetsController.js');
const CoralBathFixturesEurosmartSeriesController = require('../../controllers/sanitary/CoralBathFixtures/EurosmartSeriesController.js');
const CoralBathFixturesFlowmoreSeriesController = require('../../controllers/sanitary/CoralBathFixtures/FlowmoreSeriesController.js');
const CoralBathFixturesNewSuperGlowSeriesController = require('../../controllers/sanitary/CoralBathFixtures/NewSuperGlowSeriesController.js');
const CoralBathFixturesRoyaleSeriesController = require('../../controllers/sanitary/CoralBathFixtures/RoyaleSeriesController.js');
const CoralBathFixturesTreemoSeriesController = require('../../controllers/sanitary/CoralBathFixtures/TreemoSeriesController.js');
const CoralBathFixturesXrossaSeriesController = require('../../controllers/sanitary/CoralBathFixtures/XrossaSeriesController.js');
const CorsaBathroomFaucetsAlmondController = require('../../controllers/sanitary/Corsa/BathroomFaucets/AlmondController.js');
const CorsaBathroomFaucetsArrowController = require('../../controllers/sanitary/Corsa/BathroomFaucets/ArrowController.js');
const CorsaBathroomFaucetsBoldController = require('../../controllers/sanitary/Corsa/BathroomFaucets/BoldController.js');
const CorsaBathroomFaucetsBudgetController = require('../../controllers/sanitary/Corsa/BathroomFaucets/BudgetController.js');
const CorsaBathroomFaucetsConceptController = require('../../controllers/sanitary/Corsa/BathroomFaucets/ConceptController.js');
const CorsaBathroomFaucetsDeluxeController = require('../../controllers/sanitary/Corsa/BathroomFaucets/DeluxeController.js');
const CorsaBathroomFaucetsEecoController = require('../../controllers/sanitary/Corsa/BathroomFaucets/EecoController.js');
const CorsaBathroomFaucetsExpertController = require('../../controllers/sanitary/Corsa/BathroomFaucets/ExpertController.js');
const CorsaBathroomFaucetsFlorenceController = require('../../controllers/sanitary/Corsa/BathroomFaucets/FlorenceController.js');
const CorsaBathroomFaucetsGlassBowlFaucetController = require('../../controllers/sanitary/Corsa/BathroomFaucets/GlassBowlFaucetController.js');
const CorsaBathroomFaucetsIdeaController = require('../../controllers/sanitary/Corsa/BathroomFaucets/IdeaController.js');
const CorsaBathroomFaucetsJazzController = require('../../controllers/sanitary/Corsa/BathroomFaucets/JazzController.js');
const CorsaBathroomFaucetsKetController = require('../../controllers/sanitary/Corsa/BathroomFaucets/KetController.js');
const CorsaBathroomFaucetsMilanoController = require('../../controllers/sanitary/Corsa/BathroomFaucets/MilanoController.js');
const CorsaBathroomFaucetsNanoController = require('../../controllers/sanitary/Corsa/BathroomFaucets/NanoController.js');
const CorsaBathroomFaucetsNexaController = require('../../controllers/sanitary/Corsa/BathroomFaucets/NexaController.js');
const CorsaBathroomFaucetsNiagraController = require('../../controllers/sanitary/Corsa/BathroomFaucets/NiagraController.js');
const CorsaBathroomFaucetsNiceController = require('../../controllers/sanitary/Corsa/BathroomFaucets/NiceController.js');
const CorsaBathroomFaucetsOmegaController = require('../../controllers/sanitary/Corsa/BathroomFaucets/OmegaController.js');
const CorsaBathroomFaucetsPassionController = require('../../controllers/sanitary/Corsa/BathroomFaucets/PassionController.js');
const CorsaBathroomFaucetsRoyalController = require('../../controllers/sanitary/Corsa/BathroomFaucets/RoyalController.js');
const CorsaBathroomFaucetsSlimlineController = require('../../controllers/sanitary/Corsa/BathroomFaucets/SlimlineController.js');
const CorsaBathroomFaucetsSplashController = require('../../controllers/sanitary/Corsa/BathroomFaucets/SplashController.js');
const CorsaBathroomFaucetsSquareFController = require('../../controllers/sanitary/Corsa/BathroomFaucets/SquareFController.js');
const CorsaBathroomFaucetsSquareSController = require('../../controllers/sanitary/Corsa/BathroomFaucets/SquareSController.js');
const CorsaBathroomFaucetsSuperController = require('../../controllers/sanitary/Corsa/BathroomFaucets/SuperController.js');
const CorsaBathroomFaucetsTriController = require('../../controllers/sanitary/Corsa/BathroomFaucets/TriController.js');
const CorsaBATHROOMACCESSORIESAcrylicAccessoriesController = require('../../controllers/sanitary/Corsa/BATHROOM_ACCESSORIES/AcrylicAccessoriesController.js');
const CorsaBATHROOMACCESSORIESAlmondController = require('../../controllers/sanitary/Corsa/BATHROOM_ACCESSORIES/AlmondController.js');
const CorsaBATHROOMACCESSORIESAngloController = require('../../controllers/sanitary/Corsa/BATHROOM_ACCESSORIES/AngloController.js');
const CorsaBATHROOMACCESSORIESBudgetController = require('../../controllers/sanitary/Corsa/BATHROOM_ACCESSORIES/BudgetController.js');
const CorsaBATHROOMACCESSORIESDolphinController = require('../../controllers/sanitary/Corsa/BATHROOM_ACCESSORIES/DolphinController.js');
const CorsaBATHROOMACCESSORIESEccoController = require('../../controllers/sanitary/Corsa/BATHROOM_ACCESSORIES/EccoController.js');
const CorsaBATHROOMACCESSORIESKetiController = require('../../controllers/sanitary/Corsa/BATHROOM_ACCESSORIES/KetiController.js');
const CorsaBATHROOMACCESSORIESQubixController = require('../../controllers/sanitary/Corsa/BATHROOM_ACCESSORIES/QubixController.js');
const CorsaBATHROOMACCESSORIESSquareController = require('../../controllers/sanitary/Corsa/BATHROOM_ACCESSORIES/SquareController.js');
const CorsaBATHROOMACCESSORIESSupremeController = require('../../controllers/sanitary/Corsa/BATHROOM_ACCESSORIES/SupremeController.js');
const CorsaFlushingCisternController = require('../../controllers/sanitary/Corsa/FlushingCisternController.js');
const CorsaKitchenKitchenFaucetsController = require('../../controllers/sanitary/Corsa/Kitchen/KitchenFaucetsController.js');
const CorsaKitchenKitchenSinkController = require('../../controllers/sanitary/Corsa/Kitchen/KitchenSinkController.js');
const CorsaOtherUsefulItemsBallValvesController = require('../../controllers/sanitary/Corsa/OtherUsefulItems/BallValvesController.js');
const CorsaOtherUsefulItemsMiniAngleCockController = require('../../controllers/sanitary/Corsa/OtherUsefulItems/MiniAngleCockController.js');
const CorsaOtherUsefulItemsMouthOperatedController = require('../../controllers/sanitary/Corsa/OtherUsefulItems/MouthOperatedController.js');
const CorsaOtherUsefulItemsPressmaticPushCockController = require('../../controllers/sanitary/Corsa/OtherUsefulItems/PressmaticPushCockController.js');
const CorsaOtherUsefulItemsSensorTapsController = require('../../controllers/sanitary/Corsa/OtherUsefulItems/SensorTapsController.js');
const CorsaOtherUsefulItemsSoapDispenserController = require('../../controllers/sanitary/Corsa/OtherUsefulItems/SoapDispenserController.js');
const CorsaSHOWERSHealthFaucetController = require('../../controllers/sanitary/Corsa/SHOWERS/HealthFaucetController.js');
const CorsaSHOWERSOverheadShowerController = require('../../controllers/sanitary/Corsa/SHOWERS/OverheadShowerController.js');
const CorsaSHOWERSRainShowerController = require('../../controllers/sanitary/Corsa/SHOWERS/RainShowerController.js');
const CorsaSHOWERSTelephonicShowerController = require('../../controllers/sanitary/Corsa/SHOWERS/TelephonicShowerController.js');
const EssessAccessoriesSeries1CromaController = require('../../controllers/sanitary/Essess/Accessories/Series1CromaController.js');
const EssessAccessoriesSeries2SwingController = require('../../controllers/sanitary/Essess/Accessories/Series2SwingController.js');
const EssessAccessoriesSeries3TarimController = require('../../controllers/sanitary/Essess/Accessories/Series3TarimController.js');
const EssessAccessoriesSeries5HotelierSeriesController = require('../../controllers/sanitary/Essess/Accessories/Series5HotelierSeriesController.js');
const EssessAccessoriesSeries6CruzoController = require('../../controllers/sanitary/Essess/Accessories/Series6CruzoController.js');
const EssessAccessoriesSeries7DeonController = require('../../controllers/sanitary/Essess/Accessories/Series7DeonController.js');
const EssessAccessoriesSeries8BSeriesController = require('../../controllers/sanitary/Essess/Accessories/Series8BSeriesController.js');
const EssessAutoCloseTapsController = require('../../controllers/sanitary/Essess/AutoCloseTapsController.js');
const EssessCelatoController = require('../../controllers/sanitary/Essess/CelatoController.js');
const EssessCromaController = require('../../controllers/sanitary/Essess/CromaController.js');
const EssessCruzoController = require('../../controllers/sanitary/Essess/CruzoController.js');
const EssessDeonController = require('../../controllers/sanitary/Essess/DeonController.js');
const EssessDSeriesController = require('../../controllers/sanitary/Essess/DSeriesController.js');
const EssessEchoController = require('../../controllers/sanitary/Essess/EchoController.js');
const EssessEssentialsController = require('../../controllers/sanitary/Essess/EssentialsController.js');
const EssessHotelierSeriesController = require('../../controllers/sanitary/Essess/HotelierSeriesController.js');
const EssessHS03Controller = require('../../controllers/sanitary/Essess/HS03Controller.js');
const EssessLabTapsController = require('../../controllers/sanitary/Essess/LabTapsController.js');
const EssessNewDuneController = require('../../controllers/sanitary/Essess/NewDuneController.js');
const EssessNewXessController = require('../../controllers/sanitary/Essess/NewXessController.js');
const EssessQuadraController = require('../../controllers/sanitary/Essess/QuadraController.js');
const EssessSensorsController = require('../../controllers/sanitary/Essess/SensorsController.js');
const EssessShowersHandShowersController = require('../../controllers/sanitary/Essess/Showers/HandShowersController.js');
const EssessShowersOverheadShowersController = require('../../controllers/sanitary/Essess/Showers/OverheadShowersController.js');
const EssessShowersRainfallShowersController = require('../../controllers/sanitary/Essess/Showers/RainfallShowersController.js');
const EssessShowersShowerArmsController = require('../../controllers/sanitary/Essess/Showers/ShowerArmsController.js');
const EssessTarimController = require('../../controllers/sanitary/Essess/TarimController.js');
const EssessTrandController = require('../../controllers/sanitary/Essess/TrandController.js');
const faucetsController = require('../../controllers/sanitary/faucetsController.js');
const hardwareBathroomAccessoriesController = require('../../controllers/sanitary/hardwareBathroomAccessoriesController.js');
const healthFaucetController = require('../../controllers/sanitary/healthFaucetController.js');
const HindwareAddOnController = require('../../controllers/sanitary/Hindware/addOnController.js');
const HindwareBathTubController = require('../../controllers/sanitary/Hindware/bathTubController.js');
const HindwareCisternsController = require('../../controllers/sanitary/Hindware/cisternsController.js');
const HindwareFaucetsAngularStopCockController = require('../../controllers/sanitary/Hindware/faucets/angularStopCockController.js');
const HindwareFaucetsBathSpoutController = require('../../controllers/sanitary/Hindware/faucets/bathSpoutController.js');
const HindwareFaucetsBibCockController = require('../../controllers/sanitary/Hindware/faucets/bibCockController.js');
const HindwareFaucetsChbmController = require('../../controllers/sanitary/Hindware/faucets/chbmController.js');
const HindwareFaucetsConcealedStopCockController = require('../../controllers/sanitary/Hindware/faucets/concealedStopCockController.js');
const HindwareFaucetsCscExpKitController = require('../../controllers/sanitary/Hindware/faucets/cscExpKitController.js');
const HindwareFaucetsDeuschMixerController = require('../../controllers/sanitary/Hindware/faucets/deuschMixerController.js');
const HindwareFaucetsExposedMixersController = require('../../controllers/sanitary/Hindware/faucets/exposedMixersController.js');
const HindwareFaucetsFlushCockController = require('../../controllers/sanitary/Hindware/faucets/flushCockController.js');
const HindwareFaucetsMedicalSeriesController = require('../../controllers/sanitary/Hindware/faucets/medicalSeriesController.js');
const HindwareFaucetsMixerFaucetController = require('../../controllers/sanitary/Hindware/faucets/mixerFaucetController.js');
const HindwareFaucetsPillarCockController = require('../../controllers/sanitary/Hindware/faucets/pillarCockController.js');
const HindwareFaucetsPillarCockTallController = require('../../controllers/sanitary/Hindware/faucets/pillarCockTallController.js');
const HindwareFaucetsPillarFaucetController = require('../../controllers/sanitary/Hindware/faucets/pillarFaucetController.js');
const HindwareFaucetsPressmaticController = require('../../controllers/sanitary/Hindware/faucets/pressmaticController.js');
const HindwareFaucetsRecessedController = require('../../controllers/sanitary/Hindware/faucets/recessedController.js');
const HindwareFaucetsSingleLeverDivertorController = require('../../controllers/sanitary/Hindware/faucets/singleLeverDivertorController.js');
const HindwareFaucetsSinkCockController = require('../../controllers/sanitary/Hindware/faucets/sinkCockController.js');
const HindwareFaucetsSinkMixerController = require('../../controllers/sanitary/Hindware/faucets/sinkMixerController.js');
const HindwareFaucetsSlbmFaucetController = require('../../controllers/sanitary/Hindware/faucets/slbmFaucetController.js');
const HindwareFaucetsSlbmFaucetTallController = require('../../controllers/sanitary/Hindware/faucets/slbmFaucetTallController.js');
const HindwareFaucetsWallMixerController = require('../../controllers/sanitary/Hindware/faucets/wallMixerController.js');
const HindwareShowersRainShowersController = require('../../controllers/sanitary/Hindware/showers/rainShowersController.js');
const HindwareWashBasinsController = require('../../controllers/sanitary/Hindware/washBasinsController.js');
const HindwareWaterClosetsController = require('../../controllers/sanitary/Hindware/waterClosetsController.js');
const jaquarController = require('../../controllers/sanitary/jaquarController.js');
const kitchenSinksController = require('../../controllers/sanitary/kitchenSinksController.js');
const LeoBathFittingsBathroomAccessoriesBathroomAccessoriesController = require('../../controllers/sanitary/LeoBathFittings/BathroomAccessories/bathroomAccessoriesController.js');
const LeoBathFittingsFaucetsFaucetsController = require('../../controllers/sanitary/LeoBathFittings/Faucets/faucetsController.js');
const LeoBathFittingsValveValveController = require('../../controllers/sanitary/LeoBathFittings/Valve/valveController.js');
const PamayFaucetsFaucetsController = require('../../controllers/sanitary/Pamay/Faucets/faucetsController.js');
const PamayShowersShowersController = require('../../controllers/sanitary/Pamay/Showers/showersController.js');
const parrywareAccessoriesAccessoriesController = require('../../controllers/sanitary/parryware/Accessories/accessoriesController.js');
const parrywareAngleValvesAngleValvesController = require('../../controllers/sanitary/parryware/AngleValves/angleValvesController.js');
const parrywareBelowCounterBasinsBelowCounterBasinsController = require('../../controllers/sanitary/parryware/BelowCounterBasins/belowCounterBasinsController.js');
const parrywareBowlBasinsBowlBasinsController = require('../../controllers/sanitary/parryware/BowlBasins/bowlBasinsController.js');
const parrywareCLOSETSClosetsController = require('../../controllers/sanitary/parryware/CLOSETS/closetsController.js');
const parrywareConcealedCisternConcealedCisternController = require('../../controllers/sanitary/parryware/ConcealedCistern/concealedCisternController.js');
const parrywareEuropeanWaterClosetEuropeanWaterClosetController = require('../../controllers/sanitary/parryware/EuropeanWaterCloset/europeanWaterClosetController.js');
const parrywareFAUCETSFlushCocksController = require('../../controllers/sanitary/parryware/FAUCETS/flushCocksController.js');
const parrywareFAUCETSFlushValveController = require('../../controllers/sanitary/parryware/FAUCETS/flushValveController.js');
const parrywareFAUCETSHealthFaucetsController = require('../../controllers/sanitary/parryware/FAUCETS/healthFaucetsController.js');
const parrywareFAUCETSKitchenSinksController = require('../../controllers/sanitary/parryware/FAUCETS/kitchenSinksController.js');
const parrywareFAUCETSPedestalsController = require('../../controllers/sanitary/parryware/FAUCETS/pedestalsController.js');
const parrywarePolymerCisternsPolymerCisternsController = require('../../controllers/sanitary/parryware/PolymerCisterns/polymerCisternsController.js');
const parrywarePushPlatesPushPlatesController = require('../../controllers/sanitary/parryware/PushPlates/pushPlatesController.js');
const parrywareSeatCoversSeatCoversController = require('../../controllers/sanitary/parryware/SeatCovers/seatCoversController.js');
const parrywareSemiRecessedBasinsSemiRecessedBasinsController = require('../../controllers/sanitary/parryware/SemiRecessedBasins/semiRecessedBasinsController.js');
const parrywareShowerEnclosuresShowerEnclosuresController = require('../../controllers/sanitary/parryware/ShowerEnclosures/showerEnclosuresController.js');
const parrywareShowerPanelsShowerPanelsController = require('../../controllers/sanitary/parryware/ShowerPanels/showerPanelsController.js');
const parrywareShowersShowersController = require('../../controllers/sanitary/parryware/showers/showersController.js');
const parrywareUtsavRangeUtsavRangeController = require('../../controllers/sanitary/parryware/UtsavRange/utsavRangeController.js');
const parrywareWashBasinsWashBasinsController = require('../../controllers/sanitary/parryware/washBasins/washBasinsController.js');
const parrywareWasteCouplingWasteCouplingController = require('../../controllers/sanitary/parryware/WasteCoupling/wasteCouplingController.js');
const parrywareWaterHeatersWaterHeatersController = require('../../controllers/sanitary/parryware/WaterHeaters/waterHeatersController.js');
const PearlPreciousProductsEdgeEdgeController = require('../../controllers/sanitary/PearlPreciousProducts/Edge/edgeController.js');
const showersController = require('../../controllers/sanitary/showersController.js');
const tapsController = require('../../controllers/sanitary/tapsController.js');
const washbasinsController = require('../../controllers/sanitary/washbasinsController.js');
const WatermanAccessoriesController = require('../../controllers/sanitary/Waterman/accessoriesController.js');
const WatermanAriaController = require('../../controllers/sanitary/Waterman/ariaController.js');
const WatermanAuraController = require('../../controllers/sanitary/Waterman/auraController.js');
const WatermanDellController = require('../../controllers/sanitary/Waterman/dellController.js');
const WatermanDeluxeController = require('../../controllers/sanitary/Waterman/deluxeController.js');
const WatermanEcoController = require('../../controllers/sanitary/Waterman/ecoController.js');
const WatermanEvoqueController = require('../../controllers/sanitary/Waterman/evoqueController.js');
const WatermanHandShowersController = require('../../controllers/sanitary/Waterman/handShowersController.js');
const WatermanHealthFaucetAbsController = require('../../controllers/sanitary/Waterman/healthFaucetAbsController.js');
const WatermanHealthFaucetsBrassController = require('../../controllers/sanitary/Waterman/healthFaucetsBrassController.js');
const WatermanIkonController = require('../../controllers/sanitary/Waterman/ikonController.js');
const WatermanRainShowersController = require('../../controllers/sanitary/Waterman/rainShowersController.js');
const WatermanRomanController = require('../../controllers/sanitary/Waterman/romanController.js');
const WatermanShowerTubesController = require('../../controllers/sanitary/Waterman/showerTubesController.js');
const WatermanWallShowersWithArmController = require('../../controllers/sanitary/Waterman/wallShowersWithArmController.js');
const WatermanWallShowersWithoutArmController = require('../../controllers/sanitary/Waterman/wallShowersWithoutArmController.js');
const WaterTecAlliedController = require('../../controllers/sanitary/WaterTec/alliedController.js');
const WaterTecAquaController = require('../../controllers/sanitary/WaterTec/aquaController.js');
const WaterTecAspireController = require('../../controllers/sanitary/WaterTec/aspireController.js');
const WaterTecBathroomAccessoriesController = require('../../controllers/sanitary/WaterTec/bathroomAccessoriesController.js');
const WaterTecCisternController = require('../../controllers/sanitary/WaterTec/cisternController.js');
const WaterTecConcealedCisternController = require('../../controllers/sanitary/WaterTec/concealedCisternController.js');
const WaterTecConnectionTubeController = require('../../controllers/sanitary/WaterTec/connectionTubeController.js');
const WaterTecEbonyController = require('../../controllers/sanitary/WaterTec/ebonyController.js');
const WaterTecEcoController = require('../../controllers/sanitary/WaterTec/ecoController.js');
const WaterTecEvaController = require('../../controllers/sanitary/WaterTec/evaController.js');
const WaterTecFloraController = require('../../controllers/sanitary/WaterTec/floraController.js');
const WaterTecHealthFaucetsController = require('../../controllers/sanitary/WaterTec/healthFaucetsController.js');
const WaterTecQuattroController = require('../../controllers/sanitary/WaterTec/quattroController.js');
const WaterTecShowersController = require('../../controllers/sanitary/WaterTec/showersController.js');
const WaterTecTapsController = require('../../controllers/sanitary/WaterTec/tapsController.js');
const WaterTecToiletSeatCoversController = require('../../controllers/sanitary/WaterTec/toiletSeatCoversController.js');
const WaterTecTSeriesAltController = require('../../controllers/sanitary/WaterTec/tSeriesAltController.js');
const WaterTecTSeriesController = require('../../controllers/sanitary/WaterTec/tSeriesController.js');
const WaterTecValvesController = require('../../controllers/sanitary/WaterTec/valvesController.js');

// acrylic-products endpoints
router.post('/acrylic-products', acrylicProductsController.createAcrylicProducts);
router.get('/acrylic-products', acrylicProductsController.getAllAcrylicProducts);
router.get('/acrylic-products/:id', acrylicProductsController.getOneAcrylicProducts);
router.put('/acrylic-products/:id', acrylicProductsController.updateAcrylicProducts);
router.delete('/acrylic-products/:id', acrylicProductsController.deleteAcrylicProducts);

// bathroom-accessories endpoints
router.post('/bathroom-accessories', bathroomAccessoriesController.createBathroomAccessories);
router.get('/bathroom-accessories', bathroomAccessoriesController.getAllBathroomAccessories);
router.get('/bathroom-accessories/:id', bathroomAccessoriesController.getOneBathroomAccessories);
router.put('/bathroom-accessories/:id', bathroomAccessoriesController.updateBathroomAccessories);
router.delete('/bathroom-accessories/:id', bathroomAccessoriesController.deleteBathroomAccessories);

// bathsense-c-pfittings-faucets-altius endpoints
router.post('/bathsense-c-pfittings-faucets-altius', BathsenseCPfittingsFaucetsAltiusController.createAltius);
router.get('/bathsense-c-pfittings-faucets-altius', BathsenseCPfittingsFaucetsAltiusController.getAllAltius);
router.get('/bathsense-c-pfittings-faucets-altius/:id', BathsenseCPfittingsFaucetsAltiusController.getOneAltius);
router.put('/bathsense-c-pfittings-faucets-altius/:id', BathsenseCPfittingsFaucetsAltiusController.updateAltius);
router.delete('/bathsense-c-pfittings-faucets-altius/:id', BathsenseCPfittingsFaucetsAltiusController.deleteAltius);

// bathsense-c-pfittings-faucets-bathsense-essentials endpoints
router.post('/bathsense-c-pfittings-faucets-bathsense-essentials', BathsenseCPfittingsFaucetsBathsenseEssentialsController.createBathsenseEssentials);
router.get('/bathsense-c-pfittings-faucets-bathsense-essentials', BathsenseCPfittingsFaucetsBathsenseEssentialsController.getAllBathsenseEssentials);
router.get('/bathsense-c-pfittings-faucets-bathsense-essentials/:id', BathsenseCPfittingsFaucetsBathsenseEssentialsController.getOneBathsenseEssentials);
router.put('/bathsense-c-pfittings-faucets-bathsense-essentials/:id', BathsenseCPfittingsFaucetsBathsenseEssentialsController.updateBathsenseEssentials);
router.delete('/bathsense-c-pfittings-faucets-bathsense-essentials/:id', BathsenseCPfittingsFaucetsBathsenseEssentialsController.deleteBathsenseEssentials);

// bathsense-c-pfittings-faucets-bathsense-showers endpoints
router.post('/bathsense-c-pfittings-faucets-bathsense-showers', BathsenseCPfittingsFaucetsBathsenseShowersController.createBathsenseShowers);
router.get('/bathsense-c-pfittings-faucets-bathsense-showers', BathsenseCPfittingsFaucetsBathsenseShowersController.getAllBathsenseShowers);
router.get('/bathsense-c-pfittings-faucets-bathsense-showers/:id', BathsenseCPfittingsFaucetsBathsenseShowersController.getOneBathsenseShowers);
router.put('/bathsense-c-pfittings-faucets-bathsense-showers/:id', BathsenseCPfittingsFaucetsBathsenseShowersController.updateBathsenseShowers);
router.delete('/bathsense-c-pfittings-faucets-bathsense-showers/:id', BathsenseCPfittingsFaucetsBathsenseShowersController.deleteBathsenseShowers);

// bathsense-c-pfittings-faucets-colossus endpoints
router.post('/bathsense-c-pfittings-faucets-colossus', BathsenseCPfittingsFaucetsColossusController.createColossus);
router.get('/bathsense-c-pfittings-faucets-colossus', BathsenseCPfittingsFaucetsColossusController.getAllColossus);
router.get('/bathsense-c-pfittings-faucets-colossus/:id', BathsenseCPfittingsFaucetsColossusController.getOneColossus);
router.put('/bathsense-c-pfittings-faucets-colossus/:id', BathsenseCPfittingsFaucetsColossusController.updateColossus);
router.delete('/bathsense-c-pfittings-faucets-colossus/:id', BathsenseCPfittingsFaucetsColossusController.deleteColossus);

// bathsense-c-pfittings-faucets-invictus endpoints
router.post('/bathsense-c-pfittings-faucets-invictus', BathsenseCPfittingsFaucetsInvictusController.createInvictus);
router.get('/bathsense-c-pfittings-faucets-invictus', BathsenseCPfittingsFaucetsInvictusController.getAllInvictus);
router.get('/bathsense-c-pfittings-faucets-invictus/:id', BathsenseCPfittingsFaucetsInvictusController.getOneInvictus);
router.put('/bathsense-c-pfittings-faucets-invictus/:id', BathsenseCPfittingsFaucetsInvictusController.updateInvictus);
router.delete('/bathsense-c-pfittings-faucets-invictus/:id', BathsenseCPfittingsFaucetsInvictusController.deleteInvictus);

// bathsense-c-pfittings-faucets-maximus endpoints
router.post('/bathsense-c-pfittings-faucets-maximus', BathsenseCPfittingsFaucetsMaximusController.createMaximus);
router.get('/bathsense-c-pfittings-faucets-maximus', BathsenseCPfittingsFaucetsMaximusController.getAllMaximus);
router.get('/bathsense-c-pfittings-faucets-maximus/:id', BathsenseCPfittingsFaucetsMaximusController.getOneMaximus);
router.put('/bathsense-c-pfittings-faucets-maximus/:id', BathsenseCPfittingsFaucetsMaximusController.updateMaximus);
router.delete('/bathsense-c-pfittings-faucets-maximus/:id', BathsenseCPfittingsFaucetsMaximusController.deleteMaximus);

// bathsense-c-pfittings-faucets-spry endpoints
router.post('/bathsense-c-pfittings-faucets-spry', BathsenseCPfittingsFaucetsSpryController.createSpry);
router.get('/bathsense-c-pfittings-faucets-spry', BathsenseCPfittingsFaucetsSpryController.getAllSpry);
router.get('/bathsense-c-pfittings-faucets-spry/:id', BathsenseCPfittingsFaucetsSpryController.getOneSpry);
router.put('/bathsense-c-pfittings-faucets-spry/:id', BathsenseCPfittingsFaucetsSpryController.updateSpry);
router.delete('/bathsense-c-pfittings-faucets-spry/:id', BathsenseCPfittingsFaucetsSpryController.deleteSpry);

// bathsense-c-pfittings-faucets-theta endpoints
router.post('/bathsense-c-pfittings-faucets-theta', BathsenseCPfittingsFaucetsThetaController.createTheta);
router.get('/bathsense-c-pfittings-faucets-theta', BathsenseCPfittingsFaucetsThetaController.getAllTheta);
router.get('/bathsense-c-pfittings-faucets-theta/:id', BathsenseCPfittingsFaucetsThetaController.getOneTheta);
router.put('/bathsense-c-pfittings-faucets-theta/:id', BathsenseCPfittingsFaucetsThetaController.updateTheta);
router.delete('/bathsense-c-pfittings-faucets-theta/:id', BathsenseCPfittingsFaucetsThetaController.deleteTheta);

// bathsense-sanitaryware-essentials endpoints
router.post('/bathsense-sanitaryware-essentials', BathsenseSanitarywareEssentialsController.createEssentials);
router.get('/bathsense-sanitaryware-essentials', BathsenseSanitarywareEssentialsController.getAllEssentials);
router.get('/bathsense-sanitaryware-essentials/:id', BathsenseSanitarywareEssentialsController.getOneEssentials);
router.put('/bathsense-sanitaryware-essentials/:id', BathsenseSanitarywareEssentialsController.updateEssentials);
router.delete('/bathsense-sanitaryware-essentials/:id', BathsenseSanitarywareEssentialsController.deleteEssentials);

// bathsense-sanitaryware-pedestals endpoints
router.post('/bathsense-sanitaryware-pedestals', BathsenseSanitarywarePedestalsController.createPedestals);
router.get('/bathsense-sanitaryware-pedestals', BathsenseSanitarywarePedestalsController.getAllPedestals);
router.get('/bathsense-sanitaryware-pedestals/:id', BathsenseSanitarywarePedestalsController.getOnePedestals);
router.put('/bathsense-sanitaryware-pedestals/:id', BathsenseSanitarywarePedestalsController.updatePedestals);
router.delete('/bathsense-sanitaryware-pedestals/:id', BathsenseSanitarywarePedestalsController.deletePedestals);

// bathsense-sanitaryware-venus endpoints
router.post('/bathsense-sanitaryware-venus', BathsenseSanitarywareVenusController.createVenus);
router.get('/bathsense-sanitaryware-venus', BathsenseSanitarywareVenusController.getAllVenus);
router.get('/bathsense-sanitaryware-venus/:id', BathsenseSanitarywareVenusController.getOneVenus);
router.put('/bathsense-sanitaryware-venus/:id', BathsenseSanitarywareVenusController.updateVenus);
router.delete('/bathsense-sanitaryware-venus/:id', BathsenseSanitarywareVenusController.deleteVenus);

// bathsense-sanitaryware-washbasins endpoints
router.post('/bathsense-sanitaryware-washbasins', BathsenseSanitarywareWashbasinsController.createWashbasins);
router.get('/bathsense-sanitaryware-washbasins', BathsenseSanitarywareWashbasinsController.getAllWashbasins);
router.get('/bathsense-sanitaryware-washbasins/:id', BathsenseSanitarywareWashbasinsController.getOneWashbasins);
router.put('/bathsense-sanitaryware-washbasins/:id', BathsenseSanitarywareWashbasinsController.updateWashbasins);
router.delete('/bathsense-sanitaryware-washbasins/:id', BathsenseSanitarywareWashbasinsController.deleteWashbasins);

// bathsense-sanitaryware-water-closet endpoints
router.post('/bathsense-sanitaryware-water-closet', BathsenseSanitarywareWaterClosetController.createWaterCloset);
router.get('/bathsense-sanitaryware-water-closet', BathsenseSanitarywareWaterClosetController.getAllWaterCloset);
router.get('/bathsense-sanitaryware-water-closet/:id', BathsenseSanitarywareWaterClosetController.getOneWaterCloset);
router.put('/bathsense-sanitaryware-water-closet/:id', BathsenseSanitarywareWaterClosetController.updateWaterCloset);
router.delete('/bathsense-sanitaryware-water-closet/:id', BathsenseSanitarywareWaterClosetController.deleteWaterCloset);

// closets endpoints
router.post('/closets', closetsController.createClosets);
router.get('/closets', closetsController.getAllClosets);
router.get('/closets/:id', closetsController.getOneClosets);
router.put('/closets/:id', closetsController.updateClosets);
router.delete('/closets/:id', closetsController.deleteClosets);

// coral-bath-fixtures-eurosmart-series endpoints
router.post('/coral-bath-fixtures-eurosmart-series', CoralBathFixturesEurosmartSeriesController.createEurosmartSeries);
router.get('/coral-bath-fixtures-eurosmart-series', CoralBathFixturesEurosmartSeriesController.getAllEurosmartSeries);
router.get('/coral-bath-fixtures-eurosmart-series/:id', CoralBathFixturesEurosmartSeriesController.getOneEurosmartSeries);
router.put('/coral-bath-fixtures-eurosmart-series/:id', CoralBathFixturesEurosmartSeriesController.updateEurosmartSeries);
router.delete('/coral-bath-fixtures-eurosmart-series/:id', CoralBathFixturesEurosmartSeriesController.deleteEurosmartSeries);

// coral-bath-fixtures-flowmore-series endpoints
router.post('/coral-bath-fixtures-flowmore-series', CoralBathFixturesFlowmoreSeriesController.createFlowmoreSeries);
router.get('/coral-bath-fixtures-flowmore-series', CoralBathFixturesFlowmoreSeriesController.getAllFlowmoreSeries);
router.get('/coral-bath-fixtures-flowmore-series/:id', CoralBathFixturesFlowmoreSeriesController.getOneFlowmoreSeries);
router.put('/coral-bath-fixtures-flowmore-series/:id', CoralBathFixturesFlowmoreSeriesController.updateFlowmoreSeries);
router.delete('/coral-bath-fixtures-flowmore-series/:id', CoralBathFixturesFlowmoreSeriesController.deleteFlowmoreSeries);

// coral-bath-fixtures-new-super-glow-series endpoints
router.post('/coral-bath-fixtures-new-super-glow-series', CoralBathFixturesNewSuperGlowSeriesController.createNewSuperGlowSeries);
router.get('/coral-bath-fixtures-new-super-glow-series', CoralBathFixturesNewSuperGlowSeriesController.getAllNewSuperGlowSeries);
router.get('/coral-bath-fixtures-new-super-glow-series/:id', CoralBathFixturesNewSuperGlowSeriesController.getOneNewSuperGlowSeries);
router.put('/coral-bath-fixtures-new-super-glow-series/:id', CoralBathFixturesNewSuperGlowSeriesController.updateNewSuperGlowSeries);
router.delete('/coral-bath-fixtures-new-super-glow-series/:id', CoralBathFixturesNewSuperGlowSeriesController.deleteNewSuperGlowSeries);

// coral-bath-fixtures-royale-series endpoints
router.post('/coral-bath-fixtures-royale-series', CoralBathFixturesRoyaleSeriesController.createRoyaleSeries);
router.get('/coral-bath-fixtures-royale-series', CoralBathFixturesRoyaleSeriesController.getAllRoyaleSeries);
router.get('/coral-bath-fixtures-royale-series/:id', CoralBathFixturesRoyaleSeriesController.getOneRoyaleSeries);
router.put('/coral-bath-fixtures-royale-series/:id', CoralBathFixturesRoyaleSeriesController.updateRoyaleSeries);
router.delete('/coral-bath-fixtures-royale-series/:id', CoralBathFixturesRoyaleSeriesController.deleteRoyaleSeries);

// coral-bath-fixtures-treemo-series endpoints
router.post('/coral-bath-fixtures-treemo-series', CoralBathFixturesTreemoSeriesController.createTreemoSeries);
router.get('/coral-bath-fixtures-treemo-series', CoralBathFixturesTreemoSeriesController.getAllTreemoSeries);
router.get('/coral-bath-fixtures-treemo-series/:id', CoralBathFixturesTreemoSeriesController.getOneTreemoSeries);
router.put('/coral-bath-fixtures-treemo-series/:id', CoralBathFixturesTreemoSeriesController.updateTreemoSeries);
router.delete('/coral-bath-fixtures-treemo-series/:id', CoralBathFixturesTreemoSeriesController.deleteTreemoSeries);

// coral-bath-fixtures-xrossa-series endpoints
router.post('/coral-bath-fixtures-xrossa-series', CoralBathFixturesXrossaSeriesController.createXrossaSeries);
router.get('/coral-bath-fixtures-xrossa-series', CoralBathFixturesXrossaSeriesController.getAllXrossaSeries);
router.get('/coral-bath-fixtures-xrossa-series/:id', CoralBathFixturesXrossaSeriesController.getOneXrossaSeries);
router.put('/coral-bath-fixtures-xrossa-series/:id', CoralBathFixturesXrossaSeriesController.updateXrossaSeries);
router.delete('/coral-bath-fixtures-xrossa-series/:id', CoralBathFixturesXrossaSeriesController.deleteXrossaSeries);

// corsa-bathroom-faucets-almond endpoints
router.post('/corsa-bathroom-faucets-almond', CorsaBathroomFaucetsAlmondController.createAlmond);
router.get('/corsa-bathroom-faucets-almond', CorsaBathroomFaucetsAlmondController.getAllAlmond);
router.get('/corsa-bathroom-faucets-almond/:id', CorsaBathroomFaucetsAlmondController.getOneAlmond);
router.put('/corsa-bathroom-faucets-almond/:id', CorsaBathroomFaucetsAlmondController.updateAlmond);
router.delete('/corsa-bathroom-faucets-almond/:id', CorsaBathroomFaucetsAlmondController.deleteAlmond);

// corsa-bathroom-faucets-arrow endpoints
router.post('/corsa-bathroom-faucets-arrow', CorsaBathroomFaucetsArrowController.createArrow);
router.get('/corsa-bathroom-faucets-arrow', CorsaBathroomFaucetsArrowController.getAllArrow);
router.get('/corsa-bathroom-faucets-arrow/:id', CorsaBathroomFaucetsArrowController.getOneArrow);
router.put('/corsa-bathroom-faucets-arrow/:id', CorsaBathroomFaucetsArrowController.updateArrow);
router.delete('/corsa-bathroom-faucets-arrow/:id', CorsaBathroomFaucetsArrowController.deleteArrow);

// corsa-bathroom-faucets-bold endpoints
router.post('/corsa-bathroom-faucets-bold', CorsaBathroomFaucetsBoldController.createBold);
router.get('/corsa-bathroom-faucets-bold', CorsaBathroomFaucetsBoldController.getAllBold);
router.get('/corsa-bathroom-faucets-bold/:id', CorsaBathroomFaucetsBoldController.getOneBold);
router.put('/corsa-bathroom-faucets-bold/:id', CorsaBathroomFaucetsBoldController.updateBold);
router.delete('/corsa-bathroom-faucets-bold/:id', CorsaBathroomFaucetsBoldController.deleteBold);

// corsa-bathroom-faucets-budget endpoints
router.post('/corsa-bathroom-faucets-budget', CorsaBathroomFaucetsBudgetController.createBudget);
router.get('/corsa-bathroom-faucets-budget', CorsaBathroomFaucetsBudgetController.getAllBudget);
router.get('/corsa-bathroom-faucets-budget/:id', CorsaBathroomFaucetsBudgetController.getOneBudget);
router.put('/corsa-bathroom-faucets-budget/:id', CorsaBathroomFaucetsBudgetController.updateBudget);
router.delete('/corsa-bathroom-faucets-budget/:id', CorsaBathroomFaucetsBudgetController.deleteBudget);

// corsa-bathroom-faucets-concept endpoints
router.post('/corsa-bathroom-faucets-concept', CorsaBathroomFaucetsConceptController.createConcept);
router.get('/corsa-bathroom-faucets-concept', CorsaBathroomFaucetsConceptController.getAllConcept);
router.get('/corsa-bathroom-faucets-concept/:id', CorsaBathroomFaucetsConceptController.getOneConcept);
router.put('/corsa-bathroom-faucets-concept/:id', CorsaBathroomFaucetsConceptController.updateConcept);
router.delete('/corsa-bathroom-faucets-concept/:id', CorsaBathroomFaucetsConceptController.deleteConcept);

// corsa-bathroom-faucets-deluxe endpoints
router.post('/corsa-bathroom-faucets-deluxe', CorsaBathroomFaucetsDeluxeController.createDeluxe);
router.get('/corsa-bathroom-faucets-deluxe', CorsaBathroomFaucetsDeluxeController.getAllDeluxe);
router.get('/corsa-bathroom-faucets-deluxe/:id', CorsaBathroomFaucetsDeluxeController.getOneDeluxe);
router.put('/corsa-bathroom-faucets-deluxe/:id', CorsaBathroomFaucetsDeluxeController.updateDeluxe);
router.delete('/corsa-bathroom-faucets-deluxe/:id', CorsaBathroomFaucetsDeluxeController.deleteDeluxe);

// corsa-bathroom-faucets-eeco endpoints
router.post('/corsa-bathroom-faucets-eeco', CorsaBathroomFaucetsEecoController.createEeco);
router.get('/corsa-bathroom-faucets-eeco', CorsaBathroomFaucetsEecoController.getAllEeco);
router.get('/corsa-bathroom-faucets-eeco/:id', CorsaBathroomFaucetsEecoController.getOneEeco);
router.put('/corsa-bathroom-faucets-eeco/:id', CorsaBathroomFaucetsEecoController.updateEeco);
router.delete('/corsa-bathroom-faucets-eeco/:id', CorsaBathroomFaucetsEecoController.deleteEeco);

// corsa-bathroom-faucets-expert endpoints
router.post('/corsa-bathroom-faucets-expert', CorsaBathroomFaucetsExpertController.createExpert);
router.get('/corsa-bathroom-faucets-expert', CorsaBathroomFaucetsExpertController.getAllExpert);
router.get('/corsa-bathroom-faucets-expert/:id', CorsaBathroomFaucetsExpertController.getOneExpert);
router.put('/corsa-bathroom-faucets-expert/:id', CorsaBathroomFaucetsExpertController.updateExpert);
router.delete('/corsa-bathroom-faucets-expert/:id', CorsaBathroomFaucetsExpertController.deleteExpert);

// corsa-bathroom-faucets-florence endpoints
router.post('/corsa-bathroom-faucets-florence', CorsaBathroomFaucetsFlorenceController.createFlorence);
router.get('/corsa-bathroom-faucets-florence', CorsaBathroomFaucetsFlorenceController.getAllFlorence);
router.get('/corsa-bathroom-faucets-florence/:id', CorsaBathroomFaucetsFlorenceController.getOneFlorence);
router.put('/corsa-bathroom-faucets-florence/:id', CorsaBathroomFaucetsFlorenceController.updateFlorence);
router.delete('/corsa-bathroom-faucets-florence/:id', CorsaBathroomFaucetsFlorenceController.deleteFlorence);

// corsa-bathroom-faucets-glass-bowl-faucet endpoints
router.post('/corsa-bathroom-faucets-glass-bowl-faucet', CorsaBathroomFaucetsGlassBowlFaucetController.createGlassBowlFaucet);
router.get('/corsa-bathroom-faucets-glass-bowl-faucet', CorsaBathroomFaucetsGlassBowlFaucetController.getAllGlassBowlFaucet);
router.get('/corsa-bathroom-faucets-glass-bowl-faucet/:id', CorsaBathroomFaucetsGlassBowlFaucetController.getOneGlassBowlFaucet);
router.put('/corsa-bathroom-faucets-glass-bowl-faucet/:id', CorsaBathroomFaucetsGlassBowlFaucetController.updateGlassBowlFaucet);
router.delete('/corsa-bathroom-faucets-glass-bowl-faucet/:id', CorsaBathroomFaucetsGlassBowlFaucetController.deleteGlassBowlFaucet);

// corsa-bathroom-faucets-idea endpoints
router.post('/corsa-bathroom-faucets-idea', CorsaBathroomFaucetsIdeaController.createIdea);
router.get('/corsa-bathroom-faucets-idea', CorsaBathroomFaucetsIdeaController.getAllIdea);
router.get('/corsa-bathroom-faucets-idea/:id', CorsaBathroomFaucetsIdeaController.getOneIdea);
router.put('/corsa-bathroom-faucets-idea/:id', CorsaBathroomFaucetsIdeaController.updateIdea);
router.delete('/corsa-bathroom-faucets-idea/:id', CorsaBathroomFaucetsIdeaController.deleteIdea);

// corsa-bathroom-faucets-jazz endpoints
router.post('/corsa-bathroom-faucets-jazz', CorsaBathroomFaucetsJazzController.createJazz);
router.get('/corsa-bathroom-faucets-jazz', CorsaBathroomFaucetsJazzController.getAllJazz);
router.get('/corsa-bathroom-faucets-jazz/:id', CorsaBathroomFaucetsJazzController.getOneJazz);
router.put('/corsa-bathroom-faucets-jazz/:id', CorsaBathroomFaucetsJazzController.updateJazz);
router.delete('/corsa-bathroom-faucets-jazz/:id', CorsaBathroomFaucetsJazzController.deleteJazz);

// corsa-bathroom-faucets-ket endpoints
router.post('/corsa-bathroom-faucets-ket', CorsaBathroomFaucetsKetController.createKet);
router.get('/corsa-bathroom-faucets-ket', CorsaBathroomFaucetsKetController.getAllKet);
router.get('/corsa-bathroom-faucets-ket/:id', CorsaBathroomFaucetsKetController.getOneKet);
router.put('/corsa-bathroom-faucets-ket/:id', CorsaBathroomFaucetsKetController.updateKet);
router.delete('/corsa-bathroom-faucets-ket/:id', CorsaBathroomFaucetsKetController.deleteKet);

// corsa-bathroom-faucets-milano endpoints
router.post('/corsa-bathroom-faucets-milano', CorsaBathroomFaucetsMilanoController.createMilano);
router.get('/corsa-bathroom-faucets-milano', CorsaBathroomFaucetsMilanoController.getAllMilano);
router.get('/corsa-bathroom-faucets-milano/:id', CorsaBathroomFaucetsMilanoController.getOneMilano);
router.put('/corsa-bathroom-faucets-milano/:id', CorsaBathroomFaucetsMilanoController.updateMilano);
router.delete('/corsa-bathroom-faucets-milano/:id', CorsaBathroomFaucetsMilanoController.deleteMilano);

// corsa-bathroom-faucets-nano endpoints
router.post('/corsa-bathroom-faucets-nano', CorsaBathroomFaucetsNanoController.createNano);
router.get('/corsa-bathroom-faucets-nano', CorsaBathroomFaucetsNanoController.getAllNano);
router.get('/corsa-bathroom-faucets-nano/:id', CorsaBathroomFaucetsNanoController.getOneNano);
router.put('/corsa-bathroom-faucets-nano/:id', CorsaBathroomFaucetsNanoController.updateNano);
router.delete('/corsa-bathroom-faucets-nano/:id', CorsaBathroomFaucetsNanoController.deleteNano);

// corsa-bathroom-faucets-nexa endpoints
router.post('/corsa-bathroom-faucets-nexa', CorsaBathroomFaucetsNexaController.createNexa);
router.get('/corsa-bathroom-faucets-nexa', CorsaBathroomFaucetsNexaController.getAllNexa);
router.get('/corsa-bathroom-faucets-nexa/:id', CorsaBathroomFaucetsNexaController.getOneNexa);
router.put('/corsa-bathroom-faucets-nexa/:id', CorsaBathroomFaucetsNexaController.updateNexa);
router.delete('/corsa-bathroom-faucets-nexa/:id', CorsaBathroomFaucetsNexaController.deleteNexa);

// corsa-bathroom-faucets-niagra endpoints
router.post('/corsa-bathroom-faucets-niagra', CorsaBathroomFaucetsNiagraController.createNiagra);
router.get('/corsa-bathroom-faucets-niagra', CorsaBathroomFaucetsNiagraController.getAllNiagra);
router.get('/corsa-bathroom-faucets-niagra/:id', CorsaBathroomFaucetsNiagraController.getOneNiagra);
router.put('/corsa-bathroom-faucets-niagra/:id', CorsaBathroomFaucetsNiagraController.updateNiagra);
router.delete('/corsa-bathroom-faucets-niagra/:id', CorsaBathroomFaucetsNiagraController.deleteNiagra);

// corsa-bathroom-faucets-nice endpoints
router.post('/corsa-bathroom-faucets-nice', CorsaBathroomFaucetsNiceController.createNice);
router.get('/corsa-bathroom-faucets-nice', CorsaBathroomFaucetsNiceController.getAllNice);
router.get('/corsa-bathroom-faucets-nice/:id', CorsaBathroomFaucetsNiceController.getOneNice);
router.put('/corsa-bathroom-faucets-nice/:id', CorsaBathroomFaucetsNiceController.updateNice);
router.delete('/corsa-bathroom-faucets-nice/:id', CorsaBathroomFaucetsNiceController.deleteNice);

// corsa-bathroom-faucets-omega endpoints
router.post('/corsa-bathroom-faucets-omega', CorsaBathroomFaucetsOmegaController.createOmega);
router.get('/corsa-bathroom-faucets-omega', CorsaBathroomFaucetsOmegaController.getAllOmega);
router.get('/corsa-bathroom-faucets-omega/:id', CorsaBathroomFaucetsOmegaController.getOneOmega);
router.put('/corsa-bathroom-faucets-omega/:id', CorsaBathroomFaucetsOmegaController.updateOmega);
router.delete('/corsa-bathroom-faucets-omega/:id', CorsaBathroomFaucetsOmegaController.deleteOmega);

// corsa-bathroom-faucets-passion endpoints
router.post('/corsa-bathroom-faucets-passion', CorsaBathroomFaucetsPassionController.createPassion);
router.get('/corsa-bathroom-faucets-passion', CorsaBathroomFaucetsPassionController.getAllPassion);
router.get('/corsa-bathroom-faucets-passion/:id', CorsaBathroomFaucetsPassionController.getOnePassion);
router.put('/corsa-bathroom-faucets-passion/:id', CorsaBathroomFaucetsPassionController.updatePassion);
router.delete('/corsa-bathroom-faucets-passion/:id', CorsaBathroomFaucetsPassionController.deletePassion);

// corsa-bathroom-faucets-royal endpoints
router.post('/corsa-bathroom-faucets-royal', CorsaBathroomFaucetsRoyalController.createRoyal);
router.get('/corsa-bathroom-faucets-royal', CorsaBathroomFaucetsRoyalController.getAllRoyal);
router.get('/corsa-bathroom-faucets-royal/:id', CorsaBathroomFaucetsRoyalController.getOneRoyal);
router.put('/corsa-bathroom-faucets-royal/:id', CorsaBathroomFaucetsRoyalController.updateRoyal);
router.delete('/corsa-bathroom-faucets-royal/:id', CorsaBathroomFaucetsRoyalController.deleteRoyal);

// corsa-bathroom-faucets-slimline endpoints
router.post('/corsa-bathroom-faucets-slimline', CorsaBathroomFaucetsSlimlineController.createSlimline);
router.get('/corsa-bathroom-faucets-slimline', CorsaBathroomFaucetsSlimlineController.getAllSlimline);
router.get('/corsa-bathroom-faucets-slimline/:id', CorsaBathroomFaucetsSlimlineController.getOneSlimline);
router.put('/corsa-bathroom-faucets-slimline/:id', CorsaBathroomFaucetsSlimlineController.updateSlimline);
router.delete('/corsa-bathroom-faucets-slimline/:id', CorsaBathroomFaucetsSlimlineController.deleteSlimline);

// corsa-bathroom-faucets-splash endpoints
router.post('/corsa-bathroom-faucets-splash', CorsaBathroomFaucetsSplashController.createSplash);
router.get('/corsa-bathroom-faucets-splash', CorsaBathroomFaucetsSplashController.getAllSplash);
router.get('/corsa-bathroom-faucets-splash/:id', CorsaBathroomFaucetsSplashController.getOneSplash);
router.put('/corsa-bathroom-faucets-splash/:id', CorsaBathroomFaucetsSplashController.updateSplash);
router.delete('/corsa-bathroom-faucets-splash/:id', CorsaBathroomFaucetsSplashController.deleteSplash);

// corsa-bathroom-faucets-square-f endpoints
router.post('/corsa-bathroom-faucets-square-f', CorsaBathroomFaucetsSquareFController.createSquareF);
router.get('/corsa-bathroom-faucets-square-f', CorsaBathroomFaucetsSquareFController.getAllSquareF);
router.get('/corsa-bathroom-faucets-square-f/:id', CorsaBathroomFaucetsSquareFController.getOneSquareF);
router.put('/corsa-bathroom-faucets-square-f/:id', CorsaBathroomFaucetsSquareFController.updateSquareF);
router.delete('/corsa-bathroom-faucets-square-f/:id', CorsaBathroomFaucetsSquareFController.deleteSquareF);

// corsa-bathroom-faucets-square-s endpoints
router.post('/corsa-bathroom-faucets-square-s', CorsaBathroomFaucetsSquareSController.createSquareS);
router.get('/corsa-bathroom-faucets-square-s', CorsaBathroomFaucetsSquareSController.getAllSquareS);
router.get('/corsa-bathroom-faucets-square-s/:id', CorsaBathroomFaucetsSquareSController.getOneSquareS);
router.put('/corsa-bathroom-faucets-square-s/:id', CorsaBathroomFaucetsSquareSController.updateSquareS);
router.delete('/corsa-bathroom-faucets-square-s/:id', CorsaBathroomFaucetsSquareSController.deleteSquareS);

// corsa-bathroom-faucets-super endpoints
router.post('/corsa-bathroom-faucets-super', CorsaBathroomFaucetsSuperController.createSuper);
router.get('/corsa-bathroom-faucets-super', CorsaBathroomFaucetsSuperController.getAllSuper);
router.get('/corsa-bathroom-faucets-super/:id', CorsaBathroomFaucetsSuperController.getOneSuper);
router.put('/corsa-bathroom-faucets-super/:id', CorsaBathroomFaucetsSuperController.updateSuper);
router.delete('/corsa-bathroom-faucets-super/:id', CorsaBathroomFaucetsSuperController.deleteSuper);

// corsa-bathroom-faucets-tri endpoints
router.post('/corsa-bathroom-faucets-tri', CorsaBathroomFaucetsTriController.createTri);
router.get('/corsa-bathroom-faucets-tri', CorsaBathroomFaucetsTriController.getAllTri);
router.get('/corsa-bathroom-faucets-tri/:id', CorsaBathroomFaucetsTriController.getOneTri);
router.put('/corsa-bathroom-faucets-tri/:id', CorsaBathroomFaucetsTriController.updateTri);
router.delete('/corsa-bathroom-faucets-tri/:id', CorsaBathroomFaucetsTriController.deleteTri);

// corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-acrylic-accessories endpoints
router.post('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-acrylic-accessories', CorsaBATHROOMACCESSORIESAcrylicAccessoriesController.createAcrylicAccessories);
router.get('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-acrylic-accessories', CorsaBATHROOMACCESSORIESAcrylicAccessoriesController.getAllAcrylicAccessories);
router.get('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-acrylic-accessories/:id', CorsaBATHROOMACCESSORIESAcrylicAccessoriesController.getOneAcrylicAccessories);
router.put('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-acrylic-accessories/:id', CorsaBATHROOMACCESSORIESAcrylicAccessoriesController.updateAcrylicAccessories);
router.delete('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-acrylic-accessories/:id', CorsaBATHROOMACCESSORIESAcrylicAccessoriesController.deleteAcrylicAccessories);

// corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-almond endpoints
router.post('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-almond', CorsaBATHROOMACCESSORIESAlmondController.createAlmond);
router.get('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-almond', CorsaBATHROOMACCESSORIESAlmondController.getAllAlmond);
router.get('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-almond/:id', CorsaBATHROOMACCESSORIESAlmondController.getOneAlmond);
router.put('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-almond/:id', CorsaBATHROOMACCESSORIESAlmondController.updateAlmond);
router.delete('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-almond/:id', CorsaBATHROOMACCESSORIESAlmondController.deleteAlmond);

// corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-anglo endpoints
router.post('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-anglo', CorsaBATHROOMACCESSORIESAngloController.createAnglo);
router.get('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-anglo', CorsaBATHROOMACCESSORIESAngloController.getAllAnglo);
router.get('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-anglo/:id', CorsaBATHROOMACCESSORIESAngloController.getOneAnglo);
router.put('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-anglo/:id', CorsaBATHROOMACCESSORIESAngloController.updateAnglo);
router.delete('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-anglo/:id', CorsaBATHROOMACCESSORIESAngloController.deleteAnglo);

// corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-budget endpoints
router.post('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-budget', CorsaBATHROOMACCESSORIESBudgetController.createBudget);
router.get('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-budget', CorsaBATHROOMACCESSORIESBudgetController.getAllBudget);
router.get('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-budget/:id', CorsaBATHROOMACCESSORIESBudgetController.getOneBudget);
router.put('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-budget/:id', CorsaBATHROOMACCESSORIESBudgetController.updateBudget);
router.delete('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-budget/:id', CorsaBATHROOMACCESSORIESBudgetController.deleteBudget);

// corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-dolphin endpoints
router.post('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-dolphin', CorsaBATHROOMACCESSORIESDolphinController.createDolphin);
router.get('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-dolphin', CorsaBATHROOMACCESSORIESDolphinController.getAllDolphin);
router.get('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-dolphin/:id', CorsaBATHROOMACCESSORIESDolphinController.getOneDolphin);
router.put('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-dolphin/:id', CorsaBATHROOMACCESSORIESDolphinController.updateDolphin);
router.delete('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-dolphin/:id', CorsaBATHROOMACCESSORIESDolphinController.deleteDolphin);

// corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-ecco endpoints
router.post('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-ecco', CorsaBATHROOMACCESSORIESEccoController.createEcco);
router.get('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-ecco', CorsaBATHROOMACCESSORIESEccoController.getAllEcco);
router.get('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-ecco/:id', CorsaBATHROOMACCESSORIESEccoController.getOneEcco);
router.put('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-ecco/:id', CorsaBATHROOMACCESSORIESEccoController.updateEcco);
router.delete('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-ecco/:id', CorsaBATHROOMACCESSORIESEccoController.deleteEcco);

// corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-keti endpoints
router.post('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-keti', CorsaBATHROOMACCESSORIESKetiController.createKeti);
router.get('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-keti', CorsaBATHROOMACCESSORIESKetiController.getAllKeti);
router.get('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-keti/:id', CorsaBATHROOMACCESSORIESKetiController.getOneKeti);
router.put('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-keti/:id', CorsaBATHROOMACCESSORIESKetiController.updateKeti);
router.delete('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-keti/:id', CorsaBATHROOMACCESSORIESKetiController.deleteKeti);

// corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-qubix endpoints
router.post('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-qubix', CorsaBATHROOMACCESSORIESQubixController.createQubix);
router.get('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-qubix', CorsaBATHROOMACCESSORIESQubixController.getAllQubix);
router.get('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-qubix/:id', CorsaBATHROOMACCESSORIESQubixController.getOneQubix);
router.put('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-qubix/:id', CorsaBATHROOMACCESSORIESQubixController.updateQubix);
router.delete('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-qubix/:id', CorsaBATHROOMACCESSORIESQubixController.deleteQubix);

// corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-square endpoints
router.post('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-square', CorsaBATHROOMACCESSORIESSquareController.createSquare);
router.get('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-square', CorsaBATHROOMACCESSORIESSquareController.getAllSquare);
router.get('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-square/:id', CorsaBATHROOMACCESSORIESSquareController.getOneSquare);
router.put('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-square/:id', CorsaBATHROOMACCESSORIESSquareController.updateSquare);
router.delete('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-square/:id', CorsaBATHROOMACCESSORIESSquareController.deleteSquare);

// corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-supreme endpoints
router.post('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-supreme', CorsaBATHROOMACCESSORIESSupremeController.createSupreme);
router.get('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-supreme', CorsaBATHROOMACCESSORIESSupremeController.getAllSupreme);
router.get('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-supreme/:id', CorsaBATHROOMACCESSORIESSupremeController.getOneSupreme);
router.put('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-supreme/:id', CorsaBATHROOMACCESSORIESSupremeController.updateSupreme);
router.delete('/corsa-b-a-t-h-r-o-o-m_-a-c-c-e-s-s-o-r-i-e-s-supreme/:id', CorsaBATHROOMACCESSORIESSupremeController.deleteSupreme);

// corsa-flushing-cistern endpoints
router.post('/corsa-flushing-cistern', CorsaFlushingCisternController.createFlushingCistern);
router.get('/corsa-flushing-cistern', CorsaFlushingCisternController.getAllFlushingCistern);
router.get('/corsa-flushing-cistern/:id', CorsaFlushingCisternController.getOneFlushingCistern);
router.put('/corsa-flushing-cistern/:id', CorsaFlushingCisternController.updateFlushingCistern);
router.delete('/corsa-flushing-cistern/:id', CorsaFlushingCisternController.deleteFlushingCistern);

// corsa-kitchen-kitchen-faucets endpoints
router.post('/corsa-kitchen-kitchen-faucets', CorsaKitchenKitchenFaucetsController.createKitchenFaucets);
router.get('/corsa-kitchen-kitchen-faucets', CorsaKitchenKitchenFaucetsController.getAllKitchenFaucets);
router.get('/corsa-kitchen-kitchen-faucets/:id', CorsaKitchenKitchenFaucetsController.getOneKitchenFaucets);
router.put('/corsa-kitchen-kitchen-faucets/:id', CorsaKitchenKitchenFaucetsController.updateKitchenFaucets);
router.delete('/corsa-kitchen-kitchen-faucets/:id', CorsaKitchenKitchenFaucetsController.deleteKitchenFaucets);

// corsa-kitchen-kitchen-sink endpoints
router.post('/corsa-kitchen-kitchen-sink', CorsaKitchenKitchenSinkController.createKitchenSink);
router.get('/corsa-kitchen-kitchen-sink', CorsaKitchenKitchenSinkController.getAllKitchenSink);
router.get('/corsa-kitchen-kitchen-sink/:id', CorsaKitchenKitchenSinkController.getOneKitchenSink);
router.put('/corsa-kitchen-kitchen-sink/:id', CorsaKitchenKitchenSinkController.updateKitchenSink);
router.delete('/corsa-kitchen-kitchen-sink/:id', CorsaKitchenKitchenSinkController.deleteKitchenSink);

// corsa-other-useful-items-ball-valves endpoints
router.post('/corsa-other-useful-items-ball-valves', CorsaOtherUsefulItemsBallValvesController.createBallValves);
router.get('/corsa-other-useful-items-ball-valves', CorsaOtherUsefulItemsBallValvesController.getAllBallValves);
router.get('/corsa-other-useful-items-ball-valves/:id', CorsaOtherUsefulItemsBallValvesController.getOneBallValves);
router.put('/corsa-other-useful-items-ball-valves/:id', CorsaOtherUsefulItemsBallValvesController.updateBallValves);
router.delete('/corsa-other-useful-items-ball-valves/:id', CorsaOtherUsefulItemsBallValvesController.deleteBallValves);

// corsa-other-useful-items-mini-angle-cock endpoints
router.post('/corsa-other-useful-items-mini-angle-cock', CorsaOtherUsefulItemsMiniAngleCockController.createMiniAngleCock);
router.get('/corsa-other-useful-items-mini-angle-cock', CorsaOtherUsefulItemsMiniAngleCockController.getAllMiniAngleCock);
router.get('/corsa-other-useful-items-mini-angle-cock/:id', CorsaOtherUsefulItemsMiniAngleCockController.getOneMiniAngleCock);
router.put('/corsa-other-useful-items-mini-angle-cock/:id', CorsaOtherUsefulItemsMiniAngleCockController.updateMiniAngleCock);
router.delete('/corsa-other-useful-items-mini-angle-cock/:id', CorsaOtherUsefulItemsMiniAngleCockController.deleteMiniAngleCock);

// corsa-other-useful-items-mouth-operated endpoints
router.post('/corsa-other-useful-items-mouth-operated', CorsaOtherUsefulItemsMouthOperatedController.createMouthOperated);
router.get('/corsa-other-useful-items-mouth-operated', CorsaOtherUsefulItemsMouthOperatedController.getAllMouthOperated);
router.get('/corsa-other-useful-items-mouth-operated/:id', CorsaOtherUsefulItemsMouthOperatedController.getOneMouthOperated);
router.put('/corsa-other-useful-items-mouth-operated/:id', CorsaOtherUsefulItemsMouthOperatedController.updateMouthOperated);
router.delete('/corsa-other-useful-items-mouth-operated/:id', CorsaOtherUsefulItemsMouthOperatedController.deleteMouthOperated);

// corsa-other-useful-items-pressmatic-push-cock endpoints
router.post('/corsa-other-useful-items-pressmatic-push-cock', CorsaOtherUsefulItemsPressmaticPushCockController.createPressmaticPushCock);
router.get('/corsa-other-useful-items-pressmatic-push-cock', CorsaOtherUsefulItemsPressmaticPushCockController.getAllPressmaticPushCock);
router.get('/corsa-other-useful-items-pressmatic-push-cock/:id', CorsaOtherUsefulItemsPressmaticPushCockController.getOnePressmaticPushCock);
router.put('/corsa-other-useful-items-pressmatic-push-cock/:id', CorsaOtherUsefulItemsPressmaticPushCockController.updatePressmaticPushCock);
router.delete('/corsa-other-useful-items-pressmatic-push-cock/:id', CorsaOtherUsefulItemsPressmaticPushCockController.deletePressmaticPushCock);

// corsa-other-useful-items-sensor-taps endpoints
router.post('/corsa-other-useful-items-sensor-taps', CorsaOtherUsefulItemsSensorTapsController.createSensorTaps);
router.get('/corsa-other-useful-items-sensor-taps', CorsaOtherUsefulItemsSensorTapsController.getAllSensorTaps);
router.get('/corsa-other-useful-items-sensor-taps/:id', CorsaOtherUsefulItemsSensorTapsController.getOneSensorTaps);
router.put('/corsa-other-useful-items-sensor-taps/:id', CorsaOtherUsefulItemsSensorTapsController.updateSensorTaps);
router.delete('/corsa-other-useful-items-sensor-taps/:id', CorsaOtherUsefulItemsSensorTapsController.deleteSensorTaps);

// corsa-other-useful-items-soap-dispenser endpoints
router.post('/corsa-other-useful-items-soap-dispenser', CorsaOtherUsefulItemsSoapDispenserController.createSoapDispenser);
router.get('/corsa-other-useful-items-soap-dispenser', CorsaOtherUsefulItemsSoapDispenserController.getAllSoapDispenser);
router.get('/corsa-other-useful-items-soap-dispenser/:id', CorsaOtherUsefulItemsSoapDispenserController.getOneSoapDispenser);
router.put('/corsa-other-useful-items-soap-dispenser/:id', CorsaOtherUsefulItemsSoapDispenserController.updateSoapDispenser);
router.delete('/corsa-other-useful-items-soap-dispenser/:id', CorsaOtherUsefulItemsSoapDispenserController.deleteSoapDispenser);

// corsa-s-h-o-w-e-r-s-health-faucet endpoints
router.post('/corsa-s-h-o-w-e-r-s-health-faucet', CorsaSHOWERSHealthFaucetController.createHealthFaucet);
router.get('/corsa-s-h-o-w-e-r-s-health-faucet', CorsaSHOWERSHealthFaucetController.getAllHealthFaucet);
router.get('/corsa-s-h-o-w-e-r-s-health-faucet/:id', CorsaSHOWERSHealthFaucetController.getOneHealthFaucet);
router.put('/corsa-s-h-o-w-e-r-s-health-faucet/:id', CorsaSHOWERSHealthFaucetController.updateHealthFaucet);
router.delete('/corsa-s-h-o-w-e-r-s-health-faucet/:id', CorsaSHOWERSHealthFaucetController.deleteHealthFaucet);

// corsa-s-h-o-w-e-r-s-overhead-shower endpoints
router.post('/corsa-s-h-o-w-e-r-s-overhead-shower', CorsaSHOWERSOverheadShowerController.createOverheadShower);
router.get('/corsa-s-h-o-w-e-r-s-overhead-shower', CorsaSHOWERSOverheadShowerController.getAllOverheadShower);
router.get('/corsa-s-h-o-w-e-r-s-overhead-shower/:id', CorsaSHOWERSOverheadShowerController.getOneOverheadShower);
router.put('/corsa-s-h-o-w-e-r-s-overhead-shower/:id', CorsaSHOWERSOverheadShowerController.updateOverheadShower);
router.delete('/corsa-s-h-o-w-e-r-s-overhead-shower/:id', CorsaSHOWERSOverheadShowerController.deleteOverheadShower);

// corsa-s-h-o-w-e-r-s-rain-shower endpoints
router.post('/corsa-s-h-o-w-e-r-s-rain-shower', CorsaSHOWERSRainShowerController.createRainShower);
router.get('/corsa-s-h-o-w-e-r-s-rain-shower', CorsaSHOWERSRainShowerController.getAllRainShower);
router.get('/corsa-s-h-o-w-e-r-s-rain-shower/:id', CorsaSHOWERSRainShowerController.getOneRainShower);
router.put('/corsa-s-h-o-w-e-r-s-rain-shower/:id', CorsaSHOWERSRainShowerController.updateRainShower);
router.delete('/corsa-s-h-o-w-e-r-s-rain-shower/:id', CorsaSHOWERSRainShowerController.deleteRainShower);

// corsa-s-h-o-w-e-r-s-telephonic-shower endpoints
router.post('/corsa-s-h-o-w-e-r-s-telephonic-shower', CorsaSHOWERSTelephonicShowerController.createTelephonicShower);
router.get('/corsa-s-h-o-w-e-r-s-telephonic-shower', CorsaSHOWERSTelephonicShowerController.getAllTelephonicShower);
router.get('/corsa-s-h-o-w-e-r-s-telephonic-shower/:id', CorsaSHOWERSTelephonicShowerController.getOneTelephonicShower);
router.put('/corsa-s-h-o-w-e-r-s-telephonic-shower/:id', CorsaSHOWERSTelephonicShowerController.updateTelephonicShower);
router.delete('/corsa-s-h-o-w-e-r-s-telephonic-shower/:id', CorsaSHOWERSTelephonicShowerController.deleteTelephonicShower);

// essess-accessories-series1-croma endpoints
router.post('/essess-accessories-series1-croma', EssessAccessoriesSeries1CromaController.createSeries1Croma);
router.get('/essess-accessories-series1-croma', EssessAccessoriesSeries1CromaController.getAllSeries1Croma);
router.get('/essess-accessories-series1-croma/:id', EssessAccessoriesSeries1CromaController.getOneSeries1Croma);
router.put('/essess-accessories-series1-croma/:id', EssessAccessoriesSeries1CromaController.updateSeries1Croma);
router.delete('/essess-accessories-series1-croma/:id', EssessAccessoriesSeries1CromaController.deleteSeries1Croma);

// essess-accessories-series2-swing endpoints
router.post('/essess-accessories-series2-swing', EssessAccessoriesSeries2SwingController.createSeries2Swing);
router.get('/essess-accessories-series2-swing', EssessAccessoriesSeries2SwingController.getAllSeries2Swing);
router.get('/essess-accessories-series2-swing/:id', EssessAccessoriesSeries2SwingController.getOneSeries2Swing);
router.put('/essess-accessories-series2-swing/:id', EssessAccessoriesSeries2SwingController.updateSeries2Swing);
router.delete('/essess-accessories-series2-swing/:id', EssessAccessoriesSeries2SwingController.deleteSeries2Swing);

// essess-accessories-series3-tarim endpoints
router.post('/essess-accessories-series3-tarim', EssessAccessoriesSeries3TarimController.createSeries3Tarim);
router.get('/essess-accessories-series3-tarim', EssessAccessoriesSeries3TarimController.getAllSeries3Tarim);
router.get('/essess-accessories-series3-tarim/:id', EssessAccessoriesSeries3TarimController.getOneSeries3Tarim);
router.put('/essess-accessories-series3-tarim/:id', EssessAccessoriesSeries3TarimController.updateSeries3Tarim);
router.delete('/essess-accessories-series3-tarim/:id', EssessAccessoriesSeries3TarimController.deleteSeries3Tarim);

// essess-accessories-series5-hotelier-series endpoints
router.post('/essess-accessories-series5-hotelier-series', EssessAccessoriesSeries5HotelierSeriesController.createSeries5HotelierSeries);
router.get('/essess-accessories-series5-hotelier-series', EssessAccessoriesSeries5HotelierSeriesController.getAllSeries5HotelierSeries);
router.get('/essess-accessories-series5-hotelier-series/:id', EssessAccessoriesSeries5HotelierSeriesController.getOneSeries5HotelierSeries);
router.put('/essess-accessories-series5-hotelier-series/:id', EssessAccessoriesSeries5HotelierSeriesController.updateSeries5HotelierSeries);
router.delete('/essess-accessories-series5-hotelier-series/:id', EssessAccessoriesSeries5HotelierSeriesController.deleteSeries5HotelierSeries);

// essess-accessories-series6-cruzo endpoints
router.post('/essess-accessories-series6-cruzo', EssessAccessoriesSeries6CruzoController.createSeries6Cruzo);
router.get('/essess-accessories-series6-cruzo', EssessAccessoriesSeries6CruzoController.getAllSeries6Cruzo);
router.get('/essess-accessories-series6-cruzo/:id', EssessAccessoriesSeries6CruzoController.getOneSeries6Cruzo);
router.put('/essess-accessories-series6-cruzo/:id', EssessAccessoriesSeries6CruzoController.updateSeries6Cruzo);
router.delete('/essess-accessories-series6-cruzo/:id', EssessAccessoriesSeries6CruzoController.deleteSeries6Cruzo);

// essess-accessories-series7-deon endpoints
router.post('/essess-accessories-series7-deon', EssessAccessoriesSeries7DeonController.createSeries7Deon);
router.get('/essess-accessories-series7-deon', EssessAccessoriesSeries7DeonController.getAllSeries7Deon);
router.get('/essess-accessories-series7-deon/:id', EssessAccessoriesSeries7DeonController.getOneSeries7Deon);
router.put('/essess-accessories-series7-deon/:id', EssessAccessoriesSeries7DeonController.updateSeries7Deon);
router.delete('/essess-accessories-series7-deon/:id', EssessAccessoriesSeries7DeonController.deleteSeries7Deon);

// essess-accessories-series8-b-series endpoints
router.post('/essess-accessories-series8-b-series', EssessAccessoriesSeries8BSeriesController.createSeries8BSeries);
router.get('/essess-accessories-series8-b-series', EssessAccessoriesSeries8BSeriesController.getAllSeries8BSeries);
router.get('/essess-accessories-series8-b-series/:id', EssessAccessoriesSeries8BSeriesController.getOneSeries8BSeries);
router.put('/essess-accessories-series8-b-series/:id', EssessAccessoriesSeries8BSeriesController.updateSeries8BSeries);
router.delete('/essess-accessories-series8-b-series/:id', EssessAccessoriesSeries8BSeriesController.deleteSeries8BSeries);

// essess-auto-close-taps endpoints
router.post('/essess-auto-close-taps', EssessAutoCloseTapsController.createAutoCloseTaps);
router.get('/essess-auto-close-taps', EssessAutoCloseTapsController.getAllAutoCloseTaps);
router.get('/essess-auto-close-taps/:id', EssessAutoCloseTapsController.getOneAutoCloseTaps);
router.put('/essess-auto-close-taps/:id', EssessAutoCloseTapsController.updateAutoCloseTaps);
router.delete('/essess-auto-close-taps/:id', EssessAutoCloseTapsController.deleteAutoCloseTaps);

// essess-celato endpoints
router.post('/essess-celato', EssessCelatoController.createCelato);
router.get('/essess-celato', EssessCelatoController.getAllCelato);
router.get('/essess-celato/:id', EssessCelatoController.getOneCelato);
router.put('/essess-celato/:id', EssessCelatoController.updateCelato);
router.delete('/essess-celato/:id', EssessCelatoController.deleteCelato);

// essess-croma endpoints
router.post('/essess-croma', EssessCromaController.createCroma);
router.get('/essess-croma', EssessCromaController.getAllCroma);
router.get('/essess-croma/:id', EssessCromaController.getOneCroma);
router.put('/essess-croma/:id', EssessCromaController.updateCroma);
router.delete('/essess-croma/:id', EssessCromaController.deleteCroma);

// essess-cruzo endpoints
router.post('/essess-cruzo', EssessCruzoController.createCruzo);
router.get('/essess-cruzo', EssessCruzoController.getAllCruzo);
router.get('/essess-cruzo/:id', EssessCruzoController.getOneCruzo);
router.put('/essess-cruzo/:id', EssessCruzoController.updateCruzo);
router.delete('/essess-cruzo/:id', EssessCruzoController.deleteCruzo);

// essess-deon endpoints
router.post('/essess-deon', EssessDeonController.createDeon);
router.get('/essess-deon', EssessDeonController.getAllDeon);
router.get('/essess-deon/:id', EssessDeonController.getOneDeon);
router.put('/essess-deon/:id', EssessDeonController.updateDeon);
router.delete('/essess-deon/:id', EssessDeonController.deleteDeon);

// essess-d-series endpoints
router.post('/essess-d-series', EssessDSeriesController.createDSeries);
router.get('/essess-d-series', EssessDSeriesController.getAllDSeries);
router.get('/essess-d-series/:id', EssessDSeriesController.getOneDSeries);
router.put('/essess-d-series/:id', EssessDSeriesController.updateDSeries);
router.delete('/essess-d-series/:id', EssessDSeriesController.deleteDSeries);

// essess-echo endpoints
router.post('/essess-echo', EssessEchoController.createEcho);
router.get('/essess-echo', EssessEchoController.getAllEcho);
router.get('/essess-echo/:id', EssessEchoController.getOneEcho);
router.put('/essess-echo/:id', EssessEchoController.updateEcho);
router.delete('/essess-echo/:id', EssessEchoController.deleteEcho);

// essess-essentials endpoints
router.post('/essess-essentials', EssessEssentialsController.createEssentials);
router.get('/essess-essentials', EssessEssentialsController.getAllEssentials);
router.get('/essess-essentials/:id', EssessEssentialsController.getOneEssentials);
router.put('/essess-essentials/:id', EssessEssentialsController.updateEssentials);
router.delete('/essess-essentials/:id', EssessEssentialsController.deleteEssentials);

// essess-hotelier-series endpoints
router.post('/essess-hotelier-series', EssessHotelierSeriesController.createHotelierSeries);
router.get('/essess-hotelier-series', EssessHotelierSeriesController.getAllHotelierSeries);
router.get('/essess-hotelier-series/:id', EssessHotelierSeriesController.getOneHotelierSeries);
router.put('/essess-hotelier-series/:id', EssessHotelierSeriesController.updateHotelierSeries);
router.delete('/essess-hotelier-series/:id', EssessHotelierSeriesController.deleteHotelierSeries);

// essess-h-s03 endpoints
router.post('/essess-h-s03', EssessHS03Controller.createHS03);
router.get('/essess-h-s03', EssessHS03Controller.getAllHS03);
router.get('/essess-h-s03/:id', EssessHS03Controller.getOneHS03);
router.put('/essess-h-s03/:id', EssessHS03Controller.updateHS03);
router.delete('/essess-h-s03/:id', EssessHS03Controller.deleteHS03);

// essess-lab-taps endpoints
router.post('/essess-lab-taps', EssessLabTapsController.createLabTaps);
router.get('/essess-lab-taps', EssessLabTapsController.getAllLabTaps);
router.get('/essess-lab-taps/:id', EssessLabTapsController.getOneLabTaps);
router.put('/essess-lab-taps/:id', EssessLabTapsController.updateLabTaps);
router.delete('/essess-lab-taps/:id', EssessLabTapsController.deleteLabTaps);

// essess-new-dune endpoints
router.post('/essess-new-dune', EssessNewDuneController.createNewDune);
router.get('/essess-new-dune', EssessNewDuneController.getAllNewDune);
router.get('/essess-new-dune/:id', EssessNewDuneController.getOneNewDune);
router.put('/essess-new-dune/:id', EssessNewDuneController.updateNewDune);
router.delete('/essess-new-dune/:id', EssessNewDuneController.deleteNewDune);

// essess-new-xess endpoints
router.post('/essess-new-xess', EssessNewXessController.createNewXess);
router.get('/essess-new-xess', EssessNewXessController.getAllNewXess);
router.get('/essess-new-xess/:id', EssessNewXessController.getOneNewXess);
router.put('/essess-new-xess/:id', EssessNewXessController.updateNewXess);
router.delete('/essess-new-xess/:id', EssessNewXessController.deleteNewXess);

// essess-quadra endpoints
router.post('/essess-quadra', EssessQuadraController.createQuadra);
router.get('/essess-quadra', EssessQuadraController.getAllQuadra);
router.get('/essess-quadra/:id', EssessQuadraController.getOneQuadra);
router.put('/essess-quadra/:id', EssessQuadraController.updateQuadra);
router.delete('/essess-quadra/:id', EssessQuadraController.deleteQuadra);

// essess-sensors endpoints
router.post('/essess-sensors', EssessSensorsController.createSensors);
router.get('/essess-sensors', EssessSensorsController.getAllSensors);
router.get('/essess-sensors/:id', EssessSensorsController.getOneSensors);
router.put('/essess-sensors/:id', EssessSensorsController.updateSensors);
router.delete('/essess-sensors/:id', EssessSensorsController.deleteSensors);

// essess-showers-hand-showers endpoints
router.post('/essess-showers-hand-showers', EssessShowersHandShowersController.createHandShowers);
router.get('/essess-showers-hand-showers', EssessShowersHandShowersController.getAllHandShowers);
router.get('/essess-showers-hand-showers/:id', EssessShowersHandShowersController.getOneHandShowers);
router.put('/essess-showers-hand-showers/:id', EssessShowersHandShowersController.updateHandShowers);
router.delete('/essess-showers-hand-showers/:id', EssessShowersHandShowersController.deleteHandShowers);

// essess-showers-overhead-showers endpoints
router.post('/essess-showers-overhead-showers', EssessShowersOverheadShowersController.createOverheadShowers);
router.get('/essess-showers-overhead-showers', EssessShowersOverheadShowersController.getAllOverheadShowers);
router.get('/essess-showers-overhead-showers/:id', EssessShowersOverheadShowersController.getOneOverheadShowers);
router.put('/essess-showers-overhead-showers/:id', EssessShowersOverheadShowersController.updateOverheadShowers);
router.delete('/essess-showers-overhead-showers/:id', EssessShowersOverheadShowersController.deleteOverheadShowers);

// essess-showers-rainfall-showers endpoints
router.post('/essess-showers-rainfall-showers', EssessShowersRainfallShowersController.createRainfallShowers);
router.get('/essess-showers-rainfall-showers', EssessShowersRainfallShowersController.getAllRainfallShowers);
router.get('/essess-showers-rainfall-showers/:id', EssessShowersRainfallShowersController.getOneRainfallShowers);
router.put('/essess-showers-rainfall-showers/:id', EssessShowersRainfallShowersController.updateRainfallShowers);
router.delete('/essess-showers-rainfall-showers/:id', EssessShowersRainfallShowersController.deleteRainfallShowers);

// essess-showers-shower-arms endpoints
router.post('/essess-showers-shower-arms', EssessShowersShowerArmsController.createShowerArms);
router.get('/essess-showers-shower-arms', EssessShowersShowerArmsController.getAllShowerArms);
router.get('/essess-showers-shower-arms/:id', EssessShowersShowerArmsController.getOneShowerArms);
router.put('/essess-showers-shower-arms/:id', EssessShowersShowerArmsController.updateShowerArms);
router.delete('/essess-showers-shower-arms/:id', EssessShowersShowerArmsController.deleteShowerArms);

// essess-tarim endpoints
router.post('/essess-tarim', EssessTarimController.createTarim);
router.get('/essess-tarim', EssessTarimController.getAllTarim);
router.get('/essess-tarim/:id', EssessTarimController.getOneTarim);
router.put('/essess-tarim/:id', EssessTarimController.updateTarim);
router.delete('/essess-tarim/:id', EssessTarimController.deleteTarim);

// essess-trand endpoints
router.post('/essess-trand', EssessTrandController.createTrand);
router.get('/essess-trand', EssessTrandController.getAllTrand);
router.get('/essess-trand/:id', EssessTrandController.getOneTrand);
router.put('/essess-trand/:id', EssessTrandController.updateTrand);
router.delete('/essess-trand/:id', EssessTrandController.deleteTrand);

// faucets endpoints
router.post('/faucets', faucetsController.createFaucets);
router.get('/faucets', faucetsController.getAllFaucets);
router.get('/faucets/:id', faucetsController.getOneFaucets);
router.put('/faucets/:id', faucetsController.updateFaucets);
router.delete('/faucets/:id', faucetsController.deleteFaucets);

// hardware-bathroom-accessories endpoints
router.post('/hardware-bathroom-accessories', hardwareBathroomAccessoriesController.createHardwareBathroomAccessories);
router.get('/hardware-bathroom-accessories', hardwareBathroomAccessoriesController.getAllHardwareBathroomAccessories);
router.get('/hardware-bathroom-accessories/:id', hardwareBathroomAccessoriesController.getOneHardwareBathroomAccessories);
router.put('/hardware-bathroom-accessories/:id', hardwareBathroomAccessoriesController.updateHardwareBathroomAccessories);
router.delete('/hardware-bathroom-accessories/:id', hardwareBathroomAccessoriesController.deleteHardwareBathroomAccessories);

// health-faucet endpoints
router.post('/health-faucet', healthFaucetController.createHealthFaucet);
router.get('/health-faucet', healthFaucetController.getAllHealthFaucet);
router.get('/health-faucet/:id', healthFaucetController.getOneHealthFaucet);
router.put('/health-faucet/:id', healthFaucetController.updateHealthFaucet);
router.delete('/health-faucet/:id', healthFaucetController.deleteHealthFaucet);

// hindware-add-on endpoints
router.post('/hindware-add-on', HindwareAddOnController.createAddOn);
router.get('/hindware-add-on', HindwareAddOnController.getAllAddOn);
router.get('/hindware-add-on/:id', HindwareAddOnController.getOneAddOn);
router.put('/hindware-add-on/:id', HindwareAddOnController.updateAddOn);
router.delete('/hindware-add-on/:id', HindwareAddOnController.deleteAddOn);

// hindware-bath-tub endpoints
router.post('/hindware-bath-tub', HindwareBathTubController.createBathTub);
router.get('/hindware-bath-tub', HindwareBathTubController.getAllBathTub);
router.get('/hindware-bath-tub/:id', HindwareBathTubController.getOneBathTub);
router.put('/hindware-bath-tub/:id', HindwareBathTubController.updateBathTub);
router.delete('/hindware-bath-tub/:id', HindwareBathTubController.deleteBathTub);

// hindware-cisterns endpoints
router.post('/hindware-cisterns', HindwareCisternsController.createCisterns);
router.get('/hindware-cisterns', HindwareCisternsController.getAllCisterns);
router.get('/hindware-cisterns/:id', HindwareCisternsController.getOneCisterns);
router.put('/hindware-cisterns/:id', HindwareCisternsController.updateCisterns);
router.delete('/hindware-cisterns/:id', HindwareCisternsController.deleteCisterns);

// hindware-faucets-angular-stop-cock endpoints
router.post('/hindware-faucets-angular-stop-cock', HindwareFaucetsAngularStopCockController.createAngularStopCock);
router.get('/hindware-faucets-angular-stop-cock', HindwareFaucetsAngularStopCockController.getAllAngularStopCock);
router.get('/hindware-faucets-angular-stop-cock/:id', HindwareFaucetsAngularStopCockController.getOneAngularStopCock);
router.put('/hindware-faucets-angular-stop-cock/:id', HindwareFaucetsAngularStopCockController.updateAngularStopCock);
router.delete('/hindware-faucets-angular-stop-cock/:id', HindwareFaucetsAngularStopCockController.deleteAngularStopCock);

// hindware-faucets-bath-spout endpoints
router.post('/hindware-faucets-bath-spout', HindwareFaucetsBathSpoutController.createBathSpout);
router.get('/hindware-faucets-bath-spout', HindwareFaucetsBathSpoutController.getAllBathSpout);
router.get('/hindware-faucets-bath-spout/:id', HindwareFaucetsBathSpoutController.getOneBathSpout);
router.put('/hindware-faucets-bath-spout/:id', HindwareFaucetsBathSpoutController.updateBathSpout);
router.delete('/hindware-faucets-bath-spout/:id', HindwareFaucetsBathSpoutController.deleteBathSpout);

// hindware-faucets-bib-cock endpoints
router.post('/hindware-faucets-bib-cock', HindwareFaucetsBibCockController.createBibCock);
router.get('/hindware-faucets-bib-cock', HindwareFaucetsBibCockController.getAllBibCock);
router.get('/hindware-faucets-bib-cock/:id', HindwareFaucetsBibCockController.getOneBibCock);
router.put('/hindware-faucets-bib-cock/:id', HindwareFaucetsBibCockController.updateBibCock);
router.delete('/hindware-faucets-bib-cock/:id', HindwareFaucetsBibCockController.deleteBibCock);

// hindware-faucets-chbm endpoints
router.post('/hindware-faucets-chbm', HindwareFaucetsChbmController.createChbm);
router.get('/hindware-faucets-chbm', HindwareFaucetsChbmController.getAllChbm);
router.get('/hindware-faucets-chbm/:id', HindwareFaucetsChbmController.getOneChbm);
router.put('/hindware-faucets-chbm/:id', HindwareFaucetsChbmController.updateChbm);
router.delete('/hindware-faucets-chbm/:id', HindwareFaucetsChbmController.deleteChbm);

// hindware-faucets-concealed-stop-cock endpoints
router.post('/hindware-faucets-concealed-stop-cock', HindwareFaucetsConcealedStopCockController.createConcealedStopCock);
router.get('/hindware-faucets-concealed-stop-cock', HindwareFaucetsConcealedStopCockController.getAllConcealedStopCock);
router.get('/hindware-faucets-concealed-stop-cock/:id', HindwareFaucetsConcealedStopCockController.getOneConcealedStopCock);
router.put('/hindware-faucets-concealed-stop-cock/:id', HindwareFaucetsConcealedStopCockController.updateConcealedStopCock);
router.delete('/hindware-faucets-concealed-stop-cock/:id', HindwareFaucetsConcealedStopCockController.deleteConcealedStopCock);

// hindware-faucets-csc-exp-kit endpoints
router.post('/hindware-faucets-csc-exp-kit', HindwareFaucetsCscExpKitController.createCscExpKit);
router.get('/hindware-faucets-csc-exp-kit', HindwareFaucetsCscExpKitController.getAllCscExpKit);
router.get('/hindware-faucets-csc-exp-kit/:id', HindwareFaucetsCscExpKitController.getOneCscExpKit);
router.put('/hindware-faucets-csc-exp-kit/:id', HindwareFaucetsCscExpKitController.updateCscExpKit);
router.delete('/hindware-faucets-csc-exp-kit/:id', HindwareFaucetsCscExpKitController.deleteCscExpKit);

// hindware-faucets-deusch-mixer endpoints
router.post('/hindware-faucets-deusch-mixer', HindwareFaucetsDeuschMixerController.createDeuschMixer);
router.get('/hindware-faucets-deusch-mixer', HindwareFaucetsDeuschMixerController.getAllDeuschMixer);
router.get('/hindware-faucets-deusch-mixer/:id', HindwareFaucetsDeuschMixerController.getOneDeuschMixer);
router.put('/hindware-faucets-deusch-mixer/:id', HindwareFaucetsDeuschMixerController.updateDeuschMixer);
router.delete('/hindware-faucets-deusch-mixer/:id', HindwareFaucetsDeuschMixerController.deleteDeuschMixer);

// hindware-faucets-exposed-mixers endpoints
router.post('/hindware-faucets-exposed-mixers', HindwareFaucetsExposedMixersController.createExposedMixers);
router.get('/hindware-faucets-exposed-mixers', HindwareFaucetsExposedMixersController.getAllExposedMixers);
router.get('/hindware-faucets-exposed-mixers/:id', HindwareFaucetsExposedMixersController.getOneExposedMixers);
router.put('/hindware-faucets-exposed-mixers/:id', HindwareFaucetsExposedMixersController.updateExposedMixers);
router.delete('/hindware-faucets-exposed-mixers/:id', HindwareFaucetsExposedMixersController.deleteExposedMixers);

// hindware-faucets-flush-cock endpoints
router.post('/hindware-faucets-flush-cock', HindwareFaucetsFlushCockController.createFlushCock);
router.get('/hindware-faucets-flush-cock', HindwareFaucetsFlushCockController.getAllFlushCock);
router.get('/hindware-faucets-flush-cock/:id', HindwareFaucetsFlushCockController.getOneFlushCock);
router.put('/hindware-faucets-flush-cock/:id', HindwareFaucetsFlushCockController.updateFlushCock);
router.delete('/hindware-faucets-flush-cock/:id', HindwareFaucetsFlushCockController.deleteFlushCock);

// hindware-faucets-medical-series endpoints
router.post('/hindware-faucets-medical-series', HindwareFaucetsMedicalSeriesController.createMedicalSeries);
router.get('/hindware-faucets-medical-series', HindwareFaucetsMedicalSeriesController.getAllMedicalSeries);
router.get('/hindware-faucets-medical-series/:id', HindwareFaucetsMedicalSeriesController.getOneMedicalSeries);
router.put('/hindware-faucets-medical-series/:id', HindwareFaucetsMedicalSeriesController.updateMedicalSeries);
router.delete('/hindware-faucets-medical-series/:id', HindwareFaucetsMedicalSeriesController.deleteMedicalSeries);

// hindware-faucets-mixer-faucet endpoints
router.post('/hindware-faucets-mixer-faucet', HindwareFaucetsMixerFaucetController.createMixerFaucet);
router.get('/hindware-faucets-mixer-faucet', HindwareFaucetsMixerFaucetController.getAllMixerFaucet);
router.get('/hindware-faucets-mixer-faucet/:id', HindwareFaucetsMixerFaucetController.getOneMixerFaucet);
router.put('/hindware-faucets-mixer-faucet/:id', HindwareFaucetsMixerFaucetController.updateMixerFaucet);
router.delete('/hindware-faucets-mixer-faucet/:id', HindwareFaucetsMixerFaucetController.deleteMixerFaucet);

// hindware-faucets-pillar-cock endpoints
router.post('/hindware-faucets-pillar-cock', HindwareFaucetsPillarCockController.createPillarCock);
router.get('/hindware-faucets-pillar-cock', HindwareFaucetsPillarCockController.getAllPillarCock);
router.get('/hindware-faucets-pillar-cock/:id', HindwareFaucetsPillarCockController.getOnePillarCock);
router.put('/hindware-faucets-pillar-cock/:id', HindwareFaucetsPillarCockController.updatePillarCock);
router.delete('/hindware-faucets-pillar-cock/:id', HindwareFaucetsPillarCockController.deletePillarCock);

// hindware-faucets-pillar-cock-tall endpoints
router.post('/hindware-faucets-pillar-cock-tall', HindwareFaucetsPillarCockTallController.createPillarCockTall);
router.get('/hindware-faucets-pillar-cock-tall', HindwareFaucetsPillarCockTallController.getAllPillarCockTall);
router.get('/hindware-faucets-pillar-cock-tall/:id', HindwareFaucetsPillarCockTallController.getOnePillarCockTall);
router.put('/hindware-faucets-pillar-cock-tall/:id', HindwareFaucetsPillarCockTallController.updatePillarCockTall);
router.delete('/hindware-faucets-pillar-cock-tall/:id', HindwareFaucetsPillarCockTallController.deletePillarCockTall);

// hindware-faucets-pillar-faucet endpoints
router.post('/hindware-faucets-pillar-faucet', HindwareFaucetsPillarFaucetController.createPillarFaucet);
router.get('/hindware-faucets-pillar-faucet', HindwareFaucetsPillarFaucetController.getAllPillarFaucet);
router.get('/hindware-faucets-pillar-faucet/:id', HindwareFaucetsPillarFaucetController.getOnePillarFaucet);
router.put('/hindware-faucets-pillar-faucet/:id', HindwareFaucetsPillarFaucetController.updatePillarFaucet);
router.delete('/hindware-faucets-pillar-faucet/:id', HindwareFaucetsPillarFaucetController.deletePillarFaucet);

// hindware-faucets-pressmatic endpoints
router.post('/hindware-faucets-pressmatic', HindwareFaucetsPressmaticController.createPressmatic);
router.get('/hindware-faucets-pressmatic', HindwareFaucetsPressmaticController.getAllPressmatic);
router.get('/hindware-faucets-pressmatic/:id', HindwareFaucetsPressmaticController.getOnePressmatic);
router.put('/hindware-faucets-pressmatic/:id', HindwareFaucetsPressmaticController.updatePressmatic);
router.delete('/hindware-faucets-pressmatic/:id', HindwareFaucetsPressmaticController.deletePressmatic);

// hindware-faucets-recessed endpoints
router.post('/hindware-faucets-recessed', HindwareFaucetsRecessedController.createRecessed);
router.get('/hindware-faucets-recessed', HindwareFaucetsRecessedController.getAllRecessed);
router.get('/hindware-faucets-recessed/:id', HindwareFaucetsRecessedController.getOneRecessed);
router.put('/hindware-faucets-recessed/:id', HindwareFaucetsRecessedController.updateRecessed);
router.delete('/hindware-faucets-recessed/:id', HindwareFaucetsRecessedController.deleteRecessed);

// hindware-faucets-single-lever-divertor endpoints
router.post('/hindware-faucets-single-lever-divertor', HindwareFaucetsSingleLeverDivertorController.createSingleLeverDivertor);
router.get('/hindware-faucets-single-lever-divertor', HindwareFaucetsSingleLeverDivertorController.getAllSingleLeverDivertor);
router.get('/hindware-faucets-single-lever-divertor/:id', HindwareFaucetsSingleLeverDivertorController.getOneSingleLeverDivertor);
router.put('/hindware-faucets-single-lever-divertor/:id', HindwareFaucetsSingleLeverDivertorController.updateSingleLeverDivertor);
router.delete('/hindware-faucets-single-lever-divertor/:id', HindwareFaucetsSingleLeverDivertorController.deleteSingleLeverDivertor);

// hindware-faucets-sink-cock endpoints
router.post('/hindware-faucets-sink-cock', HindwareFaucetsSinkCockController.createSinkCock);
router.get('/hindware-faucets-sink-cock', HindwareFaucetsSinkCockController.getAllSinkCock);
router.get('/hindware-faucets-sink-cock/:id', HindwareFaucetsSinkCockController.getOneSinkCock);
router.put('/hindware-faucets-sink-cock/:id', HindwareFaucetsSinkCockController.updateSinkCock);
router.delete('/hindware-faucets-sink-cock/:id', HindwareFaucetsSinkCockController.deleteSinkCock);

// hindware-faucets-sink-mixer endpoints
router.post('/hindware-faucets-sink-mixer', HindwareFaucetsSinkMixerController.createSinkMixer);
router.get('/hindware-faucets-sink-mixer', HindwareFaucetsSinkMixerController.getAllSinkMixer);
router.get('/hindware-faucets-sink-mixer/:id', HindwareFaucetsSinkMixerController.getOneSinkMixer);
router.put('/hindware-faucets-sink-mixer/:id', HindwareFaucetsSinkMixerController.updateSinkMixer);
router.delete('/hindware-faucets-sink-mixer/:id', HindwareFaucetsSinkMixerController.deleteSinkMixer);

// hindware-faucets-slbm-faucet endpoints
router.post('/hindware-faucets-slbm-faucet', HindwareFaucetsSlbmFaucetController.createSlbmFaucet);
router.get('/hindware-faucets-slbm-faucet', HindwareFaucetsSlbmFaucetController.getAllSlbmFaucet);
router.get('/hindware-faucets-slbm-faucet/:id', HindwareFaucetsSlbmFaucetController.getOneSlbmFaucet);
router.put('/hindware-faucets-slbm-faucet/:id', HindwareFaucetsSlbmFaucetController.updateSlbmFaucet);
router.delete('/hindware-faucets-slbm-faucet/:id', HindwareFaucetsSlbmFaucetController.deleteSlbmFaucet);

// hindware-faucets-slbm-faucet-tall endpoints
router.post('/hindware-faucets-slbm-faucet-tall', HindwareFaucetsSlbmFaucetTallController.createSlbmFaucetTall);
router.get('/hindware-faucets-slbm-faucet-tall', HindwareFaucetsSlbmFaucetTallController.getAllSlbmFaucetTall);
router.get('/hindware-faucets-slbm-faucet-tall/:id', HindwareFaucetsSlbmFaucetTallController.getOneSlbmFaucetTall);
router.put('/hindware-faucets-slbm-faucet-tall/:id', HindwareFaucetsSlbmFaucetTallController.updateSlbmFaucetTall);
router.delete('/hindware-faucets-slbm-faucet-tall/:id', HindwareFaucetsSlbmFaucetTallController.deleteSlbmFaucetTall);

// hindware-faucets-wall-mixer endpoints
router.post('/hindware-faucets-wall-mixer', HindwareFaucetsWallMixerController.createWallMixer);
router.get('/hindware-faucets-wall-mixer', HindwareFaucetsWallMixerController.getAllWallMixer);
router.get('/hindware-faucets-wall-mixer/:id', HindwareFaucetsWallMixerController.getOneWallMixer);
router.put('/hindware-faucets-wall-mixer/:id', HindwareFaucetsWallMixerController.updateWallMixer);
router.delete('/hindware-faucets-wall-mixer/:id', HindwareFaucetsWallMixerController.deleteWallMixer);

// hindware-showers-rain-showers endpoints
router.post('/hindware-showers-rain-showers', HindwareShowersRainShowersController.createRainShowers);
router.get('/hindware-showers-rain-showers', HindwareShowersRainShowersController.getAllRainShowers);
router.get('/hindware-showers-rain-showers/:id', HindwareShowersRainShowersController.getOneRainShowers);
router.put('/hindware-showers-rain-showers/:id', HindwareShowersRainShowersController.updateRainShowers);
router.delete('/hindware-showers-rain-showers/:id', HindwareShowersRainShowersController.deleteRainShowers);

// hindware-wash-basins endpoints
router.post('/hindware-wash-basins', HindwareWashBasinsController.createWashBasins);
router.get('/hindware-wash-basins', HindwareWashBasinsController.getAllWashBasins);
router.get('/hindware-wash-basins/:id', HindwareWashBasinsController.getOneWashBasins);
router.put('/hindware-wash-basins/:id', HindwareWashBasinsController.updateWashBasins);
router.delete('/hindware-wash-basins/:id', HindwareWashBasinsController.deleteWashBasins);

// hindware-water-closets endpoints
router.post('/hindware-water-closets', HindwareWaterClosetsController.createWaterClosets);
router.get('/hindware-water-closets', HindwareWaterClosetsController.getAllWaterClosets);
router.get('/hindware-water-closets/:id', HindwareWaterClosetsController.getOneWaterClosets);
router.put('/hindware-water-closets/:id', HindwareWaterClosetsController.updateWaterClosets);
router.delete('/hindware-water-closets/:id', HindwareWaterClosetsController.deleteWaterClosets);

// jaquar endpoints
router.post('/jaquar', jaquarController.createJaquar);
router.get('/jaquar', jaquarController.getAllJaquar);
router.get('/jaquar/:id', jaquarController.getOneJaquar);
router.put('/jaquar/:id', jaquarController.updateJaquar);
router.delete('/jaquar/:id', jaquarController.deleteJaquar);

// kitchen-sinks endpoints
router.post('/kitchen-sinks', kitchenSinksController.createKitchenSinks);
router.get('/kitchen-sinks', kitchenSinksController.getAllKitchenSinks);
router.get('/kitchen-sinks/:id', kitchenSinksController.getOneKitchenSinks);
router.put('/kitchen-sinks/:id', kitchenSinksController.updateKitchenSinks);
router.delete('/kitchen-sinks/:id', kitchenSinksController.deleteKitchenSinks);

// leo-bath-fittings-bathroom-accessories-bathroom-accessories endpoints
router.post('/leo-bath-fittings-bathroom-accessories-bathroom-accessories', LeoBathFittingsBathroomAccessoriesBathroomAccessoriesController.createBathroomAccessories);
router.get('/leo-bath-fittings-bathroom-accessories-bathroom-accessories', LeoBathFittingsBathroomAccessoriesBathroomAccessoriesController.getAllBathroomAccessories);
router.get('/leo-bath-fittings-bathroom-accessories-bathroom-accessories/:id', LeoBathFittingsBathroomAccessoriesBathroomAccessoriesController.getOneBathroomAccessories);
router.put('/leo-bath-fittings-bathroom-accessories-bathroom-accessories/:id', LeoBathFittingsBathroomAccessoriesBathroomAccessoriesController.updateBathroomAccessories);
router.delete('/leo-bath-fittings-bathroom-accessories-bathroom-accessories/:id', LeoBathFittingsBathroomAccessoriesBathroomAccessoriesController.deleteBathroomAccessories);

// leo-bath-fittings-faucets-faucets endpoints
router.post('/leo-bath-fittings-faucets-faucets', LeoBathFittingsFaucetsFaucetsController.createFaucets);
router.get('/leo-bath-fittings-faucets-faucets', LeoBathFittingsFaucetsFaucetsController.getAllFaucets);
router.get('/leo-bath-fittings-faucets-faucets/:id', LeoBathFittingsFaucetsFaucetsController.getOneFaucets);
router.put('/leo-bath-fittings-faucets-faucets/:id', LeoBathFittingsFaucetsFaucetsController.updateFaucets);
router.delete('/leo-bath-fittings-faucets-faucets/:id', LeoBathFittingsFaucetsFaucetsController.deleteFaucets);

// leo-bath-fittings-valve-valve endpoints
router.post('/leo-bath-fittings-valve-valve', LeoBathFittingsValveValveController.createValve);
router.get('/leo-bath-fittings-valve-valve', LeoBathFittingsValveValveController.getAllValve);
router.get('/leo-bath-fittings-valve-valve/:id', LeoBathFittingsValveValveController.getOneValve);
router.put('/leo-bath-fittings-valve-valve/:id', LeoBathFittingsValveValveController.updateValve);
router.delete('/leo-bath-fittings-valve-valve/:id', LeoBathFittingsValveValveController.deleteValve);

// pamay-faucets-faucets endpoints
router.post('/pamay-faucets-faucets', PamayFaucetsFaucetsController.createFaucets);
router.get('/pamay-faucets-faucets', PamayFaucetsFaucetsController.getAllFaucets);
router.get('/pamay-faucets-faucets/:id', PamayFaucetsFaucetsController.getOneFaucets);
router.put('/pamay-faucets-faucets/:id', PamayFaucetsFaucetsController.updateFaucets);
router.delete('/pamay-faucets-faucets/:id', PamayFaucetsFaucetsController.deleteFaucets);

// pamay-showers-showers endpoints
router.post('/pamay-showers-showers', PamayShowersShowersController.createShowers);
router.get('/pamay-showers-showers', PamayShowersShowersController.getAllShowers);
router.get('/pamay-showers-showers/:id', PamayShowersShowersController.getOneShowers);
router.put('/pamay-showers-showers/:id', PamayShowersShowersController.updateShowers);
router.delete('/pamay-showers-showers/:id', PamayShowersShowersController.deleteShowers);

// parryware-accessories-accessories endpoints
router.post('/parryware-accessories-accessories', parrywareAccessoriesAccessoriesController.createAccessories);
router.get('/parryware-accessories-accessories', parrywareAccessoriesAccessoriesController.getAllAccessories);
router.get('/parryware-accessories-accessories/:id', parrywareAccessoriesAccessoriesController.getOneAccessories);
router.put('/parryware-accessories-accessories/:id', parrywareAccessoriesAccessoriesController.updateAccessories);
router.delete('/parryware-accessories-accessories/:id', parrywareAccessoriesAccessoriesController.deleteAccessories);

// parryware-angle-valves-angle-valves endpoints
router.post('/parryware-angle-valves-angle-valves', parrywareAngleValvesAngleValvesController.createAngleValves);
router.get('/parryware-angle-valves-angle-valves', parrywareAngleValvesAngleValvesController.getAllAngleValves);
router.get('/parryware-angle-valves-angle-valves/:id', parrywareAngleValvesAngleValvesController.getOneAngleValves);
router.put('/parryware-angle-valves-angle-valves/:id', parrywareAngleValvesAngleValvesController.updateAngleValves);
router.delete('/parryware-angle-valves-angle-valves/:id', parrywareAngleValvesAngleValvesController.deleteAngleValves);

// parryware-below-counter-basins-below-counter-basins endpoints
router.post('/parryware-below-counter-basins-below-counter-basins', parrywareBelowCounterBasinsBelowCounterBasinsController.createBelowCounterBasins);
router.get('/parryware-below-counter-basins-below-counter-basins', parrywareBelowCounterBasinsBelowCounterBasinsController.getAllBelowCounterBasins);
router.get('/parryware-below-counter-basins-below-counter-basins/:id', parrywareBelowCounterBasinsBelowCounterBasinsController.getOneBelowCounterBasins);
router.put('/parryware-below-counter-basins-below-counter-basins/:id', parrywareBelowCounterBasinsBelowCounterBasinsController.updateBelowCounterBasins);
router.delete('/parryware-below-counter-basins-below-counter-basins/:id', parrywareBelowCounterBasinsBelowCounterBasinsController.deleteBelowCounterBasins);

// parryware-bowl-basins-bowl-basins endpoints
router.post('/parryware-bowl-basins-bowl-basins', parrywareBowlBasinsBowlBasinsController.createBowlBasins);
router.get('/parryware-bowl-basins-bowl-basins', parrywareBowlBasinsBowlBasinsController.getAllBowlBasins);
router.get('/parryware-bowl-basins-bowl-basins/:id', parrywareBowlBasinsBowlBasinsController.getOneBowlBasins);
router.put('/parryware-bowl-basins-bowl-basins/:id', parrywareBowlBasinsBowlBasinsController.updateBowlBasins);
router.delete('/parryware-bowl-basins-bowl-basins/:id', parrywareBowlBasinsBowlBasinsController.deleteBowlBasins);

// parryware-c-l-o-s-e-t-s-closets endpoints
router.post('/parryware-c-l-o-s-e-t-s-closets', parrywareCLOSETSClosetsController.createClosets);
router.get('/parryware-c-l-o-s-e-t-s-closets', parrywareCLOSETSClosetsController.getAllClosets);
router.get('/parryware-c-l-o-s-e-t-s-closets/:id', parrywareCLOSETSClosetsController.getOneClosets);
router.put('/parryware-c-l-o-s-e-t-s-closets/:id', parrywareCLOSETSClosetsController.updateClosets);
router.delete('/parryware-c-l-o-s-e-t-s-closets/:id', parrywareCLOSETSClosetsController.deleteClosets);

// parryware-concealed-cistern-concealed-cistern endpoints
router.post('/parryware-concealed-cistern-concealed-cistern', parrywareConcealedCisternConcealedCisternController.createConcealedCistern);
router.get('/parryware-concealed-cistern-concealed-cistern', parrywareConcealedCisternConcealedCisternController.getAllConcealedCistern);
router.get('/parryware-concealed-cistern-concealed-cistern/:id', parrywareConcealedCisternConcealedCisternController.getOneConcealedCistern);
router.put('/parryware-concealed-cistern-concealed-cistern/:id', parrywareConcealedCisternConcealedCisternController.updateConcealedCistern);
router.delete('/parryware-concealed-cistern-concealed-cistern/:id', parrywareConcealedCisternConcealedCisternController.deleteConcealedCistern);

// parryware-european-water-closet-european-water-closet endpoints
router.post('/parryware-european-water-closet-european-water-closet', parrywareEuropeanWaterClosetEuropeanWaterClosetController.createEuropeanWaterCloset);
router.get('/parryware-european-water-closet-european-water-closet', parrywareEuropeanWaterClosetEuropeanWaterClosetController.getAllEuropeanWaterCloset);
router.get('/parryware-european-water-closet-european-water-closet/:id', parrywareEuropeanWaterClosetEuropeanWaterClosetController.getOneEuropeanWaterCloset);
router.put('/parryware-european-water-closet-european-water-closet/:id', parrywareEuropeanWaterClosetEuropeanWaterClosetController.updateEuropeanWaterCloset);
router.delete('/parryware-european-water-closet-european-water-closet/:id', parrywareEuropeanWaterClosetEuropeanWaterClosetController.deleteEuropeanWaterCloset);

// parryware-f-a-u-c-e-t-s-flush-cocks endpoints
router.post('/parryware-f-a-u-c-e-t-s-flush-cocks', parrywareFAUCETSFlushCocksController.createFlushCocks);
router.get('/parryware-f-a-u-c-e-t-s-flush-cocks', parrywareFAUCETSFlushCocksController.getAllFlushCocks);
router.get('/parryware-f-a-u-c-e-t-s-flush-cocks/:id', parrywareFAUCETSFlushCocksController.getOneFlushCocks);
router.put('/parryware-f-a-u-c-e-t-s-flush-cocks/:id', parrywareFAUCETSFlushCocksController.updateFlushCocks);
router.delete('/parryware-f-a-u-c-e-t-s-flush-cocks/:id', parrywareFAUCETSFlushCocksController.deleteFlushCocks);

// parryware-f-a-u-c-e-t-s-flush-valve endpoints
router.post('/parryware-f-a-u-c-e-t-s-flush-valve', parrywareFAUCETSFlushValveController.createFlushValve);
router.get('/parryware-f-a-u-c-e-t-s-flush-valve', parrywareFAUCETSFlushValveController.getAllFlushValve);
router.get('/parryware-f-a-u-c-e-t-s-flush-valve/:id', parrywareFAUCETSFlushValveController.getOneFlushValve);
router.put('/parryware-f-a-u-c-e-t-s-flush-valve/:id', parrywareFAUCETSFlushValveController.updateFlushValve);
router.delete('/parryware-f-a-u-c-e-t-s-flush-valve/:id', parrywareFAUCETSFlushValveController.deleteFlushValve);

// parryware-f-a-u-c-e-t-s-health-faucets endpoints
router.post('/parryware-f-a-u-c-e-t-s-health-faucets', parrywareFAUCETSHealthFaucetsController.createHealthFaucets);
router.get('/parryware-f-a-u-c-e-t-s-health-faucets', parrywareFAUCETSHealthFaucetsController.getAllHealthFaucets);
router.get('/parryware-f-a-u-c-e-t-s-health-faucets/:id', parrywareFAUCETSHealthFaucetsController.getOneHealthFaucets);
router.put('/parryware-f-a-u-c-e-t-s-health-faucets/:id', parrywareFAUCETSHealthFaucetsController.updateHealthFaucets);
router.delete('/parryware-f-a-u-c-e-t-s-health-faucets/:id', parrywareFAUCETSHealthFaucetsController.deleteHealthFaucets);

// parryware-f-a-u-c-e-t-s-kitchen-sinks endpoints
router.post('/parryware-f-a-u-c-e-t-s-kitchen-sinks', parrywareFAUCETSKitchenSinksController.createKitchenSinks);
router.get('/parryware-f-a-u-c-e-t-s-kitchen-sinks', parrywareFAUCETSKitchenSinksController.getAllKitchenSinks);
router.get('/parryware-f-a-u-c-e-t-s-kitchen-sinks/:id', parrywareFAUCETSKitchenSinksController.getOneKitchenSinks);
router.put('/parryware-f-a-u-c-e-t-s-kitchen-sinks/:id', parrywareFAUCETSKitchenSinksController.updateKitchenSinks);
router.delete('/parryware-f-a-u-c-e-t-s-kitchen-sinks/:id', parrywareFAUCETSKitchenSinksController.deleteKitchenSinks);

// parryware-f-a-u-c-e-t-s-pedestals endpoints
router.post('/parryware-f-a-u-c-e-t-s-pedestals', parrywareFAUCETSPedestalsController.createPedestals);
router.get('/parryware-f-a-u-c-e-t-s-pedestals', parrywareFAUCETSPedestalsController.getAllPedestals);
router.get('/parryware-f-a-u-c-e-t-s-pedestals/:id', parrywareFAUCETSPedestalsController.getOnePedestals);
router.put('/parryware-f-a-u-c-e-t-s-pedestals/:id', parrywareFAUCETSPedestalsController.updatePedestals);
router.delete('/parryware-f-a-u-c-e-t-s-pedestals/:id', parrywareFAUCETSPedestalsController.deletePedestals);

// parryware-polymer-cisterns-polymer-cisterns endpoints
router.post('/parryware-polymer-cisterns-polymer-cisterns', parrywarePolymerCisternsPolymerCisternsController.createPolymerCisterns);
router.get('/parryware-polymer-cisterns-polymer-cisterns', parrywarePolymerCisternsPolymerCisternsController.getAllPolymerCisterns);
router.get('/parryware-polymer-cisterns-polymer-cisterns/:id', parrywarePolymerCisternsPolymerCisternsController.getOnePolymerCisterns);
router.put('/parryware-polymer-cisterns-polymer-cisterns/:id', parrywarePolymerCisternsPolymerCisternsController.updatePolymerCisterns);
router.delete('/parryware-polymer-cisterns-polymer-cisterns/:id', parrywarePolymerCisternsPolymerCisternsController.deletePolymerCisterns);

// parryware-push-plates-push-plates endpoints
router.post('/parryware-push-plates-push-plates', parrywarePushPlatesPushPlatesController.createPushPlates);
router.get('/parryware-push-plates-push-plates', parrywarePushPlatesPushPlatesController.getAllPushPlates);
router.get('/parryware-push-plates-push-plates/:id', parrywarePushPlatesPushPlatesController.getOnePushPlates);
router.put('/parryware-push-plates-push-plates/:id', parrywarePushPlatesPushPlatesController.updatePushPlates);
router.delete('/parryware-push-plates-push-plates/:id', parrywarePushPlatesPushPlatesController.deletePushPlates);

// parryware-seat-covers-seat-covers endpoints
router.post('/parryware-seat-covers-seat-covers', parrywareSeatCoversSeatCoversController.createSeatCovers);
router.get('/parryware-seat-covers-seat-covers', parrywareSeatCoversSeatCoversController.getAllSeatCovers);
router.get('/parryware-seat-covers-seat-covers/:id', parrywareSeatCoversSeatCoversController.getOneSeatCovers);
router.put('/parryware-seat-covers-seat-covers/:id', parrywareSeatCoversSeatCoversController.updateSeatCovers);
router.delete('/parryware-seat-covers-seat-covers/:id', parrywareSeatCoversSeatCoversController.deleteSeatCovers);

// parryware-semi-recessed-basins-semi-recessed-basins endpoints
router.post('/parryware-semi-recessed-basins-semi-recessed-basins', parrywareSemiRecessedBasinsSemiRecessedBasinsController.createSemiRecessedBasins);
router.get('/parryware-semi-recessed-basins-semi-recessed-basins', parrywareSemiRecessedBasinsSemiRecessedBasinsController.getAllSemiRecessedBasins);
router.get('/parryware-semi-recessed-basins-semi-recessed-basins/:id', parrywareSemiRecessedBasinsSemiRecessedBasinsController.getOneSemiRecessedBasins);
router.put('/parryware-semi-recessed-basins-semi-recessed-basins/:id', parrywareSemiRecessedBasinsSemiRecessedBasinsController.updateSemiRecessedBasins);
router.delete('/parryware-semi-recessed-basins-semi-recessed-basins/:id', parrywareSemiRecessedBasinsSemiRecessedBasinsController.deleteSemiRecessedBasins);

// parryware-shower-enclosures-shower-enclosures endpoints
router.post('/parryware-shower-enclosures-shower-enclosures', parrywareShowerEnclosuresShowerEnclosuresController.createShowerEnclosures);
router.get('/parryware-shower-enclosures-shower-enclosures', parrywareShowerEnclosuresShowerEnclosuresController.getAllShowerEnclosures);
router.get('/parryware-shower-enclosures-shower-enclosures/:id', parrywareShowerEnclosuresShowerEnclosuresController.getOneShowerEnclosures);
router.put('/parryware-shower-enclosures-shower-enclosures/:id', parrywareShowerEnclosuresShowerEnclosuresController.updateShowerEnclosures);
router.delete('/parryware-shower-enclosures-shower-enclosures/:id', parrywareShowerEnclosuresShowerEnclosuresController.deleteShowerEnclosures);

// parryware-shower-panels-shower-panels endpoints
router.post('/parryware-shower-panels-shower-panels', parrywareShowerPanelsShowerPanelsController.createShowerPanels);
router.get('/parryware-shower-panels-shower-panels', parrywareShowerPanelsShowerPanelsController.getAllShowerPanels);
router.get('/parryware-shower-panels-shower-panels/:id', parrywareShowerPanelsShowerPanelsController.getOneShowerPanels);
router.put('/parryware-shower-panels-shower-panels/:id', parrywareShowerPanelsShowerPanelsController.updateShowerPanels);
router.delete('/parryware-shower-panels-shower-panels/:id', parrywareShowerPanelsShowerPanelsController.deleteShowerPanels);

// parryware-showers-showers endpoints
router.post('/parryware-showers-showers', parrywareShowersShowersController.createShowers);
router.get('/parryware-showers-showers', parrywareShowersShowersController.getAllShowers);
router.get('/parryware-showers-showers/:id', parrywareShowersShowersController.getOneShowers);
router.put('/parryware-showers-showers/:id', parrywareShowersShowersController.updateShowers);
router.delete('/parryware-showers-showers/:id', parrywareShowersShowersController.deleteShowers);

// parryware-utsav-range-utsav-range endpoints
router.post('/parryware-utsav-range-utsav-range', parrywareUtsavRangeUtsavRangeController.createUtsavRange);
router.get('/parryware-utsav-range-utsav-range', parrywareUtsavRangeUtsavRangeController.getAllUtsavRange);
router.get('/parryware-utsav-range-utsav-range/:id', parrywareUtsavRangeUtsavRangeController.getOneUtsavRange);
router.put('/parryware-utsav-range-utsav-range/:id', parrywareUtsavRangeUtsavRangeController.updateUtsavRange);
router.delete('/parryware-utsav-range-utsav-range/:id', parrywareUtsavRangeUtsavRangeController.deleteUtsavRange);

// parryware-wash-basins-wash-basins endpoints
router.post('/parryware-wash-basins-wash-basins', parrywareWashBasinsWashBasinsController.createWashBasins);
router.get('/parryware-wash-basins-wash-basins', parrywareWashBasinsWashBasinsController.getAllWashBasins);
router.get('/parryware-wash-basins-wash-basins/:id', parrywareWashBasinsWashBasinsController.getOneWashBasins);
router.put('/parryware-wash-basins-wash-basins/:id', parrywareWashBasinsWashBasinsController.updateWashBasins);
router.delete('/parryware-wash-basins-wash-basins/:id', parrywareWashBasinsWashBasinsController.deleteWashBasins);

// parryware-waste-coupling-waste-coupling endpoints
router.post('/parryware-waste-coupling-waste-coupling', parrywareWasteCouplingWasteCouplingController.createWasteCoupling);
router.get('/parryware-waste-coupling-waste-coupling', parrywareWasteCouplingWasteCouplingController.getAllWasteCoupling);
router.get('/parryware-waste-coupling-waste-coupling/:id', parrywareWasteCouplingWasteCouplingController.getOneWasteCoupling);
router.put('/parryware-waste-coupling-waste-coupling/:id', parrywareWasteCouplingWasteCouplingController.updateWasteCoupling);
router.delete('/parryware-waste-coupling-waste-coupling/:id', parrywareWasteCouplingWasteCouplingController.deleteWasteCoupling);

// parryware-water-heaters-water-heaters endpoints
router.post('/parryware-water-heaters-water-heaters', parrywareWaterHeatersWaterHeatersController.createWaterHeaters);
router.get('/parryware-water-heaters-water-heaters', parrywareWaterHeatersWaterHeatersController.getAllWaterHeaters);
router.get('/parryware-water-heaters-water-heaters/:id', parrywareWaterHeatersWaterHeatersController.getOneWaterHeaters);
router.put('/parryware-water-heaters-water-heaters/:id', parrywareWaterHeatersWaterHeatersController.updateWaterHeaters);
router.delete('/parryware-water-heaters-water-heaters/:id', parrywareWaterHeatersWaterHeatersController.deleteWaterHeaters);

// pearl-precious-products-edge-edge endpoints
router.post('/pearl-precious-products-edge-edge', PearlPreciousProductsEdgeEdgeController.createEdge);
router.get('/pearl-precious-products-edge-edge', PearlPreciousProductsEdgeEdgeController.getAllEdge);
router.get('/pearl-precious-products-edge-edge/:id', PearlPreciousProductsEdgeEdgeController.getOneEdge);
router.put('/pearl-precious-products-edge-edge/:id', PearlPreciousProductsEdgeEdgeController.updateEdge);
router.delete('/pearl-precious-products-edge-edge/:id', PearlPreciousProductsEdgeEdgeController.deleteEdge);

// showers endpoints
router.post('/showers', showersController.createShowers);
router.get('/showers', showersController.getAllShowers);
router.get('/showers/:id', showersController.getOneShowers);
router.put('/showers/:id', showersController.updateShowers);
router.delete('/showers/:id', showersController.deleteShowers);

// taps endpoints
router.post('/taps', tapsController.createTaps);
router.get('/taps', tapsController.getAllTaps);
router.get('/taps/:id', tapsController.getOneTaps);
router.put('/taps/:id', tapsController.updateTaps);
router.delete('/taps/:id', tapsController.deleteTaps);

// washbasins endpoints
router.post('/washbasins', washbasinsController.createWashbasins);
router.get('/washbasins', washbasinsController.getAllWashbasins);
router.get('/washbasins/:id', washbasinsController.getOneWashbasins);
router.put('/washbasins/:id', washbasinsController.updateWashbasins);
router.delete('/washbasins/:id', washbasinsController.deleteWashbasins);

// waterman-accessories endpoints
router.post('/waterman-accessories', WatermanAccessoriesController.createAccessories);
router.get('/waterman-accessories', WatermanAccessoriesController.getAllAccessories);
router.get('/waterman-accessories/:id', WatermanAccessoriesController.getOneAccessories);
router.put('/waterman-accessories/:id', WatermanAccessoriesController.updateAccessories);
router.delete('/waterman-accessories/:id', WatermanAccessoriesController.deleteAccessories);

// waterman-aria endpoints
router.post('/waterman-aria', WatermanAriaController.createAria);
router.get('/waterman-aria', WatermanAriaController.getAllAria);
router.get('/waterman-aria/:id', WatermanAriaController.getOneAria);
router.put('/waterman-aria/:id', WatermanAriaController.updateAria);
router.delete('/waterman-aria/:id', WatermanAriaController.deleteAria);

// waterman-aura endpoints
router.post('/waterman-aura', WatermanAuraController.createAura);
router.get('/waterman-aura', WatermanAuraController.getAllAura);
router.get('/waterman-aura/:id', WatermanAuraController.getOneAura);
router.put('/waterman-aura/:id', WatermanAuraController.updateAura);
router.delete('/waterman-aura/:id', WatermanAuraController.deleteAura);

// waterman-dell endpoints
router.post('/waterman-dell', WatermanDellController.createDell);
router.get('/waterman-dell', WatermanDellController.getAllDell);
router.get('/waterman-dell/:id', WatermanDellController.getOneDell);
router.put('/waterman-dell/:id', WatermanDellController.updateDell);
router.delete('/waterman-dell/:id', WatermanDellController.deleteDell);

// waterman-deluxe endpoints
router.post('/waterman-deluxe', WatermanDeluxeController.createDeluxe);
router.get('/waterman-deluxe', WatermanDeluxeController.getAllDeluxe);
router.get('/waterman-deluxe/:id', WatermanDeluxeController.getOneDeluxe);
router.put('/waterman-deluxe/:id', WatermanDeluxeController.updateDeluxe);
router.delete('/waterman-deluxe/:id', WatermanDeluxeController.deleteDeluxe);

// waterman-eco endpoints
router.post('/waterman-eco', WatermanEcoController.createEco);
router.get('/waterman-eco', WatermanEcoController.getAllEco);
router.get('/waterman-eco/:id', WatermanEcoController.getOneEco);
router.put('/waterman-eco/:id', WatermanEcoController.updateEco);
router.delete('/waterman-eco/:id', WatermanEcoController.deleteEco);

// waterman-evoque endpoints
router.post('/waterman-evoque', WatermanEvoqueController.createEvoque);
router.get('/waterman-evoque', WatermanEvoqueController.getAllEvoque);
router.get('/waterman-evoque/:id', WatermanEvoqueController.getOneEvoque);
router.put('/waterman-evoque/:id', WatermanEvoqueController.updateEvoque);
router.delete('/waterman-evoque/:id', WatermanEvoqueController.deleteEvoque);

// waterman-hand-showers endpoints
router.post('/waterman-hand-showers', WatermanHandShowersController.createHandShowers);
router.get('/waterman-hand-showers', WatermanHandShowersController.getAllHandShowers);
router.get('/waterman-hand-showers/:id', WatermanHandShowersController.getOneHandShowers);
router.put('/waterman-hand-showers/:id', WatermanHandShowersController.updateHandShowers);
router.delete('/waterman-hand-showers/:id', WatermanHandShowersController.deleteHandShowers);

// waterman-health-faucet-abs endpoints
router.post('/waterman-health-faucet-abs', WatermanHealthFaucetAbsController.createHealthFaucetAbs);
router.get('/waterman-health-faucet-abs', WatermanHealthFaucetAbsController.getAllHealthFaucetAbs);
router.get('/waterman-health-faucet-abs/:id', WatermanHealthFaucetAbsController.getOneHealthFaucetAbs);
router.put('/waterman-health-faucet-abs/:id', WatermanHealthFaucetAbsController.updateHealthFaucetAbs);
router.delete('/waterman-health-faucet-abs/:id', WatermanHealthFaucetAbsController.deleteHealthFaucetAbs);

// waterman-health-faucets-brass endpoints
router.post('/waterman-health-faucets-brass', WatermanHealthFaucetsBrassController.createHealthFaucetsBrass);
router.get('/waterman-health-faucets-brass', WatermanHealthFaucetsBrassController.getAllHealthFaucetsBrass);
router.get('/waterman-health-faucets-brass/:id', WatermanHealthFaucetsBrassController.getOneHealthFaucetsBrass);
router.put('/waterman-health-faucets-brass/:id', WatermanHealthFaucetsBrassController.updateHealthFaucetsBrass);
router.delete('/waterman-health-faucets-brass/:id', WatermanHealthFaucetsBrassController.deleteHealthFaucetsBrass);

// waterman-ikon endpoints
router.post('/waterman-ikon', WatermanIkonController.createIkon);
router.get('/waterman-ikon', WatermanIkonController.getAllIkon);
router.get('/waterman-ikon/:id', WatermanIkonController.getOneIkon);
router.put('/waterman-ikon/:id', WatermanIkonController.updateIkon);
router.delete('/waterman-ikon/:id', WatermanIkonController.deleteIkon);

// waterman-rain-showers endpoints
router.post('/waterman-rain-showers', WatermanRainShowersController.createRainShowers);
router.get('/waterman-rain-showers', WatermanRainShowersController.getAllRainShowers);
router.get('/waterman-rain-showers/:id', WatermanRainShowersController.getOneRainShowers);
router.put('/waterman-rain-showers/:id', WatermanRainShowersController.updateRainShowers);
router.delete('/waterman-rain-showers/:id', WatermanRainShowersController.deleteRainShowers);

// waterman-roman endpoints
router.post('/waterman-roman', WatermanRomanController.createRoman);
router.get('/waterman-roman', WatermanRomanController.getAllRoman);
router.get('/waterman-roman/:id', WatermanRomanController.getOneRoman);
router.put('/waterman-roman/:id', WatermanRomanController.updateRoman);
router.delete('/waterman-roman/:id', WatermanRomanController.deleteRoman);

// waterman-shower-tubes endpoints
router.post('/waterman-shower-tubes', WatermanShowerTubesController.createShowerTubes);
router.get('/waterman-shower-tubes', WatermanShowerTubesController.getAllShowerTubes);
router.get('/waterman-shower-tubes/:id', WatermanShowerTubesController.getOneShowerTubes);
router.put('/waterman-shower-tubes/:id', WatermanShowerTubesController.updateShowerTubes);
router.delete('/waterman-shower-tubes/:id', WatermanShowerTubesController.deleteShowerTubes);

// waterman-wall-showers-with-arm endpoints
router.post('/waterman-wall-showers-with-arm', WatermanWallShowersWithArmController.createWallShowersWithArm);
router.get('/waterman-wall-showers-with-arm', WatermanWallShowersWithArmController.getAllWallShowersWithArm);
router.get('/waterman-wall-showers-with-arm/:id', WatermanWallShowersWithArmController.getOneWallShowersWithArm);
router.put('/waterman-wall-showers-with-arm/:id', WatermanWallShowersWithArmController.updateWallShowersWithArm);
router.delete('/waterman-wall-showers-with-arm/:id', WatermanWallShowersWithArmController.deleteWallShowersWithArm);

// waterman-wall-showers-without-arm endpoints
router.post('/waterman-wall-showers-without-arm', WatermanWallShowersWithoutArmController.createWallShowersWithoutArm);
router.get('/waterman-wall-showers-without-arm', WatermanWallShowersWithoutArmController.getAllWallShowersWithoutArm);
router.get('/waterman-wall-showers-without-arm/:id', WatermanWallShowersWithoutArmController.getOneWallShowersWithoutArm);
router.put('/waterman-wall-showers-without-arm/:id', WatermanWallShowersWithoutArmController.updateWallShowersWithoutArm);
router.delete('/waterman-wall-showers-without-arm/:id', WatermanWallShowersWithoutArmController.deleteWallShowersWithoutArm);

// water-tec-allied endpoints
router.post('/water-tec-allied', WaterTecAlliedController.createAllied);
router.get('/water-tec-allied', WaterTecAlliedController.getAllAllied);
router.get('/water-tec-allied/:id', WaterTecAlliedController.getOneAllied);
router.put('/water-tec-allied/:id', WaterTecAlliedController.updateAllied);
router.delete('/water-tec-allied/:id', WaterTecAlliedController.deleteAllied);

// water-tec-aqua endpoints
router.post('/water-tec-aqua', WaterTecAquaController.createAqua);
router.get('/water-tec-aqua', WaterTecAquaController.getAllAqua);
router.get('/water-tec-aqua/:id', WaterTecAquaController.getOneAqua);
router.put('/water-tec-aqua/:id', WaterTecAquaController.updateAqua);
router.delete('/water-tec-aqua/:id', WaterTecAquaController.deleteAqua);

// water-tec-aspire endpoints
router.post('/water-tec-aspire', WaterTecAspireController.createAspire);
router.get('/water-tec-aspire', WaterTecAspireController.getAllAspire);
router.get('/water-tec-aspire/:id', WaterTecAspireController.getOneAspire);
router.put('/water-tec-aspire/:id', WaterTecAspireController.updateAspire);
router.delete('/water-tec-aspire/:id', WaterTecAspireController.deleteAspire);

// water-tec-bathroom-accessories endpoints
router.post('/water-tec-bathroom-accessories', WaterTecBathroomAccessoriesController.createBathroomAccessories);
router.get('/water-tec-bathroom-accessories', WaterTecBathroomAccessoriesController.getAllBathroomAccessories);
router.get('/water-tec-bathroom-accessories/:id', WaterTecBathroomAccessoriesController.getOneBathroomAccessories);
router.put('/water-tec-bathroom-accessories/:id', WaterTecBathroomAccessoriesController.updateBathroomAccessories);
router.delete('/water-tec-bathroom-accessories/:id', WaterTecBathroomAccessoriesController.deleteBathroomAccessories);

// water-tec-cistern endpoints
router.post('/water-tec-cistern', WaterTecCisternController.createCistern);
router.get('/water-tec-cistern', WaterTecCisternController.getAllCistern);
router.get('/water-tec-cistern/:id', WaterTecCisternController.getOneCistern);
router.put('/water-tec-cistern/:id', WaterTecCisternController.updateCistern);
router.delete('/water-tec-cistern/:id', WaterTecCisternController.deleteCistern);

// water-tec-concealed-cistern endpoints
router.post('/water-tec-concealed-cistern', WaterTecConcealedCisternController.createConcealedCistern);
router.get('/water-tec-concealed-cistern', WaterTecConcealedCisternController.getAllConcealedCistern);
router.get('/water-tec-concealed-cistern/:id', WaterTecConcealedCisternController.getOneConcealedCistern);
router.put('/water-tec-concealed-cistern/:id', WaterTecConcealedCisternController.updateConcealedCistern);
router.delete('/water-tec-concealed-cistern/:id', WaterTecConcealedCisternController.deleteConcealedCistern);

// water-tec-connection-tube endpoints
router.post('/water-tec-connection-tube', WaterTecConnectionTubeController.createConnectionTube);
router.get('/water-tec-connection-tube', WaterTecConnectionTubeController.getAllConnectionTube);
router.get('/water-tec-connection-tube/:id', WaterTecConnectionTubeController.getOneConnectionTube);
router.put('/water-tec-connection-tube/:id', WaterTecConnectionTubeController.updateConnectionTube);
router.delete('/water-tec-connection-tube/:id', WaterTecConnectionTubeController.deleteConnectionTube);

// water-tec-ebony endpoints
router.post('/water-tec-ebony', WaterTecEbonyController.createEbony);
router.get('/water-tec-ebony', WaterTecEbonyController.getAllEbony);
router.get('/water-tec-ebony/:id', WaterTecEbonyController.getOneEbony);
router.put('/water-tec-ebony/:id', WaterTecEbonyController.updateEbony);
router.delete('/water-tec-ebony/:id', WaterTecEbonyController.deleteEbony);

// water-tec-eco endpoints
router.post('/water-tec-eco', WaterTecEcoController.createEco);
router.get('/water-tec-eco', WaterTecEcoController.getAllEco);
router.get('/water-tec-eco/:id', WaterTecEcoController.getOneEco);
router.put('/water-tec-eco/:id', WaterTecEcoController.updateEco);
router.delete('/water-tec-eco/:id', WaterTecEcoController.deleteEco);

// water-tec-eva endpoints
router.post('/water-tec-eva', WaterTecEvaController.createEva);
router.get('/water-tec-eva', WaterTecEvaController.getAllEva);
router.get('/water-tec-eva/:id', WaterTecEvaController.getOneEva);
router.put('/water-tec-eva/:id', WaterTecEvaController.updateEva);
router.delete('/water-tec-eva/:id', WaterTecEvaController.deleteEva);

// water-tec-flora endpoints
router.post('/water-tec-flora', WaterTecFloraController.createFlora);
router.get('/water-tec-flora', WaterTecFloraController.getAllFlora);
router.get('/water-tec-flora/:id', WaterTecFloraController.getOneFlora);
router.put('/water-tec-flora/:id', WaterTecFloraController.updateFlora);
router.delete('/water-tec-flora/:id', WaterTecFloraController.deleteFlora);

// water-tec-health-faucets endpoints
router.post('/water-tec-health-faucets', WaterTecHealthFaucetsController.createHealthFaucets);
router.get('/water-tec-health-faucets', WaterTecHealthFaucetsController.getAllHealthFaucets);
router.get('/water-tec-health-faucets/:id', WaterTecHealthFaucetsController.getOneHealthFaucets);
router.put('/water-tec-health-faucets/:id', WaterTecHealthFaucetsController.updateHealthFaucets);
router.delete('/water-tec-health-faucets/:id', WaterTecHealthFaucetsController.deleteHealthFaucets);

// water-tec-quattro endpoints
router.post('/water-tec-quattro', WaterTecQuattroController.createQuattro);
router.get('/water-tec-quattro', WaterTecQuattroController.getAllQuattro);
router.get('/water-tec-quattro/:id', WaterTecQuattroController.getOneQuattro);
router.put('/water-tec-quattro/:id', WaterTecQuattroController.updateQuattro);
router.delete('/water-tec-quattro/:id', WaterTecQuattroController.deleteQuattro);

// water-tec-showers endpoints
router.post('/water-tec-showers', WaterTecShowersController.createShowers);
router.get('/water-tec-showers', WaterTecShowersController.getAllShowers);
router.get('/water-tec-showers/:id', WaterTecShowersController.getOneShowers);
router.put('/water-tec-showers/:id', WaterTecShowersController.updateShowers);
router.delete('/water-tec-showers/:id', WaterTecShowersController.deleteShowers);

// water-tec-taps endpoints
router.post('/water-tec-taps', WaterTecTapsController.createTaps);
router.get('/water-tec-taps', WaterTecTapsController.getAllTaps);
router.get('/water-tec-taps/:id', WaterTecTapsController.getOneTaps);
router.put('/water-tec-taps/:id', WaterTecTapsController.updateTaps);
router.delete('/water-tec-taps/:id', WaterTecTapsController.deleteTaps);

// water-tec-toilet-seat-covers endpoints
router.post('/water-tec-toilet-seat-covers', WaterTecToiletSeatCoversController.createToiletSeatCovers);
router.get('/water-tec-toilet-seat-covers', WaterTecToiletSeatCoversController.getAllToiletSeatCovers);
router.get('/water-tec-toilet-seat-covers/:id', WaterTecToiletSeatCoversController.getOneToiletSeatCovers);
router.put('/water-tec-toilet-seat-covers/:id', WaterTecToiletSeatCoversController.updateToiletSeatCovers);
router.delete('/water-tec-toilet-seat-covers/:id', WaterTecToiletSeatCoversController.deleteToiletSeatCovers);

// water-tec-t-series-alt endpoints
router.post('/water-tec-t-series-alt', WaterTecTSeriesAltController.createTSeriesAlt);
router.get('/water-tec-t-series-alt', WaterTecTSeriesAltController.getAllTSeriesAlt);
router.get('/water-tec-t-series-alt/:id', WaterTecTSeriesAltController.getOneTSeriesAlt);
router.put('/water-tec-t-series-alt/:id', WaterTecTSeriesAltController.updateTSeriesAlt);
router.delete('/water-tec-t-series-alt/:id', WaterTecTSeriesAltController.deleteTSeriesAlt);

// water-tec-t-series endpoints
router.post('/water-tec-t-series', WaterTecTSeriesController.createTSeries);
router.get('/water-tec-t-series', WaterTecTSeriesController.getAllTSeries);
router.get('/water-tec-t-series/:id', WaterTecTSeriesController.getOneTSeries);
router.put('/water-tec-t-series/:id', WaterTecTSeriesController.updateTSeries);
router.delete('/water-tec-t-series/:id', WaterTecTSeriesController.deleteTSeries);

// water-tec-valves endpoints
router.post('/water-tec-valves', WaterTecValvesController.createValves);
router.get('/water-tec-valves', WaterTecValvesController.getAllValves);
router.get('/water-tec-valves/:id', WaterTecValvesController.getOneValves);
router.put('/water-tec-valves/:id', WaterTecValvesController.updateValves);
router.delete('/water-tec-valves/:id', WaterTecValvesController.deleteValves);


module.exports = router;
