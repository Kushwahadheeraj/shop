const ElectricalModels = require('../../models/ElectricalModels');

// GET /api/electrical/categories
// Returns distinct categories that have at least one product
exports.getElectricalCategoriesWithData = async (req, res) => {
  try {
    const categories = await ElectricalModels.distinct('category');
    const filtered = categories.filter((c) => typeof c === 'string' && c.trim().length > 0).sort((a, b) => a.localeCompare(b));
    res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching electrical categories', error: error.message });
  }
};

// POST /api/electrical/first-by-categories
// Body: { categories: string[] }
// Returns the first (earliest createdAt) product for each category
exports.getFirstByCategories = async (req, res) => {
  try {
    let { categories } = req.body;
    if (!categories) categories = [];
    if (typeof categories === 'string') {
      try { categories = JSON.parse(categories); } catch { categories = String(categories).split(',').map((s) => s.trim()).filter(Boolean); }
    }
    if (!Array.isArray(categories)) categories = [];

    const results = await Promise.all(
      categories.map(async (cat) => {
        const doc = await ElectricalModels.findOne({ category: cat }).sort({ createdAt: 1 });
        return doc ? { category: cat, product: doc } : { category: cat, product: null };
      })
    );

    res.status(200).json({ success: true, data: results.filter((r) => r.product) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching first products by categories', error: error.message });
  }
};


