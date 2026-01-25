const fs = require('fs');
const path = require('path');

const rootDir = path.join(process.cwd(), 'app/dashboard/app/ProductAdd');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file === 'page.js' || file === 'page.jsx') {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });

  return arrayOfFiles;
}

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check for the specific broken pattern: two return statements or invalid JSX structure
    // Pattern 1: return <CategoryBannerUpload ... /> followed by return <ProductForm ... />
    const brokenPatternRegex = /return\s+<CategoryBannerUpload\s+category="([^"]+)"\s*\/>\s*return\s+<ProductForm\s*\/>\s*;/s;
    // Also handle case without semicolon or different spacing
    const brokenPatternRegex2 = /return\s+<CategoryBannerUpload\s+category="([^"]+)"\s*\/>\s*return\s+<ProductForm\s*\/>/s;
    
    // Pattern 3: return <CategoryBannerUpload ... /> followed by <ProductForm /> (implicit return issue if arrows used without block, but here we see function bodies)
    
    let match = content.match(brokenPatternRegex) || content.match(brokenPatternRegex2);
    
    if (match) {
      const category = match[1];
      const replacement = `return (
    <div className="space-y-6">
      <CategoryBannerUpload category="${category}" />
      <ProductForm />
    </div>
  );`;
      
      // Replace the whole match
      // We need to be careful with string replacement if regex matched large chunk
      // But here the match is specific.
      
      // Let's reconstruct the file content
      // We'll replace the match text with replacement.
      
      const newContent = content.replace(match[0], replacement);
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Fixed ${filePath}`);
      return;
    }

    // Pattern 4: Check if we created invalid JSX by inserting next to ProductForm without a parent?
    // If original was: return <ProductForm />
    // Script made: return <CategoryBannerUpload ... />\n<ProductForm />
    // This is unreachable code if first line is return.
    
    // The script logic was:
    // content.slice(0, productFormIndex) + componentUsage + '\n' + indentation + content.slice(productFormIndex);
    
    // If original: return <ProductForm />;
    // productFormIndex points to <ProductForm
    // Result: return <CategoryBannerUpload ... />\n<ProductForm />;
    
    // My previous regex covers this (two returns? No, the original `return` is before the insertion point).
    // Original: return <ProductForm />;
    // Insertion point: before <ProductForm
    // Result: return <CategoryBannerUpload ... />
    //         <ProductForm />;
    // So it looks like:
    // return <CategoryBannerUpload category="..." />
    // <ProductForm />;
    
    // The `return` keyword is BEFORE the insertion.
    // So the code becomes:
    // return <CategoryBannerUpload category="..." />
    // <ProductForm />;
    
    // This effectively returns the banner and ignores the form!
    // And if it's JSX, it returns the banner element.
    // The Form is unreachable code.
    
    // So I need to find:
    // return <CategoryBannerUpload ... />
    // \s*<ProductForm ...
    
    const brokenReturnRegex = /return\s+<CategoryBannerUpload\s+category="([^"]+)"\s*\/>\s*<ProductForm/s;
    
    match = content.match(brokenReturnRegex);
    if (match) {
      const category = match[1];
      // We need to capture the rest of ProductForm line usually ending with /> or />;
      
      // Actually, easier approach:
      // Search for the sequence and wrap it.
      
      const pattern = `return <CategoryBannerUpload category="${category}" />`;
      const index = content.indexOf(pattern);
      if (index !== -1) {
        // check what follows
        const after = content.slice(index + pattern.length);
        if (after.trim().startsWith('<ProductForm')) {
           // This is the broken case
           // We need to wrap them.
           
           // We need to find where `return` started.
           const returnIndex = content.lastIndexOf('return', index);
           
           if (returnIndex !== -1) {
             const preReturn = content.slice(0, returnIndex);
             const postProductForm = content.slice(content.indexOf('<ProductForm', index));
             // Find end of ProductForm
             const endForm = postProductForm.indexOf('/>');
             const endFormFull = endForm + 2;
             const rest = postProductForm.slice(endFormFull);
             
             // Check for semicolon
             let restClean = rest;
             if (rest.trim().startsWith(';')) {
                restClean = rest.substring(rest.indexOf(';') + 1);
             }
             
             const newBlock = `return (
    <div className="space-y-6">
      <CategoryBannerUpload category="${category}" />
      <ProductForm />
    </div>
  );`;
             
             const finalContent = preReturn + newBlock + restClean;
             fs.writeFileSync(filePath, finalContent, 'utf8');
             console.log(`Fixed (Variant 2) ${filePath}`);
           }
        }
      }
    }

  } catch (err) {
    console.error(`Error fixing ${filePath}:`, err);
  }
}

try {
  const files = getAllFiles(rootDir);
  console.log(`Scanning ${files.length} files for fixes...`);
  files.forEach(file => fixFile(file));
} catch (e) {
  console.error("Error finding files:", e);
}
