const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'backend', 'controllers', 'waterProofing');
const MODEL_IMPORT = `const WaterProofing = require('REPLACE_PATH/models/WaterProofingModels');\n`;

function getImportPath(filePath) {
  // Calculate how many ../ needed to reach backend/models from filePath
  const rel = path.relative(path.dirname(filePath), path.join(__dirname, 'backend', 'models', 'WaterProofingModels.js'));
  let importPath = rel.replace(/\\/g, '/').replace('WaterProofingModels.js', '');
  if (!importPath.startsWith('.')) importPath = './' + importPath;
  return importPath;
}

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Remove old model imports
  content = content.replace(/const\s+\w+Model\s*=.*\n/g, '');
  // Add WaterProofing import if not present
  if (!content.includes('require') || !content.includes('WaterProofingModels')) {
    const importPath = getImportPath(filePath);
    content = MODEL_IMPORT.replace('REPLACE_PATH', importPath) + content;
  }
  // Replace all usages of old models with WaterProofing
  content = content.replace(/\b\w+Model\b/g, 'WaterProofing');
  content = content.replace(/\bToolsModel\b/g, 'WaterProofing');
  // Replace any TODO: Set correct model import
  content = content.replace(/\/\/ TODO: Set correct model import\n/g, '');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated:', filePath);
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.js')) {
      updateFile(fullPath);
    }
  });
}

walk(BASE_DIR);
console.log('All waterProofing controllers updated to use WaterProofingModels!'); 