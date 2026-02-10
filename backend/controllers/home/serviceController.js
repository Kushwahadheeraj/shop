const ServiceModel = require('../../models/ServiceModel');

// Create a new service
exports.createService = async (req, res) => {
  try {
     // Debug log
     // Debug log
    
    // Validate required fields
    if (!req.body.icon || !req.body.title || !req.body.description) {
            return res.status(400).json({
        success: false,
        message: 'Missing required fields: icon, title, and description are required'
      });
    }

    const serviceData = {
      icon: req.body.icon,
      title: req.body.title,
      description: req.body.description
    };

     // Debug log

    const service = new ServiceModel(serviceData);
    const savedService = await service.save();
    
     // Debug log
    
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: savedService
    });
  } catch (error) {
     // Debug log
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message
    });
  }
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await ServiceModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
     // Debug log
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
};

// Get one service by ID
exports.getOneService = async (req, res) => {
  try {
    const service = await ServiceModel.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
     // Debug log
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message
    });
  }
};

// Update service by ID
exports.updateService = async (req, res) => {
  try {
    const service = await ServiceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
     // Debug log
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message
    });
  }
};

// Delete service by ID
exports.deleteService = async (req, res) => {
  try {
    const service = await ServiceModel.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
     // Debug log
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message
    });
  }
}; 