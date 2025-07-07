const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const adaptors = require('../controllers/electrical/adaptorsController');
const fans = require('../controllers/electrical/fansController');
const lights = require('../controllers/electrical/lightsController');
const switches = require('../controllers/electrical/switchesController');
const sockets = require('../controllers/electrical/socketsController');
const plug = require('../controllers/electrical/plugController');
const uniSwitch = require('../controllers/electrical/uniSwitchController');
const tVOutlets = require('../controllers/electrical/tVOutletsController');
const travelAdaptor = require('../controllers/electrical/travelAdaptorController');
const switchPlates = require('../controllers/electrical/switchPlatesController');
const switchAndSocket = require('../controllers/electrical/switchAndSocketController');
const rotarySwitch = require('../controllers/electrical/rotarySwitchController');
const regulators = require('../controllers/electrical/regulatorsController');
const pvCClips = require('../controllers/electrical/pvCClipsController');
const powerStrips = require('../controllers/electrical/powerStripsController');
const pinTop = require('../controllers/electrical/pinTopController');
const others = require('../controllers/electrical/othersController');
const motorStarters = require('../controllers/electrical/motorStartersController');
const motors = require('../controllers/electrical/motorsController');
const modularSurfaceBox = require('../controllers/electrical/modularSurfaceBoxController');
const mCB = require('../controllers/electrical/mCBController');
const mainSwitch = require('../controllers/electrical/mainSwitchController');
const kITKATFuses = require('../controllers/electrical/kITKATFusesController');
const jacks = require('../controllers/electrical/jacksController');
const isolators = require('../controllers/electrical/isolatorsController');
const insulationTapes = require('../controllers/electrical/insulationTapesController');
const indicator = require('../controllers/electrical/indicatorController');
const holders = require('../controllers/electrical/holdersController');
const fuseCarriers = require('../controllers/electrical/fuseCarriersController');
const flexibleWires = require('../controllers/electrical/flexibleWiresController');
const flexibleConduit = require('../controllers/electrical/flexibleConduitController');
const electricalFittings = require('../controllers/electrical/electricalFittingsController');
const eLCBsRCCBs = require('../controllers/electrical/eLCBsRCCBsController');
const earthingAccessories = require('../controllers/electrical/earthingAccessoriesController');
const dPswitch = require('../controllers/electrical/dPswitchController');
const doorBells = require('../controllers/electrical/doorBellsController');
const distributionBoards = require('../controllers/electrical/distributionBoardsController');
const dimmer = require('../controllers/electrical/dimmerController');
const ceilingRoses = require('../controllers/electrical/ceilingRosesController');
const wiresAndCables = require('../controllers/electrical/wiresAndCablesController');
const waterHeater = require('../controllers/electrical/waterHeaterController');

// Set up storage for uploaded files
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Adaptors routes
router.post('/adaptors', upload.array('photos', 5), adaptors.createAdaptors);
router.get('/adaptors', adaptors.getAllAdaptors);
router.get('/adaptors/:id', adaptors.getAdaptorById);
router.put('/adaptors/:id', adaptors.updateAdaptors);
router.delete('/adaptors/:id', adaptors.deleteAdaptor);

// Fans routes
router.post('/fans', upload.array('photos', 5), fans.createFans);
router.get('/fans', fans.getAllFans);
router.get('/fans/:id', fans.getFanById);
router.put('/fans/:id', fans.updateFans);
router.delete('/fans/:id', fans.deleteFan);

// Lights routes
router.post('/lights', upload.array('photos', 5), lights.createLights);
router.get('/lights', lights.getAllLights);
router.get('/lights/:id', lights.getLightById);
router.put('/lights/:id', lights.updateLights);
router.delete('/lights/:id', lights.deleteLight);

// Switches routes
router.post('/switches', upload.array('photos', 5), switches.createSwitches);
router.get('/switches', switches.getAllSwitches);
router.get('/switches/:id', switches.getSwitchById);
router.put('/switches/:id', switches.updateSwitchs);
router.delete('/switches/:id', switches.deleteSwitch);

// Sockets routes
router.post('/sockets', upload.array('photos', 5), sockets.createSockets);
router.get('/sockets', sockets.getAllSockets);
router.get('/sockets/:id', sockets.getSocketById);
router.put('/sockets/:id', sockets.updateSockets);
router.delete('/sockets/:id', sockets.deleteSocket);

// Plug routes
router.post('/plug', upload.array('photos', 5), plug.createPlug);
router.get('/plug', plug.getAllPlugs);
router.get('/plug/:id', plug.getPlugById);
router.put('/plug/:id', plug.updatePlug);
router.delete('/plug/:id', plug.deletePlug);

// UniSwitch routes
router.post('/uniSwitch', upload.array('photos', 5), uniSwitch.createUniSwitch);
router.get('/uniSwitch', uniSwitch.getAllUniSwitches);
router.get('/uniSwitch/:id', uniSwitch.getUniSwitchById);
router.put('/uniSwitch/:id', uniSwitch.updateUniSwitch);
router.delete('/uniSwitch/:id', uniSwitch.deleteUniSwitch);

// TVOutlets routes
router.post('/tVOutlets', upload.array('photos', 5), tVOutlets.createTVOutlets);
router.get('/tVOutlets', tVOutlets.getAllTVOutlets);
router.get('/tVOutlets/:id', tVOutlets.getTVOutletById);
router.put('/tVOutlets/:id', tVOutlets.updateTVOutlets);
router.delete('/tVOutlets/:id', tVOutlets.deleteTVOutlet);

// TravelAdaptor routes
router.post('/travelAdaptor', upload.array('photos', 5), travelAdaptor.createTravelAdaptor);
router.get('/travelAdaptor', travelAdaptor.getAllTravelAdaptors);
router.get('/travelAdaptor/:id', travelAdaptor.getTravelAdaptorById);
router.put('/travelAdaptor/:id', travelAdaptor.updateTravelAdaptor);
router.delete('/travelAdaptor/:id', travelAdaptor.deleteTravelAdaptor);

// SwitchPlates routes
router.post('/switchPlates', upload.array('photos', 5), switchPlates.createSwitchPlates);
router.get('/switchPlates', switchPlates.getAllSwitchPlates);
router.get('/switchPlates/:id', switchPlates.getSwitchPlateById);
router.put('/switchPlates/:id', switchPlates.updateSwitchPlate);
router.delete('/switchPlates/:id', switchPlates.deleteSwitchPlate);

// SwitchAndSocket routes
router.post('/switchAndSocket', upload.array('photos', 5), switchAndSocket.createSwitchAndSocket);
router.get('/switchAndSocket', switchAndSocket.getAllSwitchAndSockets);
router.get('/switchAndSocket/:id', switchAndSocket.getSwitchAndSocketById);
router.put('/switchAndSocket/:id', switchAndSocket.updateSwitchAndSocket);
router.delete('/switchAndSocket/:id', switchAndSocket.deleteSwitchAndSocket);

// RotarySwitch routes
router.post('/rotarySwitch', upload.array('photos', 5), rotarySwitch.createRotarySwitch);
router.get('/rotarySwitch', rotarySwitch.getAllRotarySwitchs);
router.get('/rotarySwitch/:id', rotarySwitch.getRotarySwitchById);
router.put('/rotarySwitch/:id', rotarySwitch.updateRotarySwitch);
router.delete('/rotarySwitch/:id', rotarySwitch.deleteRotarySwitch);

// Regulators routes
router.post('/regulators', upload.array('photos', 5), regulators.createRegulators);
router.get('/regulators', regulators.getAllRegulators);
router.get('/regulators/:id', regulators.getRegulatorById);
router.put('/regulators/:id', regulators.updateRegulator);
router.delete('/regulators/:id', regulators.deleteRegulator);

// PVCClips routes
router.post('/pvCClips', upload.array('photos', 5), pvCClips.createPVCClips);
router.get('/pvCClips', pvCClips.getAllPVCClips);
router.get('/pvCClips/:id', pvCClips.getPVCClipById);
router.put('/pvCClips/:id', pvCClips.updatePVCClip);
router.delete('/pvCClips/:id', pvCClips.deletePVCClip);

// PowerStrips routes
router.post('/powerStrips', upload.array('photos', 5), powerStrips.createPowerStrips);
router.get('/powerStrips', powerStrips.getAllPowerStrips);
router.get('/powerStrips/:id', powerStrips.getPowerStripById);
router.put('/powerStrips/:id', powerStrips.updatePowerStrip);
router.delete('/powerStrips/:id', powerStrips.deletePowerStrip);

// PinTop routes
router.post('/pinTop', upload.array('photos', 5), pinTop.createPinTop);
router.get('/pinTop', pinTop.getAllPinTops);
router.get('/pinTop/:id', pinTop.getPinTopById);
router.put('/pinTop/:id', pinTop.updatePinTop);
router.delete('/pinTop/:id', pinTop.deletePinTop);

// Others routes
router.post('/others', upload.array('photos', 5), others.createOthers);
router.get('/others', others.getAllOthers);
router.get('/others/:id', others.getOtherById);
router.put('/others/:id', others.updateOther);
router.delete('/others/:id', others.deleteOther);

// MotorStarters routes
router.post('/motorStarters', upload.array('photos', 5), motorStarters.createMotorStarters);
router.get('/motorStarters', motorStarters.getAllMotorStarters);
router.get('/motorStarters/:id', motorStarters.getMotorStarterById);
router.put('/motorStarters/:id', motorStarters.updateMotorStarter);
router.delete('/motorStarters/:id', motorStarters.deleteMotorStarter);

// Motors routes
router.post('/motors', upload.array('photos', 5), motors.createMotors);
router.get('/motors', motors.getAllMotors);
router.get('/motors/:id', motors.getMotorById);
router.put('/motors/:id', motors.updateMotor);
router.delete('/motors/:id', motors.deleteMotor);

// ModularSurfaceBox routes
router.post('/modularSurfaceBox', upload.array('photos', 5), modularSurfaceBox.createModularSurfaceBox);
router.get('/modularSurfaceBox', modularSurfaceBox.getAllModularSurfaceBoxs);
router.get('/modularSurfaceBox/:id', modularSurfaceBox.getModularSurfaceBoxById);
router.put('/modularSurfaceBox/:id', modularSurfaceBox.updateModularSurfaceBox);
router.delete('/modularSurfaceBox/:id', modularSurfaceBox.deleteModularSurfaceBox);

// MCB routes
router.post('/mCB', upload.array('photos', 5), mCB.createMCB);
router.get('/mCB', mCB.getAllMCBs);
router.get('/mCB/:id', mCB.getMCBById);
router.put('/mCB/:id', mCB.updateMCB);
router.delete('/mCB/:id', mCB.deleteMCB);

// MainSwitch routes
router.post('/mainSwitch', upload.array('photos', 5), mainSwitch.createMainSwitch);
router.get('/mainSwitch', mainSwitch.getAllMainSwitchs);
router.get('/mainSwitch/:id', mainSwitch.getMainSwitchById);
router.put('/mainSwitch/:id', mainSwitch.updateMainSwitch);
router.delete('/mainSwitch/:id', mainSwitch.deleteMainSwitch);

// KITKATFuses routes
router.post('/kITKATFuses', upload.array('photos', 5), kITKATFuses.createKITKATFuses);
router.get('/kITKATFuses', kITKATFuses.getAllKITKATFuses);
router.get('/kITKATFuses/:id', kITKATFuses.getKITKATFuseById);
router.put('/kITKATFuses/:id', kITKATFuses.updateKITKATFuse);
router.delete('/kITKATFuses/:id', kITKATFuses.deleteKITKATFuse);

// Jacks routes
router.post('/jacks', upload.array('photos', 5), jacks.createJacks);
router.get('/jacks', jacks.getAllJacks);
router.get('/jacks/:id', jacks.getJackById);
router.put('/jacks/:id', jacks.updateJack);
router.delete('/jacks/:id', jacks.deleteJack);

// Isolators routes
router.post('/isolators', upload.array('photos', 5), isolators.createIsolators);
router.get('/isolators', isolators.getAllIsolators);
router.get('/isolators/:id', isolators.getIsolatorById);
router.put('/isolators/:id', isolators.updateIsolator);
router.delete('/isolators/:id', isolators.deleteIsolator);

// InsulationTapes routes
router.post('/insulationTapes', upload.array('photos', 5), insulationTapes.createInsulationTapes);
router.get('/insulationTapes', insulationTapes.getAllInsulationTapes);
router.get('/insulationTapes/:id', insulationTapes.getInsulationTapeById);
router.put('/insulationTapes/:id', insulationTapes.updateInsulationTape);
router.delete('/insulationTapes/:id', insulationTapes.deleteInsulationTape);

// Indicator routes
router.post('/indicator', upload.array('photos', 5), indicator.createIndicator);
router.get('/indicator', indicator.getAllIndicators);
router.get('/indicator/:id', indicator.getIndicatorById);
router.put('/indicator/:id', indicator.updateIndicator);
router.delete('/indicator/:id', indicator.deleteIndicator);

// Holders routes
router.post('/holders', upload.array('photos', 5), holders.createHolders);
router.get('/holders', holders.getAllHolders);
router.get('/holders/:id', holders.getHolderById);
router.put('/holders/:id', holders.updateHolder);
router.delete('/holders/:id', holders.deleteHolder);

// FuseCarriers routes
router.post('/fuseCarriers', upload.array('photos', 5), fuseCarriers.createFuseCarriers);
router.get('/fuseCarriers', fuseCarriers.getAllFuseCarriers);
router.get('/fuseCarriers/:id', fuseCarriers.getFuseCarrierById);
router.put('/fuseCarriers/:id', fuseCarriers.updateFuseCarrier);
router.delete('/fuseCarriers/:id', fuseCarriers.deleteFuseCarrier);

// FlexibleWires routes
router.post('/flexibleWires', upload.array('photos', 5), flexibleWires.createFlexibleWires);
router.get('/flexibleWires', flexibleWires.getAllFlexibleWires);
router.get('/flexibleWires/:id', flexibleWires.getFlexibleWireById);
router.put('/flexibleWires/:id', flexibleWires.updateFlexibleWire);
router.delete('/flexibleWires/:id', flexibleWires.deleteFlexibleWire);

// FlexibleConduit routes
router.post('/flexibleConduit', upload.array('photos', 5), flexibleConduit.createFlexibleConduit);
router.get('/flexibleConduit', flexibleConduit.getAllFlexibleConduits);
router.get('/flexibleConduit/:id', flexibleConduit.getFlexibleConduitById);
router.put('/flexibleConduit/:id', flexibleConduit.updateFlexibleConduit);
router.delete('/flexibleConduit/:id', flexibleConduit.deleteFlexibleConduit);

// ElectricalFittings routes
router.post('/electricalFittings', upload.array('photos', 5), electricalFittings.createElectricalFittings);
router.get('/electricalFittings', electricalFittings.getAllElectricalFittings);
router.get('/electricalFittings/:id', electricalFittings.getElectricalFittingById);
router.put('/electricalFittings/:id', electricalFittings.updateElectricalFitting);
router.delete('/electricalFittings/:id', electricalFittings.deleteElectricalFitting);

// ELCBsRCCBs routes
router.post('/eLCBsRCCBs', upload.array('photos', 5), eLCBsRCCBs.createELCBsRCCBs);
router.get('/eLCBsRCCBs', eLCBsRCCBs.getAllELCBsRCCBs);
router.get('/eLCBsRCCBs/:id', eLCBsRCCBs.getELCBsRCCBById);
router.put('/eLCBsRCCBs/:id', eLCBsRCCBs.updateELCBsRCCB);
router.delete('/eLCBsRCCBs/:id', eLCBsRCCBs.deleteELCBsRCCB);

// EarthingAccessories routes
router.post('/earthingAccessories', upload.array('photos', 5), earthingAccessories.createEarthingAccessorys);
router.get('/earthingAccessories', earthingAccessories.getAllEarthingAccessories);
router.get('/earthingAccessories/:id', earthingAccessories.getEarthingAccessoryById);
router.put('/earthingAccessories/:id', earthingAccessories.updateEarthingAccessory);
router.delete('/earthingAccessories/:id', earthingAccessories.deleteEarthingAccessory);

// DPswitch routes
router.post('/dPswitch', upload.array('photos', 5), dPswitch.createDPswitch);
router.get('/dPswitch', dPswitch.getAllDPswitchs);
router.get('/dPswitch/:id', dPswitch.getDPswitchById);
router.put('/dPswitch/:id', dPswitch.updateDPswitch);
router.delete('/dPswitch/:id', dPswitch.deleteDPswitch);

// DoorBells routes
router.post('/doorBells', upload.array('photos', 5), doorBells.createDoorBell);
router.get('/doorBells', doorBells.getAllDoorBells);
router.get('/doorBells/:id', doorBells.getDoorBellById);
router.put('/doorBells/:id', doorBells.updateDoorBell);
router.delete('/doorBells/:id', doorBells.deleteDoorBell);

// DistributionBoards routes
router.post('/distributionBoards', upload.array('photos', 5), distributionBoards.createDistributionBoard);
router.get('/distributionBoards', distributionBoards.getAllDistributionBoards);
router.get('/distributionBoards/:id', distributionBoards.getDistributionBoardById);
router.put('/distributionBoards/:id', distributionBoards.updateDistributionBoard);
router.delete('/distributionBoards/:id', distributionBoards.deleteDistributionBoard);

// Dimmer routes
router.post('/dimmer', upload.array('photos', 5), dimmer.createDimmer);
router.get('/dimmer', dimmer.getAllDimmers);
router.get('/dimmer/:id', dimmer.getDimmerById);
router.put('/dimmer/:id', dimmer.updateDimmer);
router.delete('/dimmer/:id', dimmer.deleteDimmer);

// CeilingRoses routes
router.post('/ceilingRoses', upload.array('photos', 5), ceilingRoses.createCeilingRoses);
router.get('/ceilingRoses', ceilingRoses.getAllCeilingRosess);
router.get('/ceilingRoses/:id', ceilingRoses.getCeilingRosesById);
router.put('/ceilingRoses/:id', ceilingRoses.updateCeilingRoses);
router.delete('/ceilingRoses/:id', ceilingRoses.deleteCeilingRoses);

// WiresAndCables routes
router.post('/wiresAndCables', upload.array('photos', 5), wiresAndCables.createWiresAndCables);
router.get('/wiresAndCables', wiresAndCables.getAllWiresAndCables);
router.get('/wiresAndCables/:id', wiresAndCables.getWiresAndCablesById);
router.put('/wiresAndCables/:id', wiresAndCables.updateWiresAndCables);
router.delete('/wiresAndCables/:id', wiresAndCables.deleteWiresAndCables);

// WaterHeater routes
router.post('/waterHeater', upload.array('photos', 5), waterHeater.createWaterHeater);
router.get('/waterHeater', waterHeater.getAllWaterHeaters);
router.get('/waterHeater/:id', waterHeater.getOneWaterHeater);
router.put('/waterHeater/:id', waterHeater.updateWaterHeater);
router.delete('/waterHeater/:id', waterHeater.deleteWaterHeater);

module.exports = router;
