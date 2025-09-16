const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();
const connectDB = require('./config/db');
const adhesivesRoutes = require('./routes/adhesivesRoutes');
const brushRoutes = require('./routes/brushRoutes');
const cementsRoutes = require('./routes/cementsRoutes');
const cleaningRoutes = require('./routes/cleaningRoutes');
const dryRoutes = require('./routes/dryRoutes');
const electricalRoutes = require('./routes/electricalRoutes');
const fiberRoutes = require('./routes/fiberRoutes');
const fittingRoutes = require('./routes/fittingRoutes');
const hardwareRoutes = require('./routes/hardwareRoutes');
const homeRoutes = require('./routes/homeRoutes');
const homeDecorRoutes = require('./routes/homeDecorRoutes');
const locksRoutes = require('./routes/locksRoutes');
const paintRoutes = require('./routes/paintRoutes');
const pipeRoutes = require('./routes/pipeRoutes');
const pvcMatsRoutes = require('./routes/pvcMatsRoutes');
const rooferRoutes = require('./routes/rooferRoutes');
const sanitaryRoutes = require('./routes/sanitaryRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const toolsRoutes = require('./routes/toolsRoutes');
const uncategorizedRoutes = require('./routes/uncategorizedRoutes');
const waterProofingRoutes = require('./routes/waterProofingRoutes');
const euserRoutes = require('./routes/euserRoutes');
const ordersRoutes = require('./routes/orders');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to DB
connectDB();

// Routes
app.use('/api/seller', sellerRoutes);
app.use('/api/euser', euserRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/adhesives', adhesivesRoutes);
app.use('/api/brush', brushRoutes);
app.use('/api/cements', cementsRoutes);
app.use('/api/cleaning', cleaningRoutes);
app.use('/api/dry', dryRoutes);
app.use('/api/electrical', electricalRoutes);
app.use('/api/fiber', fiberRoutes);
app.use('/api/fitting', fittingRoutes);
app.use('/api/hardware', hardwareRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/homedecor', homeDecorRoutes);
app.use('/api/locks', locksRoutes);
app.use('/api/paint', paintRoutes);
app.use('/api/pipe', pipeRoutes);
app.use('/api/pvcmats', pvcMatsRoutes);
app.use('/api/roofer', rooferRoutes);
app.use('/api/sanitary', sanitaryRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/uncategorized', uncategorizedRoutes);
app.use('/api/waterproofing', waterProofingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 