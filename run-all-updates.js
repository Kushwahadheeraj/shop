const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting comprehensive ProductList API URL updates...\n');

try {
  // Run the first script (main categories and electrical)
  console.log('📋 Step 1: Updating main categories and electrical...');
  execSync('node update-all-productlist-apis.js', { stdio: 'inherit' });
  console.log('\n✅ Step 1 completed!\n');

  // Run the second script (locks, paint, tools)
  console.log('📋 Step 2: Updating locks, paint, and tools...');
  execSync('node update-remaining-categories.js', { stdio: 'inherit' });
  console.log('\n✅ Step 2 completed!\n');

  // Run the third script (sanitary)
  console.log('📋 Step 3: Updating sanitary category...');
  execSync('node update-sanitary-category.js', { stdio: 'inherit' });
  console.log('\n✅ Step 3 completed!\n');

  console.log('🎉 All ProductList API URL updates completed successfully!');
  console.log('\n📊 Summary:');
  console.log('- ✅ Main categories (Adhesives, Brush, Cements, etc.)');
  console.log('- ✅ Electrical (all subcategories including Fans, Lights, etc.)');
  console.log('- ✅ Locks (all subcategories)');
  console.log('- ✅ Paint (all subcategories)');
  console.log('- ✅ Sanitary (all subcategories)');
  console.log('- ✅ Tools (all subcategories)');
  console.log('- ✅ Pipe, PVC Mats, Roofer, WaterProofing');
  console.log('\n🔧 All API_URL values now match the exact endpoints from api.js');
  console.log('🔧 All delete endpoints have been fixed from /delete: to /delete/');

} catch (error) {
  console.error('❌ Error running update scripts:', error.message);
  process.exit(1);
} 