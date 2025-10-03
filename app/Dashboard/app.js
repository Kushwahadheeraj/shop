// Configuration file for the application
// This file contains environment variables and configuration settings

const config = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://kushwahahardware02:@Dkushwaha123@cluster0.cbzehqw.mongodb.net/',
  JWT_SECRET: process.env.JWT_SECRET || 'ghfghftyf68otjbiltg77bgiyg',
  PORT: process.env.PORT || 5000
};

export default config;