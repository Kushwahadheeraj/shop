const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGO_URI is not defined in environment variables');
      console.error('Please set MONGO_URI in your .env file');
      process.exit(1);
    }

    const safeUri = mongoUri.replace(/:\/\/.*:(.*)@/, '://****:****@');
    console.log('🔄 Attempting to connect to MongoDB...');
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      retryWrites: true,
      retryReads: true
    });
    
    console.log('✅ MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });
    
  } catch (err) {
    console.error('❌ MongoDB connection failed');
    console.error('Error type:', err.name);
    console.error('Error message:', err.message);
    
    if (err.name === 'MongoServerSelectionError') {
      console.error('\n💡 Possible solutions:');
      console.error('1. Check if MongoDB Atlas cluster is running (not paused)');
      console.error('2. Verify your IP address is whitelisted in MongoDB Atlas');
      console.error('3. Check your internet connection');
      console.error('4. Verify MONGO_URI connection string is correct');
      console.error('5. Try using 0.0.0.0/0 in IP whitelist for testing (not recommended for production)');
    } else if (err.message.includes('ENOTFOUND')) {
      console.error('\n💡 DNS resolution failed. Possible solutions:');
      console.error('1. Check your internet connection');
      console.error('2. Verify MongoDB Atlas cluster hostname is correct');
      console.error('3. Try pinging the MongoDB hostname');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB; 