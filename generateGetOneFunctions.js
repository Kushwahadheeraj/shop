const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'backend', 'controllers', 'locks');

function pascalCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/(^\w|\s\w)/g, m => m.toUpperCase())
    .replace(/\s/g, '');
}

function getTypeOrCategory(content, fileName) {
  // Try to find type or category from code
  const typeMatch = content.match(/type:\s*['"]([\w-]+)['"]/);
  if (typeMatch) return typeMatch[1];
  const catMatch = content.match(/category:\s*['"]([\w-]+)['"]/);
  if (catMatch) return catMatch[1];
  // Fallback: guess from file name
  return fileName.replace(/Controller(s)?\.js$/i, '').replace(/([A-Z])/g, (m, i) => (i ? m : m.toLowerCase()));
}

function getResourceName(fileName) {
  // Remove extension and Controller(s)
  let base = path.basename(fileName).replace(/Controller(s)?\.js$/i, '');
  return pascalCase(base);
}

function hasGetOneFunction(content, resource) {
  const regex = new RegExp(`exports\\.getOne${resource}\\s*=`, 'i');
  return regex.test(content);
}

function addGetOneFunction(content, resource, typeOrCategory) {
  return (
    content.trim() +
    `\n\nexports.getOne${resource} = async (req, res) => {\n  try {\n    const item = await Lock.findOne({ _id: req.params.id, type: '${typeOrCategory}' });\n    if (!item) return res.status(404).json({ message: 'Not found' });\n    res.json(item);\n  } catch (err) {\n    res.status(500).json({ message: err.message });\n  }\n};\n`
  );
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const resource = getResourceName(filePath);
  if (hasGetOneFunction(content, resource)) return false;
  const typeOrCategory = getTypeOrCategory(content, resource);
  // Ensure Lock is imported
  if (!/const Lock = require\(['"][\.\.\/]+models\/LocksModels['"]\)/.test(content)) {
    content = `const Lock = require('../../models/LocksModels');\n` + content;
  }
  content = addGetOneFunction(content, resource, typeOrCategory);
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.js')) {
      if (processFile(fullPath)) {
        console.log('Updated:', fullPath);
      }
    }
  });
}

walk(BASE_DIR);
console.log('Done!'); 