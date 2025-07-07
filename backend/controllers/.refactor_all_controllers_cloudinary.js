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
const uploadHelper = `/**\n * Uploads a buffer to Cloudinary and returns the secure URL.\n * @param {Buffer} buffer\n * @returns {Promise<string>}\n */\nfunction uploadToCloudinary(buffer) {\n  return new Promise((resolve, reject) => {\n    const stream = cloudinary.uploader.upload_stream((err, result) => {\n      if (err) return reject(err);\n      resolve(result.secure_url);\n    });\n    streamifier.createReadStream(buffer).pipe(stream);\n  });\n}\n`;

for (const { abs, rel } of controllers) {
  const fileBase = path.basename(abs, 'Controller.js');
  const pascal = toPascal(fileBase);
  // Try to detect the model import line
  let modelImport = '';
  let modelName = '';
  let modelPath = '';
  let content = fs.readFileSync(abs, 'utf8');
  const modelMatch = content.match(/require\(['"](\.\.\/models\/(\w+))['"]\)/);
  if (modelMatch) {
    modelPath = modelMatch[1];
    modelName = modelMatch[2];
    modelImport = `const ${modelName} = require('${modelPath}');\n`;
  } else {
    // fallback: try to guess model name from file name
    modelName = pascal + 'Model';
    modelImport = `// TODO: Set correct model import\n`;
  }
  let code = `// AUTO-REFRACTORED FOR CLOUDINARY IMAGE UPLOAD. DO NOT EDIT MANUALLY.\n\n${cloudinaryImport}${streamifierImport}${modelImport}${uploadHelper}\n`;
  code += `/**\n * Create a new ${pascal} product.\n */\nexports.create${pascal} = async (req, res) => {\n  try {\n    if (!req.files || req.files.length < 1) {\n      return res.status(400).json({ error: 'At least 1 image is required.' });\n    }\n    if (req.files.length > 5) {\n      return res.status(400).json({ error: 'No more than 5 images allowed.' });\n    }\n    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    const product = new ${modelName}({ ...req.body, photos: photoUrls, category: '${fileBase}' });\n    await product.save();\n    res.status(201).json(product);\n  } catch (err) {\n    res.status(500).json({ error: err.message });\n  }\n};\n\n`;
  code += `/**\n * Update a ${pascal} product by ID.\n */\nexports.update${pascal} = async (req, res) => {\n  try {\n    let update = { ...req.body };
    if (req.files && req.files.length > 0) {\n      if (req.files.length > 5) {\n        return res.status(400).json({ error: 'No more than 5 images allowed.' });\n      }\n      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }\n    const product = await ${modelName}.findOneAndUpdate(\n      { _id: req.params.id, category: '${fileBase}' },\n      update,\n      { new: true }\n    );\n    if (!product) return res.status(404).json({ error: 'Not found' });\n    res.json(product);\n  } catch (err) {\n    res.status(500).json({ error: err.message });\n  }\n};\n`;
  // Keep other functions as-is (getAll, getOne, delete)
  const keepFns = content.match(/exports\.(getAll|getOne|delete)[^=]*=\s*async[\s\S]*?};/g);
  if (keepFns) code += keepFns.join('\n\n') + '\n';
  fs.writeFileSync(abs, code);
  console.log('Refactored for Cloudinary image upload:', abs);
} 