const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('[DB] MONGO_URI missing in environment variables');
      process.exit(1);
    }

    const safeUri = mongoUri.replace(/:\/\/.*:(.*)@/, '://****:****@');
    console.log(`[DB] Connecting to MongoDB: ${safeUri}`);
    
    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      retryWrites: true,
      retryReads: true
    });
    console.log(
      `[DB] Connected successfully to ${connection.connection.host}/${connection.connection.name}`
    );
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('[DB] MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('[DB] MongoDB disconnected');
    });

    return connection;
    
  } catch (err) {
    console.error('[DB] Initial MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB; 
