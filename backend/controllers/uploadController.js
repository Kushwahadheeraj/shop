const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Upload image to Cloudinary
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Upload single file (image or PDF) to Cloudinary
exports.uploadImage = async (req, res) => {
  try {
    console.log('Upload request received');
    if (!req.file) {
      console.error('No file provided in request');
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    console.log('File received:', req.file.originalname, 'Size:', req.file.size);
    const fileUrl = await uploadToCloudinary(req.file.buffer);
    console.log('Upload successful:', fileUrl);
    
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      secure_url: fileUrl
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
};
