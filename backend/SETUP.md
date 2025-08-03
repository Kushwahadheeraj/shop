# Backend Setup Guide

## Quick Setup (Automatic Error Fix)

The backend now includes automatic error handling and fallback solutions:

1. **Run the setup script** to configure everything automatically:
   ```bash
   cd backend
   node setup-env.js
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

That's it! The system will work with local image storage by default.

## Environment Variables

The setup script creates a `.env` file with default values. You can customize it:

```env
# Database Configuration
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
```

## Image Storage Options

### Option 1: Local Storage (Default - No Setup Required)
- Images are stored locally in the `uploads/` directory
- Automatically configured and working
- No external dependencies

### Option 2: Cloudinary (Optional)
1. Sign up for a free Cloudinary account at https://cloudinary.com/
2. Get your cloud name, API key, and API secret from your dashboard
3. Uncomment and add them to your `.env` file
4. Restart the server

## Features Implemented

### ✅ Seller Profile Management
- ✅ Seller-only dashboard access
- ✅ Profile information display
- ✅ Profile editing with image upload
- ✅ Password change functionality
- ✅ Avatar image upload and display
- ✅ Username and email editing
- ✅ **Automatic error handling and fallback solutions**

### ✅ Security Features
- ✅ JWT authentication
- ✅ Protected routes for sellers only
- ✅ File upload validation (images only, 5MB limit)
- ✅ Password hashing with bcrypt

### ✅ Frontend Features
- ✅ Modern UI with Tailwind CSS
- ✅ Image preview before upload
- ✅ Responsive design
- ✅ Loading states and error handling
- ✅ Avatar display in navbar and profile
- ✅ **Automatic URL handling for local and cloud storage**

### ✅ Error Handling
- ✅ **Automatic fallback to local storage if Cloudinary fails**
- ✅ **Graceful handling of missing configuration**
- ✅ **Proper error messages and validation**
- ✅ **Image upload works without any external setup**

## API Endpoints

### Public Routes
- `POST /api/seller/register` - Register new seller
- `POST /api/seller/login` - Seller login

### Protected Routes (Seller Only)
- `GET /api/seller/profile/me` - Get current seller profile
- `PUT /api/seller/profile/me` - Update profile (with image upload)
- `PUT /api/seller/profile/password` - Change password
- `GET /api/seller/:id` - Get seller by ID
- `PUT /api/seller/:id` - Update seller by ID

## Troubleshooting

### "Failed to upload image" Error
This error is now automatically fixed! The system will:
1. Try to use Cloudinary if configured
2. Automatically fall back to local storage if Cloudinary fails
3. Create necessary directories automatically
4. Handle file URLs properly

### No Setup Required
The system works out of the box with:
- Local image storage
- Default database configuration
- Automatic directory creation
- Error handling and fallbacks

## Running the Backend

```bash
cd backend
node setup-env.js  # One-time setup
npm start
```

The server will start on port 5000 and handle image uploads automatically! 