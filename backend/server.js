const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

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
const uploadRoutes = require('./routes/uploadRoutes');
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
const productRoutes = require('./routes/productRoutes');
const simpleProductRoutes = require('./routes/simpleProductRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const couponRoutes = require('./routes/couponRoutes');
const categoryCountRoutes = require('./routes/categoryCountRoutes');
const billRoutes = require('./routes/billRoutes');
const simpleBillRoutes = require('./routes/simpleBillRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const invoiceBusinessRoutes = require('./routes/invoiceBusinessRoutes');
const shopRoutes = require('./routes/shopRoutes');
const gstBillsRoutes = require('./routes/gstBillsRoutes');
const bankAccountsRoutes = require('./routes/bankAccountsRoutes');
const gstShopsRoutes = require('./routes/gstShopsRoutes');
const clientsRoutes = require('./routes/clientsRoutes');
const balanceEntryRoutes = require('./routes/balanceEntryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const productsRoutes = require('./routes/productsRoutes');
const shopManagementRoutes = require('./routes/shopManagementRoutes');
const galleryRoutes = require('./routes/GalleryRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to DB
connectDB();

// Stream files from GridFS with correct headers
const gridfsBucket = () => new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
app.get('/files/:id', async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const filesCursor = gridfsBucket().find({ _id: id });
    const files = await filesCursor.toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }
    const meta = files[0];
    const contentType = meta.contentType || 'application/octet-stream';
    res.set('Content-Type', contentType);
    res.set('Content-Disposition', `inline; filename="${meta.filename || 'file'}"`);
    const dl = gridfsBucket().openDownloadStream(id);
    dl.on('error', () => res.status(404).end());
    dl.pipe(res);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid file id' });
  }
});

// Routes
app.use('/api/seller', sellerRoutes);
app.use('/api/euser', euserRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productRoutes);
app.use('/api/simple-products', simpleProductRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/category-count', categoryCountRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/simple-bills', simpleBillRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/invoice-business-profiles', invoiceBusinessRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/gst-shops', gstShopsRoutes);
app.use('/api/gst-bills', gstBillsRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/balance-entries', balanceEntryRoutes);
app.use('/api/bill-files', require('./routes/billFilesRoutes'));
app.use('/api/bank-accounts', bankAccountsRoutes);
app.use('/api/dashboard', dashboardRoutes);
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
app.use('/api/products', productsRoutes);
app.use('/api/shop-management', shopManagementRoutes);
app.use('/api/gallery',galleryRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
