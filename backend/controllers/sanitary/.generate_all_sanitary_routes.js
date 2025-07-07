// .generate_all_sanitary_routes.js
// Script to auto-generate backend/routes/sanitaryRoutes.js for all controllers in /sanitary and subfolders, using specific function names

const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname);
const routesFile = path.join(__dirname, '../../routes/sanitaryRoutes.js');

function getAllControllerFiles(dir, arr = [], relBase = '') {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const relPath = path.join(relBase, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllControllerFiles(fullPath, arr, path.join(relBase, file));
    } else if (file.endsWith('Controller.js')) {
      arr.push(relPath.replace(/\\/g, '/'));
    }
  });
  return arr;
}

function toRouteName(controllerFile) {
  // e.g. parryware/basinMixerController.js -> parryware-basin-mixer
  const noExt = controllerFile.replace(/Controller.js$/, '');
  return noExt
    .split('/')
    .map(seg => seg.replace(/([A-Z])/g, '-$1').replace(/^-/, '').toLowerCase())
    .join('-');
}

function toImportVar(controllerFile) {
  // e.g. parryware/basinMixerController.js -> parrywareBasinMixerController
  const noExt = controllerFile.replace(/.js$/, '');
  return noExt
    .split('/')
    .map((seg, i) => i === 0 ? seg : seg[0].toUpperCase() + seg.slice(1))
    .join('')
    .replace(/[^a-zA-Z0-9]/g, '');
}

function toFunctionSuffix(controllerFile) {
  // e.g. washbasinsController.js -> Washbasins
  const base = path.basename(controllerFile, 'Controller.js');
  return base[0].toUpperCase() + base.slice(1);
}

function generate() {
  const controllerFiles = getAllControllerFiles(controllersDir).filter(f => !f.startsWith('.'));
  let imports = '';
  let routes = '';
  let uses = '';
  imports += "const express = require('express');\n";
  imports += "const router = express.Router();\n";

  controllerFiles.forEach(controllerFile => {
    const importPath = `../../controllers/sanitary/${controllerFile}`;
    const importVar = toImportVar(controllerFile);
    imports += `const ${importVar} = require('${importPath}');\n`;
    const routeName = toRouteName(controllerFile);
    const fnSuffix = toFunctionSuffix(controllerFile);
    // Register CRUD endpoints with specific function names
    routes += `// ${routeName} endpoints\n`;
    routes += `router.post('/${routeName}', ${importVar}.create${fnSuffix});\n`;
    routes += `router.get('/${routeName}', ${importVar}.getAll${fnSuffix});\n`;
    routes += `router.get('/${routeName}/:id', ${importVar}.getOne${fnSuffix});\n`;
    routes += `router.put('/${routeName}/:id', ${importVar}.update${fnSuffix});\n`;
    routes += `router.delete('/${routeName}/:id', ${importVar}.delete${fnSuffix});\n\n`;
  });

  uses += '\nmodule.exports = router;\n';

  const fileContent = imports + '\n' + routes + uses;
  fs.writeFileSync(routesFile, fileContent, 'utf8');
  console.log('sanitaryRoutes.js updated with all controllers and specific function names!');
}

generate(); 