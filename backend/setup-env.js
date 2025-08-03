const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envExample = `# Database Configuration
MONGODB_URI=mongodb://localhost:27017/shop

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Cloudinary Configuration (optional - will use local storage if not configured)
# CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
# CLOUDINARY_API_KEY=your_cloudinary_api_key
# CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=5000
NODE_ENV=development
`;

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envExample);
  console.log('✅ Created .env file with default configuration');
  console.log('📝 Please update the MONGODB_URI and JWT_SECRET in the .env file');
  console.log('🌤️  Optional: Add Cloudinary credentials for cloud image storage');
} else {
  console.log('✅ .env file already exists');
}

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory for local image storage');
} else {
  console.log('✅ Uploads directory already exists');
}

console.log('\n🚀 Setup complete! You can now start the server with: npm start'); 