const fs = require('fs');
const path = require('path');

// Load sidebar structure from controllersSidebar.json
const sidebar = require('./controllersSidebar.json');

function createPageFile(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const pageFile = path.join(dir, 'page.jsx');
  if (!fs.existsSync(pageFile)) {
    fs.writeFileSync(pageFile, `// page.jsx for ${dir.split(path.sep).pop()}`);
  }
}

function processItems(base, items) {
  items.forEach(item => {
    const folder = path.join(base, item.name);
    createPageFile(folder);
    if (item.subItems) processItems(folder, item.subItems);
    if (item.subItemsName) processItems(folder, item.subItemsName);
    if (item.subItemsNameComponent) processItems(folder, item.subItemsNameComponent);
  });
}

['app/Dashboard/ProductAdd', 'app/Dashboard/ProductList'].forEach(base => {
  processItems(base, sidebar);
});

console.log('Sidebar folders and page.jsx files created/updated.'); 