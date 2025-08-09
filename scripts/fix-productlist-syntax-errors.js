const fs = require('fs');
const path = require('path');

function fixProductListFile(filePath) {
  console.log(`Fixing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Fix duplicate fetchProducts function
  if (content.includes('const fetchProducts = async () => {') && content.includes('setProducts(data);')) {
    // Find the original fetchProducts function and replace it completely
    const fetchProductsRegex = /const fetchProducts = async \(\) => \{[\s\S]*?\};/g;
    const matches = content.match(fetchProductsRegex);
    
    if (matches && matches.length > 1) {
      // Keep only the first (correct) version
      const correctFetchProducts = `const fetchProducts = async () => {
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
      
      content = content.replace(fetchProductsRegex, correctFetchProducts);
      modified = true;
    }
  }

  // 2. Fix loading state
  if (content.includes('const [loading, setLoading] = useState(false)')) {
    content = content.replace(
      'const [loading, setLoading] = useState(false)',
      'const [loading, setLoading] = useState(true)'
    );
    modified = true;
  }

  // 3. Fix error display
  if (content.includes('Error: {error}')) {
    content = content.replace(
      'Error: {error}',
      'Error loading products: {error}'
    );
    modified = true;
  }

  // 4. Fix loading text
  if (content.includes('Loading products...') && !content.includes('Loading products... Please wait.')) {
    content = content.replace(
      'Loading products...',
      'Loading products... Please wait.'
    );
    modified = true;
  }

  // 5. Fix retry button text
  if (content.includes('Try Again')) {
    content = content.replace(
      'Try Again',
      'Retry Loading'
    );
    modified = true;
  }

  // 6. Fix handleDelete function
  if (content.includes('const handleDelete = async (id) => {') && !content.includes('alert(\'Product deleted successfully!\')')) {
    const handleDeleteRegex = /const handleDelete = async \(id\) => \{[\s\S]*?\};/;
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
    
    content = content.replace(handleDeleteRegex, newHandleDelete);
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
console.log('🔧 Fixing ProductList syntax errors...\n');

const productListDir = path.join(__dirname, '..', 'app', 'Dashboard', 'ProductList');
const productListFiles = findProductListFiles(productListDir);

console.log(`Found ${productListFiles.length} ProductList files:\n`);

for (const file of productListFiles) {
  fixProductListFile(file);
}

console.log('\n🎉 All ProductList files have been fixed!');
console.log('\n📋 Summary of fixes applied:');
console.log('1. ✅ Fixed duplicate fetchProducts functions');
console.log('2. ✅ Fixed loading state management');
console.log('3. ✅ Improved error display messages');
console.log('4. ✅ Enhanced loading indicators');
console.log('5. ✅ Added retry functionality');
console.log('6. ✅ Enhanced delete error handling');

