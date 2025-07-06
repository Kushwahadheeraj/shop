const fs = require('fs');
const path = require('path');

// Function to update a single file
function updateFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath, '.js');
        const functionName = fileName.replace('Controller', '');
        
        // Create folder name (camelCase)
        const folderName = functionName.replace(/([A-Z])/g, (match, p1) => p1.toLowerCase());
        
        // Update function names
        content = content.replace(/exports\.create\w+/g, `exports.create${functionName}`);
        content = content.replace(/exports\.getAll\w+/g, `exports.getAll${functionName}`);
        content = content.replace(/exports\.get\w+ById/g, `exports.get${functionName}ById`);
        content = content.replace(/exports\.update\w+/g, `exports.update${functionName}`);
        content = content.replace(/exports\.delete\w+/g, `exports.delete${functionName}`);
        
        // Update type field
        content = content.replace(/type: '\w+'/g, `type: '${functionName}'`);
        
        // Update cloudinary folder
        content = content.replace(/folder: '\w+'/g, `folder: '${folderName}'`);
        
        // Update import paths for subdirectories
        const relativePath = path.relative(path.dirname(filePath), path.join(__dirname, 'backend'));
        const depth = relativePath.split(path.sep).length - 1;
        
        if (depth > 0) {
            const modelPath = '../'.repeat(depth) + 'models/locksModel';
            const cloudinaryPath = '../'.repeat(depth) + 'config/cloudinary';
            
            content = content.replace(/require\('\.\.\/\.\.\/models\/locksModel'\)/g, `require('${modelPath}')`);
            content = content.replace(/require\('\.\.\/\.\.\/config\/cloudinary'\)/g, `require('${cloudinaryPath}')`);
        }
        
        fs.writeFileSync(filePath, content);
        console.log(`Updated: ${filePath}`);
        return true;
    } catch (error) {
        console.error(`Error updating ${filePath}:`, error.message);
        return false;
    }
}

// Function to recursively find all .js files
function findJsFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            files.push(...findJsFiles(fullPath));
        } else if (item.endsWith('.js')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

// Main execution
const locksDir = path.join(__dirname, 'backend', 'controllers', 'locks');
const jsFiles = findJsFiles(locksDir);

console.log(`Found ${jsFiles.length} files to update:`);

let successCount = 0;
for (const file of jsFiles) {
    if (updateFile(file)) {
        successCount++;
    }
}

console.log(`\nSuccessfully updated ${successCount} out of ${jsFiles.length} files.`); 