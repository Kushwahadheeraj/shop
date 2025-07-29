const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  icon: { 
    type: String, 
    required: true,
    enum: ['ShieldCheck', 'Headphones', 'Truck', 'CreditCard', 'Phone', 'Mail', 'Clock', 'Star', 'Heart', 'CheckCircle']
  },
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true,
    trim: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Service', ServiceSchema); 