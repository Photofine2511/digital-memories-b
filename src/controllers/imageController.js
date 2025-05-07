const asyncHandler = require('express-async-handler');
const imagekit = require('../config/imagekit');

// @desc    Upload image to ImageKit
// @route   POST /api/upload
// @access  Public
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload an image');
  }

  try {
    // Get file details from multer
    const file = req.file;
    
    // Upload to ImageKit
    const response = await imagekit.upload({
      file: file.buffer.toString('base64'),
      fileName: `${Date.now()}_${file.originalname}`,
      folder: '/digital-memories-now/'
    });

    // Return the URL and file ID
    res.status(201).json({
      id: `img_${Date.now()}`,
      url: response.url,
      fileId: response.fileId,
      isCover: false,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500);
    throw new Error('Image upload failed');
  }
});

// @desc    Get ImageKit auth params for client-side uploads
// @route   GET /api/upload/auth
// @access  Public
const getAuthParams = asyncHandler(async (req, res) => {
  const authenticationParameters = imagekit.getAuthenticationParameters();
  res.json(authenticationParameters);
});

// @desc    Delete image from ImageKit
// @route   DELETE /api/upload/:fileId
// @access  Public
const deleteImage = asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  
  try {
    await imagekit.deleteFile(fileId);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500);
    throw new Error('Failed to delete image');
  }
});

module.exports = {
  uploadImage,
  getAuthParams,
  deleteImage
}; 