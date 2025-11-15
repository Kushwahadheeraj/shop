# Environment Variables Setup

## Problem
The API routes are returning 500 errors because required environment variables are missing.

## Solution

Create a `.env` file in the project root (`C:\Users\HP\Documents\NextJS-Pro\shop\.env`) with the following:

```env
# MongoDB Connection String
# For local MongoDB:
MONGO_URI=mongodb://localhost:27017/shop

# For MongoDB Atlas (cloud):
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shop

# JWT Secret Key (generate a random string)
# You can generate one by running: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Optional: Backend API URL (if using separate backend server on port 5000)
# NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

## Steps to Fix

1. **Create `.env` file** in the project root directory
2. **Add the variables** above with your actual values:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A random secret key (generate one or use a strong password)
3. **Restart the dev server**:
   - Stop the current `npm run dev` (Ctrl+C)
   - Run `npm run dev` again
4. **Verify** the errors are gone

## Generate JWT Secret

Run this command to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET` value.

## MongoDB Setup

### Local MongoDB
If you have MongoDB installed locally:
```env
MONGO_URI=mongodb://localhost:27017/shop
```

### MongoDB Atlas (Cloud)
If using MongoDB Atlas:
1. Get your connection string from MongoDB Atlas dashboard
2. Replace `<password>` with your actual password
3. Use format: `mongodb+srv://username:password@cluster.mongodb.net/shop`

## After Setup

Once you've created the `.env` file and restarted the server, the API routes should work correctly.

