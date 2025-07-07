const fs = require('fs');
const path = require('path');

function toPascal(str) {
  return str.replace(/(^|_)([a-z])/g, (_, __, c) => c.toUpperCase());
}

function walk(dir, arr = [], rel = '') {
  for (const f of fs.readdirSync(dir)) {
    const abs = path.join(dir, f);
    const relPath = rel ? rel + '/' + f : f;
    if (fs.statSync(abs).isDirectory()) walk(abs, arr, relPath);
    else if (f.endsWith('Controller.js')) arr.push({ abs, rel: relPath });
  }
  return arr;
}

const baseDir = path.join(__dirname);
const controllers = walk(baseDir);

for (const { abs, rel } of controllers) {
  const fileBase = path.basename(abs, 'Controller.js');
  const pascal = toPascal(fileBase);
  let content = fs.readFileSync(abs, 'utf8');
  // Remove duplicate model imports
  content = content.replace(/(const\s+ToolsModel\s*=\s*require\(['"][^'"]*ToolsModels['"]\);?\s*)+/g, '');
  // Add single model import at the top (after any comments or 'use strict')
  const importLine = "const ToolsModel = require('../../models/ToolsModels');\n";
  if (!content.includes(importLine)) {
    const lines = content.split('\n');
    let insertIdx = 0;
    while (insertIdx < lines.length && (lines[insertIdx].startsWith('//') || lines[insertIdx].startsWith('"use strict"') || lines[insertIdx].trim() === '')) insertIdx++;
    lines.splice(insertIdx, 0, importLine);
    content = lines.join('\n');
  }
  // Replace function names
  content = content.replace(/exports\.create\w*\s*=\s*async/g, `exports.create${pascal} = async`);
  content = content.replace(/exports\.getAll\w*\s*=\s*async/g, `exports.getAll${pascal} = async`);
  content = content.replace(/exports\.getOne\w*\s*=\s*async/g, `exports.getOne${pascal} = async`);
  content = content.replace(/exports\.update\w*\s*=\s*async/g, `exports.update${pascal} = async`);
  content = content.replace(/exports\.delete\w*\s*=\s*async/g, `exports.delete${pascal} = async`);
  if (!content.startsWith('// AUTO-RENAMED FUNCTIONS TO MATCH FILE NAME. DO NOT EDIT MANUALLY.')) {
    content = '// AUTO-RENAMED FUNCTIONS TO MATCH FILE NAME. DO NOT EDIT MANUALLY.\n' + content;
  }
  fs.writeFileSync(abs, content);
  console.log('Function names and model import updated:', abs);
}

// Update routes in toolsRoutes.js
const routeFile = path.join(__dirname, '../../routes/toolsRoutes.js');
let routeContent = fs.readFileSync(routeFile, 'utf8');
for (const { rel } of controllers) {
  const fileBase = path.basename(rel, 'Controller.js');
  const pascal = toPascal(fileBase);
  // Replace function calls in routes
  routeContent = routeContent.replace(/(\w+)\.create\w*(\W)/g, `$1.create${pascal}$2`);
  routeContent = routeContent.replace(/(\w+)\.getAll\w*(\W)/g, `$1.getAll${pascal}$2`);
  routeContent = routeContent.replace(/(\w+)\.getOne\w*(\W)/g, `$1.getOne${pascal}$2`);
  routeContent = routeContent.replace(/(\w+)\.update\w*(\W)/g, `$1.update${pascal}$2`);
  routeContent = routeContent.replace(/(\w+)\.delete\w*(\W)/g, `$1.delete${pascal}$2`);
}
if (!routeContent.startsWith('// AUTO-RENAMED FUNCTIONS TO MATCH FILE NAME. DO NOT EDIT MANUALLY.')) {
  routeContent = '// AUTO-RENAMED FUNCTIONS TO MATCH FILE NAME. DO NOT EDIT MANUALLY.\n' + routeContent;
}
fs.writeFileSync(routeFile, routeContent);
console.log('Routes updated for renamed functions:', routeFile); 