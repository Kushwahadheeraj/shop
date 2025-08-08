const fs = require('fs');
const path = require('path');

// Template for updating Electrical subfolder controllers
const subfolderControllerTemplate = (controllerName, categoryName) => `const ElectricalModels = require('../../../models/ElectricalModels');
const cloudinary = require('../../../config/cloudinary');
const streamifier = require('streamifier');
const shouldLog = process.env.APP_DEBUG === 'true';

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

function coerceAmps(maybeAmps) {
  if (!maybeAmps) return [];
  if (typeof maybeAmps === 'string') {
    try {
      const parsed = JSON.parse(maybeAmps);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  if (Array.isArray(maybeAmps)) {
    const jsonCandidate = maybeAmps.find(v => typeof v === 'string' && v.trim().startsWith('['));
    if (jsonCandidate) {
      try {
        const parsed = JSON.parse(jsonCandidate);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // fallthrough to validation of object entries
      }
    }
    return maybeAmps;
  }
  return [];
}

function sanitizeAmps(amps) {
  if (!Array.isArray(amps)) return [];
  return amps.filter(amp =>
    amp && typeof amp === 'object' && amp.amps && amp.amps.trim() !== '' &&
    amp.price !== undefined && !isNaN(Number(amp.price))
  );
}

// Create
exports.create = async (req, res) => {
  try {
    if (shouldLog) {
      console.log('[${controllerName}] Create request');
      console.log('[${controllerName}] Body:', req.body);
      console.log('[${controllerName}] Files:', req.files);
    }

    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }

    if (shouldLog) console.log('[${controllerName}] Uploading images to Cloudinary...');
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    if (shouldLog) console.log('[${controllerName}] Uploaded URLs:', photoUrls);

    // Parse amps and tag if sent as JSON string or array entries
    let { amps, tag, ...rest } = req.body;
    if (shouldLog) {
      console.log('[${controllerName}] Raw amps:', amps);
      console.log('[${controllerName}] Raw tag:', tag);
    }

    // Coerce and sanitize amps
    const coercedAmps = coerceAmps(amps);
    const finalAmps = sanitizeAmps(coercedAmps);

    // Ensure tag is an array
    if (typeof tag === 'string') {
      try {
        tag = JSON.parse(tag);
      } catch {
        tag = [tag];
      }
    }
    if (!Array.isArray(tag)) {
      tag = tag ? [tag] : [];
    }

    // Filter out empty tags
    tag = tag.filter(t => t && t.trim() !== '');

    const productData = {
      ...rest,
      amps: finalAmps,
      tag,
      photos: photoUrls,
      category: rest.category || '${categoryName}'
    };

    if (shouldLog) console.log('[${controllerName}] Creating with data:', productData);
    const product = new ElectricalModels(productData);
    await product.save();
    if (shouldLog) console.log('[${controllerName}] Created:', product._id);

    res.status(201).json(product);
  } catch (err) {
    console.error('Error in create${controllerName}:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get All
exports.getAll = async (req, res) => {
  try {
    const products = await ElectricalModels.find({ category: '${categoryName.toLowerCase()}' });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get One
exports.getOne = async (req, res) => {
  try {
    const product = await ElectricalModels.findOne({ _id: req.params.id, category: '${categoryName.toLowerCase()}' });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.update = async (req, res) => {
  try {
    if (shouldLog) {
      console.log('[${controllerName}] Update id:', req.params.id);
      console.log('[${controllerName}] Body:', req.body);
      console.log('[${controllerName}] Files:', req.files);
    }

    let update = { ...req.body };

    if (update.amps) {
      update.amps = sanitizeAmps(coerceAmps(update.amps));
    }

    if (update.tag && typeof update.tag === 'string') {
      try {
        update.tag = JSON.parse(update.tag);
      } catch {
        update.tag = [update.tag];
      }
    }
    if (update.tag && !Array.isArray(update.tag)) {
      update.tag = [update.tag];
    }
    if (update.tag) {
      update.tag = update.tag.filter(t => t && t.trim() !== '');
    }

    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }

    const product = await ElectricalModels.findOneAndUpdate(
      { _id: req.params.id, category: '${categoryName.toLowerCase()}' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });

    res.json(product);
  } catch (err) {
    console.error('Error in update${controllerName}:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete
exports.delete = async (req, res) => {
  try {
    const product = await ElectricalModels.findOneAndDelete({ _id: req.params.id, category: '${categoryName.toLowerCase()}' });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
`;

// List of subfolder controllers to update
const subfolderControllers = [
  // Fans
  { name: 'CeilingFans', category: 'CeilingFans', folder: 'Fans' },
  { name: 'Pedestalfans', category: 'Pedestalfans', folder: 'Fans' },
  { name: 'TableFans', category: 'TableFans', folder: 'Fans' },
  { name: 'VentilationExhaustfans', category: 'VentilationExhaustfans', folder: 'Fans' },
  { name: 'WallMountingfans', category: 'WallMountingfans', folder: 'Fans' },
  { name: 'CabinFans', category: 'CabinFans', folder: 'Fans' },
  
  // Lights
  { name: 'WallLight', category: 'WallLight', folder: 'Lights' },
  { name: 'TBulb', category: 'TBulb', folder: 'Lights' },
  { name: 'UnderWaterLights', category: 'UnderWaterLights', folder: 'Lights' },
  { name: 'FocusLight', category: 'FocusLight', folder: 'Lights' },
  { name: 'Reflections', category: 'Reflections', folder: 'Lights' },
  { name: 'StandardIncandescent', category: 'StandardIncandescent', folder: 'Lights' },
  { name: 'TubeLight', category: 'TubeLight', folder: 'Lights' },
  { name: 'LightElectronics', category: 'LightElectronics', folder: 'Lights' },
  { name: 'MirrorLight', category: 'MirrorLight', folder: 'Lights' },
  { name: 'LEDStrips', category: 'LEDStrips', folder: 'Lights' },
  { name: 'LedSurfaceLight', category: 'LedSurfaceLight', folder: 'Lights' },
  { name: 'LEDStreetLight', category: 'LEDStreetLight', folder: 'Lights' },
  { name: 'LEDPanelLight', category: 'LEDPanelLight', folder: 'Lights' },
  { name: 'LEDSpotlight', category: 'LEDSpotlight', folder: 'Lights' },
  { name: 'LEDLuminaires', category: 'LEDLuminaires', folder: 'Lights' },
  { name: 'DeskLight', category: 'DeskLight', folder: 'Lights' },
  { name: 'GardenLight', category: 'GardenLight', folder: 'Lights' },
  { name: 'GateLight', category: 'GateLight', folder: 'Lights' },
  { name: 'LedDownLightersSpotLight', category: 'LedDownLightersSpotLight', folder: 'Lights' },
  { name: 'GLS', category: 'GLS', folder: 'Lights' },
  { name: 'LEDBatten', category: 'LEDBatten', folder: 'Lights' },
  { name: 'LEDBulbs', category: 'LEDBulbs', folder: 'Lights' },
  { name: 'Home', category: 'Home', folder: 'Lights' },
  { name: 'Lamps', category: 'Lamps', folder: 'Lights' },
  { name: 'CFL', category: 'CFL', folder: 'Lights' },
  { name: 'Ceilinglight', category: 'Ceilinglight', folder: 'Lights' },
  
  // ElectricalFittings
  { name: 'Accessories', category: 'Accessories', folder: 'ElectricalFittings' },
  { name: 'CircularDeepBox', category: 'CircularDeepBox', folder: 'ElectricalFittings' },
  { name: 'CircularSurfaceBox', category: 'CircularSurfaceBox', folder: 'ElectricalFittings' },
  { name: 'RigidType', category: 'RigidType', folder: 'ElectricalFittings' }
];

// Update each subfolder controller
subfolderControllers.forEach(({ name, category, folder }) => {
  const filePath = path.join(__dirname, '..', 'backend', 'controllers', 'electrical', folder, `${name}Controller.js`);
  
  if (fs.existsSync(filePath)) {
    const content = subfolderControllerTemplate(name, category);
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log('All Electrical subfolder controllers updated successfully!');
