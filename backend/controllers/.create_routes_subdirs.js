const fs = require('fs');
const path = require('path');

function walkForDirs(dir, rel = '', out = new Set()) {
  for (const f of fs.readdirSync(dir)) {
    const abs = path.join(dir, f);
    const relPath = rel ? rel + '/' + f : f;
    if (fs.statSync(abs).isDirectory()) {
      // If this directory contains any Controller.js file, add it
      const hasController = fs.readdirSync(abs).some(x => x.endsWith('Controller.js'));
      if (hasController) out.add(relPath);
      walkForDirs(abs, relPath, out);
    }
  }
  return out;
}

const controllersBase = path.join(__dirname);
const routesBase = path.join(__dirname, '../routes');
const dirs = walkForDirs(controllersBase);
for (const d of dirs) {
  const target = path.join(routesBase, d);
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
    console.log('Created routes subdir:', target);
  }
} 