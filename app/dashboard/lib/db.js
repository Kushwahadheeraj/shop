import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI;

// Don't throw during build - only check when actually connecting
// This allows the build to complete even without MONGO_URI set

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
  // Check for MONGO_URI when actually connecting (not during build)
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGO_URI environment variable inside .env');
  }
  
  // Log environment variable status
  
  // Check if we have a cached connection and if it's still alive
  if (cached.conn) {
    const state = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (state === 1) {
      return cached.conn;
    } else {
      cached.conn = null;
      cached.promise = null;
    }
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000, // Increased timeout
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    }).catch((err) => {
      
      if (err.name === 'MongoServerSelectionError' || err.code === 'ENOTFOUND' || err.message.includes('ENOTFOUND')) {
      } else if (err.message.includes('authentication') || err.message.includes('auth') || err.code === 8000) {
      } else {
      }
      
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

