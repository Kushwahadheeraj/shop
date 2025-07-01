const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const adhesivesProductRoutes = require('./routes/adhesivesProductRoutes');
const brushProductRoutes = require('./routes/brushProductRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use('/api/seller', require('./routes/sellerRoutes'));
app.use('/api/adhesives-products', adhesivesProductRoutes);
app.use('/api/brush-products', brushProductRoutes);
app.use('/api/cleaning-products', require('./routes/cleaningProductRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 