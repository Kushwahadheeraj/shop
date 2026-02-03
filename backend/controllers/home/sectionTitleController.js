const HomeSectionTitle = require('../../models/HomeSectionTitle');

exports.getAllTitles = async (req, res) => {
  try {
    const titles = await HomeSectionTitle.find({});
    res.status(200).json({
      success: true,
      data: titles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching all titles',
      error: error.message
    });
  }
};

exports.getTitle = async (req, res) => {
  try {
    const { sectionId } = req.params;
    let titleDoc = await HomeSectionTitle.findOne({ sectionId });
    
    if (!titleDoc) {
      return res.status(200).json({
        success: true,
        data: { title: null } // Let frontend decide default
      });
    }

    res.status(200).json({
      success: true,
      data: titleDoc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching title',
      error: error.message
    });
  }
};

exports.updateTitle = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const titleDoc = await HomeSectionTitle.findOneAndUpdate(
      { sectionId },
      { title },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Title updated successfully',
      data: titleDoc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating title',
      error: error.message
    });
  }
};
