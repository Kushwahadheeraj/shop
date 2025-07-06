const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const adhesivesRoutes = require('./routes/adhesivesRoutes');
const brushRoutes = require('./routes/brushRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const electricalRoutes = require('./routes/electricalRoutes');
const locksRoutes = require('./routes/locksRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use('/api/seller', require('./routes/sellerRoutes'));
app.use('/api/adhesives-products', adhesivesRoutes);
app.use('/api/brush-products', brushRoutes);
app.use('/api/cleaning-products', require('./routes/cleaningRoutes'));
app.use('/api/analytics', analyticsRoutes);
app.use('/api/electrical-products', electricalRoutes);
app.use('/api/locks-products', locksRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 