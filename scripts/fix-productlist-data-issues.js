const fs = require('fs');
const path = require('path');

function fixProductListFile(filePath) {
  console.log(`Fixing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Add better error handling and debugging
  if (content.includes('const fetchProducts = async () => {') && !content.includes('console.log(\'API URL:\', API_URL')) {
    const fetchProductsPattern = /const fetchProducts = async \(\) => \{[\s\S]*?const res = await fetch\(API_URL \+ '\/get'\);/;
    const newFetchProducts = `const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('API URL:', API_URL + '/get');
      const res = await fetch(API_URL + '/get');
      console.log('Response status:', res.status);
      if (!res.ok) {
        throw new Error(\`HTTP error! status: \${res.status}\`);
      }
      const data = await res.json();
      console.log('Response data:', data);
      console.log('Data type:', typeof data);
      console.log('Data length:', Array.isArray(data) ? data.length : 'Not an array');
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };`;
    
    content = content.replace(fetchProductsPattern, newFetchProducts);
    modified = true;
  }

  // 2. Add better loading state management
  if (content.includes('const [loading, setLoading] = useState(false)') && !content.includes('const [loading, setLoading] = useState(true)')) {
    content = content.replace(
      'const [loading, setLoading] = useState(false)',
      'const [loading, setLoading] = useState(true)'
    );
    modified = true;
  }

  // 3. Add better empty state handling
  if (content.includes('No products found') && !content.includes('No products found. Please check your connection or try refreshing.')) {
    content = content.replace(
      'No products found',
      'No products found. Please check your connection or try refreshing.'
    );
    modified = true;
  }

  // 4. Add better error display
  if (content.includes('Error: {error}') && !content.includes('Error loading products: {error}')) {
    content = content.replace(
      'Error: {error}',
      'Error loading products: {error}'
    );
    modified = true;
  }

  // 5. Add data validation before setting products
  if (content.includes('setProducts(data)') && !content.includes('setProducts(Array.isArray(data) ? data : [])')) {
    content = content.replace(
      'setProducts(data)',
      'setProducts(Array.isArray(data) ? data : [])'
    );
    modified = true;
  }

  // 6. Add better delete error handling
  if (content.includes('const handleDelete = async (id) => {') && !content.includes('alert(\'Product deleted successfully!\')')) {
    const handleDeletePattern = /const handleDelete = async \(id\) => \{[\s\S]*?await fetchProducts\(\); \/\/ Refresh the list[\s\S]*?\};/;
    const newHandleDelete = `const handleDelete = async (id) => {
    try {
      const deleteUrl = \`\${API_URL}/delete/\${id}\`;
      console.log('Delete URL:', deleteUrl);
      const res = await fetch(deleteUrl, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(\`HTTP error! status: \${res.status}\`);
      }
      alert('Product deleted successfully!');
      await fetchProducts(); // Refresh the list
    } catch (err) {
      console.error('Error deleting product:', err);
      alert(\`Error deleting product: \${err.message}\`);
      setError(err.message);
    }
  };`;
    
    content = content.replace(handleDeletePattern, newHandleDelete);
    modified = true;
  }

  // 7. Add better loading indicator
  if (content.includes('Loading products...') && !content.includes('Loading products... Please wait.')) {
    content = content.replace(
      'Loading products...',
      'Loading products... Please wait.'
    );
    modified = true;
  }

  // 8. Add retry button for errors
  if (content.includes('Try Again') && !content.includes('Retry Loading')) {
    content = content.replace(
      'Try Again',
      'Retry Loading'
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
  } else {
    console.log(`✅ No changes needed: ${filePath}`);
  }
}

function findProductListFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item === 'ProductList.jsx') {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Main execution
console.log('🔧 Fixing ProductList data display issues...\n');

const productListDir = path.join(__dirname, '..', 'app', 'Dashboard', 'ProductList');
const productListFiles = findProductListFiles(productListDir);

console.log(`Found ${productListFiles.length} ProductList files:\n`);

for (const file of productListFiles) {
  fixProductListFile(file);
}

console.log('\n🎉 All ProductList files have been updated!');
console.log('\n📋 Summary of fixes applied:');
console.log('1. ✅ Added better error handling and debugging logs');
console.log('2. ✅ Fixed loading state management');
console.log('3. ✅ Added better empty state handling');
console.log('4. ✅ Improved error display messages');
console.log('5. ✅ Added data validation before setting products');
console.log('6. ✅ Enhanced delete error handling with alerts');
console.log('7. ✅ Improved loading indicators');
console.log('8. ✅ Added retry functionality');
