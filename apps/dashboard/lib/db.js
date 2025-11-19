import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Log environment variable status
  console.log('🔍 connectDB() called');
  console.log('  MONGO_URI defined:', !!MONGODB_URI);
  console.log('  MONGO_URI preview:', MONGODB_URI ? MONGODB_URI.replace(/:[^:@]+@/, ':****@') : 'NOT SET');
  
  // Check if we have a cached connection and if it's still alive
  if (cached.conn) {
    const state = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (state === 1) {
      console.log('✅ Using cached connection (state: connected)');
      return cached.conn;
    } else {
      console.log(`⚠️ Cached connection state: ${state}, reconnecting...`);
      cached.conn = null;
      cached.promise = null;
    }
  }

  if (!cached.promise) {
    console.log('🔄 Creating new MongoDB connection...');
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000, // Increased timeout
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      console.log('✅ Database:', mongoose.connection.name);
      console.log('✅ Host:', mongoose.connection.host);
      return mongoose;
    }).catch((err) => {
      console.error('');
      console.error('❌ MongoDB connection failed!');
      console.error('═══════════════════════════════════════');
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      console.error('Error code:', err.code);
      console.error('');
      console.error('💡 MONGO_URI being used:', MONGODB_URI ? MONGODB_URI.replace(/:[^:@]+@/, ':****@') : 'NOT SET');
      console.error('');
      console.error('💡 Possible solutions:');
      
      if (err.name === 'MongoServerSelectionError' || err.code === 'ENOTFOUND' || err.message.includes('ENOTFOUND')) {
        console.error('');
        console.error('🔴 Network/Connection Issue:');
        console.error('1. Check if MongoDB Atlas cluster is running (not paused)');
        console.error('   - Go to MongoDB Atlas → Clusters');
        console.error('   - Make sure cluster status is "Active"');
        console.error('');
        console.error('2. Verify your IP address is whitelisted in MongoDB Atlas');
        console.error('   - Go to MongoDB Atlas → Network Access');
        console.error('   - Click "Add IP Address"');
        console.error('   - Add your current IP or use 0.0.0.0/0 for testing');
        console.error('   - Wait 1-2 minutes for changes to take effect');
        console.error('');
        console.error('3. Check your internet connection');
        console.error('4. Verify the cluster URL is correct');
      } else if (err.message.includes('authentication') || err.message.includes('auth') || err.code === 8000) {
        console.error('');
        console.error('🔴 Authentication Issue:');
        console.error('1. Check your username and password are correct');
        console.error('2. Make sure special characters in password are URL-encoded:');
        console.error('   - @ → %40');
        console.error('   - # → %23');
        console.error('   - % → %25');
        console.error('   - & → %26');
        console.error('3. Verify the database user has proper permissions');
        console.error('   - Go to MongoDB Atlas → Database Access');
        console.error('   - Check user permissions');
      } else {
        console.error('');
        console.error('🔴 General Connection Issue:');
        console.error('1. Check your MONGO_URI format in .env file');
        console.error('   Format should be: mongodb://localhost:27017/shop');
        console.error('   Or for Atlas: mongodb+srv://username:password@cluster.mongodb.net/shop');
        console.error('2. Make sure .env file is in project root');
        console.error('3. Restart dev server after changing .env file');
      }
      console.error('═══════════════════════════════════════');
      console.error('');
      
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

