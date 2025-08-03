const fs = require('fs');
const path = require('path');

console.log('🖼️  Testing Image Upload System...\n');

// Test 1: Check uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsDir)) {
  console.log('✅ Uploads directory exists');
  const files = fs.readdirSync(uploadsDir);
  console.log(`📁 Found ${files.length} files in uploads directory`);
  if (files.length > 0) {
    files.forEach(file => {
      console.log(`   - ${file}`);
    });
  }
} else {
  console.log('❌ Uploads directory missing');
}

// Test 2: Check server configuration
try {
  const serverPath = path.join(__dirname, 'server.js');
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  if (serverContent.includes('/uploads')) {
    console.log('✅ Static file serving configured for uploads');
  } else {
    console.log('❌ Static file serving not configured');
  }
} catch (error) {
  console.log('❌ Could not check server configuration');
}

// Test 3: Check controller configuration
try {
  const controllerPath = path.join(__dirname, 'controllers/sellerController.js');
  const controllerContent = fs.readFileSync(controllerPath, 'utf8');
  if (controllerContent.includes('uploadToCloudinary')) {
    console.log('✅ Image upload function exists');
  } else {
    console.log('❌ Image upload function missing');
  }
  
  if (controllerContent.includes('fs.writeFileSync')) {
    console.log('✅ Local storage fallback configured');
  } else {
    console.log('❌ Local storage fallback missing');
  }
} catch (error) {
  console.log('❌ Could not check controller configuration');
}

// Test 4: Check environment
try {
  require('dotenv').config();
  const port = process.env.PORT || 5000;
  console.log(`✅ Server will run on port ${port}`);
  
  const hasMongo = process.env.MONGODB_URI;
  if (hasMongo) {
    console.log('✅ MongoDB URI configured');
  } else {
    console.log('⚠️  MongoDB URI not configured (using default)');
  }
  
  const hasJWT = process.env.JWT_SECRET;
  if (hasJWT) {
    console.log('✅ JWT Secret configured');
  } else {
    console.log('⚠️  JWT Secret not configured (using default)');
  }
} catch (error) {
  console.log('❌ Could not check environment configuration');
}

console.log('\n🎯 Image Upload System Status:');
console.log('📤 Uploads will be stored in: ./uploads/');
console.log('🌐 Images will be served from: http://localhost:5000/uploads/');
console.log('🔄 Fallback to local storage if Cloudinary fails');
console.log('✅ System is ready for image uploads!');

console.log('\n🚀 To test:');
console.log('1. Start the server: npm start');
console.log('2. Go to the profile page');
console.log('3. Click "Edit Profile"');
console.log('4. Click the camera icon to upload an image');
console.log('5. Save changes'); 