const fs = require('fs');
const path = require('path');

// Function to fix individual ProductForm file
function fixProductFormFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Fix missing onSave prop in function signature
    if (content.includes('export default function ProductForm() {') && 
        content.includes('onSave && onSave()')) {
      content = content.replace(
        'export default function ProductForm() {',
        'export default function ProductForm({ onSave }) {'
      );
      modified = true;
      console.log(`✅ Fixed onSave prop in: ${filePath}`);
    }

    // 2. Fix API URL case sensitivity issues
    const urlFixes = [
      // Electrical main controllers
      { from: '/electrical/Adaptors/create', to: '/electrical/adaptors/create' },
      { from: '/electrical/Switches/create', to: '/electrical/switches/create' },
      { from: '/electrical/Sockets/create', to: '/electrical/sockets/create' },
      { from: '/electrical/Regulators/create', to: '/electrical/regulators/create' },
      { from: '/electrical/Plug/create', to: '/electrical/plug/create' },
      { from: '/electrical/PinTop/create', to: '/electrical/pinTop/create' },
      { from: '/electrical/Others/create', to: '/electrical/others/create' },
      { from: '/electrical/Motors/create', to: '/electrical/motors/create' },
      { from: '/electrical/Holders/create', to: '/electrical/holders/create' },
      { from: '/electrical/Dimmer/create', to: '/electrical/dimmer/create' },
      { from: '/electrical/Jacks/create', to: '/electrical/jacks/create' },
      { from: '/electrical/Isolators/create', to: '/electrical/isolators/create' },
      { from: '/electrical/Indicator/create', to: '/electrical/indicator/create' },
      { from: '/electrical/KITKATFuses/create', to: '/electrical/kITKATFuses/create' },
      
      // Electrical subfolder controllers
      { from: '/electrical/Fans/WallMountingFans/create', to: '/electrical/wallmountingfans/create' },
      { from: '/electrical/Fans/VentilationExhaustFans/create', to: '/electrical/ventilationexhaustfans/create' },
      { from: '/electrical/Fans/TableFans/create', to: '/electrical/tablefans/create' },
      { from: '/electrical/Fans/PedestalFans/create', to: '/electrical/pedestalfans/create' },
      { from: '/electrical/Fans/CeilingFans/create', to: '/electrical/ceilingfans/create' },
      { from: '/electrical/Fans/CabinFans/create', to: '/electrical/cabinfans/create' },
      
      { from: '/electrical/Lights/WallLight/create', to: '/electrical/walllight/create' },
      { from: '/electrical/Lights/UnderWaterLights/create', to: '/electrical/underwaterlights/create' },
      { from: '/electrical/Lights/TubeLight/create', to: '/electrical/tubelight/create' },
      { from: '/electrical/Lights/TBulb/create', to: '/electrical/tbulb/create' },
      { from: '/electrical/Lights/StandardIncandescent/create', to: '/electrical/standardincandescent/create' },
      { from: '/electrical/Lights/Reflectors/create', to: '/electrical/reflections/create' },
      { from: '/electrical/Lights/MirrorLight/create', to: '/electrical/mirrorlight/create' },
      { from: '/electrical/Lights/LightElectronics/create', to: '/electrical/lightelectronics/create' },
      { from: '/electrical/Lights/LedSurfaceLight/create', to: '/electrical/ledsurfacelight/create' },
      { from: '/electrical/Lights/LEDStrips/create', to: '/electrical/ledstrips/create' },
      { from: '/electrical/Lights/LEDStreetLight/create', to: '/electrical/ledstreetlight/create' },
      { from: '/electrical/Lights/LEDSpotlight/create', to: '/electrical/ledspotlight/create' },
      { from: '/electrical/Lights/LEDPanelLight/create', to: '/electrical/ledpanellight/create' },
      { from: '/electrical/Lights/LEDLuminaires/create', to: '/electrical/ledluminaires/create' },
      { from: '/electrical/Lights/LedDownLightersSpotLight/create', to: '/electrical/leddownlightersspotlight/create' },
      { from: '/electrical/Lights/LEDBulbs/create', to: '/electrical/ledbulbs/create' },
      { from: '/electrical/Lights/LEDBatten/create', to: '/electrical/ledbatten/create' },
      { from: '/electrical/Lights/Lamps/create', to: '/electrical/lamps/create' },
      { from: '/electrical/Lights/Home/create', to: '/electrical/home/create' },
      { from: '/electrical/Lights/GLS/create', to: '/electrical/gls/create' },
      { from: '/electrical/Lights/GateLight/create', to: '/electrical/gatelight/create' },
      { from: '/electrical/Lights/GardenLight/create', to: '/electrical/gardenlight/create' },
      { from: '/electrical/Lights/FocusLight/create', to: '/electrical/focuslight/create' },
      { from: '/electrical/Lights/Desklight/create', to: '/electrical/desklight/create' },
      { from: '/electrical/Lights/CFL/create', to: '/electrical/cfl/create' },
      { from: '/electrical/Lights/CeilingLight/create', to: '/electrical/ceilinglight/create' },
      
      { from: '/electrical/ElectricalFittings/RigidType/create', to: '/electrical/rigidtype/create' },
      { from: '/electrical/ElectricalFittings/CircularSurfaceBox/create', to: '/electrical/circularsurfacebox/create' },
      { from: '/electrical/ElectricalFittings/CircularDeepBox/create', to: '/electrical/circulardeepbox/create' },
      { from: '/electrical/ElectricalFittings/Accessories/create', to: '/electrical/accessories/create' },
    ];

    urlFixes.forEach(fix => {
      if (content.includes(fix.from)) {
        content = content.replace(new RegExp(fix.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), fix.to);
        modified = true;
        console.log(`✅ Fixed API URL in: ${filePath} (${fix.from} → ${fix.to})`);
      }
    });

    // 3. Fix field name mismatches (tags → tag)
    if (content.includes('tags.forEach(tag =>') && !content.includes('tag.forEach(tag =>')) {
      content = content.replace(/tags\.forEach\(tag =>/g, 'tag.forEach(tag =>');
      content = content.replace(/formData\.append\("tags", tag\)/g, 'formData.append("tag", tag)');
      content = content.replace(/data\.append\('tags', tag\)/g, "data.append('tag', tag)");
      modified = true;
      console.log(`✅ Fixed tags → tag in: ${filePath}`);
    }

    // 4. Add required attribute to totalProduct if missing
    if (content.includes('name="totalProduct"') && !content.includes('name="totalProduct" required')) {
      content = content.replace(
        /name="totalProduct"[^>]*>/g,
        'name="totalProduct" required>'
      );
      modified = true;
      console.log(`✅ Added required to totalProduct in: ${filePath}`);
    }

    // 5. Add image validation if missing
    if (content.includes('const handleSubmit') && !content.includes('files.length === 0')) {
      const handleSubmitMatch = content.match(/const handleSubmit[^{]*{[\s\S]*?}/);
      if (handleSubmitMatch) {
        const handleSubmitContent = handleSubmitMatch[0];
        if (!handleSubmitContent.includes('files.length === 0')) {
          // Add image validation after e.preventDefault()
          const newHandleSubmit = handleSubmitContent.replace(
            /e\.preventDefault\(\);/,
            `e.preventDefault();
    if (files.length === 0) {
      setPhotoError("Please upload at least 1 photo.");
      return;
    }
    setPhotoError("");`
          );
          content = content.replace(handleSubmitContent, newHandleSubmit);
          modified = true;
          console.log(`✅ Added image validation in: ${filePath}`);
        }
      }
    }

    // 6. Add error handling if missing
    if (content.includes('if (res.ok)') && !content.includes('else {')) {
      content = content.replace(
        /if \(res\.ok\) onSave && onSave\(\);/g,
        `if (res.ok) {
      alert('Product created successfully!');
      if (onSave) onSave();
    } else {
      const errorData = await res.json();
      alert(\`Error creating product: \${errorData.error || 'Unknown error'}\`);
    }`
      );
      modified = true;
      console.log(`✅ Added error handling in: ${filePath}`);
    }

    // Write back if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively find all ProductForm.jsx files
function findProductFormFiles(dir) {
  const files = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item === 'ProductForm.jsx') {
        files.push(fullPath);
      }
    }
  }
  
  scanDirectory(dir);
  return files;
}

// Main execution
function main() {
  console.log('🔧 Starting ProductAdd bugs fix...\n');
  
  const productAddDir = path.join(__dirname, '..', 'app', 'Dashboard', 'ProductAdd');
  const productFormFiles = findProductFormFiles(productAddDir);
  
  console.log(`📁 Found ${productFormFiles.length} ProductForm.jsx files\n`);
  
  let fixedCount = 0;
  let errorCount = 0;
  
  for (const filePath of productFormFiles) {
    try {
      const wasFixed = fixProductFormFile(filePath);
      if (wasFixed) {
        fixedCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`✅ Files fixed: ${fixedCount}`);
  console.log(`❌ Files with errors: ${errorCount}`);
  console.log(`📁 Total files processed: ${productFormFiles.length}`);
  console.log('\n🎉 ProductAdd bugs fix completed!');
}

main();
