const Pipe = require('../../models/PipeModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

exports.createGardenPipe = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }

    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    let productData = { ...req.body, photos: photoUrls, category: 'GardenPipe' };

    if (req.body.type && typeof req.body.type === 'string') {
      try {
        productData.type = JSON.parse(req.body.type);
      } catch {
        return res.status(400).json({ error: 'Invalid type field format' });
      }
    }

    if (req.body.tags && typeof req.body.tags === 'string') {
      try {
        productData.tags = JSON.parse(req.body.tags);
      } catch {
        productData.tags = [req.body.tags];
      }
    }

    if (req.body.minPrice) {
      productData.minPrice = parseFloat(req.body.minPrice);
      if (isNaN(productData.minPrice)) return res.status(400).json({ error: 'Invalid min price' });
    }
    if (req.body.maxPrice) {
      productData.maxPrice = parseFloat(req.body.maxPrice);
      if (isNaN(productData.maxPrice)) return res.status(400).json({ error: 'Invalid max price' });
    }
    if (productData.maxPrice && productData.minPrice && productData.maxPrice < productData.minPrice) {
      return res.status(400).json({ error: 'Max price must be >= min price' });
    }

    const product = new Pipe(productData);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateGardenPipe = async (req, res) => {
  try {
    let update = { ...req.body };
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) return res.status(400).json({ error: 'No more than 5 images allowed.' });
      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    if (req.body.type && typeof req.body.type === 'string') {
      try {
        update.type = JSON.parse(req.body.type);
      } catch {
        return res.status(400).json({ error: 'Invalid type field format' });
      }
    }
    if (req.body.tags && typeof req.body.tags === 'string') {
      try {
        update.tags = JSON.parse(req.body.tags);
      } catch {
        update.tags = [req.body.tags];
      }
    }
    if (req.body.minPrice) {
      update.minPrice = parseFloat(req.body.minPrice);
      if (isNaN(update.minPrice)) return res.status(400).json({ error: 'Invalid min price' });
    }
    if (req.body.maxPrice) {
      update.maxPrice = parseFloat(req.body.maxPrice);
      if (isNaN(update.maxPrice)) return res.status(400).json({ error: 'Invalid max price' });
    }
    if (update.maxPrice && update.minPrice && update.maxPrice < update.minPrice) {
      return res.status(400).json({ error: 'Max price must be >= min price' });
    }
    const product = await Pipe.findOneAndUpdate(
      { _id: req.params.id, category: 'GardenPipe' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllGardenPipe = async (req, res) => {
  try {
    const items = await Pipe.find({ category: 'GardenPipe' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOneGardenPipe = async (req, res) => {
  try {
    const item = await Pipe.findOne({ _id: req.params.id, category: 'GardenPipe' });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteGardenPipe = async (req, res) => {
  try {
    const item = await Pipe.findOneAndDelete({ _id: req.params.id, category: 'GardenPipe' });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
