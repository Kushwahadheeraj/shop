const fs = require('fs');
const path = require('path');

const CONTROLLERS_DIR = path.join(__dirname, 'backend', 'controllers');
const OUTPUT_FILE = path.join(__dirname, 'controllersSidebar.json');

function toTitleCase(str) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/Controller|\.js$/g, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^\w/, c => c.toUpperCase())
    .trim();
}

function scanDir(dir, baseRoute = '') {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  return items.map(item => {
    if (item.isDirectory()) {
      return {
        name: toTitleCase(item.name),
        path: baseRoute + '/' + item.name,
        subItems: scanDir(path.join(dir, item.name), baseRoute + '/' + item.name)
      };
    } else if (item.isFile() && item.name.endsWith('Controller.js')) {
      const name = toTitleCase(item.name.replace('Controller.js', ''));
      return {
        name,
        path: baseRoute + '/' + name.replace(/ /g, ''),
      };
    }
    return null;
  }).filter(Boolean);
}

const sidebar = scanDir(CONTROLLERS_DIR);
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sidebar, null, 2));
console.log('Sidebar JSON generated at', OUTPUT_FILE); 