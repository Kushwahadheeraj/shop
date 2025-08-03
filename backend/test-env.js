require('dotenv').config();

console.log('Environment Variables Test:');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not Set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not Set');
console.log('NODE_ENV:', process.env.NODE_ENV);

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is missing!');
} else {
  console.log('✅ All environment variables are set');
} 