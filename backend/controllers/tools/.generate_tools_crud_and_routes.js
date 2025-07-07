const fs = require('fs');
const path = require('path');

const multerImport = `const multer = require('multer');\nconst storage = multer.memoryStorage();\nconst upload = multer({ storage });\n`;
const cloudinaryImport = `const cloudinary = require('../../config/cloudinary');\n`;
const streamifierImport = `const streamifier = require('streamifier');\n`;

const uploadHelper = `// Helper for Cloudinary upload\nfunction uploadToCloudinary(buffer) {\n  return new Promise((resolve, reject) => {\n    const stream = cloudinary.uploader.upload_stream((err, result) => {\n      if (err) return reject(err);\n      resolve(result.secure_url);\n    });\n    streamifier.createReadStream(buffer).pipe(stream);\n  });\n}\n`;

const crudTemplate = (category) => `// AUTO-GENERATED. DO NOT EDIT MANUALLY.\n\n${cloudinaryImport}${streamifierImport}${uploadHelper}
exports.create = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    const product = new (require('../../models/ToolsModels'))({ ...req.body, photos: photoUrls, category: '${category}' });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const products = await require('../../models/ToolsModels').find({ category: '${category}' });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const product = await require('../../models/ToolsModels').findOne({ _id: req.params.id, category: '${category}' });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let update = { ...req.body };
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const product = await require('../../models/ToolsModels').findOneAndUpdate(
      { _id: req.params.id, category: '${category}' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const product = await require('../../models/ToolsModels').findOneAndDelete({ _id: req.params.id, category: '${category}' });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
`;

function toCamel(str) {
  return str.replace(/[-_ ]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^./, s => s.toLowerCase());
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

// 1. Generate CRUD code for each controller
for (const { abs, rel } of controllers) {
  const parts = rel.split(path.sep);
  const file = parts.pop();
  const category = toCamel(file.replace('Controller.js', ''));
  if (fs.readFileSync(abs, 'utf8').trim().startsWith('// AUTO-GENERATED. DO NOT EDIT MANUALLY.')) continue;
  fs.writeFileSync(abs, crudTemplate(category));
  console.log('CRUD written:', abs);
}

// 2. Generate routes
const routeFile = path.join(__dirname, '../../routes/toolsRoutes.js');
let imports = '';
let routes = '';
let routerDef = `// AUTO-GENERATED. DO NOT EDIT MANUALLY.\n\nconst express = require('express');\nconst multer = require('multer');\nconst storage = multer.memoryStorage();\nconst upload = multer({ storage });\nconst router = express.Router();\n`;

for (const { rel } of controllers) {
  const parts = rel.split(path.sep);
  const file = parts.pop();
  const controllerVar = toCamel(parts.join('_') + '_' + file.replace('.js', ''));
  const importPath = `../controllers/tools/${parts.length ? parts.join('/') + '/' : ''}${file}`;
  imports += `const ${controllerVar} = require('${importPath}');\n`;
  // Route: /api/tools/<folders>/<controller>
  const routeBase = '/api/tools/' + parts.map(toCamel).join('/') + (parts.length ? '/' : '') + toCamel(file.replace('Controller.js', ''));
  routes += `router.post('${routeBase}', upload.array('photos', 5), ${controllerVar}.create);\n`;
  routes += `router.get('${routeBase}', ${controllerVar}.getAll);\n`;
  routes += `router.get('${routeBase}/:id', ${controllerVar}.getOne);\n`;
  routes += `router.put('${routeBase}/:id', upload.array('photos', 5), ${controllerVar}.update);\n`;
  routes += `router.delete('${routeBase}/:id', ${controllerVar}.delete);\n`;
}

const finalRoutes = `${routerDef}${imports}\n${routes}\nmodule.exports = router;\n`;
fs.writeFileSync(routeFile, finalRoutes);
console.log('Routes written:', routeFile); 