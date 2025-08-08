const fs = require('fs');
const path = require('path');

// Template for updating Electrical controllers
const controllerTemplate = (controllerName, categoryName) => `const ElectricalModels = require('../../models/ElectricalModels');
const cloudinary = require('../../config/cloudinary');
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

exports.create${controllerName} = async (req, res) => {
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

exports.getAll${controllerName} = async (req, res) => {
  try {
    const products = await ElectricalModels.find({ category: '${categoryName.toLowerCase()}' });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne${controllerName} = async (req, res) => {
  try {
    const product = await ElectricalModels.findOne({ _id: req.params.id, category: '${categoryName.toLowerCase()}' });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update${controllerName} = async (req, res) => {
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

exports.delete${controllerName} = async (req, res) => {
  try {
    const product = await ElectricalModels.findOneAndDelete({ _id: req.params.id, category: '${categoryName.toLowerCase()}' });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
`;

// List of controllers to update
const controllers = [
  { name: 'CeilingRoses', category: 'CeilingRoses' },
  { name: 'WiresAndCables', category: 'WiresAndCables' },
  { name: 'WaterHeater', category: 'WaterHeater' },
  { name: 'UniSwitch', category: 'UniSwitch' },
  { name: 'TVOutlets', category: 'TVOutlets' },
  { name: 'TravelAdaptor', category: 'TravelAdaptor' },
  { name: 'SwitchPlates', category: 'SwitchPlates' },
  { name: 'Switches', category: 'Switches' },
  { name: 'SwitchAndSocket', category: 'SwitchAndSocket' },
  { name: 'Sockets', category: 'Sockets' },
  { name: 'RotarySwitch', category: 'RotarySwitch' },
  { name: 'Regulators', category: 'Regulators' },
  { name: 'PVCClips', category: 'PVCClips' },
  { name: 'PowerStrips', category: 'PowerStrips' },
  { name: 'Plug', category: 'Plug' },
  { name: 'PinTop', category: 'PinTop' },
  { name: 'Others', category: 'Others' },
  { name: 'MotorStarters', category: 'MotorStarters' },
  { name: 'Motors', category: 'Motors' },
  { name: 'ModularSurfaceBox', category: 'ModularSurfaceBox' },
  { name: 'MCB', category: 'MCB' },
  { name: 'MainSwitch', category: 'MainSwitch' },
  { name: 'Lights', category: 'Lights' },
  { name: 'KITKATFuses', category: 'KITKATFuses' },
  { name: 'Jacks', category: 'Jacks' },
  { name: 'Isolators', category: 'Isolators' },
  { name: 'InsulationTapes', category: 'InsulationTapes' },
  { name: 'Indicator', category: 'Indicator' },
  { name: 'Holders', category: 'Holders' },
  { name: 'FuseCarriers', category: 'FuseCarriers' },
  { name: 'FlexibleWires', category: 'FlexibleWires' },
  { name: 'FlexibleConduit', category: 'FlexibleConduit' },
  { name: 'Fan', category: 'Fan' },
  { name: 'ElectricalFittings', category: 'ElectricalFittings' },
  { name: 'ELCBsRCCBs', category: 'ELCBsRCCBs' },
  { name: 'EarthingAccessories', category: 'EarthingAccessories' },
  { name: 'DPswitch', category: 'DPswitch' },
  { name: 'DoorBells', category: 'DoorBells' },
  { name: 'DistributionBoards', category: 'DistributionBoards' },
  { name: 'Dimmer', category: 'Dimmer' }
];

// Update each controller
controllers.forEach(({ name, category }) => {
  const filePath = path.join(__dirname, '..', 'backend', 'controllers', 'electrical', `${name.toLowerCase()}Controller.js`);
  
  if (fs.existsSync(filePath)) {
    const content = controllerTemplate(name, category);
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log('All Electrical controllers updated successfully!');
