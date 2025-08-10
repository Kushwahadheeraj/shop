const fs = require('fs');
const path = require('path');

function fixMissingRequiredFields(filePath, controllerName) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if the create method is missing required fields
    if (content.includes('create' + controllerName) && 
        !content.includes('type: \'' + controllerName + '\'') &&
        !content.includes('type: "' + controllerName + '"')) {
      
      // Find the create method and add required fields
      const createMethodRegex = new RegExp(
        `(exports\\.create${controllerName}\\s*=\\s*async\\s*\\(req,\\s*res\\)\\s*=>\\s*{[^}]*?const\\s+product\\s*=\\s*new\\s+Lock\\(\\s*{[^}]*?photos:\\s*photoUrls[^}]*?category:\\s*['"]${controllerName}['"][^}]*?}\\)[^}]*?await\\s+product\\.save\\(\\)[^}]*?res\\.status\\(201\\)\\.json\\(product\\)[^}]*?}`, 
        's'
      );
      
      if (createMethodRegex.test(content)) {
        // Replace the create method with the fixed version
        const replacement = `exports.create${controllerName} = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    const product = new Lock({ 
      ...req.body, 
      photos: photoUrls, 
      category: '${controllerName}',
      type: '${controllerName}',
      productNo: req.body.productNo || '${controllerName.charAt(0).toUpperCase() + controllerName.slice(1)}-' + Date.now(),
      productQualityName: req.body.productQualityName || 'Standard'
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}`;
        
        content = content.replace(createMethodRegex, replacement);
        modified = true;
        console.log(`✅ Fixed missing required fields in ${path.basename(filePath)}`);
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`📝 Updated ${path.basename(filePath)}`);
    } else {
      console.log(`✅ ${path.basename(filePath)} already has required fields`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

function fixAllControllers(dirPath) {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      fixAllControllers(fullPath);
    } else if (item.endsWith('Controller.js') || item.endsWith('Controllers.js')) {
      let controllerName = item.replace(/Controller\.js$/, '').replace(/Controllers\.js$/, '');
      
      // Handle special cases for controller names
      if (controllerName === 'mortiseLockBody') controllerName = 'MortiseLockBody';
      if (controllerName === 'morticeLocks') controllerName = 'MorticeLocks';
      if (controllerName === 'patchFittings') controllerName = 'PatchFittings';
      if (controllerName === 'doorKings') controllerName = 'DoorKings';
      if (controllerName === 'doorPulls') controllerName = 'DoorPulls';
      if (controllerName === 'dimpleKey') controllerName = 'DimpleKey';
      if (controllerName === 'diamantPadlocks') controllerName = 'DiamantPadlocks';
      if (controllerName === 'deadLocks') controllerName = 'DeadLocks';
      if (controllerName === 'cylindricalLocks') controllerName = 'CylindricalLocks';
      if (controllerName === 'cupboardLocks') controllerName = 'CupboardLocks';
      if (controllerName === 'centreShutterLocks') controllerName = 'CentreShutterLocks';
      if (controllerName === 'triBoltLocks') controllerName = 'TriBoltLocks';
      if (controllerName === 'smartKey') controllerName = 'SmartKey';
      if (controllerName === 'sideLock') controllerName = 'SideLock';
      if (controllerName === 'rimDeadLock') controllerName = 'RimDeadLock';
      if (controllerName === 'pullHandlesForMainDoors') controllerName = 'PullHandlesForMainDoors';
      if (controllerName === 'nightLatch') controllerName = 'NightLatch';
      if (controllerName === 'mainDoorLock') controllerName = 'MainDoorLock';
      if (controllerName === 'knobLocks') controllerName = 'KnobLocks';
      if (controllerName === 'jemmyProofDoorLock') controllerName = 'JemmyProofDoorLock';
      if (controllerName === 'drawerLock') controllerName = 'DrawerLock';
      if (controllerName === 'discPadLocks') controllerName = 'DiscPadLocks';
      if (controllerName === 'nuvo') controllerName = 'Nuvo';
      if (controllerName === 'multiPurposeLock') controllerName = 'MultiPurposeLock';
      if (controllerName === 'furnitureFittings') controllerName = 'FurnitureFittings';
      if (controllerName === 'drawerLocks') controllerName = 'DrawerLocks';
      if (controllerName === 'drawerCupboardLock') controllerName = 'DrawerCupboardLock';
      if (controllerName === 'curvo') controllerName = 'Curvo';
      if (controllerName === 'supernova') controllerName = 'Supernova';
      if (controllerName === 'tableLock') controllerName = 'TableLock';
      if (controllerName === 'thickDoorHinge') controllerName = 'ThickDoorHinge';
      if (controllerName === 'softCloseDrawerChannel') controllerName = 'SoftCloseDrawerChannel';
      if (controllerName === 'slipOnHinge') controllerName = 'SlipOnHinge';
      if (controllerName === 'heavyDutyDrawerSlides') controllerName = 'HeavyDutyDrawerSlides';
      if (controllerName === 'foldingBrackets') controllerName = 'FoldingBrackets';
      if (controllerName === 'drawerChannels') controllerName = 'DrawerChannels';
      if (controllerName === 'clipOnSoftHinge') controllerName = 'ClipOnSoftHinge';
      if (controllerName === 'clipOnSoftHinge4Hole') controllerName = 'ClipOnSoftHinge4Hole';
      if (controllerName === 'cabinetHinge') controllerName = 'CabinetHinge';
      if (controllerName === 'blindCornerHinge') controllerName = 'BlindCornerHinge';
      if (controllerName === 'victoria') controllerName = 'Victoria';
      if (controllerName === 'towyLowHeightDesign') controllerName = 'TowyLowHeightDesign';
      if (controllerName === 'ssdTypeTubeLever') controllerName = 'SSDTypeTubeLever';
      if (controllerName === 'pullHandles') controllerName = 'PullHandles';
      if (controllerName === 'popularMortiseSeries') controllerName = 'PopularMortiseSeries';
      if (controllerName === 'oliver') controllerName = 'Oliver';
      if (controllerName === 'neh16') controllerName = 'NEH16';
      if (controllerName === 'neh15LowHeightDesign') controllerName = 'NEH15LowHeightDesign';
      if (controllerName === 'neh14') controllerName = 'NEH14';
      if (controllerName === 'neh13') controllerName = 'NEH13';
      if (controllerName === 'neh12') controllerName = 'NEH12';
      if (controllerName === 'neh06') controllerName = 'NEH06';
      if (controllerName === 'neh11') controllerName = 'NEH11';
      if (controllerName === 'neh10') controllerName = 'NEH10';
      if (controllerName === 'neh09') controllerName = 'NEH09';
      if (controllerName === 'neh08') controllerName = 'NEH08';
      if (controllerName === 'neh07') controllerName = 'NEH07';
      if (controllerName === 'neh05') controllerName = 'NEH05';
      if (controllerName === 'neh04') controllerName = 'NEH04';
      if (controllerName === 'matiz') controllerName = 'Matiz';
      if (controllerName === 'mainDoorSet') controllerName = 'MainDoorSet';
      if (controllerName === 'gloria') controllerName = 'Gloria';
      if (controllerName === 'cornerFetchSeries') controllerName = 'CornerFetchSeries';
      if (controllerName === 'combiSet') controllerName = 'CombiSet';
      if (controllerName === 'classicLock') controllerName = 'ClassicLock';
      if (controllerName === 'bm06') controllerName = 'BM06';
      if (controllerName === 'bm04') controllerName = 'BM04';
      if (controllerName === 'bm02') controllerName = 'BM02';
      if (controllerName === 'bm01') controllerName = 'BM01';
      if (controllerName === 'sehSeries') controllerName = 'SEHSeries';
      if (controllerName === 'premiumMortiseSeries') controllerName = 'PremiumMortiseSeries';
      if (controllerName === 'phoenix') controllerName = 'Phoenix';
      if (controllerName === 'orbit') controllerName = 'Orbit';
      if (controllerName === 'mercury') controllerName = 'Mercury';
      if (controllerName === 'evva3KSRegalisMortise') controllerName = 'Evva3KSRegalisMortise';
      if (controllerName === 'europrofileBrassHandleSet240mm') controllerName = 'EuroprofileBrassHandleSet240mm';
      if (controllerName === 'combipackWith240mmEuroMortiseLock') controllerName = 'CombipackWith240mmEuroMortiseLock';
      if (controllerName === 'allureRossetteSeries') controllerName = 'AllureRossetteSeries';
      if (controllerName === 'leverMortiseLocks') controllerName = 'LeverMortiseLocks';
      if (controllerName === 'exshiSecurityCylinders') controllerName = 'EXSHISecurityCylinders';
      if (controllerName === 'europrofileMortisePinCylinderWithMasterKey') controllerName = 'EuroprofileMortisePinCylinderWithMasterKey';
      if (controllerName === 'europrofileMortisePinCylinder') controllerName = 'EuroprofileMortisePinCylinder';
      if (controllerName === 'europrofileMortiseLockBodies') controllerName = 'EuroprofileMortiseLockBodies';
      if (controllerName === 'combipackWith6LeverMortiseLock') controllerName = 'CombipackWith6LeverMortiseLock';
      if (controllerName === 'slidingSystem') controllerName = 'SlidingSystem';
      if (controllerName === 'showerCubicleHinge') controllerName = 'ShowerCubicleHinge';
      if (controllerName === 'glassHardware') controllerName = 'GlassHardware';
      if (controllerName === 'glassDoorPullHandle') controllerName = 'GlassDoorPullHandle';
      if (controllerName === 'glassDoorLock') controllerName = 'GlassDoorLock';
      if (controllerName === 'glassDoorFitting') controllerName = 'GlassDoorFitting';
      if (controllerName === 'floorSpring') controllerName = 'FloorSpring';
      if (controllerName === 'floorSpringComboSet') controllerName = 'FloorSpringComboSet';
      if (controllerName === 'ultraXLVertibolt') controllerName = 'UltraXLVertibolt';
      if (controllerName === 'ultraXLTwinbolt') controllerName = 'UltraXLTwinbolt';
      if (controllerName === 'ultraXLTribolt') controllerName = 'UltraXLTribolt';
      if (controllerName === 'ultraXLRimDeadbolt') controllerName = 'UltraXLRimDeadbolt';
      if (controllerName === 'ultraVertibolt') controllerName = 'UltraVertibolt';
      if (controllerName === 'ultraTribolt') controllerName = 'UltraTribolt';
      if (controllerName === 'ultraRetrofitAdaptor') controllerName = 'UltraRetrofitAdaptor';
      if (controllerName === 'ultraLatchboltCarton') controllerName = 'UltraLatchboltCarton';
      if (controllerName === 'rimLocks') controllerName = 'RimLocks';
      if (controllerName === 'pinCylinderRimLocks') controllerName = 'PinCylinderRimLocks';
      if (controllerName === 'pentaboltAries') controllerName = 'PentaboltAries';
      if (controllerName === 'nightLatch7Lever') controllerName = 'NightLatch7Lever';
      if (controllerName === 'exsAstro') controllerName = 'EXSAstro';
      if (controllerName === 'exsAltrix') controllerName = 'EXSAltrix';
      if (controllerName === 'ultraShutterLocks') controllerName = 'UltraShutterLocks';
      if (controllerName === 'squareTypePadlock') controllerName = 'SquareTypePadlock';
      if (controllerName === 'roundTypePadlock') controllerName = 'RoundTypePadlock';
      if (controllerName === 'premiumPadlocks') controllerName = 'PremiumPadlocks';
      if (controllerName === 'padlocks') controllerName = 'Padlocks';
      if (controllerName === 'discPadlocks') controllerName = 'DiscPadlocks';
      if (controllerName === 'concealedHinges') controllerName = 'ConcealedHinges';
      if (controllerName === 'doorEye') controllerName = 'DoorEye';
      if (controllerName === 'doorStopper') controllerName = 'DoorStopper';
      if (controllerName === 'hinges') controllerName = 'Hinges';
      if (controllerName === 'magneticDoorStoppers') controllerName = 'MagneticDoorStoppers';
      if (controllerName === 'woodenSlidingDoorFittings') controllerName = 'WoodenSlidingDoorFittings';
      if (controllerName === 'ballBearingDoorHinges') controllerName = 'BallBearingDoorHinges';
      if (controllerName === 'aluminiumTowerBolt') controllerName = 'AluminiumTowerBolt';
      if (controllerName === 'doorCloser') controllerName = 'DoorCloser';
      if (controllerName === 'hydraulicDoorClosers') controllerName = 'HydraulicDoorClosers';
      
      fixMissingRequiredFields(fullPath, controllerName);
    }
  }
}

console.log('🔧 Starting to fix missing required fields in all controllers...');
const locksControllersDir = path.join(__dirname, '..', 'backend', 'controllers', 'locks');
fixAllControllers(locksControllersDir);
console.log('✅ Finished fixing missing required fields in all controllers!');
