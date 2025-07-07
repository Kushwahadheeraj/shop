const express = require('express');
const cors = require('cors');
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
const lightingRoutes = require('./routes/lightingRoutes');
const locksRoutes = require('./routes/locksRoutes');
// const paintRoutes = require('./routes/paintRoutes');
// const pipeRoutes = require('./routes/pipeRoutes');
// const pvcMatsRoutes = require('./routes/pvcMatsRoutes');
// const rooferRoutes = require('./routes/rooferRoutes');
// const sanitaryRoutes = require('./routes/sanitaryRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
// const toolsRoutes = require('./routes/toolsRoutes');
const uncategorizedRoutes = require('./routes/uncategorizedRoutes');
// const waterProofingRoutes = require('./routes/waterProofingRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use('/api/seller', sellerRoutes);
app.use('/api/adhesives-products', adhesivesRoutes);
app.use('/api/brush-products', brushRoutes);
app.use('/api/cements-products', cementsRoutes);
app.use('/api/cleaning-products', cleaningRoutes);
app.use('/api/dry-products', dryRoutes);
app.use('/api/electrical-products', electricalRoutes);
app.use('/api/fiber-products', fiberRoutes);
app.use('/api/fitting-products', fittingRoutes);
app.use('/api/hardware-products', hardwareRoutes);
app.use('/api/home-products', homeRoutes);
app.use('/api/home-decor-products', homeDecorRoutes);
app.use('/api/lighting-products', lightingRoutes);
app.use('/api/locks-products', locksRoutes);
// app.use('/api/paint-products', paintRoutes);
// app.use('/api/pipe-products', pipeRoutes);
// app.use('/api/pvc-mats-products', pvcMatsRoutes);
// app.use('/api/roofer-products', rooferRoutes);
// app.use('/api/sanitary-products', sanitaryRoutes);
// app.use('/api/tools-products', toolsRoutes);
app.use('/api/uncategorized-products', uncategorizedRoutes);
// app.use('/api/water-proofing-products', waterProofingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 