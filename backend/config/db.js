const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      process.exit(1);
    }

    const safeUri = mongoUri.replace(/:\/\/.*:(.*)@/, '://****:****@');
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      retryWrites: true,
      retryReads: true
    });
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
    });
    
    mongoose.connection.on('disconnected', () => {
    });
    
  } catch (err) {
    process.exit(1);
  }
};

module.exports = connectDB; 