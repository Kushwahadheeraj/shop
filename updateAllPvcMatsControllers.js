const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'backend', 'controllers', 'pvcMats');
const MODEL_IMPORT = `const PvcMats = require('REPLACE_PATH/models/PvcMatsModels');\n`;

function getImportPath(filePath) {
  // Calculate how many ../ needed to reach backend/models from filePath
  const rel = path.relative(path.dirname(filePath), path.join(__dirname, 'backend', 'models', 'PvcMatsModels.js'));
  let importPath = rel.replace(/\\/g, '/').replace('PvcMatsModels.js', '');
  if (!importPath.startsWith('.')) importPath = './' + importPath;
  return importPath;
}

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Remove old model imports
  content = content.replace(/const\s+\w+Model\s*=.*\n/g, '');
  // Add PvcMats import if not present
  if (!content.includes('require') || !content.includes('PvcMatsModels')) {
    const importPath = getImportPath(filePath);
    content = MODEL_IMPORT.replace('REPLACE_PATH', importPath) + content;
  }
  // Replace all usages of old models with PvcMats
  content = content.replace(/\b\w+Model\b/g, 'PvcMats');
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
console.log('All pvcMats controllers updated to use PvcMatsModels!'); 