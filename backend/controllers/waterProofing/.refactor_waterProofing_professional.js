const WaterProofing = require('../../models//models/WaterProofingModels');
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

const cloudinaryImport = `const cloudinary = require('../../config/cloudinary');\n`;
const streamifierImport = `const streamifier = require('streamifier');\n`;
const modelImport = `const WaterProofing = require('../../models/ToolsModels');\n`;
const uploadHelper = `/**\n * Uploads a buffer to Cloudinary and returns the secure URL.\n * @param {Buffer} buffer\n * @returns {Promise<string>}\n */\nfunction uploadToCloudinary(buffer) {\n  return new Promise((resolve, reject) => {\n    const stream = cloudinary.uploader.upload_stream((err, result) => {\n      if (err) return reject(err);\n      resolve(result.secure_url);\n    });\n    streamifier.createReadStream(buffer).pipe(stream);\n  });\n}\n`;

for (const { abs, rel } of controllers) {
  const fileBase = path.basename(abs, 'Controller.js');
  const pascal = toPascal(fileBase);
  let code = `// AUTO-REFRACTORED FOR PROFESSIONAL USAGE. DO NOT EDIT MANUALLY.\n\n${cloudinaryImport}${streamifierImport}${modelImport}${uploadHelper}\n`;
  code += `/**\n * Create a new ${pascal} product.\n */\nexports.create${pascal} = async (req, res) => {\n  try {\n    if (!req.files || req.files.length < 1) {\n      return res.status(400).json({ error: 'At least 1 image is required.' });\n    }\n    if (req.files.length > 5) {\n      return res.status(400).json({ error: 'No more than 5 images allowed.' });\n    }\n    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));\n    const product = new WaterProofing({ ...req.body, photos: photoUrls, category: '${fileBase}' });\n    await product.save();\n    res.status(201).json(product);\n  } catch (err) {\n    res.status(500).json({ error: err.message });\n  }\n};\n\n`;
  code += `/**\n * Get all ${pascal} products.\n */\nexports.getAll${pascal} = async (req, res) => {\n  try {\n    const products = await WaterProofing.find({ category: '${fileBase}' });\n    res.json(products);\n  } catch (err) {\n    res.status(500).json({ error: err.message });\n  }\n};\n\n`;
  code += `/**\n * Get a single ${pascal} product by ID.\n */\nexports.getOne${pascal} = async (req, res) => {\n  try {\n    const product = await WaterProofing.findOne({ _id: req.params.id, category: '${fileBase}' });\n    if (!product) return res.status(404).json({ error: 'Not found' });\n    res.json(product);\n  } catch (err) {\n    res.status(500).json({ error: err.message });\n  }\n};\n\n`;
  code += `/**\n * Update a ${pascal} product by ID.\n */\nexports.update${pascal} = async (req, res) => {\n  try {\n    let update = { ...req.body };
    if (req.files && req.files.length > 0) {\n      if (req.files.length > 5) {\n        return res.status(400).json({ error: 'No more than 5 images allowed.' });\n      }\n      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));\n    }\n    const product = await WaterProofing.findOneAndUpdate(\n      { _id: req.params.id, category: '${fileBase}' },\n      update,\n      { new: true }\n    );\n    if (!product) return res.status(404).json({ error: 'Not found' });\n    res.json(product);\n  } catch (err) {\n    res.status(500).json({ error: err.message });\n  }\n};\n\n`;
  code += `/**\n * Delete a ${pascal} product by ID.\n */\nexports.delete${pascal} = async (req, res) => {\n  try {\n    const product = await WaterProofing.findOneAndDelete({ _id: req.params.id, category: '${fileBase}' });\n    if (!product) return res.status(404).json({ error: 'Not found' });\n    res.json({ message: 'Deleted' });\n  } catch (err) {\n    res.status(500).json({ error: err.message });\n  }\n};\n`;
  fs.writeFileSync(abs, code);
  console.log('Refactored for professional usage:', abs);
}

// Update or create routes/toolsRoutes.js for waterProofing
const routeFile = path.join(__dirname, '../../routes/toolsRoutes.js');
let routerDef = `// AUTO-REFRACTORED FOR WATERPROOFING CONTROLLERS. DO NOT EDIT MANUALLY.\n\nconst express = require('express');\nconst multer = require('multer');\nconst storage = multer.memoryStorage();\nconst upload = multer({ storage });\nconst router = express.Router();\n`;
let imports = '';
let routes = '';
for (const { rel } of controllers) {
  const parts = rel.split(path.sep);
  const file = parts.pop();
  const controllerVar = toPascal(parts.join('_') + '_' + file.replace('.js', ''));
  const importPath = `../controllers/waterProofing/${parts.length ? parts.join('/') + '/' : ''}${file}`;
  imports += `const ${controllerVar} = require('${importPath}');\n`;
  // Route: /api/waterProofing/<folders>/<controller>
  const routeBase = '/api/waterProofing/' + parts.map(toPascal).join('/') + (parts.length ? '/' : '') + toPascal(file.replace('Controller.js', ''));
  routes += `router.post('${routeBase}', upload.array('photos', 5), ${controllerVar}.create${toPascal(file.replace('Controller.js', ''))});\n`;
  routes += `router.get('${routeBase}', ${controllerVar}.getAll${toPascal(file.replace('Controller.js', ''))});\n`;
  routes += `router.get('${routeBase}/:id', ${controllerVar}.getOne${toPascal(file.replace('Controller.js', ''))});\n`;
  routes += `router.put('${routeBase}/:id', upload.array('photos', 5), ${controllerVar}.update${toPascal(file.replace('Controller.js', ''))});\n`;
  routes += `router.delete('${routeBase}/:id', ${controllerVar}.delete${toPascal(file.replace('Controller.js', ''))});\n`;
}
const finalRoutes = `${routerDef}${imports}\n${routes}\nmodule.exports = router;\n`;
fs.writeFileSync(routeFile, finalRoutes);
console.log('Routes written:', routeFile); 