const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Image Upload Configuration...\n');

// Test 1: Check if uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsDir)) {
  console.log('✅ Uploads directory exists');
} else {
  console.log('❌ Uploads directory missing');
}

// Test 2: Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file exists');
} else {
  console.log('❌ .env file missing');
}

// Test 3: Check Cloudinary configuration
try {
  require('dotenv').config();
  const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                       process.env.CLOUDINARY_API_KEY && 
                       process.env.CLOUDINARY_API_SECRET;
  
  if (hasCloudinary) {
    console.log('✅ Cloudinary configured - will use cloud storage');
  } else {
    console.log('✅ Cloudinary not configured - will use local storage (fallback)');
  }
} catch (error) {
  console.log('✅ Using local storage fallback');
}

// Test 4: Check required dependencies
const dependencies = ['multer', 'cloudinary', 'streamifier'];
dependencies.forEach(dep => {
  try {
    require(dep);
    console.log(`✅ ${dep} dependency available`);
  } catch (error) {
    console.log(`❌ ${dep} dependency missing`);
  }
});

console.log('\n🎉 Configuration test complete!');
console.log('📝 If you see any ❌ marks, run: node setup-env.js');
console.log('🚀 Start the server with: npm start'); 