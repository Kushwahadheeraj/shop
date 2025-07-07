const fs = require('fs');
const path = require('path');

function toPascal(str) {
  return str.replace(/(^|_)([a-z])/g, (_, __, c) => c.toUpperCase());
}
function toCamel(str) {
  return str.replace(/[-_ ]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^./, s => s.toLowerCase());
}

function walkControllers(dir, arr = [], rel = '') {
  for (const f of fs.readdirSync(dir)) {
    const abs = path.join(dir, f);
    const relPath = rel ? rel + '/' + f : f;
    if (fs.statSync(abs).isDirectory()) walkControllers(abs, arr, relPath);
    else if (f.endsWith('Controller.js')) arr.push({ abs, rel: relPath });
  }
  return arr;
}

const controllersDir = path.join(__dirname);
const routesDir = path.join(__dirname, '../routes');
const controllers = walkControllers(controllersDir);

const multerImport = `const multer = require('multer');\nconst storage = multer.memoryStorage();\nconst upload = multer({ storage });\n`;

// 1. Generate/Update route files
const routeFiles = new Set();
for (const { abs, rel } of controllers) {
  const parts = rel.split(path.sep);
  const file = parts.pop();
  const base = file.replace('Controller.js', '');
  const pascal = toPascal(base);
  const camel = toCamel(base);
  let routeFileName = base + 'Routes.js';
  let routePath = path.join(routesDir, routeFileName);
  routeFiles.add({ routeFileName, routePath, base, pascal, camel, rel });
  // Import controller
  let importPath = '../controllers/' + (parts.length ? parts.join('/') + '/' : '') + file;
  let importLine = `const ${camel}Controller = require('${importPath}');\n`;
  // Route prefix
  let routePrefix = '/api/' + camel;
  // Route file content
  let content = `// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.\n\nconst express = require('express');\n${multerImport}const router = express.Router();\n${importLine}\n`;
  content += `router.post('/', upload.array('photos', 5), ${camel}Controller.create${pascal});\n`;
  content += `router.get('/', ${camel}Controller.getAll${pascal});\n`;
  content += `router.get('/:id', ${camel}Controller.getOne${pascal});\n`;
  content += `router.put('/:id', upload.array('photos', 5), ${camel}Controller.update${pascal});\n`;
  content += `router.delete('/:id', ${camel}Controller.delete${pascal});\n`;
  content += '\nmodule.exports = router;\n';
  fs.writeFileSync(routePath, content);
  console.log('Route file written:', routePath);
}

// 2. Update server.js
const serverPath = path.join(__dirname, '../server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');
// Remove old auto-generated block if present
serverContent = serverContent.replace(/\/\/ AUTO-GENERATED ROUTES AND SERVER IMPORTS[\s\S]*?\/\/ END AUTO-GENERATED ROUTES AND SERVER IMPORTS/g, '');
let importBlock = '// AUTO-GENERATED ROUTES AND SERVER IMPORTS\n';
let useBlock = '';
for (const { routeFileName, base, camel } of routeFiles) {
  importBlock += `const ${camel}Routes = require('./routes/${routeFileName}');\n`;
  useBlock += `app.use('/api/${camel}', ${camel}Routes);\n`;
}
importBlock += '// END AUTO-GENERATED ROUTES AND SERVER IMPORTS\n';
useBlock += '// END AUTO-GENERATED ROUTES AND SERVER IMPORTS\n';
// Insert at the top (after express/app setup)
serverContent = importBlock + serverContent;
// Insert app.use blocks before module.exports or at the end
if (serverContent.includes('module.exports')) {
  serverContent = serverContent.replace('module.exports', useBlock + '\nmodule.exports');
} else {
  serverContent += '\n' + useBlock;
}
fs.writeFileSync(serverPath, serverContent);
console.log('server.js updated with all routes.'); 