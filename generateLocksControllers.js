const fs = require('fs');
const path = require('path');

const CONTROLLERS_DIR = path.join(__dirname, 'backend', 'controllers', 'locks');
const MODEL_IMPORT = `const Lock = require('../../models/LocksModels');`;

function getAllJsFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllJsFiles(filePath));
    } else if (file.endsWith('.js')) {
      results.push(filePath);
    }
  });
  return results;
}

function updateControllerFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove any old model import
  content = content.replace(/const\s+\w+Model\s*=.*require\([^)]*\);?\n?/g, '');
  content = content.replace(/const\s+Lock\s*=.*require\([^)]*\);?\n?/g, '');

  // Add correct model import at the top (after any 'use strict' or comment block)
  if (!content.includes(MODEL_IMPORT)) {
    const lines = content.split('\n');
    let insertIdx = 0;
    while (insertIdx < lines.length && (lines[insertIdx].startsWith('//') || lines[insertIdx].startsWith('/*') || lines[insertIdx].trim() === '' || lines[insertIdx].startsWith('"use strict"'))) {
      insertIdx++;
    }
    lines.splice(insertIdx, 0, MODEL_IMPORT);
    content = lines.join('\n');
  }

  // Replace all model usages (e.g., BM01Model, PadlocksModel, etc.) with 'Lock'
  content = content.replace(/\b([A-Z][a-zA-Z0-9_]*)Model\b/g, 'Lock');

  // Save the updated file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated:', filePath);
}

function main() {
  const files = getAllJsFiles(CONTROLLERS_DIR);
  files.forEach(updateControllerFile);
  console.log('All controller files updated successfully!');
}

main(); 