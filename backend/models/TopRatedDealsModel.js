const mongoose = require('mongoose');

const TopRatedDealsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subtitle: { type: String },
    link: { type: String },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TopRatedDeals', TopRatedDealsSchema);

