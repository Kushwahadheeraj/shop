const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'backend', 'controllers', 'sanitary');
const MODEL_IMPORT = `const Sanitary = require('REPLACE_PATH/models/SanitaryModels');\n`;

function getImportPath(filePath) {
  // Calculate how many ../ needed to reach backend/models from filePath
  const rel = path.relative(path.dirname(filePath), path.join(__dirname, 'backend', 'models', 'SanitaryModels.js'));
  let importPath = rel.replace(/\\/g, '/').replace('SanitaryModels.js', '');
  if (!importPath.startsWith('.')) importPath = './' + importPath;
  return importPath;
}

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Remove all model imports (including misplaced ones)
  content = content.replace(/const\s+\w+Model\s*=.*\n/g, '');
  content = content.replace(/const\s+Sanitary\s*=.*SanitaryModels.*\n/g, '');
  // Remove any require('../../models/SanitaryModels')
  content = content.replace(/require\(['"]\.\.\/models\/SanitaryModels['"]\)/g, 'Sanitary');
  // Remove any TODO: Set correct model import
  content = content.replace(/\/\/ TODO: Set correct model import\n/g, '');
  // Replace all usages of old models with Sanitary
  content = content.replace(/\b\w+Model\b/g, 'Sanitary');
  // Add single correct import at the very top
  const importPath = getImportPath(filePath);
  content = MODEL_IMPORT.replace('REPLACE_PATH', importPath) + content.trimStart();
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
console.log('All sanitary controllers now have a single SanitaryModels import at the top!'); 