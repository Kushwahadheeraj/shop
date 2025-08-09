const fs = require('fs');
const path = require('path');

// Function to fix individual ProductList file
function fixProductListFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Fix duplicate semicolons
    if (content.includes(';;')) {
      content = content.replace(/;;/g, ';');
      modified = true;
      console.log(`✅ Fixed duplicate semicolons in: ${filePath}`);
    }

    // 2. Add error handling for delete operations
    if (content.includes('const res = await fetch') && content.includes('method: "DELETE"') && !content.includes('catch (error)')) {
      // Find the delete function and add error handling
      const deleteFunctionMatch = content.match(/const handleDelete[^{]*{[\s\S]*?}/);
      if (deleteFunctionMatch) {
        const deleteFunction = deleteFunctionMatch[0];
        if (!deleteFunction.includes('catch (error)')) {
          const newDeleteFunction = deleteFunction.replace(
            /const res = await fetch[^;]+;/,
            `try {
      const res = await fetch(deleteUrl, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(\`HTTP error! status: \${res.status}\`);
      }
      // Refresh the product list after successful deletion
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }`
          );
          content = content.replace(deleteFunction, newDeleteFunction);
          modified = true;
          console.log(`✅ Added error handling in: ${filePath}`);
        }
      }
    }

    // 3. Add loading states if missing
    if (content.includes('const [products, setProducts]') && !content.includes('const [loading, setLoading]')) {
      content = content.replace(
        /const \[products, setProducts\]/,
        `const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);`
      );
      modified = true;
      console.log(`✅ Added loading state in: ${filePath}`);
    }

    // 4. Add loading state management in fetchProducts
    if (content.includes('const fetchProducts') && !content.includes('setLoading(true)')) {
      const fetchProductsMatch = content.match(/const fetchProducts[^{]*{[\s\S]*?}/);
      if (fetchProductsMatch) {
        const fetchProducts = fetchProductsMatch[0];
        if (!fetchProducts.includes('setLoading(true)')) {
          const newFetchProducts = fetchProducts.replace(
            /const fetchProducts[^{]*{/,
            `const fetchProducts = async () => {
    try {
      setLoading(true);`
          ).replace(
            /setProducts\(data\);/,
            `setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        alert('Error loading products. Please refresh the page.');
      } finally {
        setLoading(false);
      }`
          );
          content = content.replace(fetchProducts, newFetchProducts);
          modified = true;
          console.log(`✅ Added loading management in: ${filePath}`);
        }
      }
    }

    // 5. Add loading indicator in JSX if missing
    if (content.includes('return (') && !content.includes('loading') && content.includes('const [loading, setLoading]')) {
      content = content.replace(
        /return \(/,
        `return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading products...</div>
        </div>
      ) : (`
      ).replace(
        /<\/div>/,
        `      )}
    </div>`
      );
      modified = true;
      console.log(`✅ Added loading indicator in: ${filePath}`);
    }

    // Write back if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively find all ProductList.jsx files
function findProductListFiles(dir) {
  const files = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item === 'ProductList.jsx') {
        files.push(fullPath);
      }
    }
  }
  
  scanDirectory(dir);
  return files;
}

// Main execution
function main() {
  console.log('🔧 Starting ProductList bugs fix...\n');
  
  const productListDir = path.join(__dirname, '..', 'app', 'Dashboard', 'ProductList');
  const productListFiles = findProductListFiles(productListDir);
  
  console.log(`📁 Found ${productListFiles.length} ProductList.jsx files\n`);
  
  let fixedCount = 0;
  let errorCount = 0;
  
  for (const filePath of productListFiles) {
    try {
      const wasFixed = fixProductListFile(filePath);
      if (wasFixed) {
        fixedCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`✅ Files fixed: ${fixedCount}`);
  console.log(`❌ Files with errors: ${errorCount}`);
  console.log(`📁 Total files processed: ${productListFiles.length}`);
  console.log('\n🎉 ProductList bugs fix completed!');
}

main();
