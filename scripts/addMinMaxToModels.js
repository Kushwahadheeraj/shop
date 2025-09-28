// Run: node scripts/addMinMaxToModels.js
// Adds optional minPrice/maxPrice to multiple backend models if missing

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const targets = [
  'backend/models/ToolsModels.js',
  'backend/models/CleaningModels.js',
  'backend/models/FiberModels.js',
  'backend/models/FittingModels.js',
  'backend/models/HardwareModels.js',
  'backend/models/HomeDecorModels.js',
  'backend/models/LightingModels.js',
  'backend/models/PvcMatsModels.js',
  'backend/models/RooferModels.js',
  'backend/models/UncategorizedModels.js',
  'backend/models/WaterProofingModels.js',
];

const FIELD_BLOCK = `\n  minPrice: { type: Number },\n  maxPrice: { type: Number },`;

let changed = 0, skipped = 0, failed = 0;

for (const rel of targets) {
  const file = path.join(root, rel);
  try {
    if (!fs.existsSync(file)) {
      console.log('[skip] missing:', rel);
      skipped++;
      continue;
    }
    let src = fs.readFileSync(file, 'utf8');
    if (/minPrice:\s*\{[^}]*Number/i.test(src) && /maxPrice:\s*\{[^}]*Number/i.test(src)) {
      console.log('[skip] already present:', rel);
      skipped++;
      continue;
    }

    let next = src;
    const afterDiscount = src.match(/discountPrice:\s*\{[^}]*\}?,?/);
    if (afterDiscount) {
      next = src.replace(afterDiscount[0], m => m.replace(/,?$/, ',') + FIELD_BLOCK);
    } else {
      const afterFix = src.match(/fixPrice:\s*\{[^}]*\}?,?/);
      if (afterFix) {
        next = src.replace(afterFix[0], m => m.replace(/,?$/, ',') + FIELD_BLOCK);
      }
    }
    if (next === src) {
      // fallback insert before totalProduct
      next = src.replace(/(\s+totalProduct:\s*\{[^}]*\}?,?)/, FIELD_BLOCK + '$1');
    }

    fs.writeFileSync(file, next, 'utf8');
    console.log('[ok] updated:', rel);
    changed++;
  } catch (e) {
    console.log('[fail]', rel, e.message);
    failed++;
  }
}

console.log(`\nDone. changed=${changed} skipped=${skipped} failed=${failed}`);


