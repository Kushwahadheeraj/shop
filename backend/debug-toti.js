require('dotenv').config();
const connectDB = require('./config/db');
const Sanitary = require('./models/SanitaryModels');

async function run() {
  try {
    console.log('Connecting to DB...');
    await connectDB();
    console.log('DB Connected.');

    console.log('Checking PlasticToti...');
    try {
      const plastic = await Sanitary.find({ category: 'PlasticToti' });
      console.log('PlasticToti count:', plastic.length);
    } catch (e) {
      console.error('PlasticToti Query Failed:', e);
    }

    console.log('Checking PTMTToti...');
    try {
      const ptmt = await Sanitary.find({ category: 'PTMTToti' });
      console.log('PTMTToti count:', ptmt.length);
    } catch (e) {
      console.error('PTMTToti Query Failed:', e);
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Script Failed:', err);
    process.exit(1);
  }
}

run();
