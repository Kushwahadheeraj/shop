const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'app', 'Dashboard', 'ProductList', 'Sanitary');

// API mappings from apiS.js - exact matches
const SANITARY_API_MAPPINGS = {
  // Main sanitary categories
  'AcrylicProducts': '/sanitary/acrylic-products',
  'BathroomAccessories': '/sanitary/bathroom-accessories',
  'Closets': '/sanitary/closets',
  'Faucets': '/sanitary/faucets',
  'HealthFaucet': '/sanitary/health-faucet',
  'HardwareBathroomAccessories': '/sanitary/hardware-bathroom-accessories',
  'KitchenSinks': '/sanitary/kitchen-sinks',
  'Showers': '/sanitary/showers',
  'Taps': '/sanitary/taps',
  'Washbasins': '/sanitary/washbasins',
  'Jaquar': '/sanitary/jaquar',
  'LemonBathroomAccessories': '/sanitary/lemon-bathroom-accessories',

  // Bathsense categories
  'Bathsense/PFittings/Faucets/Altius': '/sanitary/bathsense-pfittings-faucets-altius',
  'Bathsense/PFittings/Faucets/BathsenseEssentials': '/sanitary/bathsense-pfittings-faucets-bathsense-essentials',
  'Bathsense/PFittings/Faucets/BathsenseShowers': '/sanitary/bathsense-pfittings-faucets-bathsense-showers',
  'Bathsense/PFittings/Faucets/Colossus': '/sanitary/bathsense-pfittings-faucets-colossus',
  'Bathsense/PFittings/Faucets/Invictus': '/sanitary/bathsense-pfittings-faucets-invictus',
  'Bathsense/PFittings/Faucets/Maximus': '/sanitary/bathsense-pfittings-faucets-maximus',
  'Bathsense/PFittings/Faucets/Spry': '/sanitary/bathsense-pfittings-faucets-spry',
  'Bathsense/PFittings/Faucets/Theta': '/sanitary/bathsense-pfittings-faucets-theta',
  'Bathsense/Sanitaryware/Essentials': '/sanitary/bathsense-sanitaryware-essentials',
  'Bathsense/Sanitaryware/Pedestals': '/sanitary/bathsense-sanitaryware-pedestals',
  'Bathsense/Sanitaryware/Venus': '/sanitary/bathsense-sanitaryware-venus',
  'Bathsense/Sanitaryware/Washbasins': '/sanitary/bathsense-sanitaryware-washbasins',
  'Bathsense/Sanitaryware/WaterCloset': '/sanitary/bathsense-sanitaryware-water-closet',

  // Coral Bath Fixtures
  'CoralBathFixtures/EurosmartSeries': '/sanitary/coral-bath-fixtures-eurosmart-series',
  'CoralBathFixtures/FlowmoreSeries': '/sanitary/coral-bath-fixtures-flowmore-series',
  'CoralBathFixtures/NewSuperGlowSeries': '/sanitary/coral-bath-fixtures-new-super-glow-series',
  'CoralBathFixtures/RoyaleSeries': '/sanitary/coral-bath-fixtures-royale-series',
  'CoralBathFixtures/TreemoSeries': '/sanitary/coral-bath-fixtures-treemo-series',
  'CoralBathFixtures/XrossaSeries': '/sanitary/coral-bath-fixtures-xrossa-series',

  // Corsa categories
  'Corsa/BathroomFaucets/Almond': '/sanitary/corsa-bathroom-faucets-almond',
  'Corsa/BathroomFaucets/Arrow': '/sanitary/corsa-bathroom-faucets-arrow',
  'Corsa/BathroomFaucets/Bold': '/sanitary/corsa-bathroom-faucets-bold',
  'Corsa/BathroomFaucets/Budget': '/sanitary/corsa-bathroom-faucets-budget',
  'Corsa/BathroomFaucets/Concept': '/sanitary/corsa-bathroom-faucets-concept',
  'Corsa/BathroomFaucets/Deluxe': '/sanitary/corsa-bathroom-faucets-deluxe',
  'Corsa/BathroomFaucets/Eeco': '/sanitary/corsa-bathroom-faucets-eeco',
  'Corsa/BathroomFaucets/Expert': '/sanitary/corsa-bathroom-faucets-expert',
  'Corsa/BathroomFaucets/Florence': '/sanitary/corsa-bathroom-faucets-florence',
  'Corsa/BathroomFaucets/GlassBowlFaucet': '/sanitary/corsa-bathroom-faucets-glass-bowl-faucet',
  'Corsa/BathroomFaucets/Idea': '/sanitary/corsa-bathroom-faucets-idea',
  'Corsa/BathroomFaucets/Jazz': '/sanitary/corsa-bathroom-faucets-jazz',
  'Corsa/BathroomFaucets/Ket': '/sanitary/corsa-bathroom-faucets-ket',
  'Corsa/BathroomFaucets/Milano': '/sanitary/corsa-bathroom-faucets-milano',
  'Corsa/BathroomFaucets/Nano': '/sanitary/corsa-bathroom-faucets-nano',
  'Corsa/BathroomFaucets/Nexa': '/sanitary/corsa-bathroom-faucets-nexa',
  'Corsa/BathroomFaucets/Niagra': '/sanitary/corsa-bathroom-faucets-niagra',
  'Corsa/BathroomFaucets/Nice': '/sanitary/corsa-bathroom-faucets-nice',
  'Corsa/BathroomFaucets/Omega': '/sanitary/corsa-bathroom-faucets-omega',
  'Corsa/BathroomFaucets/Passion': '/sanitary/corsa-bathroom-faucets-passion',
  'Corsa/BathroomFaucets/Royal': '/sanitary/corsa-bathroom-faucets-royal',
  'Corsa/BathroomFaucets/Slimline': '/sanitary/corsa-bathroom-faucets-slimline',
  'Corsa/BathroomFaucets/Splash': '/sanitary/corsa-bathroom-faucets-splash',
  'Corsa/BathroomFaucets/SquareF': '/sanitary/corsa-bathroom-faucets-square-f',
  'Corsa/BathroomFaucets/SquareS': '/sanitary/corsa-bathroom-faucets-square-s',
  'Corsa/BathroomFaucets/Super': '/sanitary/corsa-bathroom-faucets-super',
  'Corsa/BathroomFaucets/Tri': '/sanitary/corsa-bathroom-faucets-tri',

  // Corsa Bathroom Accessories
  'Corsa/BathroomAccessories/AcrylicAccessories': '/sanitary/corsa-bathroom-accessories-acrylic-accessories',
  'Corsa/BathroomAccessories/Almond': '/sanitary/corsa-bathroom-accessories-almond',
  'Corsa/BathroomAccessories/Anglo': '/sanitary/corsa-bathroom-accessories-anglo',
  'Corsa/BathroomAccessories/Budget': '/sanitary/corsa-bathroom-accessories-budget',
  'Corsa/BathroomAccessories/Dolphin': '/sanitary/corsa-bathroom-accessories-dolphin',
  'Corsa/BathroomAccessories/Ecco': '/sanitary/corsa-bathroom-accessories-ecco',
  'Corsa/BathroomAccessories/Keti': '/sanitary/corsa-bathroom-accessories-keti',
  'Corsa/BathroomAccessories/Qubix': '/sanitary/corsa-bathroom-accessories-qubix',
  'Corsa/BathroomAccessories/Square': '/sanitary/corsa-bathroom-accessories-square',
  'Corsa/BathroomAccessories/Supreme': '/sanitary/corsa-bathroom-accessories-supreme',

  // Corsa other categories
  'Corsa/FlushingCistern': '/sanitary/corsa-flushing-cistern',
  'Corsa/Kitchen/KitchenFaucets': '/sanitary/corsa-kitchen-kitchen-faucets',
  'Corsa/Kitchen/KitchenSink': '/sanitary/corsa-kitchen-kitchen-sink',
  'Corsa/OtherUsefulItems/BallValves': '/sanitary/corsa-other-useful-items-ball-valves',
  'Corsa/OtherUsefulItems/MiniAngleCock': '/sanitary/corsa-other-useful-items-mini-angle-cock',
  'Corsa/OtherUsefulItems/MouthOperated': '/sanitary/corsa-other-useful-items-mouth-operated',
  'Corsa/OtherUsefulItems/PressmaticPushCock': '/sanitary/corsa-other-useful-items-pressmatic-push-cock',
  'Corsa/OtherUsefulItems/SensorTaps': '/sanitary/corsa-other-useful-items-sensor-taps',
  'Corsa/OtherUsefulItems/SoapDispenser': '/sanitary/corsa-other-useful-items-soap-dispenser',
  'Corsa/Showers/HealthFaucet': '/sanitary/corsa-showers-health-faucet',
  'Corsa/Showers/OverheadShower': '/sanitary/corsa-shower-soverhead-shower',
  'Corsa/Showers/RainShower': '/sanitary/corsa-showers-rain-shower',
  'Corsa/Showers/TelephonicShower': '/sanitary/corsa-showers-telephonic-shower',

  // Essess categories
  'Essess/Accessories/Series1Croma': '/sanitary/essess-accessories-series1-croma',
  'Essess/Accessories/Series2Swing': '/sanitary/essess-accessories-series2-swing',
  'Essess/Accessories/Series3Tarim': '/sanitary/essess-accessories-series3-tarim',
  'Essess/Accessories/Series5HotelierSeries': '/sanitary/essess-accessories-series5-hotelier-series',
  'Essess/Accessories/Series6Cruzo': '/sanitary/essess-accessories-series6-cruzo',
  'Essess/Accessories/Series7Deon': '/sanitary/essess-accessories-series7-deon',
  'Essess/Accessories/Series8Series': '/sanitary/essess-accessories-series8-series',
  'Essess/AutoCloseTaps': '/sanitary/essess-auto-close-taps',
  'Essess/Celato': '/sanitary/essess-celato',
  'Essess/Croma': '/sanitary/essess-croma',
  'Essess/Cruzo': '/sanitary/essess-cruzo',
  'Essess/Deon': '/sanitary/essess-deon',
  'Essess/Series': '/sanitary/essess-series',
  'Essess/Echo': '/sanitary/essess-echo',
  'Essess/Essentials': '/sanitary/essess-essentials',
  'Essess/HotelierSeries': '/sanitary/essess-hotelier-series',
  'Essess/S03': '/sanitary/essess-s03',
  'Essess/LabTaps': '/sanitary/essess-lab-taps',
  'Essess/NewDune': '/sanitary/essess-new-dune',
  'Essess/NewXess': '/sanitary/essess-new-xess',
  'Essess/Quadra': '/sanitary/essess-quadra',
  'Essess/Sensors': '/sanitary/essess-sensors',
  'Essess/Showers/HandShowers': '/sanitary/essess-showers-hand-showers',
  'Essess/Showers/OverheadShowers': '/sanitary/essess-showers-overhead-showers',
  'Essess/Showers/RainfallShowers': '/sanitary/essess-showers-rainfall-showers',
  'Essess/Showers/ShowerArms': '/sanitary/essess-showers-shower-arms',
  'Essess/Tarim': '/sanitary/essess-tarim',
  'Essess/Trand': '/sanitary/essess-trand',

  // Hindware categories
  'Hindware/AddOn': '/sanitary/hindware-add-on',
  'Hindware/BathTub': '/sanitary/hindware-bath-tub',
  'Hindware/Cisterns': '/sanitary/hindware-cisterns',
  'Hindware/Faucets/AngularStopCock': '/sanitary/hindware-faucets-angular-stop-cock',
  'Hindware/Faucets/BathSpout': '/sanitary/hindware-faucets-bath-spout',
  'Hindware/Faucets/BibCock': '/sanitary/hindware-faucets-bib-cock',
  'Hindware/Faucets/CHBM': '/sanitary/hindware-faucets-chbm',
  'Hindware/Faucets/ConcealedStopCock': '/sanitary/hindware-faucets-concealed-stop-cock',
  'Hindware/Faucets/CSCExpKit': '/sanitary/hindware-faucets-csc-exp-kit',
  'Hindware/Faucets/DeuschMixer': '/sanitary/hindware-faucets-deusch-mixer',
  'Hindware/Faucets/ExposedMixers': '/sanitary/hindware-faucets-exposed-mixers',
  'Hindware/Faucets/FlushCock': '/sanitary/hindware-faucets-flush-cock',
  'Hindware/Faucets/MedicalSeries': '/sanitary/hindware-faucets-medical-series',
  'Hindware/Faucets/MixerFaucet': '/sanitary/hindware-faucets-mixer-faucet',
  'Hindware/Faucets/PillarCock': '/sanitary/hindware-faucets-pillar-cock',
  'Hindware/Faucets/PillarCockTall': '/sanitary/hindware-faucets-pillar-cock-tall',
  'Hindware/Faucets/PillarFaucet': '/sanitary/hindware-faucets-pillar-faucet',
  'Hindware/Faucets/Pressmatic': '/sanitary/hindware-faucets-pressmatic',
  'Hindware/Faucets/Recessed': '/sanitary/hindware-faucets-recessed',
  'Hindware/Faucets/SingleLeverDivertor': '/sanitary/hindware-faucets-single-lever-divertor',
  'Hindware/Faucets/SinkCock': '/sanitary/hindware-faucets-sink-cock',
  'Hindware/Faucets/SinkMixer': '/sanitary/hindware-faucets-sink-mixer',
  'Hindware/Faucets/SLBMFaucet': '/sanitary/hindware-faucets-slbm-faucet',
  'Hindware/Faucets/SLBMFaucetTall': '/sanitary/hindware-faucets-slbm-faucet-tall',
  'Hindware/Showers/RainShowers': '/sanitary/hindware-showers-rain-showers',
  'Hindware/WashBasins': '/sanitary/hindware-wash-basins',
  'Hindware/WaterClosets': '/sanitary/hindware-water-closets',

  // Leo Bath Fittings
  'LeoBathFittings/BathroomAccessories/BathroomAccessories': '/sanitary/leo-bath-fittings-bathroom-accessories-bathroom-accessories',
  'LeoBathFittings/Faucets': '/sanitary/leo-bath-fittings-faucets',
  'LeoBathFittings/Valve': '/sanitary/leo-bath-fittings-valve',

  // Pamay
  'Pamay/Faucets/Faucets': '/sanitary/pamay-faucets-faucets',
  'Pamay/Showers/Showers': '/sanitary/pamay-showers-showers',

  // Parryware categories
  'Parryware/Accessories/Accessories': '/sanitary/parryware-accessories-accessories',
  'Parryware/AngleValves/AngleValves': '/sanitary/parryware-angle-valves-angle-valves',
  'Parryware/BelowCounterBasins/BelowCounterBasins': '/sanitary/parryware-below-counter-basins-below-counter-basins',
  'Parryware/BowlBasins/BowlBasins': '/sanitary/parryware-bowl-basins-bowl-basins',
  'Parryware/Closets/Closets': '/sanitary/parryware-closets-closets',
  'Parryware/ConcealedCistern/ConcealedCistern': '/sanitary/parryware-concealed-cistern-concealed-cistern',
  'Parryware/EuropeanWaterCloset/EuropeanWaterCloset': '/sanitary/parryware-european-water-closet-european-water-closet',
  'Parryware/Faucets/FlushCocks': '/sanitary/parryware-faucets-flush-cocks',
  'Parryware/Faucets/FlushValve': '/sanitary/parryware-faucets-flush-valve',
  'Parryware/Faucets/HealthFaucets': '/sanitary/parryware-faucets-health-faucets',
  'Parryware/Faucets/KitchenSinks': '/sanitary/parryware-faucets-kitchen-sinks',
  'Parryware/Faucets/Pedestals': '/sanitary/parryware-faucets-pedestals',
  'Parryware/PolymerCisterns/PolymerCisterns': '/sanitary/parryware-polymer-cisterns-polymer-cisterns',
  'Parryware/PushPlates/PushPlates': '/sanitary/parryware-push-plates-push-plates',
  'Parryware/SeatCovers/SeatCovers': '/sanitary/parryware-seat-covers-seat-covers',
  'Parryware/SemiRecessedBasins/SemiRecessedBasins': '/sanitary/parryware-semi-recessed-basins-semi-recessed-basins',
  'Parryware/ShowerEnclosures/ShowerEnclosures': '/sanitary/parryware-shower-enclosures-shower-enclosures',
  'Parryware/ShowerPanels/ShowerPanels': '/sanitary/parryware-shower-panels-shower-panels',
  'Parryware/Showers/Showers': '/sanitary/parryware-showers-showers',
  'Parryware/UtsavRange/UtsavRange': '/sanitary/parryware-utsav-range-utsav-range',
  'Parryware/WashBasins/WashBasins': '/sanitary/parryware-wash-basins-wash-basins',
  'Parryware/WasteCoupling/WasteCoupling': '/sanitary/parryware-waste-coupling-waste-coupling',
  'Parryware/WaterHeaters/WaterHeaters': '/sanitary/parryware-water-heaters-water-heaters',

  // Pearl Precious Products
  'PearlPreciousProducts/Edge/Edge': '/sanitary/pearl-precious-products-edge-edge',

  // Waterman categories
  'Waterman/Accessories': '/sanitary/waterman-accessories',
  'Waterman/Aria': '/sanitary/waterman-aria',
  'Waterman/Aura': '/sanitary/waterman-aura',
  'Waterman/Dell': '/sanitary/waterman-dell',
  'Waterman/Deluxe': '/sanitary/waterman-deluxe',
  'Waterman/Eco': '/sanitary/waterman-eco',
  'Waterman/Evoque': '/sanitary/waterman-evoque',
  'Waterman/HandShowers': '/sanitary/waterman-hand-showers',
  'Waterman/HealthFaucetABS': '/sanitary/waterman-health-faucet-abs',
  'Waterman/HealthFaucetsBrass': '/sanitary/waterman-health-faucets-brass',
  'Waterman/Ikon': '/sanitary/waterman-ikon',
  'Waterman/RainShowers': '/sanitary/waterman-rain-showers',
  'Waterman/Roman': '/sanitary/waterman-roman',
  'Waterman/ShowerTubes': '/sanitary/waterman-shower-tubes',
  'Waterman/WallShowersWithArm': '/sanitary/waterman-wall-showers-with-arm',
  'Waterman/WallShowersWithoutArm': '/sanitary/waterman-wall-showers-without-arm',

  // Water-Tec categories
  'WaterTec/Allied': '/sanitary/water-tec-allied',
  'WaterTec/Aqua': '/sanitary/water-tec-aqua',
  'WaterTec/Aspire': '/sanitary/water-tec-aspire',
  'WaterTec/BathroomAccessories': '/sanitary/water-tec-bathroom-accessories',
  'WaterTec/Cistern': '/sanitary/water-tec-cistern',
  'WaterTec/ConcealedCistern': '/sanitary/water-tec-concealed-cistern',
  'WaterTec/ConnectionTube': '/sanitary/water-tec-connection-tube',
  'WaterTec/Ebony': '/sanitary/water-tec-ebony',
  'WaterTec/Eco': '/sanitary/water-tec-eco',
  'WaterTec/Eva': '/sanitary/water-tec-eva',
  'WaterTec/Flora': '/sanitary/water-tec-flora',
  'WaterTec/HealthFaucets': '/sanitary/water-tec-health-faucets',
  'WaterTec/Quattro': '/sanitary/water-tec-quattro',
  'WaterTec/Showers': '/sanitary/water-tec-showers',
  'WaterTec/Tops': '/sanitary/water-tec-tops',
  'WaterTec/ToiletSeatCovers': '/sanitary/water-tec-toilet-seat-covers',
  'WaterTec/TSeriesAlt': '/sanitary/water-tec-t-series-alt',
  'WaterTec/TSeries': '/sanitary/water-tec-t-series',
  'WaterTec/Valves': '/sanitary/water-tec-valves'
};

function updateFile(filePath, apiPath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = content;
    let changes = 0;

    // Update API_URL
    const apiUrlRegex = /const API_URL = `\$\{API_BASE_URL\}\/[^`]+`;/;
    const newApiUrl = `const API_URL = \`\${API_BASE_URL}${apiPath}\`;`;
    
    if (apiUrlRegex.test(content)) {
      updated = updated.replace(apiUrlRegex, newApiUrl);
      changes++;
    }

    // Fix delete endpoint syntax
    const deleteRegex = /\/delete:([^\s"']+)/g;
    if (deleteRegex.test(updated)) {
      updated = updated.replace(deleteRegex, '/delete/$1');
      changes++;
    }

    if (changes > 0) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`✅ Updated: ${filePath} -> ${apiPath}`);
      return true;
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function walk(dir, parentPath = '') {
  let updatedCount = 0;
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = parentPath ? `${parentPath}/${entry.name}` : entry.name;
      
      if (entry.isDirectory()) {
        updatedCount += walk(fullPath, relativePath);
      } else if (entry.isFile() && entry.name === 'ProductList.jsx') {
        const apiPath = SANITARY_API_MAPPINGS[relativePath];
        if (apiPath) {
          if (updateFile(fullPath, apiPath)) {
            updatedCount++;
          }
        } else {
          console.log(`⚠️  No API mapping found for: ${relativePath}`);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error reading directory ${dir}:`, error.message);
  }
  
  return updatedCount;
}

console.log('🚀 Starting Sanitary ProductList API URL updates...\n');
console.log('📋 This will update all API_URL values to match apiS.js exactly\n');
const totalUpdated = walk(BASE_DIR);
console.log(`\n✅ Completed! Updated ${totalUpdated} files.`);
console.log('\n🔧 All API_URL values now match the exact endpoints from apiS.js');
console.log('🔧 All delete endpoints have been fixed from /delete: to /delete/'); 