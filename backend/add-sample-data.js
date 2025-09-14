const mongoose = require('mongoose');
const AdhesivesModels = require('./models/AdhesivesModels');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleProducts = [
  {
    name: "Apacra Glass Marking White Pencil Pack of 2",
    minPrice: 15.00,
    maxPrice: 20.00,
    discount: 25,
    category: "Adhesives",
    totalProduct: 10,
    photos: ["https://via.placeholder.com/300x300?text=Apacra+Pencil"],
    tag: ["pencil", "glass", "marking"]
  },
  {
    name: "Araldite Karpenter Synthetic Resin Adhesive Wood Glue",
    minPrice: 700.00,
    maxPrice: 1250.00,
    discount: 43,
    category: "Adhesives",
    totalProduct: 5,
    photos: ["https://via.placeholder.com/300x300?text=Araldite+Karpenter"],
    tag: ["wood", "glue", "adhesive"]
  },
  {
    name: "Araldite Kesar 4 Plus 1.8kg",
    minPrice: 1105.00,
    maxPrice: 1250.00,
    discount: 13,
    category: "Adhesives",
    totalProduct: 8,
    photos: ["https://via.placeholder.com/300x300?text=Araldite+Kesar"],
    tag: ["epoxy", "adhesive", "strong"]
  },
  {
    name: "Araldite Mechanic Epoxy Adhesive 5g",
    minPrice: 30.00,
    maxPrice: 40.00,
    discount: 25,
    category: "Adhesives",
    totalProduct: 15,
    photos: ["https://via.placeholder.com/300x300?text=Araldite+Mechanic"],
    tag: ["epoxy", "mechanic", "small"]
  },
  {
    name: "Asian Paints acrYCRIL Fabseal 60gm",
    minPrice: 110.00,
    maxPrice: 120.00,
    discount: 4,
    category: "Adhesives",
    totalProduct: 0,
    photos: ["https://via.placeholder.com/300x300?text=Asian+Paints"],
    tag: ["paint", "seal", "fabric"]
  },
  {
    name: "Astral Adhesive Amrow",
    minPrice: 100.00,
    maxPrice: 120.00,
    discount: 0,
    category: "Adhesives",
    totalProduct: 12,
    photos: ["https://via.placeholder.com/300x300?text=Astral+Amrow"],
    tag: ["pvc", "adhesive", "pipe"]
  },
  {
    name: "Astral Adhesive Bearing Retainer 944",
    minPrice: 190.00,
    maxPrice: 200.00,
    discount: 0,
    category: "Adhesives",
    totalProduct: 0,
    photos: ["https://via.placeholder.com/300x300?text=Astral+Retainer"],
    tag: ["bearing", "retainer", "metal"]
  },
  {
    name: "Astral Adhesive Bearing Retainer TL 944",
    minPrice: 170.00,
    maxPrice: 200.00,
    discount: 0,
    category: "Adhesives",
    totalProduct: 0,
    photos: ["https://via.placeholder.com/300x300?text=Astral+TL"],
    tag: ["bearing", "retainer", "tl"]
  }
];

async function addSampleData() {
  try {
    console.log('Adding sample adhesives data...');
    await AdhesivesModels.insertMany(sampleProducts);
    console.log('Sample data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample data:', error);
    process.exit(1);
  }
}

addSampleData();
