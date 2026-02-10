const fs = require('fs');
const path = require('path');

const rootDir = path.join(process.cwd(), 'app/shop/app/ShopPage');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(rootDir, function(filePath) {
  if (filePath.endsWith('page.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content
      .replace(/\/\/ Force dynamic rendering to prevent build timeouts\s*/g, '')
      .replace(/export const dynamic = "force-dynamic";\s*/g, '')
      .replace(/export const runtime = "nodejs";\s*/g, '');
      
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
    }
  }
});
