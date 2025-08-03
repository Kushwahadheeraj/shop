const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'app', 'Dashboard', 'ProductList');

// Sanitary API mappings from api.js
const SANITARY_API_MAPPINGS = {
  // Main sanitary categories
  'Sanitary/AcrylicProducts': '/sanitary/acrylic-products',
  'Sanitary/BathroomAccessories': '/sanitary/bathroom-accessories',
  'Sanitary/Closets': '/sanitary/closets',
  'Sanitary/Faucets': '/sanitary/faucets',
  'Sanitary/HealthFaucet': '/sanitary/health-faucet',
  'Sanitary/KitchenSinks': '/sanitary/kitchen-sinks',
  'Sanitary/Showers': '/sanitary/showers',
  'Sanitary/Taps': '/sanitary/taps',
  'Sanitary/Washbasins': '/sanitary/washbasins',
  
  // Bathsense categories
  'Sanitary/Bathsense/PFittings/Faucets/Altius': '/sanitary/bathsense-pfittings-faucets-altius',
  'Sanitary/Bathsense/PFittings/Faucets/BathsenseEssentials': '/sanitary/bathsense-pfittings-faucets-bathsense-essentials',
  'Sanitary/Bathsense/PFittings/Faucets/BathsenseShowers': '/sanitary/bathsense-pfittings-faucets-bathsense-showers',
  'Sanitary/Bathsense/PFittings/Faucets/Colossus': '/sanitary/bathsense-pfittings-faucets-colossus',
  'Sanitary/Bathsense/PFittings/Faucets/Invictus': '/sanitary/bathsense-pfittings-faucets-invictus',
  'Sanitary/Bathsense/PFittings/Faucets/Maximus': '/sanitary/bathsense-pfittings-faucets-maximus',
  'Sanitary/Bathsense/PFittings/Faucets/Spry': '/sanitary/bathsense-pfittings-faucets-spry',
  'Sanitary/Bathsense/PFittings/Faucets/Theta': '/sanitary/bathsense-pfittings-faucets-theta',
  'Sanitary/Bathsense/Sanitaryware/Essentials': '/sanitary/bathsense-sanitaryware-essentials',
  'Sanitary/Bathsense/Sanitaryware/Pedestals': '/sanitary/bathsense-sanitaryware-pedestals',
  'Sanitary/Bathsense/Sanitaryware/Venus': '/sanitary/bathsense-sanitaryware-venus',
  'Sanitary/Bathsense/Sanitaryware/Washbasins': '/sanitary/bathsense-sanitaryware-washbasins',
  'Sanitary/Bathsense/Sanitaryware/WaterCloset': '/sanitary/bathsense-sanitaryware-water-closet',
  
  // Coral Bath Fixtures
  'Sanitary/CoralBathFixtures/EurosmartSeries': '/sanitary/coral-bath-fixtures-eurosmart-series',
  'Sanitary/CoralBathFixtures/FlowmoreSeries': '/sanitary/coral-bath-fixtures-flowmore-series',
  'Sanitary/CoralBathFixtures/NewSuperGlowSeries': '/sanitary/coral-bath-fixtures-new-super-glow-series',
  'Sanitary/CoralBathFixtures/RoyaleSeries': '/sanitary/coral-bath-fixtures-royale-series',
  'Sanitary/CoralBathFixtures/TreemoSeries': '/sanitary/coral-bath-fixtures-treemo-series',
  'Sanitary/CoralBathFixtures/XrossaSeries': '/sanitary/coral-bath-fixtures-xrossa-series',
  
  // Corsa categories
  'Sanitary/Corsa/BathroomFaucets/Almond': '/sanitary/corsa-bathroom-faucets-almond',
  'Sanitary/Corsa/BathroomFaucets/Arrow': '/sanitary/corsa-bathroom-faucets-arrow',
  'Sanitary/Corsa/BathroomFaucets/Bold': '/sanitary/corsa-bathroom-faucets-bold',
  'Sanitary/Corsa/BathroomFaucets/Budget': '/sanitary/corsa-bathroom-faucets-budget',
  'Sanitary/Corsa/BathroomFaucets/Concept': '/sanitary/corsa-bathroom-faucets-concept',
  'Sanitary/Corsa/BathroomFaucets/Deluxe': '/sanitary/corsa-bathroom-faucets-deluxe',
  'Sanitary/Corsa/BathroomFaucets/Eeco': '/sanitary/corsa-bathroom-faucets-eeco',
  'Sanitary/Corsa/BathroomFaucets/Expert': '/sanitary/corsa-bathroom-faucets-expert',
  'Sanitary/Corsa/BathroomFaucets/Florence': '/sanitary/corsa-bathroom-faucets-florence',
  'Sanitary/Corsa/BathroomFaucets/GlassBowlFaucet': '/sanitary/corsa-bathroom-faucets-glass-bowl-faucet',
  'Sanitary/Corsa/BathroomFaucets/Idea': '/sanitary/corsa-bathroom-faucets-idea',
  'Sanitary/Corsa/BathroomFaucets/Jazz': '/sanitary/corsa-bathroom-faucets-jazz',
  'Sanitary/Corsa/BathroomFaucets/Ket': '/sanitary/corsa-bathroom-faucets-ket',
  'Sanitary/Corsa/BathroomFaucets/Milano': '/sanitary/corsa-bathroom-faucets-milano',
  'Sanitary/Corsa/BathroomFaucets/Nano': '/sanitary/corsa-bathroom-faucets-nano',
  'Sanitary/Corsa/BathroomFaucets/Nexa': '/sanitary/corsa-bathroom-faucets-nexa',
  'Sanitary/Corsa/BathroomFaucets/Niagra': '/sanitary/corsa-bathroom-faucets-niagra',
  'Sanitary/Corsa/BathroomFaucets/Nice': '/sanitary/corsa-bathroom-faucets-nice',
  'Sanitary/Corsa/BathroomFaucets/Omega': '/sanitary/corsa-bathroom-faucets-omega',
  'Sanitary/Corsa/BathroomFaucets/Passion': '/sanitary/corsa-bathroom-faucets-passion',
  'Sanitary/Corsa/BathroomFaucets/Royal': '/sanitary/corsa-bathroom-faucets-royal',
  'Sanitary/Corsa/BathroomFaucets/Slimline': '/sanitary/corsa-bathroom-faucets-slimline',
  'Sanitary/Corsa/BathroomFaucets/Splash': '/sanitary/corsa-bathroom-faucets-splash',
  'Sanitary/Corsa/BathroomFaucets/SquareF': '/sanitary/corsa-bathroom-faucets-square-f',
  'Sanitary/Corsa/BathroomFaucets/SquareS': '/sanitary/corsa-bathroom-faucets-square-s',
  'Sanitary/Corsa/BathroomFaucets/Super': '/sanitary/corsa-bathroom-faucets-super',
  'Sanitary/Corsa/BathroomFaucets/Tri': '/sanitary/corsa-bathroom-faucets-tri',
  
  // Corsa Bathroom Accessories
  'Sanitary/Corsa/BathroomAccessories/AcrylicAccessories': '/sanitary/corsa-bathroom-accessories-acrylic-accessories',
  'Sanitary/Corsa/BathroomAccessories/Almond': '/sanitary/corsa-bathroom-accessories-almond',
  'Sanitary/Corsa/BathroomAccessories/Anglo': '/sanitary/corsa-bathroom-accessories-anglo',
  'Sanitary/Corsa/BathroomAccessories/Budget': '/sanitary/corsa-bathroom-accessories-budget',
  'Sanitary/Corsa/BathroomAccessories/Dolphin': '/sanitary/corsa-bathroom-accessories-dolphin',
  'Sanitary/Corsa/BathroomAccessories/Ecco': '/sanitary/corsa-bathroom-accessories-ecco',
  'Sanitary/Corsa/BathroomAccessories/Keti': '/sanitary/corsa-bathroom-accessories-keti',
  'Sanitary/Corsa/BathroomAccessories/Qubix': '/sanitary/corsa-bathroom-accessories-qubix',
  'Sanitary/Corsa/BathroomAccessories/Square': '/sanitary/corsa-bathroom-accessories-square',
  'Sanitary/Corsa/BathroomAccessories/Supreme': '/sanitary/corsa-bathroom-accessories-supreme',
  
  // Corsa other categories
  'Sanitary/Corsa/FlushingCistern': '/sanitary/corsa-flushing-cistern',
  'Sanitary/Corsa/Kitchen/KitchenFaucets': '/sanitary/corsa-kitchen-kitchen-faucets',
  'Sanitary/Corsa/Kitchen/KitchenSink': '/sanitary/corsa-kitchen-kitchen-sink',
  'Sanitary/Corsa/OtherUsefulItems/BallValves': '/sanitary/corsa-other-useful-items-ball-valves',
  'Sanitary/Corsa/OtherUsefulItems/MiniAngleCock': '/sanitary/corsa-other-useful-items-mini-angle-cock',
  'Sanitary/Corsa/OtherUsefulItems/MouthOperated': '/sanitary/corsa-other-useful-items-mouth-operated',
  'Sanitary/Corsa/OtherUsefulItems/PressmaticPushCock': '/sanitary/corsa-other-useful-items-pressmatic-push-cock',
  'Sanitary/Corsa/OtherUsefulItems/SensorTaps': '/sanitary/corsa-other-useful-items-sensor-taps',
  'Sanitary/Corsa/OtherUsefulItems/SoapDispenser': '/sanitary/corsa-other-useful-items-soap-dispenser',
  'Sanitary/Corsa/Showers/HealthFaucet': '/sanitary/corsa-showers-health-faucet',
  'Sanitary/Corsa/Showers/OverheadShower': '/sanitary/corsa-shower-soverhead-shower',
  'Sanitary/Corsa/Showers/RainShower': '/sanitary/corsa-showers-rain-shower',
  'Sanitary/Corsa/Showers/TelephonicShower': '/sanitary/corsa-showers-telephonic-shower',
  
  // Essess categories
  'Sanitary/Essess/Accessories/Series1Croma': '/sanitary/essess-accessories-series1-croma',
  'Sanitary/Essess/Accessories/Series2Swing': '/sanitary/essess-accessories-series2-swing',
  'Sanitary/Essess/Accessories/Series3Tarim': '/sanitary/essess-accessories-series3-tarim',
  'Sanitary/Essess/Accessories/Series5HotelierSeries': '/sanitary/essess-accessories-series5-hotelier-series',
  'Sanitary/Essess/Accessories/Series6Cruzo': '/sanitary/essess-accessories-series6-cruzo',
  'Sanitary/Essess/Accessories/Series7Deon': '/sanitary/essess-accessories-series7-deon',
  'Sanitary/Essess/Accessories/Series8Series': '/sanitary/essess-accessories-series8-series',
  'Sanitary/Essess/AutoCloseTaps': '/sanitary/essess-auto-close-taps',
  'Sanitary/Essess/Celato': '/sanitary/essess-celato',
  'Sanitary/Essess/Croma': '/sanitary/essess-croma',
  'Sanitary/Essess/Cruzo': '/sanitary/essess-cruzo',
  'Sanitary/Essess/Deon': '/sanitary/essess-deon',
  'Sanitary/Essess/Series': '/sanitary/essess-series',
  'Sanitary/Essess/Echo': '/sanitary/essess-echo',
  'Sanitary/Essess/Essentials': '/sanitary/essess-essentials',
  'Sanitary/Essess/HotelierSeries': '/sanitary/essess-hotelier-series',
  'Sanitary/Essess/S03': '/sanitary/essess-s03',
  'Sanitary/Essess/LabTaps': '/sanitary/essess-lab-taps',
  'Sanitary/Essess/NewDune': '/sanitary/essess-new-dune',
  'Sanitary/Essess/NewXess': '/sanitary/essess-new-xess',
  'Sanitary/Essess/Quadra': '/sanitary/essess-quadra',
  'Sanitary/Essess/Sensors': '/sanitary/essess-sensors',
  'Sanitary/Essess/Showers/HandShowers': '/sanitary/essess-showers-hand-showers',
  'Sanitary/Essess/Showers/OverheadShowers': '/sanitary/essess-showers-overhead-showers',
  'Sanitary/Essess/Showers/RainfallShowers': '/sanitary/essess-showers-rainfall-showers',
  'Sanitary/Essess/Showers/ShowerArms': '/sanitary/essess-showers-shower-arms',
  'Sanitary/Essess/Tarim': '/sanitary/essess-tarim',
  'Sanitary/Essess/Trand': '/sanitary/essess-trand',
  
  // Hindware categories
  'Sanitary/Hindware/AddOn': '/sanitary/hindware-add-on',
  'Sanitary/Hindware/BathTub': '/sanitary/hindware-bath-tub',
  'Sanitary/Hindware/Cisterns': '/sanitary/hindware-cisterns',
  'Sanitary/Hindware/Faucets/AngularStopCock': '/sanitary/hindware-faucets-angular-stop-cock',
  'Sanitary/Hindware/Faucets/BathSpout': '/sanitary/hindware-faucets-bath-spout',
  'Sanitary/Hindware/Faucets/BibCock': '/sanitary/hindware-faucets-bib-cock',
  'Sanitary/Hindware/Faucets/CHBM': '/sanitary/hindware-faucets-chbm',
  'Sanitary/Hindware/Faucets/ConcealedStopCock': '/sanitary/hindware-faucets-concealed-stop-cock',
  'Sanitary/Hindware/Faucets/CSCExpKit': '/sanitary/hindware-faucets-csc-exp-kit',
  'Sanitary/Hindware/Faucets/DeuschMixer': '/sanitary/hindware-faucets-deusch-mixer',
  'Sanitary/Hindware/Faucets/ExposedMixers': '/sanitary/hindware-faucets-exposed-mixers',
  'Sanitary/Hindware/Faucets/FlushCock': '/sanitary/hindware-faucets-flush-cock',
  'Sanitary/Hindware/Faucets/MedicalSeries': '/sanitary/hindware-faucets-medical-series',
  'Sanitary/Hindware/Faucets/MixerFaucet': '/sanitary/hindware-faucets-mixer-faucet',
  'Sanitary/Hindware/Faucets/PillarCock': '/sanitary/hindware-faucets-pillar-cock',
  'Sanitary/Hindware/Faucets/PillarCockTall': '/sanitary/hindware-faucets-pillar-cock-tall',
  'Sanitary/Hindware/Faucets/PillarFaucet': '/sanitary/hindware-faucets-pillar-faucet',
  'Sanitary/Hindware/Faucets/Pressmatic': '/sanitary/hindware-faucets-pressmatic',
  'Sanitary/Hindware/Faucets/Recessed': '/sanitary/hindware-faucets-recessed',
  'Sanitary/Hindware/Faucets/SingleLeverDivertor': '/sanitary/hindware-faucets-single-lever-divertor',
  'Sanitary/Hindware/Faucets/SinkCock': '/sanitary/hindware-faucets-sink-cock',
  'Sanitary/Hindware/Faucets/SinkMixer': '/sanitary/hindware-faucets-sink-mixer',
  'Sanitary/Hindware/Faucets/SLBMFaucet': '/sanitary/hindware-faucets-slbm-faucet',
  'Sanitary/Hindware/Faucets/SLBMFaucetTall': '/sanitary/hindware-faucets-slbm-faucet-tall',
  'Sanitary/Hindware/Showers/RainShowers': '/sanitary/hindware-showers-rain-showers',
  'Sanitary/Hindware/WashBasins': '/sanitary/hindware-wash-basins',
  'Sanitary/Hindware/WaterClosets': '/sanitary/hindware-water-closets',
  
  // Other brands
  'Sanitary/Jaquar': '/sanitary/jaquar',
  'Sanitary/LeoBathFittings/BathroomAccessories/BathroomAccessories': '/sanitary/leo-bath-fittings-bathroom-accessories-bathroom-accessories',
  'Sanitary/LeoBathFittings/Faucets': '/sanitary/leo-bath-fittings-faucets',
  'Sanitary/LeoBathFittings/Valve': '/sanitary/leo-bath-fittings-valve',
  'Sanitary/Pamay/Faucets/Faucets': '/sanitary/pamay-faucets-faucets',
  'Sanitary/Pamay/Showers/Showers': '/sanitary/pamay-showers-showers',
  
  // Parryware categories
  'Sanitary/Parryware/Accessories/Accessories': '/sanitary/parryware-accessories-accessories',
  'Sanitary/Parryware/AngleValves/AngleValves': '/sanitary/parryware-angle-valves-angle-valves',
  'Sanitary/Parryware/BelowCounterBasins/BelowCounterBasins': '/sanitary/parryware-below-counter-basins-below-counter-basins',
  'Sanitary/Parryware/BowlBasins/BowlBasins': '/sanitary/parryware-bowl-basins-bowl-basins',
  'Sanitary/Parryware/Closets/Closets': '/sanitary/parryware-closets-closets',
  'Sanitary/Parryware/ConcealedCistern/ConcealedCistern': '/sanitary/parryware-concealed-cistern-concealed-cistern',
  'Sanitary/Parryware/EuropeanWaterCloset/EuropeanWaterCloset': '/sanitary/parryware-european-water-closet-european-water-closet',
  'Sanitary/Parryware/Faucets/FlushCocks': '/sanitary/parryware-faucets-flush-cocks',
  'Sanitary/Parryware/Faucets/FlushValve': '/sanitary/parryware-faucets-flush-valve',
  'Sanitary/Parryware/Faucets/HealthFaucets': '/sanitary/parryware-faucets-health-faucets',
  'Sanitary/Parryware/Faucets/KitchenSinks': '/sanitary/parryware-faucets-kitchen-sinks',
  'Sanitary/Parryware/Faucets/Pedestals': '/sanitary/parryware-faucets-pedestals',
  'Sanitary/Parryware/PolymerCisterns/PolymerCisterns': '/sanitary/parryware-polymer-cisterns-polymer-cisterns',
  'Sanitary/Parryware/PushPlates/PushPlates': '/sanitary/parryware-push-plates-push-plates',
  'Sanitary/Parryware/SeatCovers/SeatCovers': '/sanitary/parryware-seat-covers-seat-covers',
  'Sanitary/Parryware/SemiRecessedBasins/SemiRecessedBasins': '/sanitary/parryware-semi-recessed-basins-semi-recessed-basins',
  'Sanitary/Parryware/ShowerEnclosures/ShowerEnclosures': '/sanitary/parryware-shower-enclosures-shower-enclosures',
  'Sanitary/Parryware/ShowerPanels/ShowerPanels': '/sanitary/parryware-shower-panels-shower-panels',
  'Sanitary/Parryware/Showers/Showers': '/sanitary/parryware-showers-showers',
  'Sanitary/Parryware/UtsavRange/UtsavRange': '/sanitary/parryware-utsav-range-utsav-range',
  'Sanitary/Parryware/WashBasins/WashBasins': '/sanitary/parryware-wash-basins-wash-basins',
  'Sanitary/Parryware/WasteCoupling/WasteCoupling': '/sanitary/parryware-waste-coupling-waste-coupling',
  'Sanitary/Parryware/WaterHeaters/WaterHeaters': '/sanitary/parryware-water-heaters-water-heaters',
  
  // Other sanitary brands
  'Sanitary/PearlPreciousProducts/Edge/Edge': '/sanitary/pearl-precious-products-edge-edge',
  
  // Waterman categories
  'Sanitary/Waterman/Accessories': '/sanitary/waterman-accessories',
  'Sanitary/Waterman/Aria': '/sanitary/waterman-aria',
  'Sanitary/Waterman/Aura': '/sanitary/waterman-aura',
  'Sanitary/Waterman/Dell': '/sanitary/waterman-dell',
  'Sanitary/Waterman/Deluxe': '/sanitary/waterman-deluxe',
  'Sanitary/Waterman/Eco': '/sanitary/waterman-eco',
  'Sanitary/Waterman/Evoque': '/sanitary/waterman-evoque',
  'Sanitary/Waterman/HandShowers': '/sanitary/waterman-hand-showers',
  'Sanitary/Waterman/HealthFaucetABS': '/sanitary/waterman-health-faucet-abs',
  'Sanitary/Waterman/HealthFaucetsBrass': '/sanitary/waterman-health-faucets-brass',
  'Sanitary/Waterman/Ikon': '/sanitary/waterman-ikon',
  'Sanitary/Waterman/RainShowers': '/sanitary/waterman-rain-showers',
  'Sanitary/Waterman/Roman': '/sanitary/waterman-roman',
  'Sanitary/Waterman/ShowerTubes': '/sanitary/waterman-shower-tubes',
  'Sanitary/Waterman/WallShowersWithArm': '/sanitary/waterman-wall-showers-with-arm',
  'Sanitary/Waterman/WallShowersWithoutArm': '/sanitary/waterman-wall-showers-without-arm',
  
  // Water-Tec categories
  'Sanitary/WaterTec/Allied': '/sanitary/water-tec-allied',
  'Sanitary/WaterTec/Aqua': '/sanitary/water-tec-aqua',
  'Sanitary/WaterTec/Aspire': '/sanitary/water-tec-aspire',
  'Sanitary/WaterTec/BathroomAccessories': '/sanitary/water-tec-bathroom-accessories',
  'Sanitary/WaterTec/Cistern': '/sanitary/water-tec-cistern',
  'Sanitary/WaterTec/ConcealedCistern': '/sanitary/water-tec-concealed-cistern',
  'Sanitary/WaterTec/ConnectionTube': '/sanitary/water-tec-connection-tube',
  'Sanitary/WaterTec/Ebony': '/sanitary/water-tec-ebony',
  'Sanitary/WaterTec/Eco': '/sanitary/water-tec-eco',
  'Sanitary/WaterTec/Eva': '/sanitary/water-tec-eva',
  'Sanitary/WaterTec/Flora': '/sanitary/water-tec-flora',
  'Sanitary/WaterTec/HealthFaucets': '/sanitary/water-tec-health-faucets',
  'Sanitary/WaterTec/Quattro': '/sanitary/water-tec-quattro',
  'Sanitary/WaterTec/Showers': '/sanitary/water-tec-showers',
  'Sanitary/WaterTec/Tops': '/sanitary/water-tec-tops',
  'Sanitary/WaterTec/ToiletSeatCovers': '/sanitary/water-tec-toilet-seat-covers',
  'Sanitary/WaterTec/TSeriesAlt': '/sanitary/water-tec-t-series-alt',
  'Sanitary/WaterTec/TSeries': '/sanitary/water-tec-t-series',
  'Sanitary/WaterTec/Valves': '/sanitary/water-tec-valves'
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
const totalUpdated = walk(BASE_DIR);
console.log(`\n✅ Completed! Updated ${totalUpdated} files.`); 