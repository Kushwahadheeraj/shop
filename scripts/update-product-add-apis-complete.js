const fs = require('fs');
const path = require('path');

// Complete API endpoints mapping from api.js
const API_ENDPOINTS = {
  // Simple folders
  'Adhesives': 'adhesives/create',
  'Brush': 'brush/create',
  'Cements': 'cements/create',
  'Cleaning': 'cleaning/create',
  'Dry': 'dry/create',
  'Fiber': 'fiber/create',
  'Fitting': 'fitting/create',
  'Hardware': 'hardware/create',
  'HomeDecor': 'homedecor/create',
  'Uncategorized': 'uncategorized/create',
  'WaterProofing': 'waterproofing/create',
  'Tools': 'tools/create',
  'Sanitary': 'sanitary/create',
  'Roofer': 'roofer/create',
  'PvcMats': 'pvcmats/create',
  'Pipe': 'pipe/create',
  'Locks': 'locks/create',

  // Electrical subfolders
  'Electrical/Adaptors': 'electrical/adaptors/create',
  'Electrical/CeilingRoses': 'electrical/ceilingRoses/create',
  'Electrical/Dimmer': 'electrical/dimmer/create',
  'Electrical/DistributionBoards': 'electrical/distributionBoards/create',
  'Electrical/DoorBells': 'electrical/doorBells/create',
  'Electrical/DPswitch': 'electrical/dPswitch/create',
  'Electrical/EarthingAccessories': 'electrical/earthingAccessories/create',
  'Electrical/ELCBsRCCBs': 'electrical/eLCBsRCCBs/create',
  'Electrical/FlexibleConduit': 'electrical/flexibleConduit/create',
  'Electrical/FlexibleWires': 'electrical/flexibleWires/create',
  'Electrical/FuseCarriers': 'electrical/fuseCarriers/create',
  'Electrical/Holders': 'electrical/holders/create',
  'Electrical/Indicator': 'electrical/indicator/create',
  'Electrical/InsulationTapes': 'electrical/insulationTapes/create',
  'Electrical/Isolators': 'electrical/isolators/create',
  'Electrical/Jacks': 'electrical/jacks/create',
  'Electrical/KITKATFuses': 'electrical/kITKATFuses/create',
  'Electrical/MainSwitch': 'electrical/mainSwitch/create',
  'Electrical/MCB': 'electrical/mCB/create',
  'Electrical/ModularSurfaceBox': 'electrical/modularSurfaceBox/create',
  'Electrical/Motors': 'electrical/motors/create',
  'Electrical/MotorStarters': 'electrical/motorStarters/create',
  'Electrical/Others': 'electrical/others/create',
  'Electrical/PinTop': 'electrical/pinTop/create',
  'Electrical/Plug': 'electrical/plug/create',
  'Electrical/PowerStrips': 'electrical/powerStrips/create',
  'Electrical/PVCClips': 'electrical/pvCClips/create',
  'Electrical/Regulators': 'electrical/regulators/create',
  'Electrical/RotarySwitch': 'electrical/rotarySwitch/create',
  'Electrical/Sockets': 'electrical/sockets/create',
  'Electrical/SwitchAndSocket': 'electrical/switchAndSocket/create',
  'Electrical/Switches': 'electrical/switches/create',
  'Electrical/SwitchPlates': 'electrical/switchPlates/create',
  'Electrical/TravelAdaptor': 'electrical/travelAdaptor/create',
  'Electrical/TVOutlets': 'electrical/tVOutlets/create',
  'Electrical/UniSwitch': 'electrical/uniSwitch/create',
  'Electrical/WaterHeater': 'electrical/waterHeater/create',
  'Electrical/WaterHeaters': 'electrical/waterHeater/create',
  'Electrical/WiresAndCables': 'electrical/wiresAndCables/create',

  // Electrical sub-subfolders
  'Electrical/ElectricalFittings/Accessories': 'electrical/accessories/create',
  'Electrical/ElectricalFittings/CircularDeepBox': 'electrical/circulardeepbox/create',
  'Electrical/ElectricalFittings/CircularSurfaceBox': 'electrical/circularsurfacebox/create',
  'Electrical/ElectricalFittings/RigidType': 'electrical/rigidtype/create',
  'Electrical/Fans/CabinFans': 'electrical/cabinfans/create',
  'Electrical/Fans/CeilingFans': 'electrical/ceilingfans/create',
  'Electrical/Fans/PedestalFans': 'electrical/pedestalfans/create',
  'Electrical/Fans/TableFans': 'electrical/tablefans/create',
  'Electrical/Fans/VentilationExhaustFans': 'electrical/ventilationexhaustfans/create',
  'Electrical/Fans/WallMountingFans': 'electrical/wallmountingfans/create',
  'Electrical/Lights/CeilingLight': 'electrical/ceilinglight/create',
  'Electrical/Lights/CFL': 'electrical/cfl/create',
  'Electrical/Lights/Desklight': 'electrical/desklight/create',
  'Electrical/Lights/FocusLight': 'electrical/focuslight/create',
  'Electrical/Lights/GardenLight': 'electrical/gardenlight/create',
  'Electrical/Lights/GateLight': 'electrical/gatelight/create',
  'Electrical/Lights/GLS': 'electrical/gls/create',
  'Electrical/Lights/Home': 'electrical/home/create',
  'Electrical/Lights/Lamps': 'electrical/lamps/create',
  'Electrical/Lights/LEDBatten': 'electrical/ledbatten/create',
  'Electrical/Lights/LEDBulbs': 'electrical/ledbulbs/create',
  'Electrical/Lights/LedDownLightersSpotLight': 'electrical/leddownlightersspotlight/create',
  'Electrical/Lights/LEDLuminaires': 'electrical/ledluminaires/create',
  'Electrical/Lights/LEDPanelLight': 'electrical/ledpanellight/create',
  'Electrical/Lights/LEDSpotlight': 'electrical/ledspotlight/create',
  'Electrical/Lights/LEDStreetLight': 'electrical/ledstreetlight/create',
  'Electrical/Lights/LEDStrips': 'electrical/ledstrips/create',
  'Electrical/Lights/LedSurfaceLight': 'electrical/ledsurfacelight/create',
  'Electrical/Lights/LightElectronics': 'electrical/lightelectronics/create',
  'Electrical/Lights/MirrorLight': 'electrical/mirrorlight/create',
  'Electrical/Lights/Reflections': 'electrical/reflections/create',
  'Electrical/Lights/StandardIncandescent': 'electrical/standardincandescent/create',
  'Electrical/Lights/TBulb': 'electrical/tbulb/create',
  'Electrical/Lights/TubeLight': 'electrical/tubelight/create',
  'Electrical/Lights/UnderWaterLights': 'electrical/underwaterlights/create',
  'Electrical/Lights/WallLight': 'electrical/walllight/create',

  // Paint subfolders
  'Paint/AcrylicEmulsionPaint': 'paint/acrylic-emulsion-paint/create',
  'Paint/AdhesiveThinner/Adhesive': 'paint/adhesive-thinner-adhesive/create',
  'Paint/AdhesiveThinner/Thinner': 'paint/adhesive-thinner-thinner/create',
  'Paint/AspaPaints': 'paint/aspa-paints/create',
  'Paint/AutomativePaints': 'paint/automative-paints-aspa-paints/create',
  'Paint/BrushesRollers/PaintBrushes': 'paint/brushes-rollers-paint-brushes/create',
  'Paint/BrushesRollers/Rollers': 'paint/brushes-rollers-rollers/create',
  'Paint/BrushesRollers/SprayPaints': 'paint/brushes-rollers-spray-paints/create',
  'Paint/Distemper/AcrylicDistemper': 'paint/distemper-acrylic-distemper/create',
  'Paint/Distemper/SyntheticDistemper': 'paint/distemper-synthetic-distemper/create',
  'Paint/Emulsion/ExteriorEmulsion': 'paint/emulsion-exterior-emulsion/create',
  'Paint/Emulsion/InteriorEmulsion': 'paint/emulsion-interior-emulsion/create',
  'Paint/Emulsion/TileGuard': 'paint/emulsion-tile-guard/create',
  'Paint/Emulsion/WallTexture': 'paint/emulsion-wall-texture/create',
  'Paint/Enamel/GlossEnamel': 'paint/enamel-gloss-enamel/create',
  'Paint/Enamel/SatinEnamel': 'paint/enamel-satin-enamel/create',
  'Paint/Enamel/SyntheticEnamel': 'paint/enamel-synthetic-enamel/create',
  'Paint/ExteriorPaints': 'paint/exterior-paints/create',
  'Paint/FloorPaints': 'paint/floor-paints/create',
  'Paint/IndustrialCoatings': 'paint/industrial-coatings/create',
  'Paint/InteriorPaints': 'paint/interior-paints/create',
  'Paint/PaintingAccessories/PaintingTools': 'paint/painting-accessories-painting-tools/create',
  'Paint/PaintingAccessories/SandpaperRolls': 'paint/painting-accessories-sandpaper-rolls/create',
  'Paint/PaintingAccessories/Stencils': 'paint/painting-accessories-stencils/create',
  'Paint/PaintingTools': 'paint/painting-tools/create',
  'Paint/Primer/AcrylicPrimer': 'paint/primer-acrylic-primer/create',
  'Paint/Primer/CementPrimer': 'paint/primer-cement-primer/create',
  'Paint/Primer/ExteriorPrimer': 'paint/primer-exterior-primer/create',
  'Paint/Primer/InteriorPrimer': 'paint/primer-interior-primer/create',
  'Paint/Primer/MetalPrimer': 'paint/primer-metal-primer/create',
  'Paint/Primer/SolventPrimer': 'paint/primer-solvent-primer/create',
  'Paint/Primer/WoodPrimer': 'paint/primer-wood-primer/create',
  'Paint/PrimerAndWallPutty': 'paint/primer-and-wall-putty/create',
  'Paint/Sanitizer': 'paint/sanitizer/create',
  'Paint/SprayPaints': 'paint/spray-paints/create',
  'Paint/Stainers/UniversalStainers': 'paint/stainers-universal-stainers/create',
  'Paint/Stainers/WoodStainers': 'paint/stainers-wood-stainers/create',
  'Paint/StainersThinners': 'paint/stainers-thinners/create',
  'Paint/Stencils': 'paint/stencils/create',
  'Paint/TileGuard': 'paint/tile-guard/create',
  'Paint/TopBrands/DulexPaints': 'paint/top-brands-dulex-paints/create',
  'Paint/TopBrands/AsianPaints': 'paint/top-brands-asian-paints/create',
  'Paint/TopBrands/NerolocPaints': 'paint/top-brands-neroloc-paints/create',
  'Paint/TopBrands/JKWallPutty': 'paint/top-brands-jk-wall-putty/create',
  'Paint/WallPutty/AcrylicWallPutty': 'paint/wall-putty-acrylic-wall-putty/create',
  'Paint/WallPutty/KPFWallPutty': 'paint/wall-putty-kpf-wall-putty/create',
  'Paint/WallPutty/PowderWallPutty': 'paint/wall-putty-powder-wall-putty/create',
  'Paint/WallStickersWallpapers': 'paint/wall-stickers-wallpapers/create',
  'Paint/Waterproofing/CrackFillers': 'paint/waterproofing-crack-fillers/create',
  'Paint/Waterproofing/WaterproofBasecoat': 'paint/waterproofing-waterproof-basecoat/create',
  'Paint/WoodFinishes/GlassCoatings': 'paint/wood-finishes-glass-coatings/create',
  'Paint/WoodFinishes/Melamyne': 'paint/wood-finishes-melamyne/create',
  'Paint/WoodFinishes/NC': 'paint/wood-finishes-nc/create',
  'Paint/WoodFinishes/Polish': 'paint/wood-finishes-polish/create',
  'Paint/WoodFinishes/PU': 'paint/wood-finishes-pu/create',
  'Paint/WoodFinishes/Sealer': 'paint/wood-finishes-sealer/create',
  'Paint/WoodFinishes/VarnishBlackBoardPaint': 'paint/wood-finishes-varnish-black-board-paint/create',
  'Paint/WoodFinishes/WoodPutty': 'paint/wood-finishes-wood-putty/create',
  'Paint/WoodMetal': 'paint/wood-metal/create',

  // Pipe subfolders
  'Pipe/FinolexPipes': 'pipe/finolex-pipes/create',
  'Pipe/AshirvadPipes': 'pipe/ashirvad-pipes/create',
  'Pipe/AstralPipes': 'pipe/astral-pipes/create',
  'Pipe/NepulPipes': 'pipe/nepul-pipes/create',
  'Pipe/BirlaPipes': 'pipe/birla-pipes/create',
  'Pipe/PrincePipes': 'pipe/prince-pipes/create',
  'Pipe/PrakashPipes': 'pipe/prakash-pipes/create',
  'Pipe/SupremePipes': 'pipe/supreme-pipes/create',
  'Pipe/TataPipes': 'pipe/tata-pipes/create',
  'Pipe/TSAPipes': 'pipe/tsa-pipes/create',

  // PvcMats subfolders
  'PvcMats/Door': 'pvcmats/door/create',
  'PvcMats/Floor': 'pvcmats/floor/create',

  // Roofer subfolders
  'Roofer/Metal': 'roofer/metal/create',
  'Roofer/Shingles': 'roofer/shingles/create',

  // WaterProofing subfolders
  'WaterProofing/Bathrooms': 'waterproofing/bathroom/create',
  'WaterProofing/CracksJoints': 'waterproofing/creacks-joints/create',
  'WaterProofing/Interiors': 'waterproofing/interiors/create',

  // Tools subfolders
  'Tools/Abrasives/CutOffWheel': 'tools/abrasives-cutOffWheel/create',
  'Tools/Abrasives/DiamondBlades': 'tools/abrasives-diamondBlades/create',
  'Tools/AllenKeys': 'tools/allen-keys/create',
  'Tools/Brush': 'tools/brush/create',
  'Tools/CarpenterPincer': 'tools/carpenter-pincer/create',
  'Tools/CentrePunches': 'tools/centre-punches/create',
  'Tools/Chisels': 'tools/chisels/create',
  'Tools/Clamps': 'tools/clamps/create',
  'Tools/Cutters': 'tools/cutters/create',
  'Tools/Files': 'tools/files/create',
  'Tools/GardenTools': 'tools/garden-tools/create',
  'Tools/GearPullers': 'tools/gear-pullers/create',
  'Tools/GlassCutter': 'tools/glass-cutter/create',
  'Tools/Gluegun': 'tools/gluegun/create',
  'Tools/GreaseGun': 'tools/grease-gun/create',
  'Tools/HacksawBlades': 'tools/hacksaw-blades/create',
  'Tools/Hammer': 'tools/hammer/create',
  'Tools/HammerDrills': 'tools/hammer-drlls/create',
  'Tools/Handtools': 'tools/handtools/create',
  'Tools/Level': 'tools/level/create',
  'Tools/Lubrications': 'tools/lubrications/create',
  'Tools/MeasurementScale': 'tools/measurement-scale/create',
  'Tools/MeasuringTape': 'tools/measuring-tape/create',
  'Tools/Multimeter': 'tools/multimeter/create',
  'Tools/Plier': 'tools/plier/create',
  'Tools/PolishingAccessories': 'tools/polishing-accessories/create',
  'Tools/PowerTools/Drill': 'tools/powertools-drill/create',
  'Tools/PowerTools/Grinders': 'tools/powertools-grinders/create',
  'Tools/PowerTools/MarbleCutter': 'tools/powertools-marble-cutter/create',
  'Tools/Saw': 'tools/saw/create',
  'Tools/ScrewDriver': 'tools/screw-driver/create',
  'Tools/SiliconGun': 'tools/silicon-gun/create',
  'Tools/Socketset': 'tools/socketset/create',
  'Tools/Spanners': 'tools/spanners/create',
  'Tools/SpareMalets': 'tools/spare-malets/create',
  'Tools/ToolCompartments': 'tools/tool-compartments/create',
  'Tools/Toolkitset': 'tools/toolkitset/create',
  'Tools/VariousToolBits': 'tools/various-tool-bits/create',
  'Tools/WoodChisel': 'tools/wood-chisel/create',
  'Tools/WoodItems': 'tools/wood-items/create',
  'Tools/Wrench': 'tools/wrench/create',

  // Home subfolders
  'Home/Brands': 'home/brands/create',
  'Home/Card': 'home/card/create',
  'Home/CardSlider': 'home/cardSlider/create',
  'Home/Categories': 'home/categories/create',
  'Home/Electrical': 'home/electrical/create',
  'Home/Items': 'home/items/create',
  'Home/Paints': 'home/paints/create',
  'Home/Service': 'home/service/create',
  'Home/Tools': 'home/tools/create',
};

// Find all ProductForm.jsx files
function findProductFormFiles(dir, basePath = '') {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(basePath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      const productFormPath = path.join(fullPath, 'ProductForm.jsx');
      if (fs.existsSync(productFormPath)) {
        files.push({
          fullPath: productFormPath,
          folderPath: relativePath
        });
      }
      files.push(...findProductFormFiles(fullPath, relativePath));
    }
  }
  
  return files;
}

// Update API endpoint in file
function updateApiEndpoint(filePath, folderPath, correctEndpoint) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const apiRegex = /const res = await fetch\(\`\$\{API_BASE_URL\}\/([^`]+)\`, \{ method: ['"]POST['"]/;
    const match = content.match(apiRegex);
    
    if (match) {
      const currentEndpoint = match[1];
      if (currentEndpoint !== correctEndpoint) {
        console.log(`📝 Updating ${folderPath}: ${currentEndpoint} → ${correctEndpoint}`);
        content = content.replace(
          `\`\${API_BASE_URL}/${currentEndpoint}\``,
          `\`\${API_BASE_URL}/${correctEndpoint}\``
        );
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
      } else {
        console.log(`✅ ${folderPath}: Already correct`);
        return false;
      }
    } else {
      console.log(`❌ ${folderPath}: Could not find API endpoint`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error updating ${folderPath}: ${error.message}`);
    return false;
  }
}

// Main function
function main() {
  console.log('🚀 Starting comprehensive API endpoint update...\n');
  
  const productAddDir = path.join(__dirname, '..', 'app', 'Dashboard', 'ProductAdd');
  const files = findProductFormFiles(productAddDir);
  
  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  for (const file of files) {
    const correctEndpoint = API_ENDPOINTS[file.folderPath];
    
    if (correctEndpoint) {
      const wasUpdated = updateApiEndpoint(file.fullPath, file.folderPath, correctEndpoint);
      if (wasUpdated) updatedCount++;
      else skippedCount++;
    } else {
      console.log(`⚠️  ${file.folderPath}: No mapping found`);
      errorCount++;
    }
  }
  
  console.log(`\n📊 Summary: Updated ${updatedCount}, Skipped ${skippedCount}, Errors ${errorCount}`);
}

main(); 