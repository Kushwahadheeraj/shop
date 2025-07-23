const fs = require('fs');
const path = require('path');

// Helper to get all ProductForm.jsx files recursively
function getAllProductForms(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllProductForms(filePath, fileList);
    } else if (file === 'ProductForm.jsx') {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Helper to get subfolder names for category (excluding files)
function getSubfolders(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

// Main script
const baseDir = path.join(__dirname, 'app', 'Dashboard', 'ProductAdd');
const productForms = getAllProductForms(baseDir);
const template = fs.readFileSync(path.join(__dirname, 'ProductFormTemplate.txt'), 'utf8');

productForms.forEach(filePath => {
  const folderPath = path.dirname(filePath);
  const relApiPath = `/api/get-categories?dir=${encodeURIComponent(path.relative(baseDir, folderPath))}`;
  const fileContent = template.replace(/\$\{API_PATH\}/g, relApiPath);
  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`Updated: ${filePath}`);
});

console.log(`\nTotal ProductForm.jsx files updated: ${productForms.length}`); 