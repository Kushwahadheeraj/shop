const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'EUser', required: true, index: true },
  items: [
    {
      productId: { type: String },
      name: String,
      price: Number,
      quantity: { type: Number, default: 1 },
      thumbnail: String,
    }
  ],
  totals: {
    subtotal: Number,
    shipping: Number,
    grandTotal: Number,
  },
  address: {
    firstName: String,
    lastName: String,
    country: String,
    street: String,
    city: String,
    state: String,
    pin: String,
    phone: String,
    email: String,
    notes: String,
  },
  status: { type: String, default: 'created' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);


