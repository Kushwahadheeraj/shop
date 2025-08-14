const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();


const acrylicProductsController = require('../controllers/sanitary/acrylicProductsController');
const bathroomAccessoriesController = require('../controllers/sanitary/bathroomAccessoriesController.js');
const BathsenseCPfittingsFaucetsAltiusController = require('../controllers/sanitary/Bathsense/CPfittingsFaucets/AltiusController.js');
const BathsenseCPfittingsFaucetsBathsenseEssentialsController = require('../controllers/sanitary/Bathsense/CPfittingsFaucets/BathsenseEssentialsController.js');
const BathsenseCPfittingsFaucetsBathsenseShowersController = require('../controllers/sanitary/Bathsense/CPfittingsFaucets/BathsenseShowersController.js');
const BathsenseCPfittingsFaucetsColossusController = require('../controllers/sanitary/Bathsense/CPfittingsFaucets/ColossusController.js');
const BathsenseCPfittingsFaucetsInvictusController = require('../controllers/sanitary/Bathsense/CPfittingsFaucets/InvictusController.js');
const BathsenseCPfittingsFaucetsMaximusController = require('../controllers/sanitary/Bathsense/CPfittingsFaucets/MaximusController.js');
const BathsenseCPfittingsFaucetsSpryController = require('../controllers/sanitary/Bathsense/CPfittingsFaucets/SpryController.js');
const BathsenseCPfittingsFaucetsThetaController = require('../controllers/sanitary/Bathsense/CPfittingsFaucets/ThetaController.js');
const BathsenseSanitarywareEssentialsController = require('../controllers/sanitary/Bathsense/Sanitaryware/essentialsController.js');
const BathsenseSanitarywarePedestalsController = require('../controllers/sanitary/Bathsense/Sanitaryware/pedestalsController.js');
const BathsenseSanitarywareVenusController = require('../controllers/sanitary/Bathsense/Sanitaryware/VenusController.js');
const BathsenseSanitarywareWashbasinsController = require('../controllers/sanitary/Bathsense/Sanitaryware/washbasinsController.js');
const BathsenseSanitarywareWaterClosetController = require('../controllers/sanitary/Bathsense/Sanitaryware/waterClosetController.js');
const closetsController = require('../controllers/sanitary/closetsController.js');
const CoralBathFixturesEurosmartSeriesController = require('../controllers/sanitary/CoralBathFixtures/EurosmartSeriesController.js');
const CoralBathFixturesFlowmoreSeriesController = require('../controllers/sanitary/CoralBathFixtures/FlowmoreSeriesController.js');
const CoralBathFixturesNewSuperGlowSeriesController = require('../controllers/sanitary/CoralBathFixtures/NewSuperGlowSeriesController.js');
const CoralBathFixturesRoyaleSeriesController = require('../controllers/sanitary/CoralBathFixtures/RoyaleSeriesController.js');
const CoralBathFixturesTreemoSeriesController = require('../controllers/sanitary/CoralBathFixtures/TreemoSeriesController.js');
const CoralBathFixturesXrossaSeriesController = require('../controllers/sanitary/CoralBathFixtures/XrossaSeriesController.js');
const CorsaBathroomFaucetsAlmondController = require('../controllers/sanitary/Corsa/BathroomFaucets/AlmondController.js');
const CorsaBathroomFaucetsArrowController = require('../controllers/sanitary/Corsa/BathroomFaucets/ArrowController.js');
const CorsaBathroomFaucetsBoldController = require('../controllers/sanitary/Corsa/BathroomFaucets/BoldController.js');
const CorsaBathroomFaucetsBudgetController = require('../controllers/sanitary/Corsa/BathroomFaucets/BudgetController.js');
const CorsaBathroomFaucetsConceptController = require('../controllers/sanitary/Corsa/BathroomFaucets/ConceptController.js');
const CorsaBathroomFaucetsDeluxeController = require('../controllers/sanitary/Corsa/BathroomFaucets/DeluxeController.js');
const CorsaBathroomFaucetsEecoController = require('../controllers/sanitary/Corsa/BathroomFaucets/EecoController.js');
const CorsaBathroomFaucetsExpertController = require('../controllers/sanitary/Corsa/BathroomFaucets/ExpertController.js');
const CorsaBathroomFaucetsFlorenceController = require('../controllers/sanitary/Corsa/BathroomFaucets/FlorenceController.js');
const CorsaBathroomFaucetsGlassBowlFaucetController = require('../controllers/sanitary/Corsa/BathroomFaucets/GlassBowlFaucetController.js');
const CorsaBathroomFaucetsIdeaController = require('../controllers/sanitary/Corsa/BathroomFaucets/IdeaController.js');
const CorsaBathroomFaucetsJazzController = require('../controllers/sanitary/Corsa/BathroomFaucets/JazzController.js');
const CorsaBathroomFaucetsKetController = require('../controllers/sanitary/Corsa/BathroomFaucets/KetController.js');
const CorsaBathroomFaucetsMilanoController = require('../controllers/sanitary/Corsa/BathroomFaucets/MilanoController.js');
const CorsaBathroomFaucetsNanoController = require('../controllers/sanitary/Corsa/BathroomFaucets/NanoController.js');
const CorsaBathroomFaucetsNexaController = require('../controllers/sanitary/Corsa/BathroomFaucets/NexaController.js');
const CorsaBathroomFaucetsNiagraController = require('../controllers/sanitary/Corsa/BathroomFaucets/NiagraController.js');
const CorsaBathroomFaucetsNiceController = require('../controllers/sanitary/Corsa/BathroomFaucets/NiceController.js');
const CorsaBathroomFaucetsOmegaController = require('../controllers/sanitary/Corsa/BathroomFaucets/OmegaController.js');
const CorsaBathroomFaucetsPassionController = require('../controllers/sanitary/Corsa/BathroomFaucets/PassionController.js');
const CorsaBathroomFaucetsRoyalController = require('../controllers/sanitary/Corsa/BathroomFaucets/RoyalController.js');
const CorsaBathroomFaucetsSlimlineController = require('../controllers/sanitary/Corsa/BathroomFaucets/SlimlineController.js');
const CorsaBathroomFaucetsSplashController = require('../controllers/sanitary/Corsa/BathroomFaucets/SplashController.js');
const CorsaBathroomFaucetsSquareFController = require('../controllers/sanitary/Corsa/BathroomFaucets/SquareFController.js');
const CorsaBathroomFaucetsSquareSController = require('../controllers/sanitary/Corsa/BathroomFaucets/SquareSController.js');
const CorsaBathroomFaucetsSuperController = require('../controllers/sanitary/Corsa/BathroomFaucets/SuperController.js');
const CorsaBathroomFaucetsTriController = require('../controllers/sanitary/Corsa/BathroomFaucets/TriController.js');
const CorsaBATHROOMACCESSORIESAcrylicAccessoriesController = require('../controllers/sanitary/Corsa/BATHROOM_ACCESSORIES/AcrylicAccessoriesController.js');
const CorsaBATHROOMACCESSORIESAlmondController = require('../controllers/sanitary/Corsa/BATHROOM_ACCESSORIES/AlmondController.js');
const CorsaBATHROOMACCESSORIESAngloController = require('../controllers/sanitary/Corsa/BATHROOM_ACCESSORIES/AngloController.js');
const CorsaBATHROOMACCESSORIESBudgetController = require('../controllers/sanitary/Corsa/BATHROOM_ACCESSORIES/BudgetController.js');
const CorsaBATHROOMACCESSORIESDolphinController = require('../controllers/sanitary/Corsa/BATHROOM_ACCESSORIES/DolphinController.js');
const CorsaBATHROOMACCESSORIESEccoController = require('../controllers/sanitary/Corsa/BATHROOM_ACCESSORIES/EccoController.js');
const CorsaBATHROOMACCESSORIESKetiController = require('../controllers/sanitary/Corsa/BATHROOM_ACCESSORIES/KetiController.js');
const CorsaBATHROOMACCESSORIESQubixController = require('../controllers/sanitary/Corsa/BATHROOM_ACCESSORIES/QubixController.js');
const CorsaBATHROOMACCESSORIESSquareController = require('../controllers/sanitary/Corsa/BATHROOM_ACCESSORIES/SquareController.js');
const CorsaBATHROOMACCESSORIESSupremeController = require('../controllers/sanitary/Corsa/BATHROOM_ACCESSORIES/SupremeController.js');
const CorsaFlushingCisternController = require('../controllers/sanitary/Corsa/FlushingCisternController.js');
const CorsaKitchenKitchenFaucetsController = require('../controllers/sanitary/Corsa/Kitchen/KitchenFaucetsController.js');
const CorsaKitchenKitchenSinkController = require('../controllers/sanitary/Corsa/Kitchen/KitchenSinkController.js');
const CorsaOtherUsefulItemsBallValvesController = require('../controllers/sanitary/Corsa/OtherUsefulItems/BallValvesController.js');
const CorsaOtherUsefulItemsMiniAngleCockController = require('../controllers/sanitary/Corsa/OtherUsefulItems/MiniAngleCockController.js');
const CorsaOtherUsefulItemsMouthOperatedController = require('../controllers/sanitary/Corsa/OtherUsefulItems/MouthOperatedController.js');
const CorsaOtherUsefulItemsPressmaticPushCockController = require('../controllers/sanitary/Corsa/OtherUsefulItems/PressmaticPushCockController.js');
const CorsaOtherUsefulItemsSensorTapsController = require('../controllers/sanitary/Corsa/OtherUsefulItems/SensorTapsController.js');
const CorsaOtherUsefulItemsSoapDispenserController = require('../controllers/sanitary/Corsa/OtherUsefulItems/SoapDispenserController.js');
const CorsaSHOWERSHealthFaucetController = require('../controllers/sanitary/Corsa/SHOWERS/HealthFaucetController.js');
const CorsaSHOWERSOverheadShowerController = require('../controllers/sanitary/Corsa/SHOWERS/OverheadShowerController.js');
const CorsaSHOWERSRainShowerController = require('../controllers/sanitary/Corsa/SHOWERS/RainShowerController.js');
const CorsaSHOWERSTelephonicShowerController = require('../controllers/sanitary/Corsa/SHOWERS/TelephonicShowerController.js');
const EssessAccessoriesSeries1CromaController = require('../controllers/sanitary/Essess/Accessories/Series1CromaController.js');
const EssessAccessoriesSeries2SwingController = require('../controllers/sanitary/Essess/Accessories/Series2SwingController.js');
const EssessAccessoriesSeries3TarimController = require('../controllers/sanitary/Essess/Accessories/Series3TarimController.js');
const EssessAccessoriesSeries5HotelierSeriesController = require('../controllers/sanitary/Essess/Accessories/Series5HotelierSeriesController.js');
const EssessAccessoriesSeries6CruzoController = require('../controllers/sanitary/Essess/Accessories/Series6CruzoController.js');
const EssessAccessoriesSeries7DeonController = require('../controllers/sanitary/Essess/Accessories/Series7DeonController.js');
const EssessAccessoriesSeries8BSeriesController = require('../controllers/sanitary/Essess/Accessories/Series8BSeriesController.js');
const EssessAutoCloseTapsController = require('../controllers/sanitary/Essess/AutoCloseTapsController.js');
const EssessCelatoController = require('../controllers/sanitary/Essess/CelatoController.js');
const EssessCromaController = require('../controllers/sanitary/Essess/CromaController.js');
const EssessCruzoController = require('../controllers/sanitary/Essess/CruzoController.js');
const EssessDeonController = require('../controllers/sanitary/Essess/DeonController.js');
const EssessDSeriesController = require('../controllers/sanitary/Essess/DSeriesController.js');
const EssessEchoController = require('../controllers/sanitary/Essess/EchoController.js');
const EssessEssentialsController = require('../controllers/sanitary/Essess/EssentialsController.js');
const EssessHotelierSeriesController = require('../controllers/sanitary/Essess/HotelierSeriesController.js');
const EssessHS03Controller = require('../controllers/sanitary/Essess/HS03Controller.js');
const EssessLabTapsController = require('../controllers/sanitary/Essess/LabTapsController.js');
const EssessNewDuneController = require('../controllers/sanitary/Essess/NewDuneController.js');
const EssessNewXessController = require('../controllers/sanitary/Essess/NewXessController.js');
const EssessQuadraController = require('../controllers/sanitary/Essess/QuadraController.js');
const EssessSensorsController = require('../controllers/sanitary/Essess/SensorsController.js');
const EssessShowersHandShowersController = require('../controllers/sanitary/Essess/Showers/HandShowersController.js');
const EssessShowersOverheadShowersController = require('../controllers/sanitary/Essess/Showers/OverheadShowersController.js');
const EssessShowersRainfallShowersController = require('../controllers/sanitary/Essess/Showers/RainfallShowersController.js');
const EssessShowersShowerArmsController = require('../controllers/sanitary/Essess/Showers/ShowerArmsController.js');
const EssessTarimController = require('../controllers/sanitary/Essess/TarimController.js');
const EssessTrandController = require('../controllers/sanitary/Essess/TrandController.js');
const faucetsController = require('../controllers/sanitary/faucetsController.js');
const hardwareBathroomAccessoriesController = require('../controllers/sanitary/hardwareBathroomAccessoriesController.js');
const healthFaucetController = require('../controllers/sanitary/healthFaucetController.js');
const HindwareAddOnController = require('../controllers/sanitary/Hindware/addOnController.js');
const HindwareBathTubController = require('../controllers/sanitary/Hindware/bathTubController.js');
const HindwareCisternsController = require('../controllers/sanitary/Hindware/cisternsController.js');
const HindwareFaucetsAngularStopCockController = require('../controllers/sanitary/Hindware/faucets/angularStopCockController.js');
const HindwareFaucetsBathSpoutController = require('../controllers/sanitary/Hindware/faucets/bathSpoutController.js');
const HindwareFaucetsBibCockController = require('../controllers/sanitary/Hindware/faucets/bibCockController.js');
const HindwareFaucetsChbmController = require('../controllers/sanitary/Hindware/faucets/chbmController.js');
const HindwareFaucetsConcealedStopCockController = require('../controllers/sanitary/Hindware/faucets/concealedStopCockController.js');
const HindwareFaucetsCscExpKitController = require('../controllers/sanitary/Hindware/faucets/cscExpKitController.js');
const HindwareFaucetsDeuschMixerController = require('../controllers/sanitary/Hindware/faucets/deuschMixerController.js');
const HindwareFaucetsExposedMixersController = require('../controllers/sanitary/Hindware/faucets/exposedMixersController.js');
const HindwareFaucetsFlushCockController = require('../controllers/sanitary/Hindware/faucets/flushCockController.js');
const HindwareFaucetsMedicalSeriesController = require('../controllers/sanitary/Hindware/faucets/medicalSeriesController.js');
const HindwareFaucetsMixerFaucetController = require('../controllers/sanitary/Hindware/faucets/mixerFaucetController.js');
const HindwareFaucetsPillarCockController = require('../controllers/sanitary/Hindware/faucets/pillarCockController.js');
const HindwareFaucetsPillarCockTallController = require('../controllers/sanitary/Hindware/faucets/pillarCockTallController.js');
const HindwareFaucetsPillarFaucetController = require('../controllers/sanitary/Hindware/faucets/pillarFaucetController.js');
const HindwareFaucetsPressmaticController = require('../controllers/sanitary/Hindware/faucets/pressmaticController.js');
const HindwareFaucetsRecessedController = require('../controllers/sanitary/Hindware/faucets/recessedController.js');
const HindwareFaucetsSingleLeverDivertorController = require('../controllers/sanitary/Hindware/faucets/singleLeverDivertorController.js');
const HindwareFaucetsSinkCockController = require('../controllers/sanitary/Hindware/faucets/sinkCockController.js');
const HindwareFaucetsSinkMixerController = require('../controllers/sanitary/Hindware/faucets/sinkMixerController.js');
const HindwareFaucetsSlbmFaucetController = require('../controllers/sanitary/Hindware/faucets/slbmFaucetController.js');
const HindwareFaucetsSlbmFaucetTallController = require('../controllers/sanitary/Hindware/faucets/slbmFaucetTallController.js');
const HindwareFaucetsWallMixerController = require('../controllers/sanitary/Hindware/faucets/wallMixerController.js');
const HindwareShowersRainShowersController = require('../controllers/sanitary/Hindware/rainShowersController.js');
const HindwareWashBasinsController = require('../controllers/sanitary/Hindware/washBasinsController.js');
const HindwareWaterClosetsController = require('../controllers/sanitary/Hindware/waterClosetsController.js');
const jaquarController = require('../controllers/sanitary/jaquarController.js');
const kitchenSinksController = require('../controllers/sanitary/kitchenSinksController.js');
const LeoBathFittingsBathroomAccessoriesBathroomAccessoriesController = require('../controllers/sanitary/LeoBathFittings/bathroomAccessoriesController.js');
const LeoBathFittingsFaucetsFaucetsController = require('../controllers/sanitary/LeoBathFittings/faucetsController.js');
const LeoBathFittingsValveValveController = require('../controllers/sanitary/LeoBathFittings/valveController.js');
const PamayFaucetsFaucetsController = require('../controllers/sanitary/Pamay/faucetsController.js');
const PamayShowersShowersController = require('../controllers/sanitary/Pamay/showersController.js');
const parrywareAccessoriesAccessoriesController = require('../controllers/sanitary/parryware/accessoriesController.js');
const parrywareAngleValvesAngleValvesController = require('../controllers/sanitary/parryware/angleValvesController.js');
const parrywareBelowCounterBasinsBelowCounterBasinsController = require('../controllers/sanitary/parryware/belowCounterBasinsController.js');
const parrywareBowlBasinsBowlBasinsController = require('../controllers/sanitary/parryware/bowlBasinsController.js');
const parrywareCLOSETSClosetsController = require('../controllers/sanitary/parryware/closetsController.js');
const parrywareConcealedCisternConcealedCisternController = require('../controllers/sanitary/parryware/concealedCisternController.js');
const parrywareEuropeanWaterClosetEuropeanWaterClosetController = require('../controllers/sanitary/parryware/europeanWaterClosetController.js');
const parrywareFAUCETSFlushCocksController = require('../controllers/sanitary/parryware/FAUCETS/flushCocksController.js');
const parrywareFAUCETSFlushValveController = require('../controllers/sanitary/parryware/FAUCETS/flushValveController.js');
const parrywareFAUCETSHealthFaucetsController = require('../controllers/sanitary/parryware/FAUCETS/healthFaucetsController.js');
const parrywareFAUCETSKitchenSinksController = require('../controllers/sanitary/parryware/FAUCETS/kitchenSinksController.js');
const parrywareFAUCETSPedestalsController = require('../controllers/sanitary/parryware/FAUCETS/pedestalsController.js');
const parrywarePolymerCisternsPolymerCisternsController = require('../controllers/sanitary/parryware/polymerCisternsController.js');
const parrywarePushPlatesPushPlatesController = require('../controllers/sanitary/parryware/pushPlatesController.js');
const parrywareSeatCoversSeatCoversController = require('../controllers/sanitary/parryware/seatCoversController.js');
const parrywareSemiRecessedBasinsSemiRecessedBasinsController = require('../controllers/sanitary/parryware/semiRecessedBasinsController.js');
const parrywareShowerEnclosuresShowerEnclosuresController = require('../controllers/sanitary/parryware/showerEnclosuresController.js');
const parrywareShowerPanelsShowerPanelsController = require('../controllers/sanitary/parryware/showerPanelsController.js');
const parrywareShowersShowersController = require('../controllers/sanitary/parryware/showersController.js');
const parrywareUtsavRangeUtsavRangeController = require('../controllers/sanitary/parryware/utsavRangeController.js');
const parrywareWashBasinsWashBasinsController = require('../controllers/sanitary/parryware/washBasinsController.js');
const parrywareWasteCouplingWasteCouplingController = require('../controllers/sanitary/parryware/wasteCouplingController.js');
const parrywareWaterHeatersWaterHeatersController = require('../controllers/sanitary/parryware/waterHeatersController.js');
const PearlPreciousProductsEdgeEdgeController = require('../controllers/sanitary/PearlPreciousProducts/edgeController.js');
const showersController = require('../controllers/sanitary/showersController.js');
const tapsController = require('../controllers/sanitary/tapsController.js');
const washbasinsController = require('../controllers/sanitary/washbasinsController.js');
const WatermanAccessoriesController = require('../controllers/sanitary/Waterman/accessoriesController.js');
const WatermanAriaController = require('../controllers/sanitary/Waterman/ariaController.js');
const WatermanAuraController = require('../controllers/sanitary/Waterman/auraController.js');
const WatermanDellController = require('../controllers/sanitary/Waterman/dellController.js');
const WatermanDeluxeController = require('../controllers/sanitary/Waterman/deluxeController.js');
const WatermanEcoController = require('../controllers/sanitary/Waterman/ecoController.js');
const WatermanEvoqueController = require('../controllers/sanitary/Waterman/evoqueController.js');
const WatermanHandShowersController = require('../controllers/sanitary/Waterman/handShowersController.js');
const WatermanHealthFaucetAbsController = require('../controllers/sanitary/Waterman/healthFaucetAbsController.js');
const WatermanHealthFaucetsBrassController = require('../controllers/sanitary/Waterman/healthFaucetsBrassController.js');
const WatermanIkonController = require('../controllers/sanitary/Waterman/ikonController.js');
const WatermanRainShowersController = require('../controllers/sanitary/Waterman/rainShowersController.js');
const WatermanRomanController = require('../controllers/sanitary/Waterman/romanController.js');
const WatermanShowerTubesController = require('../controllers/sanitary/Waterman/showerTubesController.js');
const WatermanWallShowersWithArmController = require('../controllers/sanitary/Waterman/wallShowersWithArmController.js');
const WatermanWallShowersWithoutArmController = require('../controllers/sanitary/Waterman/wallShowersWithoutArmController.js');
const WaterTecAlliedController = require('../controllers/sanitary/WaterTec/alliedController.js');
const WaterTecAquaController = require('../controllers/sanitary/WaterTec/aquaController.js');
const WaterTecAspireController = require('../controllers/sanitary/WaterTec/aspireController.js');
const WaterTecBathroomAccessoriesController = require('../controllers/sanitary/WaterTec/bathroomAccessoriesController.js');
const WaterTecCisternController = require('../controllers/sanitary/WaterTec/cisternController.js');
const WaterTecConcealedCisternController = require('../controllers/sanitary/WaterTec/concealedCisternController.js');
const WaterTecConnectionTubeController = require('../controllers/sanitary/WaterTec/connectionTubeController.js');
const WaterTecEbonyController = require('../controllers/sanitary/WaterTec/ebonyController.js');
const WaterTecEcoController = require('../controllers/sanitary/WaterTec/ecoController.js');
const WaterTecEvaController = require('../controllers/sanitary/WaterTec/evaController.js');
const WaterTecFloraController = require('../controllers/sanitary/WaterTec/floraController.js');
const WaterTecHealthFaucetsController = require('../controllers/sanitary/WaterTec/healthFaucetsController.js');
const WaterTecQuattroController = require('../controllers/sanitary/WaterTec/quattroController.js');
const WaterTecShowersController = require('../controllers/sanitary/WaterTec/showersController.js');
const WaterTecTapsController = require('../controllers/sanitary/WaterTec/tapsController.js');
const WaterTecToiletSeatCoversController = require('../controllers/sanitary/WaterTec/toiletSeatCoversController.js');
const WaterTecTSeriesAltController = require('../controllers/sanitary/WaterTec/tSeriesAltController.js');
const WaterTecTSeriesController = require('../controllers/sanitary/WaterTec/tSeriesController.js');
const WaterTecValvesController = require('../controllers/sanitary/WaterTec/valvesController.js');

// acrylic-products endpoints
router.post('/acrylic-products/create', upload.array('photos', 5), acrylicProductsController.createacrylicProducts);
router.get('/acrylic-products/get', acrylicProductsController.getAllacrylicProducts);
router.get('/acrylic-products/getOne/:id', acrylicProductsController.getOneacrylicProducts);
router.put('/acrylic-products/update/:id', upload.array('photos', 5), acrylicProductsController.updateacrylicProducts);
router.delete('/acrylic-products/delete/:id', acrylicProductsController.deleteacrylicProducts);

// bathroom-accessories endpoints
router.post('/bathroom-accessories/create', upload.array('photos', 5), bathroomAccessoriesController.createBathroomAccessories);
router.get('/bathroom-accessories/get', bathroomAccessoriesController.getAllBathroomAccessories);
router.get('/bathroom-accessories/getOne/:id', bathroomAccessoriesController.getOneBathroomAccessories);
router.put('/bathroom-accessories/update/:id', upload.array('photos', 5), bathroomAccessoriesController.updateBathroomAccessories);
router.delete('/bathroom-accessories/delete/:id', bathroomAccessoriesController.deleteBathroomAccessories);

// bathsense-c-pfittings-faucets-altius endpoints
router.post('/bathsense-pfittings-faucets-altius/create', upload.array('photos', 5), BathsenseCPfittingsFaucetsAltiusController.createAltius);
router.get('/bathsense-pfittings-faucets-altius/get', BathsenseCPfittingsFaucetsAltiusController.getAllAltius);
router.get('/bathsense-pfittings-faucets-altius/getOne/:id', BathsenseCPfittingsFaucetsAltiusController.getOneAltius);
router.put('/bathsense-pfittings-faucets-altius/update/:id', upload.array('photos', 5), BathsenseCPfittingsFaucetsAltiusController.updateAltius);
router.delete('/bathsense-pfittings-faucets-altius/delete/:id', BathsenseCPfittingsFaucetsAltiusController.deleteAltius);

// bathsense-c-pfittings-faucets-bathsense-essentials endpoints
router.post('/bathsense-pfittings-faucets-bathsense-essentials/create', upload.array('photos', 5), BathsenseCPfittingsFaucetsBathsenseEssentialsController.createBathsenseEssentials);
router.get('/bathsense-pfittings-faucets-bathsense-essentials/get', BathsenseCPfittingsFaucetsBathsenseEssentialsController.getAllBathsenseEssentials);
router.get('/bathsense-pfittings-faucets-bathsense-essentials/getOne/:id', BathsenseCPfittingsFaucetsBathsenseEssentialsController.getOneBathsenseEssentials);
router.put('/bathsense-pfittings-faucets-bathsense-essentials/update/:id', upload.array('photos', 5), BathsenseCPfittingsFaucetsBathsenseEssentialsController.updateBathsenseEssentials);
router.delete('/bathsense-pfittings-faucets-bathsense-essentials/delete/:id', BathsenseCPfittingsFaucetsBathsenseEssentialsController.deleteBathsenseEssentials);

// bathsense-pfittings-faucets-bathsense-showers endpoints
router.post('/bathsense-pfittings-faucets-bathsense-showers/create', upload.array('photos', 5), BathsenseCPfittingsFaucetsBathsenseShowersController.createBathsenseShowers);
router.get('/bathsense-pfittings-faucets-bathsense-showers/get', BathsenseCPfittingsFaucetsBathsenseShowersController.getAllBathsenseShowers);
router.get('/bathsense-pfittings-faucets-bathsense-showers/getOne/:id', BathsenseCPfittingsFaucetsBathsenseShowersController.getOneBathsenseShowers);
router.put('/bathsense-pfittings-faucets-bathsense-showers/update/:id', upload.array('photos', 5), BathsenseCPfittingsFaucetsBathsenseShowersController.updateBathsenseShowers);
router.delete('/bathsense-pfittings-faucets-bathsense-showers/delete/:id', BathsenseCPfittingsFaucetsBathsenseShowersController.deleteBathsenseShowers);

// bathsense-pfittings-faucets-colossus endpoints
router.post('/bathsense-pfittings-faucets-colossus/create', upload.array('photos', 5), BathsenseCPfittingsFaucetsColossusController.createColossus);
router.get('/bathsense-pfittings-faucets-colossus/get', BathsenseCPfittingsFaucetsColossusController.getAllColossus);
router.get('/bathsense-pfittings-faucets-colossus/getOne/:id', BathsenseCPfittingsFaucetsColossusController.getOneColossus);
router.put('/bathsense-pfittings-faucets-colossus/update/:id', upload.array('photos', 5), BathsenseCPfittingsFaucetsColossusController.updateColossus);
router.delete('/bathsense-pfittings-faucets-colossus/delete/:id', BathsenseCPfittingsFaucetsColossusController.deleteColossus);

// bathsense-pfittings-faucets-invictus endpoints
router.post('/bathsense-pfittings-faucets-invictus/create', upload.array('photos', 5), BathsenseCPfittingsFaucetsInvictusController.createInvictus);
router.get('/bathsense-pfittings-faucets-invictus/get', BathsenseCPfittingsFaucetsInvictusController.getAllInvictus);
router.get('/bathsense-pfittings-faucets-invictus/getOne/:id', BathsenseCPfittingsFaucetsInvictusController.getOneInvictus);
router.put('/bathsense-pfittings-faucets-invictus/update/:id', upload.array('photos', 5), BathsenseCPfittingsFaucetsInvictusController.updateInvictus);
router.delete('/bathsense-pfittings-faucets-invictus/delete/:id', BathsenseCPfittingsFaucetsInvictusController.deleteInvictus);

// bathsense-pfittings-faucets-maximus endpoints
router.post('/bathsense-pfittings-faucets-maximus/create', upload.array('photos', 5), BathsenseCPfittingsFaucetsMaximusController.createMaximus);
router.get('/bathsense-pfittings-faucets-maximus/get', BathsenseCPfittingsFaucetsMaximusController.getAllMaximus);
router.get('/bathsense-pfittings-faucets-maximus/getOne/:id', BathsenseCPfittingsFaucetsMaximusController.getOneMaximus);
router.put('/bathsense-pfittings-faucets-maximus/update/:id', upload.array('photos', 5), BathsenseCPfittingsFaucetsMaximusController.updateMaximus);
router.delete('/bathsense-pfittings-faucets-maximus/delete/:id', BathsenseCPfittingsFaucetsMaximusController.deleteMaximus);

// bathsense-pfittings-faucets-spry endpoints
router.post('/bathsense-pfittings-faucets-spry/create', upload.array('photos', 5), BathsenseCPfittingsFaucetsSpryController.createSpry);
router.get('/bathsense-pfittings-faucets-spry/get', BathsenseCPfittingsFaucetsSpryController.getAllSpry);
router.get('/bathsense-pfittings-faucets-spry/getOne/:id', BathsenseCPfittingsFaucetsSpryController.getOneSpry);
router.put('/bathsense-pfittings-faucets-spry/update/:id', upload.array('photos', 5), BathsenseCPfittingsFaucetsSpryController.updateSpry);
router.delete('/bathsense-pfittings-faucets-spry/delete/:id', BathsenseCPfittingsFaucetsSpryController.deleteSpry);

// bathsense-pfittings-faucets-theta endpoints
router.post('/bathsense-pfittings-faucets-theta/create', upload.array('photos', 5), BathsenseCPfittingsFaucetsThetaController.createTheta);
router.get('/bathsense-pfittings-faucets-theta/get', BathsenseCPfittingsFaucetsThetaController.getAllTheta);
router.get('/bathsense-pfittings-faucets-theta/getOne/:id', BathsenseCPfittingsFaucetsThetaController.getOneTheta);
router.put('/bathsense-pfittings-faucets-theta/update/:id', upload.array('photos', 5), BathsenseCPfittingsFaucetsThetaController.updateTheta);
router.delete('/bathsense-pfittings-faucets-theta/delete/:id', BathsenseCPfittingsFaucetsThetaController.deleteTheta);

// bathsense-sanitaryware-essentials endpoints
router.post('/bathsense-sanitaryware-essentials/create', upload.array('photos', 5), BathsenseSanitarywareEssentialsController.createEssentials);
router.get('/bathsense-sanitaryware-essentials/get', BathsenseSanitarywareEssentialsController.getAllEssentials);
router.get('/bathsense-sanitaryware-essentials/getOne/:id', BathsenseSanitarywareEssentialsController.getOneEssentials);
router.put('/bathsense-sanitaryware-essentials/update/:id', upload.array('photos', 5), BathsenseSanitarywareEssentialsController.updateEssentials);
router.delete('/bathsense-sanitaryware-essentials/delete/:id', BathsenseSanitarywareEssentialsController.deleteEssentials);

// bathsense-sanitaryware-pedestals endpoints
router.post('/bathsense-sanitaryware-pedestals/create', upload.array('photos', 5), BathsenseSanitarywarePedestalsController.createPedestals);
router.get('/bathsense-sanitaryware-pedestals/get', BathsenseSanitarywarePedestalsController.getAllPedestals);
router.get('/bathsense-sanitaryware-pedestals/getOne/:id', BathsenseSanitarywarePedestalsController.getOnePedestals);
router.put('/bathsense-sanitaryware-pedestals/update/:id', upload.array('photos', 5), BathsenseSanitarywarePedestalsController.updatePedestals);
router.delete('/bathsense-sanitaryware-pedestals/delete/:id', BathsenseSanitarywarePedestalsController.deletePedestals);

// bathsense-sanitaryware-venus endpoints
router.post('/bathsense-sanitaryware-venus/create', upload.array('photos', 5), BathsenseSanitarywareVenusController.createVenus);
router.get('/bathsense-sanitaryware-venus/get', BathsenseSanitarywareVenusController.getAllVenus);
router.get('/bathsense-sanitaryware-venus/getOne/:id', BathsenseSanitarywareVenusController.getOneVenus);
router.put('/bathsense-sanitaryware-venus/update/:id', upload.array('photos', 5), BathsenseSanitarywareVenusController.updateVenus);
router.delete('/bathsense-sanitaryware-venus/delete/:id', BathsenseSanitarywareVenusController.deleteVenus);

// bathsense-sanitaryware-washbasins endpoints
router.post('/bathsense-sanitaryware-washbasins/create', upload.array('photos', 5), BathsenseSanitarywareWashbasinsController.createWashbasins);
router.get('/bathsense-sanitaryware-washbasins/get', BathsenseSanitarywareWashbasinsController.getAllWashbasins);
router.get('/bathsense-sanitaryware-washbasins/getOne/:id', BathsenseSanitarywareWashbasinsController.getOneWashbasins);
router.put('/bathsense-sanitaryware-washbasins/update/:id', upload.array('photos', 5), BathsenseSanitarywareWashbasinsController.updateWashbasins);
router.delete('/bathsense-sanitaryware-washbasins/delete/:id', BathsenseSanitarywareWashbasinsController.deleteWashbasins);

// bathsense-sanitaryware-water-closet endpoints
router.post('/bathsense-sanitaryware-water-closet/create', upload.array('photos', 5), BathsenseSanitarywareWaterClosetController.createWaterCloset);
router.get('/bathsense-sanitaryware-water-closet/get', BathsenseSanitarywareWaterClosetController.getAllWaterCloset);
router.get('/bathsense-sanitaryware-water-closet/getOne/:id', BathsenseSanitarywareWaterClosetController.getOneWaterCloset);
router.put('/bathsense-sanitaryware-water-closet/update/:id', upload.array('photos', 5), BathsenseSanitarywareWaterClosetController.updateWaterCloset);
router.delete('/bathsense-sanitaryware-water-closet/delete/:id', BathsenseSanitarywareWaterClosetController.deleteWaterCloset);

// closets endpoints
router.post('/closets/create', upload.array('photos', 5), closetsController.createClosets);
router.get('/closets/get', closetsController.getAllClosets);
router.get('/closets/getOne/:id', closetsController.getOneClosets);
router.put('/closets/update/:id', upload.array('photos', 5), closetsController.updateClosets);
router.delete('/closets/delete/:id', closetsController.deleteClosets);

// coral-bath-fixtures-eurosmart-series endpoints
router.post('/coral-bath-fixtures-eurosmart-series/create', upload.array('photos', 5), CoralBathFixturesEurosmartSeriesController.createEurosmartSeries);
router.get('/coral-bath-fixtures-eurosmart-series/get', CoralBathFixturesEurosmartSeriesController.getAllEurosmartSeries);
router.get('/coral-bath-fixtures-eurosmart-series/getOne/:id', CoralBathFixturesEurosmartSeriesController.getOneEurosmartSeries);
router.put('/coral-bath-fixtures-eurosmart-series/update/:id', upload.array('photos', 5), CoralBathFixturesEurosmartSeriesController.updateEurosmartSeries);
router.delete('/coral-bath-fixtures-eurosmart-series/delete/:id', CoralBathFixturesEurosmartSeriesController.deleteEurosmartSeries);

// coral-bath-fixtures-flowmore-series endpoints
router.post('/coral-bath-fixtures-flowmore-series/create', upload.array('photos', 5), CoralBathFixturesFlowmoreSeriesController.createFlowmoreSeries);
router.get('/coral-bath-fixtures-flowmore-series/get', CoralBathFixturesFlowmoreSeriesController.getAllFlowmoreSeries);
router.get('/coral-bath-fixtures-flowmore-series/getOne/:id', CoralBathFixturesFlowmoreSeriesController.getOneFlowmoreSeries);
router.put('/coral-bath-fixtures-flowmore-series/update/:id', upload.array('photos', 5), CoralBathFixturesFlowmoreSeriesController.updateFlowmoreSeries);
router.delete('/coral-bath-fixtures-flowmore-series/delete/:id', CoralBathFixturesFlowmoreSeriesController.deleteFlowmoreSeries);

// coral-bath-fixtures-new-super-glow-series endpoints
router.post('/coral-bath-fixtures-new-super-glow-series/create', upload.array('photos', 5), CoralBathFixturesNewSuperGlowSeriesController.createNewSuperGlowSeries);
router.get('/coral-bath-fixtures-new-super-glow-series/get', CoralBathFixturesNewSuperGlowSeriesController.getAllNewSuperGlowSeries);
router.get('/coral-bath-fixtures-new-super-glow-series/getOne/:id', CoralBathFixturesNewSuperGlowSeriesController.getOneNewSuperGlowSeries);
router.put('/coral-bath-fixtures-new-super-glow-series/update/:id', upload.array('photos', 5), CoralBathFixturesNewSuperGlowSeriesController.updateNewSuperGlowSeries);
router.delete('/coral-bath-fixtures-new-super-glow-series/delete/:id', CoralBathFixturesNewSuperGlowSeriesController.deleteNewSuperGlowSeries);

// coral-bath-fixtures-royale-series endpoints
router.post('/coral-bath-fixtures-royale-series/create', upload.array('photos', 5), CoralBathFixturesRoyaleSeriesController.createRoyaleSeries);
router.get('/coral-bath-fixtures-royale-series/get', CoralBathFixturesRoyaleSeriesController.getAllRoyaleSeries);
router.get('/coral-bath-fixtures-royale-series/getOne/:id', CoralBathFixturesRoyaleSeriesController.getOneRoyaleSeries);
router.put('/coral-bath-fixtures-royale-series/update/:id', upload.array('photos', 5), CoralBathFixturesRoyaleSeriesController.updateRoyaleSeries);
router.delete('/coral-bath-fixtures-royale-series/delete/:id', CoralBathFixturesRoyaleSeriesController.deleteRoyaleSeries);

// coral-bath-fixtures-treemo-series endpoints
router.post('/coral-bath-fixtures-treemo-series/create', upload.array('photos', 5), CoralBathFixturesTreemoSeriesController.createTreemoSeries);
router.get('/coral-bath-fixtures-treemo-series/get', CoralBathFixturesTreemoSeriesController.getAllTreemoSeries);
router.get('/coral-bath-fixtures-treemo-series/getOne/:id', CoralBathFixturesTreemoSeriesController.getOneTreemoSeries);
router.put('/coral-bath-fixtures-treemo-series/update/:id', upload.array('photos', 5), CoralBathFixturesTreemoSeriesController.updateTreemoSeries);
router.delete('/coral-bath-fixtures-treemo-series/delete/:id', CoralBathFixturesTreemoSeriesController.deleteTreemoSeries);

// coral-bath-fixtures-xrossa-series endpoints
router.post('/coral-bath-fixtures-xrossa-series/create', upload.array('photos', 5), CoralBathFixturesXrossaSeriesController.createXrossaSeries);
router.get('/coral-bath-fixtures-xrossa-series/get', CoralBathFixturesXrossaSeriesController.getAllXrossaSeries);
router.get('/coral-bath-fixtures-xrossa-series/getOne/:id', CoralBathFixturesXrossaSeriesController.getOneXrossaSeries);
router.put('/coral-bath-fixtures-xrossa-series/update/:id', upload.array('photos', 5), CoralBathFixturesXrossaSeriesController.updateXrossaSeries);
router.delete('/coral-bath-fixtures-xrossa-series/delete/:id', CoralBathFixturesXrossaSeriesController.deleteXrossaSeries);

// corsa-bathroom-faucets-almond endpoints
router.post('/corsa-bathroom-faucets-almond/create', upload.array('photos', 5), CorsaBathroomFaucetsAlmondController.createAlmond);
router.get('/corsa-bathroom-faucets-almond/get', CorsaBathroomFaucetsAlmondController.getAllAlmond);
router.get('/corsa-bathroom-faucets-almond/getOne/:id', CorsaBathroomFaucetsAlmondController.getOneAlmond);
router.put('/corsa-bathroom-faucets-almond/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsAlmondController.updateAlmond);
router.delete('/corsa-bathroom-faucets-almond/delete/:id', CorsaBathroomFaucetsAlmondController.deleteAlmond);

// corsa-bathroom-faucets-arrow endpoints
router.post('/corsa-bathroom-faucets-arrow/create', upload.array('photos', 5), CorsaBathroomFaucetsArrowController.createArrow);
router.get('/corsa-bathroom-faucets-arrow/get', CorsaBathroomFaucetsArrowController.getAllArrow);
router.get('/corsa-bathroom-faucets-arrow/getOne/:id', CorsaBathroomFaucetsArrowController.getOneArrow);
router.put('/corsa-bathroom-faucets-arrow/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsArrowController.updateArrow);
router.delete('/corsa-bathroom-faucets-arrow/delete/:id', CorsaBathroomFaucetsArrowController.deleteArrow);

// corsa-bathroom-faucets-bold endpoints
router.post('/corsa-bathroom-faucets-bold/create', upload.array('photos', 5), CorsaBathroomFaucetsBoldController.createBold);
router.get('/corsa-bathroom-faucets-bold/get', CorsaBathroomFaucetsBoldController.getAllBold);
router.get('/corsa-bathroom-faucets-bold/getOne/:id', CorsaBathroomFaucetsBoldController.getOneBold);
router.put('/corsa-bathroom-faucets-bold/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsBoldController.updateBold);
router.delete('/corsa-bathroom-faucets-bold/delete/:id', CorsaBathroomFaucetsBoldController.deleteBold);

// corsa-bathroom-faucets-budget endpoints
router.post('/corsa-bathroom-faucets-budget/create', upload.array('photos', 5), CorsaBathroomFaucetsBudgetController.createBudget);
router.get('/corsa-bathroom-faucets-budget/get', CorsaBathroomFaucetsBudgetController.getAllBudget);
router.get('/corsa-bathroom-faucets-budget/getOne/:id', CorsaBathroomFaucetsBudgetController.getOneBudget);
router.put('/corsa-bathroom-faucets-budget/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsBudgetController.updateBudget);
router.delete('/corsa-bathroom-faucets-budget/delete/:id', CorsaBathroomFaucetsBudgetController.deleteBudget);

// corsa-bathroom-faucets-concept endpoints
router.post('/corsa-bathroom-faucets-concept/create', upload.array('photos', 5), CorsaBathroomFaucetsConceptController.createConcept);
router.get('/corsa-bathroom-faucets-concept/get', CorsaBathroomFaucetsConceptController.getAllConcept);
router.get('/corsa-bathroom-faucets-concept/getOne/:id', CorsaBathroomFaucetsConceptController.getOneConcept);
router.put('/corsa-bathroom-faucets-concept/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsConceptController.updateConcept);
router.delete('/corsa-bathroom-faucets-concept/delete/:id', CorsaBathroomFaucetsConceptController.deleteConcept);

// corsa-bathroom-faucets-deluxe endpoints
router.post('/corsa-bathroom-faucets-deluxe/create', upload.array('photos', 5), CorsaBathroomFaucetsDeluxeController.createDeluxe);
router.get('/corsa-bathroom-faucets-deluxe/get', CorsaBathroomFaucetsDeluxeController.getAllDeluxe);
router.get('/corsa-bathroom-faucets-deluxe/getOne/:id', CorsaBathroomFaucetsDeluxeController.getOneDeluxe);
router.put('/corsa-bathroom-faucets-deluxe/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsDeluxeController.updateDeluxe);
router.delete('/corsa-bathroom-faucets-deluxe/delete/:id', CorsaBathroomFaucetsDeluxeController.deleteDeluxe);

// corsa-bathroom-faucets-eeco endpoints
router.post('/corsa-bathroom-faucets-eeco/create', upload.array('photos', 5), CorsaBathroomFaucetsEecoController.createEeco);
router.get('/corsa-bathroom-faucets-eeco/get', CorsaBathroomFaucetsEecoController.getAllEeco);
router.get('/corsa-bathroom-faucets-eeco/getOne/:id', CorsaBathroomFaucetsEecoController.getOneEeco);
router.put('/corsa-bathroom-faucets-eeco/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsEecoController.updateEeco);
router.delete('/corsa-bathroom-faucets-eeco/delete/:id', CorsaBathroomFaucetsEecoController.deleteEeco);

// corsa-bathroom-faucets-expert endpoints
router.post('/corsa-bathroom-faucets-expert/create', upload.array('photos', 5), CorsaBathroomFaucetsExpertController.createExpert);
router.get('/corsa-bathroom-faucets-expert/get', CorsaBathroomFaucetsExpertController.getAllExpert);
router.get('/corsa-bathroom-faucets-expert/getOne/:id', CorsaBathroomFaucetsExpertController.getOneExpert);
router.put('/corsa-bathroom-faucets-expert/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsExpertController.updateExpert);
router.delete('/corsa-bathroom-faucets-expert/delete/:id', CorsaBathroomFaucetsExpertController.deleteExpert);

// corsa-bathroom-faucets-florence endpoints
router.post('/corsa-bathroom-faucets-florence/create', upload.array('photos', 5), CorsaBathroomFaucetsFlorenceController.createFlorence);
router.get('/corsa-bathroom-faucets-florence/get', CorsaBathroomFaucetsFlorenceController.getAllFlorence);
router.get('/corsa-bathroom-faucets-florence/getOne/:id', CorsaBathroomFaucetsFlorenceController.getOneFlorence);
router.put('/corsa-bathroom-faucets-florence/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsFlorenceController.updateFlorence);
router.delete('/corsa-bathroom-faucets-florence/delete/:id', CorsaBathroomFaucetsFlorenceController.deleteFlorence);

// corsa-bathroom-faucets-glass-bowl-faucet endpoints
router.post('/corsa-bathroom-faucets-glass-bowl-faucet/create', upload.array('photos', 5), CorsaBathroomFaucetsGlassBowlFaucetController.createGlassBowlFaucet);
router.get('/corsa-bathroom-faucets-glass-bowl-faucet/get', CorsaBathroomFaucetsGlassBowlFaucetController.getAllGlassBowlFaucet);
router.get('/corsa-bathroom-faucets-glass-bowl-faucet/getOne/:id', CorsaBathroomFaucetsGlassBowlFaucetController.getOneGlassBowlFaucet);
router.put('/corsa-bathroom-faucets-glass-bowl-faucet/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsGlassBowlFaucetController.updateGlassBowlFaucet);
router.delete('/corsa-bathroom-faucets-glass-bowl-faucet/delete/:id', CorsaBathroomFaucetsGlassBowlFaucetController.deleteGlassBowlFaucet);

// corsa-bathroom-faucets-idea endpoints
router.post('/corsa-bathroom-faucets-idea/create', upload.array('photos', 5), CorsaBathroomFaucetsIdeaController.createIdea);
router.get('/corsa-bathroom-faucets-idea/get', CorsaBathroomFaucetsIdeaController.getAllIdea);
router.get('/corsa-bathroom-faucets-idea/getOne/:id', CorsaBathroomFaucetsIdeaController.getOneIdea);
router.put('/corsa-bathroom-faucets-idea/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsIdeaController.updateIdea);
router.delete('/corsa-bathroom-faucets-idea/delete/:id', CorsaBathroomFaucetsIdeaController.deleteIdea);

// corsa-bathroom-faucets-jazz endpoints
router.post('/corsa-bathroom-faucets-jazz/create', upload.array('photos', 5), CorsaBathroomFaucetsJazzController.createJazz);
router.get('/corsa-bathroom-faucets-jazz/get', CorsaBathroomFaucetsJazzController.getAllJazz);
router.get('/corsa-bathroom-faucets-jazz/getOne/:id', CorsaBathroomFaucetsJazzController.getOneJazz);
router.put('/corsa-bathroom-faucets-jazz/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsJazzController.updateJazz);
router.delete('/corsa-bathroom-faucets-jazz/delete/:id', CorsaBathroomFaucetsJazzController.deleteJazz);

// corsa-bathroom-faucets-ket endpoints
router.post('/corsa-bathroom-faucets-ket/create', upload.array('photos', 5), CorsaBathroomFaucetsKetController.createKet);
router.get('/corsa-bathroom-faucets-ket/get', CorsaBathroomFaucetsKetController.getAllKet);
router.get('/corsa-bathroom-faucets-ket/getOne/:id', CorsaBathroomFaucetsKetController.getOneKet);
router.put('/corsa-bathroom-faucets-ket/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsKetController.updateKet);
router.delete('/corsa-bathroom-faucets-ket/delete/:id', CorsaBathroomFaucetsKetController.deleteKet);

// corsa-bathroom-faucets-milano endpoints
router.post('/corsa-bathroom-faucets-milano/create', upload.array('photos', 5), CorsaBathroomFaucetsMilanoController.createMilano);
router.get('/corsa-bathroom-faucets-milano/get', CorsaBathroomFaucetsMilanoController.getAllMilano);
router.get('/corsa-bathroom-faucets-milano/getOne/:id', CorsaBathroomFaucetsMilanoController.getOneMilano);
router.put('/corsa-bathroom-faucets-milano/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsMilanoController.updateMilano);
router.delete('/corsa-bathroom-faucets-milano/delete/:id', CorsaBathroomFaucetsMilanoController.deleteMilano);

// corsa-bathroom-faucets-nano endpoints
router.post('/corsa-bathroom-faucets-nano/create', upload.array('photos', 5), CorsaBathroomFaucetsNanoController.createNano);
router.get('/corsa-bathroom-faucets-nano/get', CorsaBathroomFaucetsNanoController.getAllNano);
router.get('/corsa-bathroom-faucets-nano/getOne/:id', CorsaBathroomFaucetsNanoController.getOneNano);
router.put('/corsa-bathroom-faucets-nano/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsNanoController.updateNano);
router.delete('/corsa-bathroom-faucets-nano/delete/:id', CorsaBathroomFaucetsNanoController.deleteNano);

// corsa-bathroom-faucets-nexa endpoints
router.post('/corsa-bathroom-faucets-nexa/create', upload.array('photos', 5), CorsaBathroomFaucetsNexaController.createNexa);
router.get('/corsa-bathroom-faucets-nexa/get', CorsaBathroomFaucetsNexaController.getAllNexa);
router.get('/corsa-bathroom-faucets-nexa/getOne/:id', CorsaBathroomFaucetsNexaController.getOneNexa);
router.put('/corsa-bathroom-faucets-nexa/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsNexaController.updateNexa);
router.delete('/corsa-bathroom-faucets-nexa/delete/:id', CorsaBathroomFaucetsNexaController.deleteNexa);

// corsa-bathroom-faucets-niagra endpoints
router.post('/corsa-bathroom-faucets-niagra/create', upload.array('photos', 5), CorsaBathroomFaucetsNiagraController.createNiagra);
router.get('/corsa-bathroom-faucets-niagra/get', CorsaBathroomFaucetsNiagraController.getAllNiagra);
router.get('/corsa-bathroom-faucets-niagra/getOne/:id', CorsaBathroomFaucetsNiagraController.getOneNiagra);
router.put('/corsa-bathroom-faucets-niagra/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsNiagraController.updateNiagra);
router.delete('/corsa-bathroom-faucets-niagra/delete/:id', CorsaBathroomFaucetsNiagraController.deleteNiagra);

// corsa-bathroom-faucets-nice endpoints
router.post('/corsa-bathroom-faucets-nice/create', upload.array('photos', 5), CorsaBathroomFaucetsNiceController.createNice);
router.get('/corsa-bathroom-faucets-nice/get', CorsaBathroomFaucetsNiceController.getAllNice);
router.get('/corsa-bathroom-faucets-nice/getOne/:id', CorsaBathroomFaucetsNiceController.getOneNice);
router.put('/corsa-bathroom-faucets-nice/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsNiceController.updateNice);
router.delete('/corsa-bathroom-faucets-nice/delete/:id', CorsaBathroomFaucetsNiceController.deleteNice);

// corsa-bathroom-faucets-omega endpoints
router.post('/corsa-bathroom-faucets-omega/create', upload.array('photos', 5), CorsaBathroomFaucetsOmegaController.createOmega);
router.get('/corsa-bathroom-faucets-omega/get', CorsaBathroomFaucetsOmegaController.getAllOmega);
router.get('/corsa-bathroom-faucets-omega/getOne/:id', CorsaBathroomFaucetsOmegaController.getOneOmega);
router.put('/corsa-bathroom-faucets-omega/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsOmegaController.updateOmega);
router.delete('/corsa-bathroom-faucets-omega/delete/:id', CorsaBathroomFaucetsOmegaController.deleteOmega);

// corsa-bathroom-faucets-passion endpoints
router.post('/corsa-bathroom-faucets-passion/create', upload.array('photos', 5), CorsaBathroomFaucetsPassionController.createPassion);
router.get('/corsa-bathroom-faucets-passion/get', CorsaBathroomFaucetsPassionController.getAllPassion);
router.get('/corsa-bathroom-faucets-passion/getOne/:id', CorsaBathroomFaucetsPassionController.getOnePassion);
router.put('/corsa-bathroom-faucets-passion/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsPassionController.updatePassion);
router.delete('/corsa-bathroom-faucets-passion/delete/:id', CorsaBathroomFaucetsPassionController.deletePassion);

// corsa-bathroom-faucets-royal endpoints
router.post('/corsa-bathroom-faucets-royal/create', upload.array('photos', 5), CorsaBathroomFaucetsRoyalController.createRoyal);
router.get('/corsa-bathroom-faucets-royal/get', CorsaBathroomFaucetsRoyalController.getAllRoyal);
router.get('/corsa-bathroom-faucets-royal/getOne/:id', CorsaBathroomFaucetsRoyalController.getOneRoyal);
router.put('/corsa-bathroom-faucets-royal/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsRoyalController.updateRoyal);
router.delete('/corsa-bathroom-faucets-royal/delete/:id', CorsaBathroomFaucetsRoyalController.deleteRoyal);

// corsa-bathroom-faucets-slimline endpoints
router.post('/corsa-bathroom-faucets-slimline/create', upload.array('photos', 5), CorsaBathroomFaucetsSlimlineController.createSlimline);
router.get('/corsa-bathroom-faucets-slimline/get', CorsaBathroomFaucetsSlimlineController.getAllSlimline);
router.get('/corsa-bathroom-faucets-slimline/getOne/:id', CorsaBathroomFaucetsSlimlineController.getOneSlimline);
router.put('/corsa-bathroom-faucets-slimline/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsSlimlineController.updateSlimline);
router.delete('/corsa-bathroom-faucets-slimline/delete/:id', CorsaBathroomFaucetsSlimlineController.deleteSlimline);

// corsa-bathroom-faucets-splash endpoints
router.post('/corsa-bathroom-faucets-splash/create', upload.array('photos', 5), CorsaBathroomFaucetsSplashController.createSplash);
router.get('/corsa-bathroom-faucets-splash/get', CorsaBathroomFaucetsSplashController.getAllSplash);
router.get('/corsa-bathroom-faucets-splash/getOne/:id', CorsaBathroomFaucetsSplashController.getOneSplash);
router.put('/corsa-bathroom-faucets-splash/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsSplashController.updateSplash);
router.delete('/corsa-bathroom-faucets-splash/delete/:id', CorsaBathroomFaucetsSplashController.deleteSplash);

// corsa-bathroom-faucets-square-f endpoints
router.post('/corsa-bathroom-faucets-square-f/create', upload.array('photos', 5), CorsaBathroomFaucetsSquareFController.createSquareF);
router.get('/corsa-bathroom-faucets-square-f/get', CorsaBathroomFaucetsSquareFController.getAllSquareF);
router.get('/corsa-bathroom-faucets-square-f/getOne/:id', CorsaBathroomFaucetsSquareFController.getOneSquareF);
router.put('/corsa-bathroom-faucets-square-f/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsSquareFController.updateSquareF);
router.delete('/corsa-bathroom-faucets-square-f/delete/:id', CorsaBathroomFaucetsSquareFController.deleteSquareF);

// corsa-bathroom-faucets-square-s endpoints
router.post('/corsa-bathroom-faucets-square-s/create', upload.array('photos', 5), CorsaBathroomFaucetsSquareSController.createSquareS);
router.get('/corsa-bathroom-faucets-square-s/get', CorsaBathroomFaucetsSquareSController.getAllSquareS);
router.get('/corsa-bathroom-faucets-square-s/getOne/:id', CorsaBathroomFaucetsSquareSController.getOneSquareS);
router.put('/corsa-bathroom-faucets-square-s/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsSquareSController.updateSquareS);
router.delete('/corsa-bathroom-faucets-square-s/delete/:id', CorsaBathroomFaucetsSquareSController.deleteSquareS);

// corsa-bathroom-faucets-super endpoints
router.post('/corsa-bathroom-faucets-super/create', upload.array('photos', 5), CorsaBathroomFaucetsSuperController.createSuper);
router.get('/corsa-bathroom-faucets-super/get', CorsaBathroomFaucetsSuperController.getAllSuper);
router.get('/corsa-bathroom-faucets-super/getOne/:id', CorsaBathroomFaucetsSuperController.getOneSuper);
router.put('/corsa-bathroom-faucets-super/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsSuperController.updateSuper);
router.delete('/corsa-bathroom-faucets-super/delete/:id', CorsaBathroomFaucetsSuperController.deleteSuper);

// corsa-bathroom-faucets-tri endpoints
router.post('/corsa-bathroom-faucets-tri/create', upload.array('photos', 5), CorsaBathroomFaucetsTriController.createTri);
router.get('/corsa-bathroom-faucets-tri/get', CorsaBathroomFaucetsTriController.getAllTri);
router.get('/corsa-bathroom-faucets-tri/getOne/:id', CorsaBathroomFaucetsTriController.getOneTri);
router.put('/corsa-bathroom-faucets-tri/update/:id', upload.array('photos', 5), CorsaBathroomFaucetsTriController.updateTri);
router.delete('/corsa-bathroom-faucets-tri/delete/:id', CorsaBathroomFaucetsTriController.deleteTri);

// corsa-b-a-t-h-r-o-o-m_-a-e-s-s-o-r-i-e-s-acrylic-accessories endpoints
router.post('/corsa-bathroom-accessories-acrylic-accessories/create', upload.array('photos', 5), CorsaBATHROOMACCESSORIESAcrylicAccessoriesController.createAcrylicAccessories);
router.get('/corsa-bathroom-accessories-acrylic-accessories/get', CorsaBATHROOMACCESSORIESAcrylicAccessoriesController.getAllAcrylicAccessories);
router.get('/corsa-bathroom-accessories-acrylic-accessories/getOne/:id', CorsaBATHROOMACCESSORIESAcrylicAccessoriesController.getOneAcrylicAccessories);
router.put('/corsa-bathroom-accessories-acrylic-accessories/update/:id', upload.array('photos', 5), CorsaBATHROOMACCESSORIESAcrylicAccessoriesController.updateAcrylicAccessories);
router.delete('/corsa-bathroom-accessories-acrylic-accessories/delete/:id', CorsaBATHROOMACCESSORIESAcrylicAccessoriesController.deleteAcrylicAccessories);

// corsabathroomaccessoriesalmond endpoints
router.post('/corsa-bathroom-accessories-almond/create', upload.array('photos', 5), CorsaBATHROOMACCESSORIESAlmondController.createAlmond);
router.get('/corsa-bathroom-accessories-almond/get', CorsaBATHROOMACCESSORIESAlmondController.getAllAlmond);
router.get('/corsa-bathroom-accessories-almond/getOne/:id', CorsaBATHROOMACCESSORIESAlmondController.getOneAlmond);
router.put('/corsa-bathroom-accessories-almond/update/:id', upload.array('photos', 5), CorsaBATHROOMACCESSORIESAlmondController.updateAlmond);
router.delete('/corsa-bathroom-accessories-almond/delete/:id', CorsaBATHROOMACCESSORIESAlmondController.deleteAlmond);

// corsabathroomaccessoriesanglo endpoints
router.post('/corsa-bathroom-accessories-anglo/create', upload.array('photos', 5), CorsaBATHROOMACCESSORIESAngloController.createAnglo);
router.get('/corsa-bathroom-accessories-anglo/get', CorsaBATHROOMACCESSORIESAngloController.getAllAnglo);
router.get('/corsa-bathroom-accessories-anglo/getOne/:id', CorsaBATHROOMACCESSORIESAngloController.getOneAnglo);
router.put('/corsa-bathroom-accessories-anglo/update/:id', upload.array('photos', 5), CorsaBATHROOMACCESSORIESAngloController.updateAnglo);
router.delete('/corsa-bathroom-accessories-anglo/delete/:id', CorsaBATHROOMACCESSORIESAngloController.deleteAnglo);

// corsabathroomaccessoriesbudget endpoints
router.post('/corsa-bathroom-accessories-budget/create', upload.array('photos', 5), CorsaBATHROOMACCESSORIESBudgetController.createBudget);
router.get('/corsa-bathroom-accessories-budget/get', CorsaBATHROOMACCESSORIESBudgetController.getAllBudget);
router.get('/corsa-bathroom-accessories-budget/getOne/:id', CorsaBATHROOMACCESSORIESBudgetController.getOneBudget);
router.put('/corsa-bathroom-accessories-budget/update/:id', upload.array('photos', 5), CorsaBATHROOMACCESSORIESBudgetController.updateBudget);
router.delete('/corsa-bathroom-accessories-budget/delete/:id', CorsaBATHROOMACCESSORIESBudgetController.deleteBudget);

// corsabathroomaccessoriesdolphin endpoints
router.post('/corsa-bathroom-accessories-dolphin/create', upload.array('photos', 5), CorsaBATHROOMACCESSORIESDolphinController.createDolphin);
router.get('/corsa-bathroom-accessories-dolphin/get', CorsaBATHROOMACCESSORIESDolphinController.getAllDolphin);
router.get('/corsa-bathroom-accessories-dolphin/getOne/:id', CorsaBATHROOMACCESSORIESDolphinController.getOneDolphin);
router.put('/corsa-bathroom-accessories-dolphin/update/:id', upload.array('photos', 5), CorsaBATHROOMACCESSORIESDolphinController.updateDolphin);
router.delete('/corsa-bathroom-accessories-dolphin/delete/:id', CorsaBATHROOMACCESSORIESDolphinController.deleteDolphin);

// corsabathroomaccessoriesecco endpoints
router.post('/corsa-bathroom-accessories-ecco/create', upload.array('photos', 5), CorsaBATHROOMACCESSORIESEccoController.createEcco);
router.get('/corsa-bathroom-accessories-ecco/get', CorsaBATHROOMACCESSORIESEccoController.getAllEcco);
router.get('/corsa-bathroom-accessories-ecco/getOne/:id', CorsaBATHROOMACCESSORIESEccoController.getOneEcco);
router.put('/corsa-bathroom-accessories-ecco/update/:id', upload.array('photos', 5), CorsaBATHROOMACCESSORIESEccoController.updateEcco);
router.delete('/corsa-bathroom-accessories-ecco/delete/:id', CorsaBATHROOMACCESSORIESEccoController.deleteEcco);

// corsabathroomaccessoriesketi endpoints
router.post('/corsa-bathroom-accessories-keti/create', upload.array('photos', 5), CorsaBATHROOMACCESSORIESKetiController.createKeti);
router.get('/corsa-bathroom-accessories-keti/get', CorsaBATHROOMACCESSORIESKetiController.getAllKeti);
router.get('/corsa-bathroom-accessories-keti/getOne/:id', CorsaBATHROOMACCESSORIESKetiController.getOneKeti);
router.put('/corsa-bathroom-accessories-keti/update/:id', upload.array('photos', 5), CorsaBATHROOMACCESSORIESKetiController.updateKeti);
router.delete('/corsa-bathroom-accessories-keti/delete/:id', CorsaBATHROOMACCESSORIESKetiController.deleteKeti);

// corsabathroomaccessoriesqubix endpoints
router.post('/corsa-bathroom-accessories-qubix/create', upload.array('photos', 5), CorsaBATHROOMACCESSORIESQubixController.createQubix);
router.get('/corsa-bathroom-accessories-qubix/get', CorsaBATHROOMACCESSORIESQubixController.getAllQubix);
router.get('/corsa-bathroom-accessories-qubix/getOne/:id', CorsaBATHROOMACCESSORIESQubixController.getOneQubix);
router.put('/corsa-bathroom-accessories-qubix/update/:id', upload.array('photos', 5), CorsaBATHROOMACCESSORIESQubixController.updateQubix);
router.delete('/corsa-bathroom-accessories-qubix/delete/:id', CorsaBATHROOMACCESSORIESQubixController.deleteQubix);

// corsabathroomaccessoriessquare endpoints
router.post('/corsa-bathroom-accessories-square/create', upload.array('photos', 5), CorsaBATHROOMACCESSORIESSquareController.createSquare);
router.get('/corsa-bathroom-accessoriess-quare/get', CorsaBATHROOMACCESSORIESSquareController.getAllSquare);
router.get('/corsa-bathroom-accessories-square/getOne/:id', CorsaBATHROOMACCESSORIESSquareController.getOneSquare);
router.put('/corsa-bathroom-accessorie-ssquare/update/:id', upload.array('photos', 5), CorsaBATHROOMACCESSORIESSquareController.updateSquare);
router.delete('/corsa-bathroom-accessorie-ssquare/delete/:id', CorsaBATHROOMACCESSORIESSquareController.deleteSquare);

// corsabathroomaccessoriessupreme endpoints
router.post('/corsa-bathroom-accessories-supreme/create', upload.array('photos', 5), CorsaBATHROOMACCESSORIESSupremeController.createSupreme);
router.get('/corsa-bathroom-accessories-supreme/get', CorsaBATHROOMACCESSORIESSupremeController.getAllSupreme);
router.get('/corsa-bathroom-accessories-supreme/getOne/:id', CorsaBATHROOMACCESSORIESSupremeController.getOneSupreme);
router.put('/corsa-bathroom-accessories-supreme/update/:id', upload.array('photos', 5), CorsaBATHROOMACCESSORIESSupremeController.updateSupreme);
router.delete('/corsa-bathroom-accessories-supreme/delete/:id', CorsaBATHROOMACCESSORIESSupremeController.deleteSupreme);

// corsa-flushing-cistern endpoints
router.post('/corsa-flushing-cistern/create', upload.array('photos', 5), CorsaFlushingCisternController.createFlushingCistern);
router.get('/corsa-flushing-cistern/get', CorsaFlushingCisternController.getAllFlushingCistern);
router.get('/corsa-flushing-cistern/getOne/:id', CorsaFlushingCisternController.getOneFlushingCistern);
router.put('/corsa-flushing-cistern/update/:id', upload.array('photos', 5), CorsaFlushingCisternController.updateFlushingCistern);
router.delete('/corsa-flushing-cistern/delete/:id', CorsaFlushingCisternController.deleteFlushingCistern);

// corsa-kitchen-kitchen-faucets endpoints
router.post('/corsa-kitchen-kitchen-faucets/create', upload.array('photos', 5), CorsaKitchenKitchenFaucetsController.createKitchenFaucets);
router.get('/corsa-kitchen-kitchen-faucets/get', CorsaKitchenKitchenFaucetsController.getAllKitchenFaucets);
router.get('/corsa-kitchen-kitchen-faucets/getOne/:id', CorsaKitchenKitchenFaucetsController.getOneKitchenFaucets);
router.put('/corsa-kitchen-kitchen-faucets/update/:id', upload.array('photos', 5), CorsaKitchenKitchenFaucetsController.updateKitchenFaucets);
router.delete('/corsa-kitchen-kitchen-faucets/delete/:id', CorsaKitchenKitchenFaucetsController.deleteKitchenFaucets);

// corsa-kitchen-kitchen-sink endpoints
router.post('/corsa-kitchen-kitchen-sink/create', upload.array('photos', 5), CorsaKitchenKitchenSinkController.createKitchenSink);
router.get('/corsa-kitchen-kitchen-sink/get', CorsaKitchenKitchenSinkController.getAllKitchenSink);
router.get('/corsa-kitchen-kitchen-sink/getOne/:id', CorsaKitchenKitchenSinkController.getOneKitchenSink);
router.put('/corsa-kitchen-kitchen-sink/update/:id', upload.array('photos', 5), CorsaKitchenKitchenSinkController.updateKitchenSink);
router.delete('/corsa-kitchen-kitchen-sink/delete/:id', CorsaKitchenKitchenSinkController.deleteKitchenSink);

// corsa-other-useful-items-ball-valves endpoints
router.post('/corsa-other-useful-items-ball-valves/create', upload.array('photos', 5), CorsaOtherUsefulItemsBallValvesController.createBallValves);
router.get('/corsa-other-useful-items-ball-valves/get', CorsaOtherUsefulItemsBallValvesController.getAllBallValves);
router.get('/corsa-other-useful-items-ball-valves/getOne/:id', CorsaOtherUsefulItemsBallValvesController.getOneBallValves);
router.put('/corsa-other-useful-items-ball-valves/update/:id', upload.array('photos', 5), CorsaOtherUsefulItemsBallValvesController.updateBallValves);
router.delete('/corsa-other-useful-items-ball-valves/delete/:id', CorsaOtherUsefulItemsBallValvesController.deleteBallValves);

// corsa-other-useful-items-mini-angle-cock endpoints
router.post('/corsa-other-useful-items-mini-angle-cock/create', upload.array('photos', 5), CorsaOtherUsefulItemsMiniAngleCockController.createMiniAngleCock);
router.get('/corsa-other-useful-items-mini-angle-cock/get', CorsaOtherUsefulItemsMiniAngleCockController.getAllMiniAngleCock);
router.get('/corsa-other-useful-items-mini-angle-cock/getOne/:id', CorsaOtherUsefulItemsMiniAngleCockController.getOneMiniAngleCock);
router.put('/corsa-other-useful-items-mini-angle-cock/update/:id', upload.array('photos', 5), CorsaOtherUsefulItemsMiniAngleCockController.updateMiniAngleCock);
router.delete('/corsa-other-useful-items-mini-angle-cock/delete/:id', CorsaOtherUsefulItemsMiniAngleCockController.deleteMiniAngleCock);

// corsa-other-useful-items-mouth-operated endpoints
router.post('/corsa-other-useful-items-mouth-operated/create', upload.array('photos', 5), CorsaOtherUsefulItemsMouthOperatedController.createMouthOperated);
router.get('/corsa-other-useful-items-mouth-operated/get', CorsaOtherUsefulItemsMouthOperatedController.getAllMouthOperated);
router.get('/corsa-other-useful-items-mouth-operated/getOne/:id', CorsaOtherUsefulItemsMouthOperatedController.getOneMouthOperated);
router.put('/corsa-other-useful-items-mouth-operated/update/:id', upload.array('photos', 5), CorsaOtherUsefulItemsMouthOperatedController.updateMouthOperated);
router.delete('/corsa-other-useful-items-mouth-operated/delete/:id', CorsaOtherUsefulItemsMouthOperatedController.deleteMouthOperated);

// corsa-other-useful-items-pressmatic-push-cock endpoints
router.post('/corsa-other-useful-items-pressmatic-push-cock/create', upload.array('photos', 5), CorsaOtherUsefulItemsPressmaticPushCockController.createPressmaticPushCock);
router.get('/corsa-other-useful-items-pressmatic-push-cock/get', CorsaOtherUsefulItemsPressmaticPushCockController.getAllPressmaticPushCock);
router.get('/corsa-other-useful-items-pressmatic-push-cock/getOne/:id', CorsaOtherUsefulItemsPressmaticPushCockController.getOnePressmaticPushCock);
router.put('/corsa-other-useful-items-pressmatic-push-cock/update/:id', upload.array('photos', 5), CorsaOtherUsefulItemsPressmaticPushCockController.updatePressmaticPushCock);
router.delete('/corsa-other-useful-items-pressmatic-push-cock/delete/:id', CorsaOtherUsefulItemsPressmaticPushCockController.deletePressmaticPushCock);

// corsa-other-useful-items-sensor-taps endpoints
router.post('/corsa-other-useful-items-sensor-taps/create', upload.array('photos', 5), CorsaOtherUsefulItemsSensorTapsController.createSensorTaps);
router.get('/corsa-other-useful-items-sensor-taps/get', CorsaOtherUsefulItemsSensorTapsController.getAllSensorTaps);
router.get('/corsa-other-useful-items-sensor-taps/getOne/:id', CorsaOtherUsefulItemsSensorTapsController.getOneSensorTaps);
router.put('/corsa-other-useful-items-sensor-taps/update/:id', upload.array('photos', 5), CorsaOtherUsefulItemsSensorTapsController.updateSensorTaps);
router.delete('/corsa-other-useful-items-sensor-taps/delete/:id', CorsaOtherUsefulItemsSensorTapsController.deleteSensorTaps);

// corsa-other-useful-items-soap-dispenser endpoints
router.post('/corsa-other-useful-items-soap-dispenser/create', upload.array('photos', 5), CorsaOtherUsefulItemsSoapDispenserController.createSoapDispenser);
router.get('/corsa-other-useful-items-soap-dispenser/get', CorsaOtherUsefulItemsSoapDispenserController.getAllSoapDispenser);
router.get('/corsa-other-useful-items-soap-dispenser/getOne/:id', CorsaOtherUsefulItemsSoapDispenserController.getOneSoapDispenser);
router.put('/corsa-other-useful-items-soap-dispenser/update/:id', upload.array('photos', 5), CorsaOtherUsefulItemsSoapDispenserController.updateSoapDispenser);
router.delete('/corsa-other-useful-items-soap-dispenser/delete/:id', CorsaOtherUsefulItemsSoapDispenserController.deleteSoapDispenser);

// corsa-s-h-o-w-e-r-s-health-faucet endpoints
router.post('/corsashowershealth-faucet/create', upload.array('photos', 5), CorsaSHOWERSHealthFaucetController.createHealthFaucet);
router.get('/corsashowershealth-faucet/get', CorsaSHOWERSHealthFaucetController.getAllHealthFaucet);
router.get('/corsashowershealth-faucet/getOne/:id', CorsaSHOWERSHealthFaucetController.getOneHealthFaucet);
router.put('/corsashowershealth-faucet/update/:id', upload.array('photos', 5), CorsaSHOWERSHealthFaucetController.updateHealthFaucet);
router.delete('/corsashowershealth-faucet/delete/:id', CorsaSHOWERSHealthFaucetController.deleteHealthFaucet);

// corsashowersoverhead-shower endpoints
router.post('/corsa-shower-soverhead-shower/create', upload.array('photos', 5), CorsaSHOWERSOverheadShowerController.createOverheadShower);
router.get('/corsa-shower-soverhead-shower/get', CorsaSHOWERSOverheadShowerController.getAllOverheadShower);
router.get('/corsa-shower-soverhead-shower/getOne/:id', CorsaSHOWERSOverheadShowerController.getOneOverheadShower);
router.put('/corsa-shower-soverhead-shower/update/:id', upload.array('photos', 5), CorsaSHOWERSOverheadShowerController.updateOverheadShower);
router.delete('/corsa-shower-soverhead-shower/delete/:id', CorsaSHOWERSOverheadShowerController.deleteOverheadShower);

// corsashowersrain-shower endpoints
router.post('/corsa-showers-rain-shower/create', upload.array('photos', 5), CorsaSHOWERSRainShowerController.createRainShower);
router.get('/corsa-showers-rain-shower/get', CorsaSHOWERSRainShowerController.getAllRainShower);
router.get('/corsa-showers-rain-shower/getOne/:id', CorsaSHOWERSRainShowerController.getOneRainShower);
router.put('/corsa-showers-rain-shower/update/:id', upload.array('photos', 5), CorsaSHOWERSRainShowerController.updateRainShower);
router.delete('/corsa-showers-rain-shower/delete/:id', CorsaSHOWERSRainShowerController.deleteRainShower);

// corsashowerstelephonic-shower endpoints
router.post('/corsa-showers-telephonic-shower/create', upload.array('photos', 5), CorsaSHOWERSTelephonicShowerController.createTelephonicShower);
router.get('/corsa-showers-telephonic-shower/get', CorsaSHOWERSTelephonicShowerController.getAllTelephonicShower);
router.get('/corsa-showers-telephonic-shower/getOne/:id', CorsaSHOWERSTelephonicShowerController.getOneTelephonicShower);
router.put('/corsa-showers-telephonic-shower/update/:id', upload.array('photos', 5), CorsaSHOWERSTelephonicShowerController.updateTelephonicShower);
router.delete('/corsa-showers-telephonic-shower/delete/:id', CorsaSHOWERSTelephonicShowerController.deleteTelephonicShower);

// essess-accessories-series1-croma endpoints
router.post('/essess-accessories-series1-croma/create', upload.array('photos', 5), EssessAccessoriesSeries1CromaController.createSeries1Croma);
router.get('/essess-accessories-series1-croma/get', EssessAccessoriesSeries1CromaController.getAllSeries1Croma);
router.get('/essess-accessories-series1-croma/getOne/:id', EssessAccessoriesSeries1CromaController.getOneSeries1Croma);
router.put('/essess-accessories-series1-croma/update/:id', upload.array('photos', 5), EssessAccessoriesSeries1CromaController.updateSeries1Croma);
router.delete('/essess-accessories-series1-croma/delete/:id', EssessAccessoriesSeries1CromaController.deleteSeries1Croma);

// essess-accessories-series2-swing endpoints
router.post('/essess-accessories-series2-swing/create', upload.array('photos', 5), EssessAccessoriesSeries2SwingController.createSeries2Swing);
router.get('/essess-accessories-series2-swing/get', EssessAccessoriesSeries2SwingController.getAllSeries2Swing);
router.get('/essess-accessories-series2-swing/getOne/:id', EssessAccessoriesSeries2SwingController.getOneSeries2Swing);
router.put('/essess-accessories-series2-swing/update/:id', upload.array('photos', 5), EssessAccessoriesSeries2SwingController.updateSeries2Swing);
router.delete('/essess-accessories-series2-swing/delete/:id', EssessAccessoriesSeries2SwingController.deleteSeries2Swing);

// essess-accessories-series3-tarim endpoints
router.post('/essess-accessories-series3-tarim/create', upload.array('photos', 5), EssessAccessoriesSeries3TarimController.createSeries3Tarim);
router.get('/essess-accessories-series3-tarim/get', EssessAccessoriesSeries3TarimController.getAllSeries3Tarim);
router.get('/essess-accessories-series3-tarim/getOne/:id', EssessAccessoriesSeries3TarimController.getOneSeries3Tarim);
router.put('/essess-accessories-series3-tarim/update/:id', upload.array('photos', 5), EssessAccessoriesSeries3TarimController.updateSeries3Tarim);
router.delete('/essess-accessories-series3-tarim/delete/:id', EssessAccessoriesSeries3TarimController.deleteSeries3Tarim);

// essess-accessories-series5-hotelier-series endpoints
router.post('/essess-accessories-series5-hotelier-series/create', upload.array('photos', 5), EssessAccessoriesSeries5HotelierSeriesController.createSeries5HotelierSeries);
router.get('/essess-accessories-series5-hotelier-series/get', EssessAccessoriesSeries5HotelierSeriesController.getAllSeries5HotelierSeries);
router.get('/essess-accessories-series5-hotelier-series/getOne/:id', EssessAccessoriesSeries5HotelierSeriesController.getOneSeries5HotelierSeries);
router.put('/essess-accessories-series5-hotelier-series/update/:id', upload.array('photos', 5), EssessAccessoriesSeries5HotelierSeriesController.updateSeries5HotelierSeries);
router.delete('/essess-accessories-series5-hotelier-series/delete/:id', EssessAccessoriesSeries5HotelierSeriesController.deleteSeries5HotelierSeries);

// essess-accessories-series6-cruzo endpoints
router.post('/essess-accessories-series6-cruzo/create', upload.array('photos', 5), EssessAccessoriesSeries6CruzoController.createSeries6Cruzo);
router.get('/essess-accessories-series6-cruzo/get', EssessAccessoriesSeries6CruzoController.getAllSeries6Cruzo);
router.get('/essess-accessories-series6-cruzo/getOne/:id', EssessAccessoriesSeries6CruzoController.getOneSeries6Cruzo);
router.put('/essess-accessories-series6-cruzo/update/:id', upload.array('photos', 5), EssessAccessoriesSeries6CruzoController.updateSeries6Cruzo);
router.delete('/essess-accessories-series6-cruzo/delete/:id', EssessAccessoriesSeries6CruzoController.deleteSeries6Cruzo);

// essess-accessories-series7-deon endpoints
router.post('/essess-accessories-series7-deon/create', upload.array('photos', 5), EssessAccessoriesSeries7DeonController.createSeries7Deon);
router.get('/essess-accessories-series7-deon/get', EssessAccessoriesSeries7DeonController.getAllSeries7Deon);
router.get('/essess-accessories-series7-deon/getOne/:id', EssessAccessoriesSeries7DeonController.getOneSeries7Deon);
router.put('/essess-accessories-series7-deon/update/:id', upload.array('photos', 5), EssessAccessoriesSeries7DeonController.updateSeries7Deon);
router.delete('/essess-accessories-series7-deon/delete/:id', EssessAccessoriesSeries7DeonController.deleteSeries7Deon);

// essess-accessories-series8-b-series endpoints
router.post('/essess-accessories-series8-series/create', upload.array('photos', 5), EssessAccessoriesSeries8BSeriesController.createSeries8BSeries);
router.get('/essess-accessories-series8-series/get', EssessAccessoriesSeries8BSeriesController.getAllSeries8BSeries);
router.get('/essess-accessories-series8-series/getOne/:id', EssessAccessoriesSeries8BSeriesController.getOneSeries8BSeries);
router.put('/essess-accessories-series8-series/update/:id', upload.array('photos', 5), EssessAccessoriesSeries8BSeriesController.updateSeries8BSeries);
router.delete('/essess-accessories-series8-series/delete/:id', EssessAccessoriesSeries8BSeriesController.deleteSeries8BSeries);

// essess-auto-close-taps endpoints
router.post('/essess-auto-close-taps/create', upload.array('photos', 5), EssessAutoCloseTapsController.createAutoCloseTaps);
router.get('/essess-auto-close-taps/get', EssessAutoCloseTapsController.getAllAutoCloseTaps);
router.get('/essess-auto-close-taps/getOne/:id', EssessAutoCloseTapsController.getOneAutoCloseTaps);
router.put('/essess-auto-close-taps/update/:id', upload.array('photos', 5), EssessAutoCloseTapsController.updateAutoCloseTaps);
router.delete('/essess-auto-close-taps/delete/:id', EssessAutoCloseTapsController.deleteAutoCloseTaps);

// essess-celato endpoints
router.post('/essess-celato/create', upload.array('photos', 5), EssessCelatoController.createCelato);
router.get('/essess-celato/get', EssessCelatoController.getAllCelato);
router.get('/essess-celato/getOne/:id', EssessCelatoController.getOneCelato);
router.put('/essess-celato/update/:id', upload.array('photos', 5), EssessCelatoController.updateCelato);
router.delete('/essess-celato/delete/:id', EssessCelatoController.deleteCelato);

// essess-croma endpoints
router.post('/essess-croma/create', upload.array('photos', 5), EssessCromaController.createCroma);
router.get('/essess-croma/get', EssessCromaController.getAllCroma);
router.get('/essess-croma/getOne/:id', EssessCromaController.getOneCroma);
router.put('/essess-croma/update/:id', upload.array('photos', 5), EssessCromaController.updateCroma);
router.delete('/essess-croma/delete/:id', EssessCromaController.deleteCroma);

// essess-cruzo endpoints
router.post('/essess-cruzo/create', upload.array('photos', 5), EssessCruzoController.createCruzo);
router.get('/essess-cruzo/get', EssessCruzoController.getAllCruzo);
router.get('/essess-cruzo/getOne/:id', EssessCruzoController.getOneCruzo);
router.put('/essess-cruzo/update/:id', upload.array('photos', 5), EssessCruzoController.updateCruzo);
router.delete('/essess-cruzo/delete/:id', EssessCruzoController.deleteCruzo);

// essess-deon endpoints
router.post('/essess-deon/create', upload.array('photos', 5), EssessDeonController.createDeon);
router.get('/essess-deon/get', EssessDeonController.getAllDeon);
router.get('/essess-deon/getOne/:id', EssessDeonController.getOneDeon);
router.put('/essess-deon/update/:id', upload.array('photos', 5), EssessDeonController.updateDeon);
router.delete('/essess-deon/delete/:id', EssessDeonController.deleteDeon);

// essess-d-series endpoints
router.post('/essess-series/create', upload.array('photos', 5), EssessDSeriesController.createDSeries);
router.get('/essess-series/get', EssessDSeriesController.getAllDSeries);
router.get('/essess-series/getOne/:id', EssessDSeriesController.getOneDSeries);
router.put('/essess-series/update/:id', upload.array('photos', 5), EssessDSeriesController.updateDSeries);
router.delete('/essess-series/delete/:id', EssessDSeriesController.deleteDSeries);

// essess-echo endpoints
router.post('/essess-echo/create', upload.array('photos', 5), EssessEchoController.createEcho);
router.get('/essess-echo/get', EssessEchoController.getAllEcho);
router.get('/essess-echo/getOne/:id', EssessEchoController.getOneEcho);
router.put('/essess-echo/update/:id', upload.array('photos', 5), EssessEchoController.updateEcho);
router.delete('/essess-echo/delete/:id', EssessEchoController.deleteEcho);

// essess-essentials endpoints
router.post('/essess-essentials/create', upload.array('photos', 5), EssessEssentialsController.createEssentials);
router.get('/essess-essentials/get', EssessEssentialsController.getAllEssentials);
router.get('/essess-essentials/getOne/:id', EssessEssentialsController.getOneEssentials);
router.put('/essess-essentials/update/:id', upload.array('photos', 5), EssessEssentialsController.updateEssentials);
router.delete('/essess-essentials/delete/:id', EssessEssentialsController.deleteEssentials);

// essess-hotelier-series endpoints
router.post('/essess-hotelier-series/create', upload.array('photos', 5), EssessHotelierSeriesController.createHotelierSeries);
router.get('/essess-hotelier-series/get', EssessHotelierSeriesController.getAllHotelierSeries);
router.get('/essess-hotelier-series/getOne/:id', EssessHotelierSeriesController.getOneHotelierSeries);
router.put('/essess-hotelier-series/update/:id', upload.array('photos', 5), EssessHotelierSeriesController.updateHotelierSeries);
router.delete('/essess-hotelier-series/delete/:id', EssessHotelierSeriesController.deleteHotelierSeries);

// essess-h-s03 endpoints
router.post('/essess-s03/create', upload.array('photos', 5), EssessHS03Controller.createHS03);
router.get('/essess-s03/get', EssessHS03Controller.getAllHS03);
router.get('/essess-s03/getOne/:id', EssessHS03Controller.getOneHS03);
router.put('/essess-s03/update/:id', upload.array('photos', 5), EssessHS03Controller.updateHS03);
router.delete('/essess-s03/delete/:id', EssessHS03Controller.deleteHS03);

// essess-lab-taps endpoints
router.post('/essess-lab-taps/create', upload.array('photos', 5), EssessLabTapsController.createLabTaps);
router.get('/essess-lab-taps/get', EssessLabTapsController.getAllLabTaps);
router.get('/essess-lab-taps/getOne/:id', EssessLabTapsController.getOneLabTaps);
router.put('/essess-lab-taps/update/:id', upload.array('photos', 5), EssessLabTapsController.updateLabTaps);
router.delete('/essess-lab-taps/delete/:id', EssessLabTapsController.deleteLabTaps);

// essess-new-dune endpoints
router.post('/essess-new-dune/create', upload.array('photos', 5), EssessNewDuneController.createNewDune);
router.get('/essess-new-dune/get', EssessNewDuneController.getAllNewDune);
router.get('/essess-new-dune/getOne/:id', EssessNewDuneController.getOneNewDune);
router.put('/essess-new-dune/update/:id', upload.array('photos', 5), EssessNewDuneController.updateNewDune);
router.delete('/essess-new-dune/delete/:id', EssessNewDuneController.deleteNewDune);

// essess-new-xess endpoints
router.post('/essess-new-xess/create', upload.array('photos', 5), EssessNewXessController.createNewXess);
router.get('/essess-new-xess/get', EssessNewXessController.getAllNewXess);
router.get('/essess-new-xess/getOne/:id', EssessNewXessController.getOneNewXess);
router.put('/essess-new-xess/update/:id', upload.array('photos', 5), EssessNewXessController.updateNewXess);
router.delete('/essess-new-xess/delete/:id', EssessNewXessController.deleteNewXess);

// essess-quadra endpoints
router.post('/essess-quadra/create', upload.array('photos', 5), EssessQuadraController.createQuadra);
router.get('/essess-quadra/get', EssessQuadraController.getAllQuadra);
router.get('/essess-quadra/getOne/:id', EssessQuadraController.getOneQuadra);
router.put('/essess-quadra/update/:id', upload.array('photos', 5), EssessQuadraController.updateQuadra);
router.delete('/essess-quadra/delete/:id', EssessQuadraController.deleteQuadra);

// essess-sensors endpoints
router.post('/essess-sensors/create', upload.array('photos', 5), EssessSensorsController.createSensors);
router.get('/essess-sensors/get', EssessSensorsController.getAllSensors);
router.get('/essess-sensors/getOne/:id', EssessSensorsController.getOneSensors);
router.put('/essess-sensors/update/:id', upload.array('photos', 5), EssessSensorsController.updateSensors);
router.delete('/essess-sensors/delete/:id', EssessSensorsController.deleteSensors);

// essess-showers-hand-showers endpoints
router.post('/essess-showers-hand-showers/create', upload.array('photos', 5), EssessShowersHandShowersController.createHandShowers);
router.get('/essess-showers-hand-showers/get', EssessShowersHandShowersController.getAllHandShowers);
router.get('/essess-showers-hand-showers/getOne/:id', EssessShowersHandShowersController.getOneHandShowers);
router.put('/essess-showers-hand-showers/update/:id', upload.array('photos', 5), EssessShowersHandShowersController.updateHandShowers);
router.delete('/essess-showers-hand-showers/delete/:id', EssessShowersHandShowersController.deleteHandShowers);

// essess-showers-overhead-showers endpoints
router.post('/essess-showers-overhead-showers/create', upload.array('photos', 5), EssessShowersOverheadShowersController.createOverheadShowers);
router.get('/essess-showers-overhead-showers/get', EssessShowersOverheadShowersController.getAllOverheadShowers);
router.get('/essess-showers-overhead-showers/getOne/:id', EssessShowersOverheadShowersController.getOneOverheadShowers);
router.put('/essess-showers-overhead-showers/update/:id', upload.array('photos', 5), EssessShowersOverheadShowersController.updateOverheadShowers);
router.delete('/essess-showers-overhead-showers/delete/:id', EssessShowersOverheadShowersController.deleteOverheadShowers);

// essess-showers-rainfall-showers endpoints
router.post('/essess-showers-rainfall-showers/create', upload.array('photos', 5), EssessShowersRainfallShowersController.createRainfallShowers);
router.get('/essess-showers-rainfall-showers/get', EssessShowersRainfallShowersController.getAllRainfallShowers);
router.get('/essess-showers-rainfall-showers/getOne/:id', EssessShowersRainfallShowersController.getOneRainfallShowers);
router.put('/essess-showers-rainfall-showers/update/:id', upload.array('photos', 5), EssessShowersRainfallShowersController.updateRainfallShowers);
router.delete('/essess-showers-rainfall-showers/delete/:id', EssessShowersRainfallShowersController.deleteRainfallShowers);

// essess-showers-shower-arms endpoints
router.post('/essess-showers-shower-arms/create', upload.array('photos', 5), EssessShowersShowerArmsController.createShowerArms);
router.get('/essess-showers-shower-arms/get', EssessShowersShowerArmsController.getAllShowerArms);
router.get('/essess-showers-shower-arms/getOne/:id', EssessShowersShowerArmsController.getOneShowerArms);
router.put('/essess-showers-shower-arms/update/:id', upload.array('photos', 5), EssessShowersShowerArmsController.updateShowerArms);
router.delete('/essess-showers-shower-arms/delete/:id', EssessShowersShowerArmsController.deleteShowerArms);

// essess-tarim endpoints
router.post('/essess-tarim/create', upload.array('photos', 5), EssessTarimController.createTarim);
router.get('/essess-tarim/get', EssessTarimController.getAllTarim);
router.get('/essess-tarim/getOne/:id', EssessTarimController.getOneTarim);
router.put('/essess-tarim/update/:id', upload.array('photos', 5), EssessTarimController.updateTarim);
router.delete('/essess-tarim/delete/:id', EssessTarimController.deleteTarim);

// essess-trand endpoints
router.post('/essess-trand/create', upload.array('photos', 5), EssessTrandController.createTrand);
router.get('/essess-trand/get', EssessTrandController.getAllTrand);
router.get('/essess-trand/getOne/:id', EssessTrandController.getOneTrand);
router.put('/essess-trand/update/:id', upload.array('photos', 5), EssessTrandController.updateTrand);
router.delete('/essess-trand/delete/:id', EssessTrandController.deleteTrand);

// faucets endpoints
router.post('/faucets/create', upload.array('photos', 5), faucetsController.createFaucets);
router.get('/faucets/get', faucetsController.getAllFaucets);
router.get('/faucets/getOne/:id', faucetsController.getOneFaucets);
router.put('/faucets/update/:id', upload.array('photos', 5), faucetsController.updateFaucets);
router.delete('/faucets/delete/:id', faucetsController.deleteFaucets);

// hardware-bathroom-accessories endpoints
router.post('/hardware-bathroom-accessories/create', upload.array('photos', 5), hardwareBathroomAccessoriesController.createHardwareBathroomAccessories);
router.get('/hardware-bathroom-accessories/get', hardwareBathroomAccessoriesController.getAllHardwareBathroomAccessories);
router.get('/hardware-bathroom-accessories/getOne/:id', hardwareBathroomAccessoriesController.getOneHardwareBathroomAccessories);
router.put('/hardware-bathroom-accessories/update/:id', upload.array('photos', 5), hardwareBathroomAccessoriesController.updateHardwareBathroomAccessories);
router.delete('/hardware-bathroom-accessories/delete/:id', hardwareBathroomAccessoriesController.deleteHardwareBathroomAccessories);

// health-faucet endpoints
router.post('/health-faucet/create', upload.array('photos', 5), healthFaucetController.createHealthFaucet);
router.get('/health-faucet/get', healthFaucetController.getAllHealthFaucet);
router.get('/health-faucet/getOne/:id', healthFaucetController.getOneHealthFaucet);
router.put('/health-faucet/update/:id', upload.array('photos', 5), healthFaucetController.updateHealthFaucet);
router.delete('/health-faucet/delete/:id', healthFaucetController.deleteHealthFaucet);

// hindware-add-on endpoints
router.post('/hindware-add-on/create', upload.array('photos', 5), HindwareAddOnController.createAddOn);
router.get('/hindware-add-on/get', HindwareAddOnController.getAllAddOn);
router.get('/hindware-add-on/getOne/:id', HindwareAddOnController.getOneAddOn);
router.put('/hindware-add-on/update/:id', upload.array('photos', 5), HindwareAddOnController.updateAddOn);
router.delete('/hindware-add-on/delete/:id', HindwareAddOnController.deleteAddOn);

// hindware-bath-tub endpoints
router.post('/hindware-bath-tub/create', upload.array('photos', 5), HindwareBathTubController.createBathTub);
router.get('/hindware-bath-tub/get', HindwareBathTubController.getAllBathTub);
router.get('/hindware-bath-tub/getOne/:id', HindwareBathTubController.getOneBathTub);
router.put('/hindware-bath-tub/update/:id', upload.array('photos', 5), HindwareBathTubController.updateBathTub);
router.delete('/hindware-bath-tub/delete/:id', HindwareBathTubController.deleteBathTub);

// hindware-cisterns endpoints
router.post('/hindware-cisterns/create', upload.array('photos', 5), HindwareCisternsController.createCisterns);
router.get('/hindware-cisterns/get', HindwareCisternsController.getAllCisterns);
router.get('/hindware-cisterns/getOne/:id', HindwareCisternsController.getOneCisterns);
router.put('/hindware-cisterns/update/:id', upload.array('photos', 5), HindwareCisternsController.updateCisterns);
router.delete('/hindware-cisterns/delete/:id', HindwareCisternsController.deleteCisterns);

// hindware-faucets-angular-stop-cock endpoints
router.post('/hindware-faucets-angular-stop-cock/create', upload.array('photos', 5), HindwareFaucetsAngularStopCockController.createAngularStopCock);
router.get('/hindware-faucets-angular-stop-cock/get', HindwareFaucetsAngularStopCockController.getAllAngularStopCock);
router.get('/hindware-faucets-angular-stop-cock/getOne/:id', HindwareFaucetsAngularStopCockController.getOneAngularStopCock);
router.put('/hindware-faucets-angular-stop-cock/update/:id', upload.array('photos', 5), HindwareFaucetsAngularStopCockController.updateAngularStopCock);
router.delete('/hindware-faucets-angular-stop-cock/delete/:id', HindwareFaucetsAngularStopCockController.deleteAngularStopCock);

// hindware-faucets-bath-spout endpoints
router.post('/hindware-faucets-bath-spout/create', upload.array('photos', 5), HindwareFaucetsBathSpoutController.createBathSpout);
router.get('/hindware-faucets-bath-spout/get', HindwareFaucetsBathSpoutController.getAllBathSpout);
router.get('/hindware-faucets-bath-spout/getOne/:id', HindwareFaucetsBathSpoutController.getOneBathSpout);
router.put('/hindware-faucets-bath-spout/update/:id', upload.array('photos', 5), HindwareFaucetsBathSpoutController.updateBathSpout);
router.delete('/hindware-faucets-bath-spout/delete/:id', HindwareFaucetsBathSpoutController.deleteBathSpout);

// hindware-faucets-bib-cock endpoints
router.post('/hindware-faucets-bib-cock/create', upload.array('photos', 5), HindwareFaucetsBibCockController.createBibCock);
router.get('/hindware-faucets-bib-cock/get', HindwareFaucetsBibCockController.getAllBibCock);
router.get('/hindware-faucets-bib-cock/getOne/:id', HindwareFaucetsBibCockController.getOneBibCock);
router.put('/hindware-faucets-bib-cock/update/:id', upload.array('photos', 5), HindwareFaucetsBibCockController.updateBibCock);
router.delete('/hindware-faucets-bib-cock/delete/:id', HindwareFaucetsBibCockController.deleteBibCock);

// hindware-faucets-chbm endpoints
router.post('/hindware-faucets-chbm/create', upload.array('photos', 5), HindwareFaucetsChbmController.createChbm);
router.get('/hindware-faucets-chbm/get', HindwareFaucetsChbmController.getAllChbm);
router.get('/hindware-faucets-chbm/getOne/:id', HindwareFaucetsChbmController.getOneChbm);
router.put('/hindware-faucets-chbm/update/:id', upload.array('photos', 5), HindwareFaucetsChbmController.updateChbm);
router.delete('/hindware-faucets-chbm/delete/:id', HindwareFaucetsChbmController.deleteChbm);

// hindware-faucets-concealed-stop-cock endpoints
router.post('/hindware-faucets-concealed-stop-cock/create', upload.array('photos', 5), HindwareFaucetsConcealedStopCockController.createConcealedStopCock);
router.get('/hindware-faucets-concealed-stop-cock/get', HindwareFaucetsConcealedStopCockController.getAllConcealedStopCock);
router.get('/hindware-faucets-concealed-stop-cock/getOne/:id', HindwareFaucetsConcealedStopCockController.getOneConcealedStopCock);
router.put('/hindware-faucets-concealed-stop-cock/update/:id', upload.array('photos', 5), HindwareFaucetsConcealedStopCockController.updateConcealedStopCock);
router.delete('/hindware-faucets-concealed-stop-cock/delete/:id', HindwareFaucetsConcealedStopCockController.deleteConcealedStopCock);

// hindware-faucets-csc-exp-kit endpoints
router.post('/hindware-faucets-csc-exp-kit/create', upload.array('photos', 5), HindwareFaucetsCscExpKitController.createCscExpKit);
router.get('/hindware-faucets-csc-exp-kit/get', HindwareFaucetsCscExpKitController.getAllCscExpKit);
router.get('/hindware-faucets-csc-exp-kit/getOne/:id', HindwareFaucetsCscExpKitController.getOneCscExpKit);
router.put('/hindware-faucets-csc-exp-kit/update/:id', upload.array('photos', 5), HindwareFaucetsCscExpKitController.updateCscExpKit);
router.delete('/hindware-faucets-csc-exp-kit/delete/:id', HindwareFaucetsCscExpKitController.deleteCscExpKit);

// hindware-faucets-deusch-mixer endpoints
router.post('/hindware-faucets-deusch-mixer/create', upload.array('photos', 5), HindwareFaucetsDeuschMixerController.createDeuschMixer);
router.get('/hindware-faucets-deusch-mixer/get', HindwareFaucetsDeuschMixerController.getAllDeuschMixer);
router.get('/hindware-faucets-deusch-mixer/getOne/:id', HindwareFaucetsDeuschMixerController.getOneDeuschMixer);
router.put('/hindware-faucets-deusch-mixer/update/:id', upload.array('photos', 5), HindwareFaucetsDeuschMixerController.updateDeuschMixer);
router.delete('/hindware-faucets-deusch-mixer/delete/:id', HindwareFaucetsDeuschMixerController.deleteDeuschMixer);

// hindware-faucets-exposed-mixers endpoints
router.post('/hindware-faucets-exposed-mixers/create', upload.array('photos', 5), HindwareFaucetsExposedMixersController.createExposedMixers);
router.get('/hindware-faucets-exposed-mixers/get', HindwareFaucetsExposedMixersController.getAllExposedMixers);
router.get('/hindware-faucets-exposed-mixers/getOne/:id', HindwareFaucetsExposedMixersController.getOneExposedMixers);
router.put('/hindware-faucets-exposed-mixers/update/:id', upload.array('photos', 5), HindwareFaucetsExposedMixersController.updateExposedMixers);
router.delete('/hindware-faucets-exposed-mixers/delete/:id', HindwareFaucetsExposedMixersController.deleteExposedMixers);

// hindware-faucets-flush-cock endpoints
router.post('/hindware-faucets-flush-cock/create', upload.array('photos', 5), HindwareFaucetsFlushCockController.createFlushCock);
router.get('/hindware-faucets-flush-cock/get', HindwareFaucetsFlushCockController.getAllFlushCock);
router.get('/hindware-faucets-flush-cock/getOne/:id', HindwareFaucetsFlushCockController.getOneFlushCock);
router.put('/hindware-faucets-flush-cock/update/:id', upload.array('photos', 5), HindwareFaucetsFlushCockController.updateFlushCock);
router.delete('/hindware-faucets-flush-cock/delete/:id', HindwareFaucetsFlushCockController.deleteFlushCock);

// hindware-faucets-medical-series endpoints
router.post('/hindware-faucets-medical-series/create', upload.array('photos', 5), HindwareFaucetsMedicalSeriesController.createMedicalSeries);
router.get('/hindware-faucets-medical-series/get', HindwareFaucetsMedicalSeriesController.getAllMedicalSeries);
router.get('/hindware-faucets-medical-series/getOne/:id', HindwareFaucetsMedicalSeriesController.getOneMedicalSeries);
router.put('/hindware-faucets-medical-series/update/:id', upload.array('photos', 5), HindwareFaucetsMedicalSeriesController.updateMedicalSeries);
router.delete('/hindware-faucets-medical-series/delete/:id', HindwareFaucetsMedicalSeriesController.deleteMedicalSeries);

// hindware-faucets-mixer-faucet endpoints
router.post('/hindware-faucets-mixer-faucet/create', upload.array('photos', 5), HindwareFaucetsMixerFaucetController.createMixerFaucet);
router.get('/hindware-faucets-mixer-faucet/get', HindwareFaucetsMixerFaucetController.getAllMixerFaucet);
router.get('/hindware-faucets-mixer-faucet/getOne/:id', HindwareFaucetsMixerFaucetController.getOneMixerFaucet);
router.put('/hindware-faucets-mixer-faucet/update/:id', upload.array('photos', 5), HindwareFaucetsMixerFaucetController.updateMixerFaucet);
router.delete('/hindware-faucets-mixer-faucet/delete/:id', HindwareFaucetsMixerFaucetController.deleteMixerFaucet);

// hindware-faucets-pillar-cock endpoints
router.post('/hindware-faucets-pillar-cock/create', upload.array('photos', 5), HindwareFaucetsPillarCockController.createPillarCock);
router.get('/hindware-faucets-pillar-cock/get', HindwareFaucetsPillarCockController.getAllPillarCock);
router.get('/hindware-faucets-pillar-cock/getOne/:id', HindwareFaucetsPillarCockController.getOnePillarCock);
router.put('/hindware-faucets-pillar-cock/update/:id', upload.array('photos', 5), HindwareFaucetsPillarCockController.updatePillarCock);
router.delete('/hindware-faucets-pillar-cock/delete/:id', HindwareFaucetsPillarCockController.deletePillarCock);

// hindware-faucets-pillar-cock-tall endpoints
router.post('/hindware-faucets-pillar-cock-tall/create', upload.array('photos', 5), HindwareFaucetsPillarCockTallController.createPillarCockTall);
router.get('/hindware-faucets-pillar-cock-tall/get', HindwareFaucetsPillarCockTallController.getAllPillarCockTall);
router.get('/hindware-faucets-pillar-cock-tall/getOne/:id', HindwareFaucetsPillarCockTallController.getOnePillarCockTall);
router.put('/hindware-faucets-pillar-cock-tall/update/:id', upload.array('photos', 5), HindwareFaucetsPillarCockTallController.updatePillarCockTall);
router.delete('/hindware-faucets-pillar-cock-tall/delete/:id', HindwareFaucetsPillarCockTallController.deletePillarCockTall);

// hindware-faucets-pillar-faucet endpoints
router.post('/hindware-faucets-pillar-faucet/create', upload.array('photos', 5), HindwareFaucetsPillarFaucetController.createPillarFaucet);
router.get('/hindware-faucets-pillar-faucet/get', HindwareFaucetsPillarFaucetController.getAllPillarFaucet);
router.get('/hindware-faucets-pillar-faucet/getOne/:id', HindwareFaucetsPillarFaucetController.getOnePillarFaucet);
router.put('/hindware-faucets-pillar-faucet/update/:id', upload.array('photos', 5), HindwareFaucetsPillarFaucetController.updatePillarFaucet);
router.delete('/hindware-faucets-pillar-faucet/delete/:id', HindwareFaucetsPillarFaucetController.deletePillarFaucet);

// hindware-faucets-pressmatic endpoints
router.post('/hindware-faucets-pressmatic/create', upload.array('photos', 5), HindwareFaucetsPressmaticController.createPressmatic);
router.get('/hindware-faucets-pressmatic/get', HindwareFaucetsPressmaticController.getAllPressmatic);
router.get('/hindware-faucets-pressmatic/getOne/:id', HindwareFaucetsPressmaticController.getOnePressmatic);
router.put('/hindware-faucets-pressmatic/update/:id', upload.array('photos', 5), HindwareFaucetsPressmaticController.updatePressmatic);
router.delete('/hindware-faucets-pressmatic/delete/:id', HindwareFaucetsPressmaticController.deletePressmatic);

// hindware-faucets-recessed endpoints
router.post('/hindware-faucets-recessed/create', upload.array('photos', 5), HindwareFaucetsRecessedController.createRecessed);
router.get('/hindware-faucets-recessed/get', HindwareFaucetsRecessedController.getAllRecessed);
router.get('/hindware-faucets-recessed/getOne/:id', HindwareFaucetsRecessedController.getOneRecessed);
router.put('/hindware-faucets-recessed/update/:id', upload.array('photos', 5), HindwareFaucetsRecessedController.updateRecessed);
router.delete('/hindware-faucets-recessed/delete/:id', HindwareFaucetsRecessedController.deleteRecessed);

// hindware-faucets-single-lever-divertor endpoints
router.post('/hindware-faucets-single-lever-divertor/create', upload.array('photos', 5), HindwareFaucetsSingleLeverDivertorController.createSingleLeverDivertor);
router.get('/hindware-faucets-single-lever-divertor/get', HindwareFaucetsSingleLeverDivertorController.getAllSingleLeverDivertor);
router.get('/hindware-faucets-single-lever-divertor/getOne/:id', HindwareFaucetsSingleLeverDivertorController.getOneSingleLeverDivertor);
router.put('/hindware-faucets-single-lever-divertor/update/:id', upload.array('photos', 5), HindwareFaucetsSingleLeverDivertorController.updateSingleLeverDivertor);
router.delete('/hindware-faucets-single-lever-divertor/delete/:id', HindwareFaucetsSingleLeverDivertorController.deleteSingleLeverDivertor);

// hindware-faucets-sink-cock endpoints
router.post('/hindware-faucets-sink-cock/create', upload.array('photos', 5), HindwareFaucetsSinkCockController.createSinkCock);
router.get('/hindware-faucets-sink-cock/get', HindwareFaucetsSinkCockController.getAllSinkCock);
router.get('/hindware-faucets-sink-cock/getOne/:id', HindwareFaucetsSinkCockController.getOneSinkCock);
router.put('/hindware-faucets-sink-cock/update/:id', upload.array('photos', 5), HindwareFaucetsSinkCockController.updateSinkCock);
router.delete('/hindware-faucets-sink-cock/delete/:id', HindwareFaucetsSinkCockController.deleteSinkCock);

// hindware-faucets-sink-mixer endpoints
router.post('/hindware-faucets-sink-mixer/create', upload.array('photos', 5), HindwareFaucetsSinkMixerController.createSinkMixer);
router.get('/hindware-faucets-sink-mixer/get', HindwareFaucetsSinkMixerController.getAllSinkMixer);
router.get('/hindware-faucets-sink-mixer/getOne/:id', HindwareFaucetsSinkMixerController.getOneSinkMixer);
router.put('/hindware-faucets-sink-mixer/update/:id', upload.array('photos', 5), HindwareFaucetsSinkMixerController.updateSinkMixer);
router.delete('/hindware-faucets-sink-mixer/delete/:id', HindwareFaucetsSinkMixerController.deleteSinkMixer);

// hindware-faucets-slbm-faucet endpoints
router.post('/hindware-faucets-slbm-faucet/create', upload.array('photos', 5), HindwareFaucetsSlbmFaucetController.createSlbmFaucet);
router.get('/hindware-faucets-slbm-faucet/get', HindwareFaucetsSlbmFaucetController.getAllSlbmFaucet);
router.get('/hindware-faucets-slbm-faucet/getOne/:id', HindwareFaucetsSlbmFaucetController.getOneSlbmFaucet);
router.put('/hindware-faucets-slbm-faucet/update/:id', upload.array('photos', 5), HindwareFaucetsSlbmFaucetController.updateSlbmFaucet);
router.delete('/hindware-faucets-slbm-faucet/delete/:id', HindwareFaucetsSlbmFaucetController.deleteSlbmFaucet);

// hindware-faucets-slbm-faucet-tall endpoints
router.post('/hindware-faucets-slbm-faucet-tall/create', upload.array('photos', 5), HindwareFaucetsSlbmFaucetTallController.createSlbmFaucetTall);
router.get('/hindware-faucets-slbm-faucet-tall/get', HindwareFaucetsSlbmFaucetTallController.getAllSlbmFaucetTall);
router.get('/hindware-faucets-slbm-faucet-tall/getOne/:id', HindwareFaucetsSlbmFaucetTallController.getOneSlbmFaucetTall);
router.put('/hindware-faucets-slbm-faucet-tall/update/:id', upload.array('photos', 5), HindwareFaucetsSlbmFaucetTallController.updateSlbmFaucetTall);
router.delete('/hindware-faucets-slbm-faucet-tall/delete/:id', HindwareFaucetsSlbmFaucetTallController.deleteSlbmFaucetTall);

// hindware-faucets-wall-mixer endpoints
router.post('/hindware-faucets-wall-mixer/create', upload.array('photos', 5), HindwareFaucetsWallMixerController.createWallMixer);
router.get('/hindware-faucets-wall-mixer/get', HindwareFaucetsWallMixerController.getAllWallMixer);
router.get('/hindware-faucets-wall-mixer/getOne/:id', HindwareFaucetsWallMixerController.getOneWallMixer);
router.put('/hindware-faucets-wall-mixer/update/:id', upload.array('photos', 5), HindwareFaucetsWallMixerController.updateWallMixer);
router.delete('/hindware-faucets-wall-mixer/delete/:id', HindwareFaucetsWallMixerController.deleteWallMixer);

// hindware-showers-rain-showers endpoints
router.post('/hindware-showers-rain-showers/create', upload.array('photos', 5), HindwareShowersRainShowersController.createRainShowers);
router.get('/hindware-showers-rain-showers/get', HindwareShowersRainShowersController.getAllRainShowers);
router.get('/hindware-showers-rain-showers/getOne/:id', HindwareShowersRainShowersController.getOneRainShowers);
router.put('/hindware-showers-rain-showers/update/:id', upload.array('photos', 5), HindwareShowersRainShowersController.updateRainShowers);
router.delete('/hindware-showers-rain-showers/delete/:id', HindwareShowersRainShowersController.deleteRainShowers);

// hindware-wash-basins endpoints
router.post('/hindware-wash-basins/create', upload.array('photos', 5), HindwareWashBasinsController.createWashBasins);
router.get('/hindware-wash-basins/get', HindwareWashBasinsController.getAllWashBasins);
router.get('/hindware-wash-basins/getOne/:id', HindwareWashBasinsController.getOneWashBasins);
router.put('/hindware-wash-basins/update/:id', upload.array('photos', 5), HindwareWashBasinsController.updateWashBasins);
router.delete('/hindware-wash-basins/delete/:id', HindwareWashBasinsController.deleteWashBasins);

// hindware-water-closets endpoints
router.post('/hindware-water-closets/create', upload.array('photos', 5), HindwareWaterClosetsController.createWaterClosets);
router.get('/hindware-water-closets/get', HindwareWaterClosetsController.getAllWaterClosets);
router.get('/hindware-water-closets/getOne/:id', HindwareWaterClosetsController.getOneWaterClosets);
router.put('/hindware-water-closets/update/:id', upload.array('photos', 5), HindwareWaterClosetsController.updateWaterClosets);
router.delete('/hindware-water-closets/delete/:id', HindwareWaterClosetsController.deleteWaterClosets);

// jaquar endpoints
router.post('/jaquar/create', upload.array('photos', 5), jaquarController.createJaquar);
router.get('/jaquar/get', jaquarController.getAllJaquar);
router.get('/jaquar/getOne/:id', jaquarController.getOneJaquar);
router.put('/jaquar/update/:id', upload.array('photos', 5), jaquarController.updateJaquar);
router.delete('/jaquar/delete/:id', jaquarController.deleteJaquar);

// kitchen-sinks endpoints
router.post('/kitchen-sinks/create', upload.array('photos', 5), kitchenSinksController.createKitchenSinks);
router.get('/kitchen-sinks/get', kitchenSinksController.getAllKitchenSinks);
router.get('/kitchen-sinks/getOne/:id', kitchenSinksController.getOneKitchenSinks);
router.put('/kitchen-sinks/update/:id', upload.array('photos', 5), kitchenSinksController.updateKitchenSinks);
router.delete('/kitchen-sinks/delete/:id', kitchenSinksController.deleteKitchenSinks);

// leo-bath-fittings-bathroom-accessories-bathroom-accessories endpoints
router.post('/leo-bath-fittings-bathroom-accessories-bathroom-accessories/create', upload.array('photos', 5), LeoBathFittingsBathroomAccessoriesBathroomAccessoriesController.createBathroomAccessories);
router.get('/leo-bath-fittings-bathroom-accessories-bathroom-accessories/get', LeoBathFittingsBathroomAccessoriesBathroomAccessoriesController.getAllBathroomAccessories);
router.get('/leo-bath-fittings-bathroom-accessories-bathroom-accessories/getOne/:id', LeoBathFittingsBathroomAccessoriesBathroomAccessoriesController.getOneBathroomAccessories);
router.put('/leo-bath-fittings-bathroom-accessories-bathroom-accessories/update/:id', upload.array('photos', 5), LeoBathFittingsBathroomAccessoriesBathroomAccessoriesController.updateBathroomAccessories);
router.delete('/leo-bath-fittings-bathroom-accessories-bathroom-accessories/delete/:id', LeoBathFittingsBathroomAccessoriesBathroomAccessoriesController.deleteBathroomAccessories);

// leo-bath-fittings-faucets-faucets endpoints
router.post('/leo-bath-fittings-faucets/create', upload.array('photos', 5), LeoBathFittingsFaucetsFaucetsController.createFaucets);
router.get('/leo-bath-fittings-faucets/get', LeoBathFittingsFaucetsFaucetsController.getAllFaucets);
router.get('/leo-bath-fittings-faucets/getOne/:id', LeoBathFittingsFaucetsFaucetsController.getOneFaucets);
router.put('/leo-bath-fittings-faucets/update/:id', upload.array('photos', 5), LeoBathFittingsFaucetsFaucetsController.updateFaucets);
router.delete('/leo-bath-fittings-faucets/delete/:id', LeoBathFittingsFaucetsFaucetsController.deleteFaucets);

// leo-bath-fittings-valve-valve endpoints
router.post('/leo-bath-fittings-valve/create', upload.array('photos', 5), LeoBathFittingsValveValveController.createValve);
router.get('/leo-bath-fittings-valve/get', LeoBathFittingsValveValveController.getAllValve);
router.get('/leo-bath-fittings-valve/getOne/:id', LeoBathFittingsValveValveController.getOneValve);
router.put('/leo-bath-fittings-valve/update/:id', upload.array('photos', 5), LeoBathFittingsValveValveController.updateValve);
router.delete('/leo-bath-fittings-valve/delete/:id', LeoBathFittingsValveValveController.deleteValve);

// pamay-faucets-faucets endpoints
router.post('/pamay-faucets-faucets/create', upload.array('photos', 5), PamayFaucetsFaucetsController.createFaucets);
router.get('/pamay-faucets-faucets/get', PamayFaucetsFaucetsController.getAllFaucets);
router.get('/pamay-faucets-faucets/getOne/:id', PamayFaucetsFaucetsController.getOneFaucets);
router.put('/pamay-faucets-faucets/update/:id', upload.array('photos', 5), PamayFaucetsFaucetsController.updateFaucets);
router.delete('/pamay-faucets-faucets/delete/:id', PamayFaucetsFaucetsController.deleteFaucets);

// pamay-showers-showers endpoints
router.post('/pamay-showers-showers/create', upload.array('photos', 5), PamayShowersShowersController.createShowers);
router.get('/pamay-showers-showers/get', PamayShowersShowersController.getAllShowers);
router.get('/pamay-showers-showers/getOne/:id', PamayShowersShowersController.getOneShowers);
router.put('/pamay-showers-showers/update/:id', upload.array('photos', 5), PamayShowersShowersController.updateShowers);
router.delete('/pamay-showers-showers/delete/:id', PamayShowersShowersController.deleteShowers);

// parryware-accessories-accessories endpoints
router.post('/parryware-accessories-accessories/create', upload.array('photos', 5), parrywareAccessoriesAccessoriesController.createAccessories);
router.get('/parryware-accessories-accessories/get', parrywareAccessoriesAccessoriesController.getAllAccessories);
router.get('/parryware-accessories-accessories/getOne/:id', parrywareAccessoriesAccessoriesController.getOneAccessories);
router.put('/parryware-accessories-accessories/update/:id', upload.array('photos', 5), parrywareAccessoriesAccessoriesController.updateAccessories);
router.delete('/parryware-accessories-accessories/delete/:id', parrywareAccessoriesAccessoriesController.deleteAccessories);

// parryware-angle-valves-angle-valves endpoints
router.post('/parryware-angle-valves-angle-valves/create', upload.array('photos', 5), parrywareAngleValvesAngleValvesController.createAngleValves);
router.get('/parryware-angle-valves-angle-valves/get', parrywareAngleValvesAngleValvesController.getAllAngleValves);
router.get('/parryware-angle-valves-angle-valves/getOne/:id', parrywareAngleValvesAngleValvesController.getOneAngleValves);
router.put('/parryware-angle-valves-angle-valves/update/:id', upload.array('photos', 5), parrywareAngleValvesAngleValvesController.updateAngleValves);
router.delete('/parryware-angle-valves-angle-valves/delete/:id', parrywareAngleValvesAngleValvesController.deleteAngleValves);

// parryware-below-counter-basins-below-counter-basins endpoints
router.post('/parryware-below-counter-basins-below-counter-basins/create', upload.array('photos', 5), parrywareBelowCounterBasinsBelowCounterBasinsController.createBelowCounterBasins);
router.get('/parryware-below-counter-basins-below-counter-basins/get', parrywareBelowCounterBasinsBelowCounterBasinsController.getAllBelowCounterBasins);
router.get('/parryware-below-counter-basins-below-counter-basins/getOne/:id', parrywareBelowCounterBasinsBelowCounterBasinsController.getOneBelowCounterBasins);
router.put('/parryware-below-counter-basins-below-counter-basins/update/:id', upload.array('photos', 5), parrywareBelowCounterBasinsBelowCounterBasinsController.updateBelowCounterBasins);
router.delete('/parryware-below-counter-basins-below-counter-basins/delete/:id', parrywareBelowCounterBasinsBelowCounterBasinsController.deleteBelowCounterBasins);

// parryware-bowl-basins-bowl-basins endpoints
router.post('/parryware-bowl-basins-bowl-basins/create', upload.array('photos', 5), parrywareBowlBasinsBowlBasinsController.createBowlBasins);
router.get('/parryware-bowl-basins-bowl-basins/get', parrywareBowlBasinsBowlBasinsController.getAllBowlBasins);
router.get('/parryware-bowl-basins-bowl-basins/getOne/:id', parrywareBowlBasinsBowlBasinsController.getOneBowlBasins);
router.put('/parryware-bowl-basins-bowl-basins/update/:id', upload.array('photos', 5), parrywareBowlBasinsBowlBasinsController.updateBowlBasins);
router.delete('/parryware-bowl-basins-bowl-basins/delete/:id', parrywareBowlBasinsBowlBasinsController.deleteBowlBasins);

// parryware-c-l-o-s-e-t-s-closets endpoints
router.post('/parryware-closets-closets/create', upload.array('photos', 5), parrywareCLOSETSClosetsController.createClosets);
router.get('/parryware-closets-closets/get', parrywareCLOSETSClosetsController.getAllClosets);
router.get('/parryware-closets-closets/getOne/:id', parrywareCLOSETSClosetsController.getOneClosets);
router.put('/parryware-closets-closets/update/:id', upload.array('photos', 5), parrywareCLOSETSClosetsController.updateClosets);
router.delete('/parryware-closets-closets/delete/:id', parrywareCLOSETSClosetsController.deleteClosets);

// parryware-concealed-cistern-concealed-cistern endpoints
router.post('/parryware-concealed-cistern-concealed-cistern/create', upload.array('photos', 5), parrywareConcealedCisternConcealedCisternController.createConcealedCistern);
router.get('/parryware-concealed-cistern-concealed-cistern/get', parrywareConcealedCisternConcealedCisternController.getAllConcealedCistern);
router.get('/parryware-concealed-cistern-concealed-cistern/getOne/:id', parrywareConcealedCisternConcealedCisternController.getOneConcealedCistern);
router.put('/parryware-concealed-cistern-concealed-cistern/update/:id', upload.array('photos', 5), parrywareConcealedCisternConcealedCisternController.updateConcealedCistern);
router.delete('/parryware-concealed-cistern-concealed-cistern/delete/:id', parrywareConcealedCisternConcealedCisternController.deleteConcealedCistern);

// parryware-european-water-closet-european-water-closet endpoints
router.post('/parryware-european-water-closet-european-water-closet/create', upload.array('photos', 5), parrywareEuropeanWaterClosetEuropeanWaterClosetController.createEuropeanWaterCloset);
router.get('/parryware-european-water-closet-european-water-closet/get', parrywareEuropeanWaterClosetEuropeanWaterClosetController.getAllEuropeanWaterCloset);
router.get('/parryware-european-water-closet-european-water-closet/getOne/:id', parrywareEuropeanWaterClosetEuropeanWaterClosetController.getOneEuropeanWaterCloset);
router.put('/parryware-european-water-closet-european-water-closet/update/:id', upload.array('photos', 5), parrywareEuropeanWaterClosetEuropeanWaterClosetController.updateEuropeanWaterCloset);
router.delete('/parryware-european-water-closet-european-water-closet/delete/:id', parrywareEuropeanWaterClosetEuropeanWaterClosetController.deleteEuropeanWaterCloset);

// parryware-f-a-u-c-e-t-s-flush-cocks endpoints
router.post('/parryware-faucets-flush-cocks/create', upload.array('photos', 5), parrywareFAUCETSFlushCocksController.createFlushCocks);
router.get('/parryware-faucets-flush-cocks/get', parrywareFAUCETSFlushCocksController.getAllFlushCocks);
router.get('/parryware-faucets-flush-cocks/getOne/:id', parrywareFAUCETSFlushCocksController.getOneFlushCocks);
router.put('/parryware-faucets-flush-cocks/update/:id', upload.array('photos', 5), parrywareFAUCETSFlushCocksController.updateFlushCocks);
router.delete('/parryware-faucets-flush-cocks/delete/:id', parrywareFAUCETSFlushCocksController.deleteFlushCocks);

// parryware-faucets-flush-valve endpoints
router.post('/parryware-faucets-flush-valve/create', upload.array('photos', 5), parrywareFAUCETSFlushValveController.createFlushValve);
router.get('/parryware-faucets-flush-valve/get', parrywareFAUCETSFlushValveController.getAllFlushValve);
router.get('/parryware-faucets-flush-valve/getOne/:id', parrywareFAUCETSFlushValveController.getOneFlushValve);
router.put('/parryware-faucets-flush-valve/update/:id', upload.array('photos', 5), parrywareFAUCETSFlushValveController.updateFlushValve);
router.delete('/parryware-faucets-flush-valve/delete/:id', parrywareFAUCETSFlushValveController.deleteFlushValve);

// parrywarefaucetshealth-faucets endpoints
router.post('/parryware-faucets-health-faucets/create', upload.array('photos', 5), parrywareFAUCETSHealthFaucetsController.createHealthFaucets);
router.get('/parryware-faucets-health-faucets/get', parrywareFAUCETSHealthFaucetsController.getAllHealthFaucets);
router.get('/parryware-faucets-health-faucets/getOne/:id', parrywareFAUCETSHealthFaucetsController.getOneHealthFaucets);
router.put('/parryware-faucets-health-faucets/update/:id', upload.array('photos', 5), parrywareFAUCETSHealthFaucetsController.updateHealthFaucets);
router.delete('/parryware-faucets-health-faucets/delete/:id', parrywareFAUCETSHealthFaucetsController.deleteHealthFaucets);

// parrywarefaucetskitchen-sinks endpoints
router.post('/parryware-faucets-kitchen-sinks/create', upload.array('photos', 5), parrywareFAUCETSKitchenSinksController.createKitchenSinks);
router.get('/parryware-faucets-kitchen-sinks/get', parrywareFAUCETSKitchenSinksController.getAllKitchenSinks);
router.get('/parryware-faucets-kitchen-sinks/getOne/:id', parrywareFAUCETSKitchenSinksController.getOneKitchenSinks);
router.put('/parryware-faucets-kitchen-sinks/update/:id', upload.array('photos', 5), parrywareFAUCETSKitchenSinksController.updateKitchenSinks);
router.delete('/parryware-faucets-kitchen-sinks/delete/:id', parrywareFAUCETSKitchenSinksController.deleteKitchenSinks);

// parrywarefaucetspedestals endpoints
router.post('/parryware-faucets-pedestals/create', upload.array('photos', 5), parrywareFAUCETSPedestalsController.createPedestals);
router.get('/parryware-faucets-pedestals/get', parrywareFAUCETSPedestalsController.getAllPedestals);
router.get('/parryware-faucets-pedestals/getOne/:id', parrywareFAUCETSPedestalsController.getOnePedestals);
router.put('/parryware-faucets-pedestals/update/:id', upload.array('photos', 5), parrywareFAUCETSPedestalsController.updatePedestals);
router.delete('/parryware-faucets-pedestals/delete/:id', parrywareFAUCETSPedestalsController.deletePedestals);

// parryware-polymer-cisterns-polymer-cisterns endpoints
router.post('/parryware-polymer-cisterns-polymer-cisterns/create', upload.array('photos', 5), parrywarePolymerCisternsPolymerCisternsController.createPolymerCisterns);
router.get('/parryware-polymer-cisterns-polymer-cisterns/get', parrywarePolymerCisternsPolymerCisternsController.getAllPolymerCisterns);
router.get('/parryware-polymer-cisterns-polymer-cisterns/getOne/:id', parrywarePolymerCisternsPolymerCisternsController.getOnePolymerCisterns);
router.put('/parryware-polymer-cisterns-polymer-cisterns/update/:id', upload.array('photos', 5), parrywarePolymerCisternsPolymerCisternsController.updatePolymerCisterns);
router.delete('/parryware-polymer-cisterns-polymer-cisterns/delete/:id', parrywarePolymerCisternsPolymerCisternsController.deletePolymerCisterns);

// parryware-push-plates-push-plates endpoints
router.post('/parryware-push-plates-push-plates/create', upload.array('photos', 5), parrywarePushPlatesPushPlatesController.createPushPlates);
router.get('/parryware-push-plates-push-plates/get', parrywarePushPlatesPushPlatesController.getAllPushPlates);
router.get('/parryware-push-plates-push-plates/getOne/:id', parrywarePushPlatesPushPlatesController.getOnePushPlates);
router.put('/parryware-push-plates-push-plates/update/:id', upload.array('photos', 5), parrywarePushPlatesPushPlatesController.updatePushPlates);
router.delete('/parryware-push-plates-push-plates/delete/:id', parrywarePushPlatesPushPlatesController.deletePushPlates);

// parryware-seat-covers-seat-covers endpoints
router.post('/parryware-seat-covers-seat-covers/create', upload.array('photos', 5), parrywareSeatCoversSeatCoversController.createSeatCovers);
router.get('/parryware-seat-covers-seat-covers/get', parrywareSeatCoversSeatCoversController.getAllSeatCovers);
router.get('/parryware-seat-covers-seat-covers/getOne/:id', parrywareSeatCoversSeatCoversController.getOneSeatCovers);
router.put('/parryware-seat-covers-seat-covers/update/:id', upload.array('photos', 5), parrywareSeatCoversSeatCoversController.updateSeatCovers);
router.delete('/parryware-seat-covers-seat-covers/delete/:id', parrywareSeatCoversSeatCoversController.deleteSeatCovers);

// parryware-semi-recessed-basins-semi-recessed-basins endpoints
router.post('/parryware-semi-recessed-basins-semi-recessed-basins/create', upload.array('photos', 5), parrywareSemiRecessedBasinsSemiRecessedBasinsController.createSemiRecessedBasins);
router.get('/parryware-semi-recessed-basins-semi-recessed-basins/get', parrywareSemiRecessedBasinsSemiRecessedBasinsController.getAllSemiRecessedBasins);
router.get('/parryware-semi-recessed-basins-semi-recessed-basins/getOne/:id', parrywareSemiRecessedBasinsSemiRecessedBasinsController.getOneSemiRecessedBasins);
router.put('/parryware-semi-recessed-basins-semi-recessed-basins/update/:id', upload.array('photos', 5), parrywareSemiRecessedBasinsSemiRecessedBasinsController.updateSemiRecessedBasins);
router.delete('/parryware-semi-recessed-basins-semi-recessed-basins/delete/:id', parrywareSemiRecessedBasinsSemiRecessedBasinsController.deleteSemiRecessedBasins);

// parryware-shower-enclosures-shower-enclosures endpoints
router.post('/parryware-shower-enclosures-shower-enclosures/create', upload.array('photos', 5), parrywareShowerEnclosuresShowerEnclosuresController.createShowerEnclosures);
router.get('/parryware-shower-enclosures-shower-enclosures/get', parrywareShowerEnclosuresShowerEnclosuresController.getAllShowerEnclosures);
router.get('/parryware-shower-enclosures-shower-enclosures/getOne/:id', parrywareShowerEnclosuresShowerEnclosuresController.getOneShowerEnclosures);
router.put('/parryware-shower-enclosures-shower-enclosures/update/:id', upload.array('photos', 5), parrywareShowerEnclosuresShowerEnclosuresController.updateShowerEnclosures);
router.delete('/parryware-shower-enclosures-shower-enclosures/delete/:id', parrywareShowerEnclosuresShowerEnclosuresController.deleteShowerEnclosures);

// parryware-shower-panels-shower-panels endpoints
router.post('/parryware-shower-panels-shower-panels/create', upload.array('photos', 5), parrywareShowerPanelsShowerPanelsController.createShowerPanels);
router.get('/parryware-shower-panels-shower-panels/get', parrywareShowerPanelsShowerPanelsController.getAllShowerPanels);
router.get('/parryware-shower-panels-shower-panels/getOne/:id', parrywareShowerPanelsShowerPanelsController.getOneShowerPanels);
router.put('/parryware-shower-panels-shower-panels/update/:id', upload.array('photos', 5), parrywareShowerPanelsShowerPanelsController.updateShowerPanels);
router.delete('/parryware-shower-panels-shower-panels/delete/:id', parrywareShowerPanelsShowerPanelsController.deleteShowerPanels);

// parryware-showers-showers endpoints
router.post('/parryware-showers-showers/create', upload.array('photos', 5), parrywareShowersShowersController.createShowers);
router.get('/parryware-showers-showers/get', parrywareShowersShowersController.getAllShowers);
router.get('/parryware-showers-showers/getOne/:id', parrywareShowersShowersController.getOneShowers);
router.put('/parryware-showers-showers/update/:id', upload.array('photos', 5), parrywareShowersShowersController.updateShowers);
router.delete('/parryware-showers-showers/delete/:id', parrywareShowersShowersController.deleteShowers);

// parryware-utsav-range-utsav-range endpoints
router.post('/parryware-utsav-range-utsav-range/create', upload.array('photos', 5), parrywareUtsavRangeUtsavRangeController.createUtsavRange);
router.get('/parryware-utsav-range-utsav-range/get', parrywareUtsavRangeUtsavRangeController.getAllUtsavRange);
router.get('/parryware-utsav-range-utsav-range/getOne/:id', parrywareUtsavRangeUtsavRangeController.getOneUtsavRange);
router.put('/parryware-utsav-range-utsav-range/update/:id', upload.array('photos', 5), parrywareUtsavRangeUtsavRangeController.updateUtsavRange);
router.delete('/parryware-utsav-range-utsav-range/delete/:id', parrywareUtsavRangeUtsavRangeController.deleteUtsavRange);

// parryware-wash-basins-wash-basins endpoints
router.post('/parryware-wash-basins-wash-basins/create', upload.array('photos', 5), parrywareWashBasinsWashBasinsController.createWashBasins);
router.get('/parryware-wash-basins-wash-basins/get', parrywareWashBasinsWashBasinsController.getAllWashBasins);
router.get('/parryware-wash-basins-wash-basins/getOne/:id', parrywareWashBasinsWashBasinsController.getOneWashBasins);
router.put('/parryware-wash-basins-wash-basins/update/:id', upload.array('photos', 5), parrywareWashBasinsWashBasinsController.updateWashBasins);
router.delete('/parryware-wash-basins-wash-basins/delete/:id', parrywareWashBasinsWashBasinsController.deleteWashBasins);

// parryware-waste-coupling-waste-coupling endpoints
router.post('/parryware-waste-coupling-waste-coupling/create', upload.array('photos', 5), parrywareWasteCouplingWasteCouplingController.createWasteCoupling);
router.get('/parryware-waste-coupling-waste-coupling/get', parrywareWasteCouplingWasteCouplingController.getAllWasteCoupling);
router.get('/parryware-waste-coupling-waste-coupling/getOne/:id', parrywareWasteCouplingWasteCouplingController.getOneWasteCoupling);
router.put('/parryware-waste-coupling-waste-coupling/update/:id', upload.array('photos', 5), parrywareWasteCouplingWasteCouplingController.updateWasteCoupling);
router.delete('/parryware-waste-coupling-waste-coupling/delete/:id', parrywareWasteCouplingWasteCouplingController.deleteWasteCoupling);

// parryware-water-heaters-water-heaters endpoints
router.post('/parryware-water-heaters-water-heaters/create', upload.array('photos', 5), parrywareWaterHeatersWaterHeatersController.createWaterHeaters);
router.get('/parryware-water-heaters-water-heaters/get', parrywareWaterHeatersWaterHeatersController.getAllWaterHeaters);
router.get('/parryware-water-heaters-water-heaters/getOne/:id', parrywareWaterHeatersWaterHeatersController.getOneWaterHeaters);
router.put('/parryware-water-heaters-water-heaters/update/:id', upload.array('photos', 5), parrywareWaterHeatersWaterHeatersController.updateWaterHeaters);
router.delete('/parryware-water-heaters-water-heaters/delete/:id', parrywareWaterHeatersWaterHeatersController.deleteWaterHeaters);

// pearl-precious-products-edge-edge endpoints
router.post('/pearl-precious-products-edge-edge/create', upload.array('photos', 5), PearlPreciousProductsEdgeEdgeController.createEdge);
router.get('/pearl-precious-products-edge-edge/get', PearlPreciousProductsEdgeEdgeController.getAllEdge);
router.get('/pearl-precious-products-edge-edge/getOne/:id', PearlPreciousProductsEdgeEdgeController.getOneEdge);
router.put('/pearl-precious-products-edge-edge/update/:id', upload.array('photos', 5), PearlPreciousProductsEdgeEdgeController.updateEdge);
router.delete('/pearl-precious-products-edge-edge/delete/:id', PearlPreciousProductsEdgeEdgeController.deleteEdge);

// showers endpoints
router.post('/showers/create', upload.array('photos', 5), showersController.createShowers);
router.get('/showers/get', showersController.getAllShowers);
router.get('/showers/getOne/:id', showersController.getOneShowers);
router.put('/showers/update/:id', upload.array('photos', 5), showersController.updateShowers);
router.delete('/showers/delete/:id', showersController.deleteShowers);

// taps endpoints
router.post('/taps/create', upload.array('photos', 5), tapsController.createTaps);
router.get('/taps/get', tapsController.getAllTaps);
router.get('/taps/getOne/:id', tapsController.getOneTaps);
router.put('/taps/update/:id', upload.array('photos', 5), tapsController.updateTaps);
router.delete('/taps/delete/:id', tapsController.deleteTaps);

// washbasins endpoints
router.post('/washbasins/create', upload.array('photos', 5), washbasinsController.createWashBasins);
router.get('/washbasins/get', washbasinsController.getAllWashBasins);
router.get('/washbasins/getOne/:id', washbasinsController.getOneWashBasins);
router.put('/washbasins/update/:id', upload.array('photos', 5), washbasinsController.updateWashBasins);
router.delete('/washbasins/delete/:id', washbasinsController.deleteWashBasins);

// waterman-accessories endpoints
router.post('/waterman-accessories/create', upload.array('photos', 5), WatermanAccessoriesController.createAccessories);
router.get('/waterman-accessories/get', WatermanAccessoriesController.getAllAccessories);
router.get('/waterman-accessories/getOne/:id', WatermanAccessoriesController.getOneAccessories);
router.put('/waterman-accessories/update/:id', upload.array('photos', 5), WatermanAccessoriesController.updateAccessories);
router.delete('/waterman-accessories/delete/:id', WatermanAccessoriesController.deleteAccessories);

// waterman-aria endpoints
router.post('/waterman-aria/create', upload.array('photos', 5), WatermanAriaController.createAria);
router.get('/waterman-aria/get', WatermanAriaController.getAllAria);
router.get('/waterman-aria/getOne/:id', WatermanAriaController.getOneAria);
router.put('/waterman-aria/update/:id', upload.array('photos', 5), WatermanAriaController.updateAria);
router.delete('/waterman-aria/delete/:id', WatermanAriaController.deleteAria);

// waterman-aura endpoints
router.post('/waterman-aura/create', upload.array('photos', 5), WatermanAuraController.createAura);
router.get('/waterman-aura/get', WatermanAuraController.getAllAura);
router.get('/waterman-aura/getOne/:id', WatermanAuraController.getOneAura);
router.put('/waterman-aura/update/:id', upload.array('photos', 5), WatermanAuraController.updateAura);
router.delete('/waterman-aura/delete/:id', WatermanAuraController.deleteAura);

// waterman-dell endpoints
router.post('/waterman-dell/create', upload.array('photos', 5), WatermanDellController.createDell);
router.get('/waterman-dell/get', WatermanDellController.getAllDell);
router.get('/waterman-dell/getOne/:id', WatermanDellController.getOneDell);
router.put('/waterman-dell/update/:id', upload.array('photos', 5), WatermanDellController.updateDell);
router.delete('/waterman-dell/delete/:id', WatermanDellController.deleteDell);

// waterman-deluxe endpoints
router.post('/waterman-deluxe/create', upload.array('photos', 5), WatermanDeluxeController.createDeluxe);
router.get('/waterman-deluxe/get', WatermanDeluxeController.getAllDeluxe);
router.get('/waterman-deluxe/getOne/:id', WatermanDeluxeController.getOneDeluxe);
router.put('/waterman-deluxe/update/:id', upload.array('photos', 5), WatermanDeluxeController.updateDeluxe);
router.delete('/waterman-deluxe/delete/:id', WatermanDeluxeController.deleteDeluxe);

// waterman-eco endpoints
router.post('/waterman-eco/create', upload.array('photos', 5), WatermanEcoController.createEco);
router.get('/waterman-eco/get', WatermanEcoController.getAllEco);
router.get('/waterman-eco/getOne/:id', WatermanEcoController.getOneEco);
router.put('/waterman-eco/update/:id', upload.array('photos', 5), WatermanEcoController.updateEco);
router.delete('/waterman-eco/delete/:id', WatermanEcoController.deleteEco);

// waterman-evoque endpoints
router.post('/waterman-evoque/create', upload.array('photos', 5), WatermanEvoqueController.createEvoque);
router.get('/waterman-evoque/get', WatermanEvoqueController.getAllEvoque);
router.get('/waterman-evoque/getOne/:id', WatermanEvoqueController.getOneEvoque);
router.put('/waterman-evoque/update/:id', upload.array('photos', 5), WatermanEvoqueController.updateEvoque);
router.delete('/waterman-evoque/delete/:id', WatermanEvoqueController.deleteEvoque);

// waterman-hand-showers endpoints
router.post('/waterman-hand-showers/create', upload.array('photos', 5), WatermanHandShowersController.createHandShowers);
router.get('/waterman-hand-showers/get', WatermanHandShowersController.getAllHandShowers);
router.get('/waterman-hand-showers/getOne/:id', WatermanHandShowersController.getOneHandShowers);
router.put('/waterman-hand-showers/update/:id', upload.array('photos', 5), WatermanHandShowersController.updateHandShowers);
router.delete('/waterman-hand-showers/delete/:id', WatermanHandShowersController.deleteHandShowers);

// waterman-health-faucet-abs endpoints
router.post('/waterman-health-faucet-abs/create', upload.array('photos', 5), WatermanHealthFaucetAbsController.createHealthFaucetAbs);
router.get('/waterman-health-faucet-abs/get', WatermanHealthFaucetAbsController.getAllHealthFaucetAbs);
router.get('/waterman-health-faucet-abs/getOne/:id', WatermanHealthFaucetAbsController.getOneHealthFaucetAbs);
router.put('/waterman-health-faucet-abs/update/:id', upload.array('photos', 5), WatermanHealthFaucetAbsController.updateHealthFaucetAbs);
router.delete('/waterman-health-faucet-abs/delete/:id', WatermanHealthFaucetAbsController.deleteHealthFaucetAbs);

// waterman-health-faucets-brass endpoints
router.post('/waterman-health-faucets-brass/create', upload.array('photos', 5), WatermanHealthFaucetsBrassController.createHealthFaucetsBrass);
router.get('/waterman-health-faucets-brass/get', WatermanHealthFaucetsBrassController.getAllHealthFaucetsBrass);
router.get('/waterman-health-faucets-brass/getOne/:id', WatermanHealthFaucetsBrassController.getOneHealthFaucetsBrass);
router.put('/waterman-health-faucets-brass/update/:id', upload.array('photos', 5), WatermanHealthFaucetsBrassController.updateHealthFaucetsBrass);
router.delete('/waterman-health-faucets-brass/delete/:id', WatermanHealthFaucetsBrassController.deleteHealthFaucetsBrass);

// waterman-ikon endpoints
router.post('/waterman-ikon/create', upload.array('photos', 5), WatermanIkonController.createIkon);
router.get('/waterman-ikon/get', WatermanIkonController.getAllIkon);
router.get('/waterman-ikon/getOne/:id', WatermanIkonController.getOneIkon);
router.put('/waterman-ikon/update/:id', upload.array('photos', 5), WatermanIkonController.updateIkon);
router.delete('/waterman-ikon/delete/:id', WatermanIkonController.deleteIkon);

// waterman-rain-showers endpoints
router.post('/waterman-rain-showers/create', upload.array('photos', 5), WatermanRainShowersController.createRainShowers);
router.get('/waterman-rain-showers/get', WatermanRainShowersController.getAllRainShowers);
router.get('/waterman-rain-showers/getOne/:id', WatermanRainShowersController.getOneRainShowers);
router.put('/waterman-rain-showers/update/:id', upload.array('photos', 5), WatermanRainShowersController.updateRainShowers);
router.delete('/waterman-rain-showers/delete/:id', WatermanRainShowersController.deleteRainShowers);

// waterman-roman endpoints
router.post('/waterman-roman/create', upload.array('photos', 5), WatermanRomanController.createRoman);
router.get('/waterman-roman/get', WatermanRomanController.getAllRoman);
router.get('/waterman-roman/getOne/:id', WatermanRomanController.getOneRoman);
router.put('/waterman-roman/update/:id', upload.array('photos', 5), WatermanRomanController.updateRoman);
router.delete('/waterman-roman/delete/:id', WatermanRomanController.deleteRoman);

// waterman-shower-tubes endpoints
router.post('/waterman-shower-tubes/create', upload.array('photos', 5), WatermanShowerTubesController.createShowerTubes);
router.get('/waterman-shower-tubes/get', WatermanShowerTubesController.getAllShowerTubes);
router.get('/waterman-shower-tubes/getOne/:id', WatermanShowerTubesController.getOneShowerTubes);
router.put('/waterman-shower-tubes/update/:id', upload.array('photos', 5), WatermanShowerTubesController.updateShowerTubes);
router.delete('/waterman-shower-tubes/delete/:id', WatermanShowerTubesController.deleteShowerTubes);

// waterman-wall-showers-with-arm endpoints
router.post('/waterman-wall-showers-with-arm/create', upload.array('photos', 5), WatermanWallShowersWithArmController.createWallShowersWithArm);
router.get('/waterman-wall-showers-with-arm/get', WatermanWallShowersWithArmController.getAllWallShowersWithArm);
router.get('/waterman-wall-showers-with-arm/getOne/:id', WatermanWallShowersWithArmController.getOneWallShowersWithArm);
router.put('/waterman-wall-showers-with-arm/update/:id', upload.array('photos', 5), WatermanWallShowersWithArmController.updateWallShowersWithArm);
router.delete('/waterman-wall-showers-with-arm/delete/:id', WatermanWallShowersWithArmController.deleteWallShowersWithArm);

// waterman-wall-showers-without-arm endpoints
router.post('/waterman-wall-showers-without-arm/create', upload.array('photos', 5), WatermanWallShowersWithoutArmController.createWallShowersWithoutArm);
router.get('/waterman-wall-showers-without-arm/get', WatermanWallShowersWithoutArmController.getAllWallShowersWithoutArm);
router.get('/waterman-wall-showers-without-arm/getOne/:id', WatermanWallShowersWithoutArmController.getOneWallShowersWithoutArm);
router.put('/waterman-wall-showers-without-arm/update/:id', upload.array('photos', 5), WatermanWallShowersWithoutArmController.updateWallShowersWithoutArm);
router.delete('/waterman-wall-showers-without-arm/delete/:id', WatermanWallShowersWithoutArmController.deleteWallShowersWithoutArm);

// water-tec-allied endpoints
router.post('/water-tec-allied/create', upload.array('photos', 5), WaterTecAlliedController.createAllied);
router.get('/water-tec-allied/get', WaterTecAlliedController.getAllAllied);
router.get('/water-tec-allied/getOne/:id', WaterTecAlliedController.getOneAllied);
router.put('/water-tec-allied/update/:id', upload.array('photos', 5), WaterTecAlliedController.updateAllied);
router.delete('/water-tec-allied/delete/:id', WaterTecAlliedController.deleteAllied);

// water-tec-aqua endpoints
router.post('/water-tec-aqua/create', upload.array('photos', 5), WaterTecAquaController.createAqua);
router.get('/water-tec-aqua/get', WaterTecAquaController.getAllAqua);
router.get('/water-tec-aqua/getOne/:id', WaterTecAquaController.getOneAqua);
router.put('/water-tec-aqua/update/:id', upload.array('photos', 5), WaterTecAquaController.updateAqua);
router.delete('/water-tec-aqua/delete/:id', WaterTecAquaController.deleteAqua);

// water-tec-aspire endpoints
router.post('/water-tec-aspire/create', upload.array('photos', 5), WaterTecAspireController.createAspire);
router.get('/water-tec-aspire/get', WaterTecAspireController.getAllAspire);
router.get('/water-tec-aspire/getOne/:id', WaterTecAspireController.getOneAspire);
router.put('/water-tec-aspire/update/:id', upload.array('photos', 5), WaterTecAspireController.updateAspire);
router.delete('/water-tec-aspire/delete/:id', WaterTecAspireController.deleteAspire);

// water-tec-bathroom-accessories endpoints
router.post('/water-tec-bathroom-accessories/create', upload.array('photos', 5), WaterTecBathroomAccessoriesController.createBathroomAccessories);
router.get('/water-tec-bathroom-accessories/get', WaterTecBathroomAccessoriesController.getAllBathroomAccessories);
router.get('/water-tec-bathroom-accessories/getOne/:id', WaterTecBathroomAccessoriesController.getOneBathroomAccessories);
router.put('/water-tec-bathroom-accessories/update/:id', upload.array('photos', 5), WaterTecBathroomAccessoriesController.updateBathroomAccessories);
router.delete('/water-tec-bathroom-accessories/delete/:id', WaterTecBathroomAccessoriesController.deleteBathroomAccessories);

// water-tec-cistern endpoints
router.post('/water-tec-cistern/create', upload.array('photos', 5), WaterTecCisternController.createCistern);
router.get('/water-tec-cistern/get', WaterTecCisternController.getAllCistern);
router.get('/water-tec-cistern/getOne/:id', WaterTecCisternController.getOneCistern);
router.put('/water-tec-cistern/update/:id', upload.array('photos', 5), WaterTecCisternController.updateCistern);
router.delete('/water-tec-cistern/delete/:id', WaterTecCisternController.deleteCistern);

// water-tec-concealed-cistern endpoints
router.post('/water-tec-concealed-cistern/create', upload.array('photos', 5), WaterTecConcealedCisternController.createConcealedCistern);
router.get('/water-tec-concealed-cistern/get', WaterTecConcealedCisternController.getAllConcealedCistern);
router.get('/water-tec-concealed-cistern/getOne/:id', WaterTecConcealedCisternController.getOneConcealedCistern);
router.put('/water-tec-concealed-cistern/update/:id', upload.array('photos', 5), WaterTecConcealedCisternController.updateConcealedCistern);
router.delete('/water-tec-concealed-cistern/delete/:id', WaterTecConcealedCisternController.deleteConcealedCistern);

// water-tec-connection-tube endpoints
router.post('/water-tec-connection-tube/create', upload.array('photos', 5), WaterTecConnectionTubeController.createConnectionTube);
router.get('/water-tec-connection-tube/get', WaterTecConnectionTubeController.getAllConnectionTube);
router.get('/water-tec-connection-tube/getOne/:id', WaterTecConnectionTubeController.getOneConnectionTube);
router.put('/water-tec-connection-tube/update/:id', upload.array('photos', 5), WaterTecConnectionTubeController.updateConnectionTube);
router.delete('/water-tec-connection-tube/delete/:id', WaterTecConnectionTubeController.deleteConnectionTube);

// water-tec-ebony endpoints
router.post('/water-tec-ebony/create', upload.array('photos', 5), WaterTecEbonyController.createEbony);
router.get('/water-tec-ebony/get', WaterTecEbonyController.getAllEbony);
router.get('/water-tec-ebony/getOne/:id', WaterTecEbonyController.getOneEbony);
router.put('/water-tec-ebony/update/:id', upload.array('photos', 5), WaterTecEbonyController.updateEbony);
router.delete('/water-tec-ebony/delete/:id', WaterTecEbonyController.deleteEbony);

// water-tec-eco endpoints
router.post('/water-tec-eco/create', upload.array('photos', 5), WaterTecEcoController.createEco);
router.get('/water-tec-eco/get', WaterTecEcoController.getAllEco);
router.get('/water-tec-eco/getOne/:id', WaterTecEcoController.getOneEco);
router.put('/water-tec-eco/update/:id', upload.array('photos', 5), WaterTecEcoController.updateEco);
router.delete('/water-tec-eco/delete/:id', WaterTecEcoController.deleteEco);

// water-tec-eva endpoints
router.post('/water-tec-eva/create', upload.array('photos', 5), WaterTecEvaController.createEva);
router.get('/water-tec-eva/get', WaterTecEvaController.getAllEva);
router.get('/water-tec-eva/getOne/:id', WaterTecEvaController.getOneEva);
router.put('/water-tec-eva/update/:id', upload.array('photos', 5), WaterTecEvaController.updateEva);
router.delete('/water-tec-eva/delete/:id', WaterTecEvaController.deleteEva);

// water-tec-flora endpoints
router.post('/water-tec-flora/create', upload.array('photos', 5), WaterTecFloraController.createFlora);
router.get('/water-tec-flora/get', WaterTecFloraController.getAllFlora);
router.get('/water-tec-flora/getOne/:id', WaterTecFloraController.getOneFlora);
router.put('/water-tec-flora/update/:id', upload.array('photos', 5), WaterTecFloraController.updateFlora);
router.delete('/water-tec-flora/delete/:id', WaterTecFloraController.deleteFlora);

// water-tec-health-faucets endpoints
router.post('/water-tec-health-faucets/create', upload.array('photos', 5), WaterTecHealthFaucetsController.createHealthFaucets);
router.get('/water-tec-health-faucets/get', WaterTecHealthFaucetsController.getAllHealthFaucets);
router.get('/water-tec-health-faucets/getOne/:id', WaterTecHealthFaucetsController.getOneHealthFaucets);
router.put('/water-tec-health-faucets/update/:id', upload.array('photos', 5), WaterTecHealthFaucetsController.updateHealthFaucets);
router.delete('/water-tec-health-faucets/delete/:id', WaterTecHealthFaucetsController.deleteHealthFaucets);

// water-tec-quattro endpoints
router.post('/water-tec-quattro/create', upload.array('photos', 5), WaterTecQuattroController.createQuattro);
router.get('/water-tec-quattro/get', WaterTecQuattroController.getAllQuattro);
router.get('/water-tec-quattro/getOne/:id', WaterTecQuattroController.getOneQuattro);
router.put('/water-tec-quattro/update/:id', upload.array('photos', 5), WaterTecQuattroController.updateQuattro);
router.delete('/water-tec-quattro/delete/:id', WaterTecQuattroController.deleteQuattro);

// water-tec-showers endpoints
router.post('/water-tec-showers/create', upload.array('photos', 5), WaterTecShowersController.createShowers);
router.get('/water-tec-showers/get', WaterTecShowersController.getAllShowers);
router.get('/water-tec-showers/getOne/:id', WaterTecShowersController.getOneShowers);
router.put('/water-tec-showers/update/:id', upload.array('photos', 5), WaterTecShowersController.updateShowers);
router.delete('/water-tec-showers/delete/:id', WaterTecShowersController.deleteShowers);

// water-tec-taps endpoints
router.post('/water-tec-taps/create', upload.array('photos', 5), WaterTecTapsController.createTaps);
router.get('/water-tec-taps/get', WaterTecTapsController.getAllTaps);
router.get('/water-tec-taps/getOne/:id', WaterTecTapsController.getOneTaps);
router.put('/water-tec-taps/update/:id', upload.array('photos', 5), WaterTecTapsController.updateTaps);
router.delete('/water-tec-taps/delete/:id', WaterTecTapsController.deleteTaps);

// water-tec-toilet-seat-covers endpoints
router.post('/water-tec-toilet-seat-covers/create', upload.array('photos', 5), WaterTecToiletSeatCoversController.createToiletSeatCovers);
router.get('/water-tec-toilet-seat-covers/get', WaterTecToiletSeatCoversController.getAllToiletSeatCovers);
router.get('/water-tec-toilet-seat-covers/getOne/:id', WaterTecToiletSeatCoversController.getOneToiletSeatCovers);
router.put('/water-tec-toilet-seat-covers/update/:id', upload.array('photos', 5), WaterTecToiletSeatCoversController.updateToiletSeatCovers);
router.delete('/water-tec-toilet-seat-covers/delete/:id', WaterTecToiletSeatCoversController.deleteToiletSeatCovers);

// water-tec-t-series-alt endpoints
router.post('/water-tec-t-series-alt/create', upload.array('photos', 5), WaterTecTSeriesAltController.createTSeriesAlt);
router.get('/water-tec-t-series-alt/get', WaterTecTSeriesAltController.getAllTSeriesAlt);
router.get('/water-tec-t-series-alt/getOne/:id', WaterTecTSeriesAltController.getOneTSeriesAlt);
router.put('/water-tec-t-series-alt/update/:id', upload.array('photos', 5), WaterTecTSeriesAltController.updateTSeriesAlt);
router.delete('/water-tec-t-series-alt/delete/:id', WaterTecTSeriesAltController.deleteTSeriesAlt);

// water-tec-t-series endpoints
router.post('/water-tec-t-series/create', upload.array('photos', 5), WaterTecTSeriesController.createTSeries);
router.get('/water-tec-t-series/get', WaterTecTSeriesController.getAllTSeries);
router.get('/water-tec-t-series/getOne/:id', WaterTecTSeriesController.getOneTSeries);
router.put('/water-tec-t-series/update/:id', upload.array('photos', 5), WaterTecTSeriesController.updateTSeries);
router.delete('/water-tec-t-series/delete/:id', WaterTecTSeriesController.deleteTSeries);

// water-tec-valves endpoints
router.post('/water-tec-valves/create', upload.array('photos', 5), WaterTecValvesController.createValves);
router.get('/water-tec-valves/get', WaterTecValvesController.getAllValves);
router.get('/water-tec-valves/getOne/:id', WaterTecValvesController.getOneValves);
router.put('/water-tec-valves/update/:id', upload.array('photos', 5), WaterTecValvesController.updateValves);
router.delete('/water-tec-valves/delete/:id', WaterTecValvesController.deleteValves);


module.exports = router;
