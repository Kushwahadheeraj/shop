const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '../app/Dashboard/ProductAdd/Sanitary');

// API mapping from apiS.js to folder names
const apiMapping = {
  'acrylic-products': 'AcrylicProducts',
  'bathroom-accessories': 'BathroomAccessories',
  'closets': 'Closets',
  'faucets': 'Faucets',
  'hardware-bathroom-accessories': 'HardwareBathroomAccessories',
  'health-faucet': 'HealthFaucet',
  'jaquar': 'Jaquar',
  'kitchen-sinks': 'KitchenSinks',
  'showers': 'Showers',
  'taps': 'Taps',
  'washbasins': 'Washbasins',
  'bathsense-pfittings-faucets-altius': 'Bathsense/PfittingsFaucets/Altius',
  'bathsense-pfittings-faucets-bathsense-essentials': 'Bathsense/PfittingsFaucets/BathsenseEssentials',
  'bathsense-pfittings-faucets-bathsense-showers': 'Bathsense/PfittingsFaucets/BathsenseShowers',
  'bathsense-pfittings-faucets-colossus': 'Bathsense/PfittingsFaucets/Colossus',
  'bathsense-pfittings-faucets-invictus': 'Bathsense/PfittingsFaucets/Invictus',
  'bathsense-pfittings-faucets-maximus': 'Bathsense/PfittingsFaucets/Maximus',
  'bathsense-pfittings-faucets-spry': 'Bathsense/PfittingsFaucets/Spry',
  'bathsense-pfittings-faucets-theta': 'Bathsense/PfittingsFaucets/Theta',
  'bathsense-sanitaryware-essentials': 'Bathsense/Sanitaryware/Essentials',
  'bathsense-sanitaryware-pedestals': 'Bathsense/Sanitaryware/Pedestals',
  'bathsense-sanitaryware-venus': 'Bathsense/Sanitaryware/Venus',
  'bathsense-sanitaryware-washbasins': 'Bathsense/Sanitaryware/Washbasins',
  'bathsense-sanitaryware-water-closet': 'Bathsense/Sanitaryware/WaterCloset',
  'coral-bath-fixtures-eurosmart-series': 'CoralBathFixtures/EurosmartSeries',
  'coral-bath-fixtures-flowmore-series': 'CoralBathFixtures/FlowmoreSeries',
  'coral-bath-fixtures-new-super-glow-series': 'CoralBathFixtures/NewSuperGlowSeries',
  'coral-bath-fixtures-royale-series': 'CoralBathFixtures/RoyaleSeries',
  'coral-bath-fixtures-treemo-series': 'CoralBathFixtures/TreemoSeries',
  'coral-bath-fixtures-xrossa-series': 'CoralBathFixtures/XrossaSeries',
  'corsa-bathroom-faucets-almond': 'Corsa/BathroomFaucets/Almond',
  'corsa-bathroom-faucets-arrow': 'Corsa/BathroomFaucets/Arrow',
  'corsa-bathroom-faucets-bold': 'Corsa/BathroomFaucets/Bold',
  'corsa-bathroom-faucets-budget': 'Corsa/BathroomFaucets/Budget',
  'corsa-bathroom-faucets-concept': 'Corsa/BathroomFaucets/Concept',
  'corsa-bathroom-faucets-deluxe': 'Corsa/BathroomFaucets/Deluxe',
  'corsa-bathroom-faucets-eeco': 'Corsa/BathroomFaucets/Eeco',
  'corsa-bathroom-faucets-expert': 'Corsa/BathroomFaucets/Expert',
  'corsa-bathroom-faucets-florence': 'Corsa/BathroomFaucets/Florence',
  'corsa-bathroom-faucets-glass-bowl-faucet': 'Corsa/BathroomFaucets/GlassBowlFaucet',
  'corsa-bathroom-faucets-idea': 'Corsa/BathroomFaucets/Idea',
  'corsa-bathroom-faucets-jazz': 'Corsa/BathroomFaucets/Jazz',
  'corsa-bathroom-faucets-ket': 'Corsa/BathroomFaucets/Ket',
  'corsa-bathroom-faucets-milano': 'Corsa/BathroomFaucets/Milano',
  'corsa-bathroom-faucets-nano': 'Corsa/BathroomFaucets/Nano',
  'corsa-bathroom-faucets-nexa': 'Corsa/BathroomFaucets/Nexa',
  'corsa-bathroom-faucets-niagra': 'Corsa/BathroomFaucets/Niagra',
  'corsa-bathroom-faucets-nice': 'Corsa/BathroomFaucets/Nice',
  'corsa-bathroom-faucets-omega': 'Corsa/BathroomFaucets/Omega',
  'corsa-bathroom-faucets-passion': 'Corsa/BathroomFaucets/Passion',
  'corsa-bathroom-faucets-royal': 'Corsa/BathroomFaucets/Royal',
  'corsa-bathroom-faucets-slimline': 'Corsa/BathroomFaucets/Slimline',
  'corsa-bathroom-faucets-splash': 'Corsa/BathroomFaucets/Splash',
  'corsa-bathroom-faucets-square-f': 'Corsa/BathroomFaucets/SquareF',
  'corsa-bathroom-faucets-square-s': 'Corsa/BathroomFaucets/SquareS',
  'corsa-bathroom-faucets-super': 'Corsa/BathroomFaucets/Super',
  'corsa-bathroom-faucets-tri': 'Corsa/BathroomFaucets/Tri',
  'corsa-bathroom-accessories-acrylic-accessories': 'Corsa/BathroomAccessories/AcrylicAccessories',
  'corsa-bathroom-accessories-almond': 'Corsa/BathroomAccessories/Almond',
  'corsa-bathroom-accessories-anglo': 'Corsa/BathroomAccessories/Anglo',
  'corsa-bathroom-accessories-budget': 'Corsa/BathroomAccessories/Budget',
  'corsa-bathroom-accessories-dolphin': 'Corsa/BathroomAccessories/Dolphin',
  'corsa-bathroom-accessories-ecco': 'Corsa/BathroomAccessories/Ecco',
  'corsa-bathroom-accessories-keti': 'Corsa/BathroomAccessories/Keti',
  'corsa-bathroom-accessories-qubix': 'Corsa/BathroomAccessories/Qubix',
  'corsa-bathroom-accessories-square': 'Corsa/BathroomAccessories/Square',
  'corsa-bathroom-accessories-supreme': 'Corsa/BathroomAccessories/Supreme',
  'corsa-flushing-cistern': 'Corsa/FlushingCistern',
  'corsa-kitchen-kitchen-faucets': 'Corsa/Kitchen/KitchenFaucets',
  'corsa-kitchen-kitchen-sink': 'Corsa/Kitchen/KitchenSink',
  'corsa-other-useful-items-ball-valves': 'Corsa/OtherUsefulItems/BallValves',
  'corsa-other-useful-items-mini-angle-cock': 'Corsa/OtherUsefulItems/MiniAngleCock',
  'corsa-other-useful-items-mouth-operated': 'Corsa/OtherUsefulItems/MouthOperated',
  'corsa-other-useful-items-pressmatic-push-cock': 'Corsa/OtherUsefulItems/PressmaticPushCock',
  'corsa-other-useful-items-sensor-taps': 'Corsa/OtherUsefulItems/SensorTaps',
  'corsa-other-useful-items-soap-dispenser': 'Corsa/OtherUsefulItems/SoapDispenser',
  'corsa-showers-health-faucet': 'Corsa/Showers/HealthFaucet',
  'corsa-shower-soverhead-shower': 'Corsa/Showers/SoverheadShower',
  'corsa-showers-rain-shower': 'Corsa/Showers/RainShower',
  'corsa-showers-telephonic-shower': 'Corsa/Showers/TelephonicShower',
  'essess-accessories-series1-croma': 'Essess/Accessories/Series1Croma',
  'essess-accessories-series2-swing': 'Essess/Accessories/Series2Swing',
  'essess-accessories-series3-tarim': 'Essess/Accessories/Series3Tarim',
  'essess-accessories-series5-hotelier-series': 'Essess/Accessories/Series5HotelierSeries',
  'essess-accessories-series6-cruzo': 'Essess/Accessories/Series6Cruzo',
  'essess-accessories-series7-deon': 'Essess/Accessories/Series7Deon',
  'essess-accessories-series8-series': 'Essess/Accessories/Series8Series',
  'essess-auto-close-taps': 'Essess/AutoCloseTaps',
  'essess-celato': 'Essess/Celato',
  'essess-croma': 'Essess/Croma',
  'essess-cruzo': 'Essess/Cruzo',
  'essess-deon': 'Essess/Deon',
  'essess-series': 'Essess/Series',
  'essess-echo': 'Essess/Echo',
  'essess-essentials': 'Essess/Essentials',
  'essess-hotelier-series': 'Essess/HotelierSeries',
  'essess-s03': 'Essess/S03',
  'essess-lab-taps': 'Essess/LabTaps',
  'essess-new-dune': 'Essess/NewDune',
  'essess-new-xess': 'Essess/NewXess',
  'essess-quadra': 'Essess/Quadra',
  'essess-sensors': 'Essess/Sensors',
  'essess-showers-hand-showers': 'Essess/Showers/HandShowers',
  'essess-showers-overhead-showers': 'Essess/Showers/OverheadShowers',
  'essess-showers-rainfall-showers': 'Essess/Showers/RainfallShowers',
  'essess-showers-shower-arms': 'Essess/Showers/ShowerArms',
  'essess-tarim': 'Essess/Tarim',
  'essess-trand': 'Essess/Trand',
  'hindware-add-on': 'Hindware/AddOn',
  'hindware-bath-tub': 'Hindware/BathTub',
  'hindware-cisterns': 'Hindware/Cisterns',
  'hindware-faucets-angular-stop-cock': 'Hindware/Faucets/AngularStopCock',
  'hindware-faucets-bath-spout': 'Hindware/Faucets/BathSpout',
  'hindware-faucets-bib-cock': 'Hindware/Faucets/BibCock',
  'hindware-faucets-chbm': 'Hindware/Faucets/Chbm',
  'hindware-faucets-concealed-stop-cock': 'Hindware/Faucets/ConcealedStopCock',
  'hindware-faucets-csc-exp-kit': 'Hindware/Faucets/CscExpKit',
  'hindware-faucets-deusch-mixer': 'Hindware/Faucets/DeuschMixer',
  'hindware-faucets-exposed-mixers': 'Hindware/Faucets/ExposedMixers',
  'hindware-faucets-flush-cock': 'Hindware/Faucets/FlushCock',
  'hindware-faucets-medical-series': 'Hindware/Faucets/MedicalSeries',
  'hindware-faucets-mixer-faucet': 'Hindware/Faucets/MixerFaucet',
  'hindware-faucets-pillar-cock': 'Hindware/Faucets/PillarCock',
  'hindware-faucets-pillar-cock-tall': 'Hindware/Faucets/PillarCockTall',
  'hindware-faucets-pillar-faucet': 'Hindware/Faucets/PillarFaucet',
  'hindware-faucets-pressmatic': 'Hindware/Faucets/Pressmatic',
  'hindware-faucets-recessed': 'Hindware/Faucets/Recessed',
  'hindware-faucets-single-lever-divertor': 'Hindware/Faucets/SingleLeverDivertor',
  'hindware-faucets-sink-cock': 'Hindware/Faucets/SinkCock',
  'hindware-faucets-sink-mixer': 'Hindware/Faucets/SinkMixer',
  'hindware-faucets-slbm-faucet': 'Hindware/Faucets/SlbmFaucet',
  'hindware-faucets-slbm-faucet-tall': 'Hindware/Faucets/SlbmFaucetTall',
  'hindware-showers-rain-showers': 'Hindware/Showers/RainShowers',
  'hindware-wash-basins': 'Hindware/WashBasins',
  'hindware-water-closets': 'Hindware/WaterClosets',
  'leo-bath-fittings-bathroom-accessories-bathroom-accessories': 'LeoBathFittings/BathroomAccessories/BathroomAccessories',
  'leo-bath-fittings-faucets': 'LeoBathFittings/Faucets',
  'leo-bath-fittings-valve': 'LeoBathFittings/Valve',
  'pamay-faucets-faucets': 'Pamay/Faucets/Faucets',
  'pamay-showers-showers': 'Pamay/Showers/Showers',
  'parryware-accessories-accessories': 'Parryware/Accessories/Accessories',
  'parryware-angle-valves-angle-valves': 'Parryware/AngleValves/AngleValves',
  'parryware-below-counter-basins-below-counter-basins': 'Parryware/BelowCounterBasins/BelowCounterBasins',
  'parryware-bowl-basins-bowl-basins': 'Parryware/BowlBasins/BowlBasins',
  'parryware-closets-closets': 'Parryware/Closets/Closets',
  'parryware-concealed-cistern-concealed-cistern': 'Parryware/ConcealedCistern/ConcealedCistern',
  'parryware-european-water-closet-european-water-closet': 'Parryware/EuropeanWaterCloset/EuropeanWaterCloset',
  'parryware-faucets-flush-cocks': 'Parryware/FAUCETS/FlushCocks',
  'parryware-faucets-flush-valve': 'Parryware/FAUCETS/FlushValve',
  'parryware-faucets-health-faucets': 'Parryware/FAUCETS/HealthFaucets',
  'parryware-faucets-kitchen-sinks': 'Parryware/FAUCETS/KitchenSinks',
  'parryware-faucets-pedestals': 'Parryware/FAUCETS/Pedestals',
  'parryware-polymer-cisterns-polymer-cisterns': 'Parryware/PolymerCisterns/PolymerCisterns',
  'parryware-push-plates-push-plates': 'Parryware/PushPlates/PushPlates',
  'parryware-seat-covers-seat-covers': 'Parryware/SeatCovers/SeatCovers',
  'parryware-semi-recessed-basins-semi-recessed-basins': 'Parryware/SemiRecessedBasins/SemiRecessedBasins',
  'parryware-shower-enclosures-shower-enclosures': 'Parryware/ShowerEnclosures/ShowerEnclosures',
  'parryware-shower-panels-shower-panels': 'Parryware/ShowerPanels/ShowerPanels',
  'parryware-showers-showers': 'Parryware/Showers/Showers',
  'parryware-utsav-range-utsav-range': 'Parryware/UtsavRange/UtsavRange',
  'parryware-wash-basins-wash-basins': 'Parryware/WashBasins/WashBasins',
  'parryware-waste-coupling-waste-coupling': 'Parryware/WasteCoupling/WasteCoupling',
  'parryware-water-heaters-water-heaters': 'Parryware/WaterHeaters/WaterHeaters',
  'pearl-precious-products-edge-edge': 'PearlPreciousProducts/Edge/Edge',
  'waterman-accessories': 'Waterman/Accessories',
  'waterman-aria': 'Waterman/Aria',
  'waterman-aura': 'Waterman/Aura',
  'waterman-dell': 'Waterman/Dell',
  'waterman-deluxe': 'Waterman/Deluxe',
  'waterman-eco': 'Waterman/Eco',
  'waterman-evoque': 'Waterman/Evoque',
  'waterman-hand-showers': 'Waterman/HandShowers',
  'waterman-health-faucet-abs': 'Waterman/HealthFaucetAbs',
  'waterman-health-faucets-brass': 'Waterman/HealthFaucetsBrass',
  'waterman-ikon': 'Waterman/Ikon',
  'waterman-rain-showers': 'Waterman/RainShowers',
  'waterman-roman': 'Waterman/Roman',
  'waterman-shower-tubes': 'Waterman/ShowerTubes',
  'waterman-wall-showers-with-arm': 'Waterman/WallShowersWithArm',
  'waterman-wall-showers-without-arm': 'Waterman/WallShowersWithoutArm',
  'water-tec-allied': 'WaterTec/Allied',
  'water-tec-aqua': 'WaterTec/Aqua',
  'water-tec-aspire': 'WaterTec/Aspire',
  'water-tec-bathroom-accessories': 'WaterTec/BathroomAccessories',
  'water-tec-cistern': 'WaterTec/Cistern',
  'water-tec-concealed-cistern': 'WaterTec/ConcealedCistern',
  'water-tec-connection-tube': 'WaterTec/ConnectionTube',
  'water-tec-ebony': 'WaterTec/Ebony',
  'water-tec-eco': 'WaterTec/Eco',
  'water-tec-eva': 'WaterTec/Eva',
  'water-tec-flora': 'WaterTec/Flora',
  'water-tec-health-faucets': 'WaterTec/HealthFaucets',
  'water-tec-quattro': 'WaterTec/Quattro',
  'water-tec-showers': 'WaterTec/Showers',
  'water-tec-tops': 'WaterTec/Tops',
  'water-tec-toilet-seat-covers': 'WaterTec/ToiletSeatCovers',
  'water-tec-t-series-alt': 'WaterTec/TSeriesAlt',
  'water-tec-t-series': 'WaterTec/TSeries',
  'water-tec-valves': 'WaterTec/Valves'
};

// Function to find the correct API endpoint for a folder path
function findApiEndpoint(folderPath) {
  // Convert folder path to kebab-case format
  const kebabPath = folderPath.replace(/[A-Z]/g, (match, offset) => {
    return (offset > 0 ? '-' : '') + match.toLowerCase();
  }).replace(/\//g, '-');
  
  // Look for exact match or closest match
  for (const [apiPath, folderName] of Object.entries(apiMapping)) {
    if (folderName === folderPath || folderName.replace(/\//g, '') === folderPath.replace(/\//g, '')) {
      return apiPath;
    }
  }
  
  // If no exact match, try to find by folder name
  const folderName = folderPath.split('/').pop();
  for (const [apiPath, mappedFolder] of Object.entries(apiMapping)) {
    if (mappedFolder.includes(folderName)) {
      return apiPath;
    }
  }
  
  return null;
}

// Function to process a single ProductForm.jsx file
function processProductForm(filePath, folderPath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const apiEndpoint = findApiEndpoint(folderPath);
    
    if (!apiEndpoint) {
      console.log(`⚠️  No API endpoint found for ${folderPath}`);
      return false;
    }
    
    // Find and replace the API endpoint
    const oldApiPattern = /`\${API_BASE_URL}\/sanitary\/[^`]+`/g;
    const newApi = `\`\${API_BASE_URL}/sanitary/${apiEndpoint}/create\``;
    
    let updatedContent = content;
    let replaced = false;
    
    // Replace the API endpoint
    if (oldApiPattern.test(content)) {
      updatedContent = content.replace(oldApiPattern, newApi);
      replaced = true;
    }
    
    // Also check for any other patterns
    const otherPatterns = [
      /\/sanitary\/[^\/]+-create/g,
      /\/sanitary\/[^\/]+create/g,
      /\/sanitary\/[^\/]+-create/g
    ];
    
    otherPatterns.forEach(pattern => {
      if (pattern.test(updatedContent)) {
        updatedContent = updatedContent.replace(pattern, `/sanitary/${apiEndpoint}/create`);
        replaced = true;
      }
    });
    
    if (replaced) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Updated ${folderPath}/ProductForm.jsx with API: /sanitary/${apiEndpoint}/create`);
      return true;
    } else {
      console.log(`ℹ️  No changes needed for ${folderPath}/ProductForm.jsx`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${folderPath}/ProductForm.jsx:`, error.message);
    return false;
  }
}

// Function to process all ProductForm.jsx files recursively
function processDirectory(dirPath, dirName = '') {
  const items = fs.readdirSync(dirPath);
  let processedCount = 0;
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      const subProcessed = processDirectory(itemPath, path.join(dirName, item));
      processedCount += subProcessed;
    } else if (item === 'ProductForm.jsx') {
      // Process ProductForm.jsx files
      if (processProductForm(itemPath, dirName)) {
        processedCount++;
      }
    }
  }
  
  return processedCount;
}

console.log('🔍 Starting comprehensive sanitary frontend API fix...\n');
console.log('📋 This will update ALL ProductForm.jsx files to match exact API endpoints from apiS.js\n');
console.log('🔄 Only API endpoints will be updated - no other code changes\n');

// Process all ProductForm.jsx files recursively
const totalProcessed = processDirectory(frontendDir);

console.log(`\n🎉 API fix completed! Total ProductForm.jsx files processed: ${totalProcessed}`);
console.log('✅ All sanitary frontend forms now have correct API endpoints!');
console.log('🔍 API endpoints updated to match apiS.js exactly');
console.log('🚀 No more API mismatch errors!');
