const InvoiceBusinessProfile = require('../models/InvoiceBusinessProfile');

// @desc    Get all business profiles for the logged-in user
// @route   GET /api/invoice-business-profiles
// @access  Private
const getProfiles = async (req, res) => {
  try {
    const profiles = await InvoiceBusinessProfile.find({ createdBy: req.sellerId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    console.error('Error fetching business profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create a new business profile
// @route   POST /api/invoice-business-profiles
// @access  Private
const createProfile = async (req, res) => {
  try {
    const { name, address, phone, email, gstin, terms } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a business name'
      });
    }

    const profile = await InvoiceBusinessProfile.create({
      name,
      address,
      phone,
      email,
      gstin,
      terms,
      createdBy: req.sellerId
    });

    res.status(201).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error creating business profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update a business profile
// @route   PUT /api/invoice-business-profiles/:id
// @access  Private
const updateProfile = async (req, res) => {
  try {
    let profile = await InvoiceBusinessProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Business profile not found'
      });
    }

    // Make sure user owns the profile
    if (profile.createdBy.toString() !== req.seller._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    profile = await InvoiceBusinessProfile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error updating business profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete a business profile
// @route   DELETE /api/invoice-business-profiles/:id
// @access  Private
const deleteProfile = async (req, res) => {
  try {
    const profile = await InvoiceBusinessProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Business profile not found'
      });
    }

    // Make sure user owns the profile
    if (profile.createdBy.toString() !== req.sellerId.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this profile'
      });
    }

    await profile.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting business profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  getProfiles,
  createProfile,
  updateProfile,
  deleteProfile
};
