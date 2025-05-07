const express = require('express');
const multer = require('multer');
const {
  uploadImage,
  getAuthParams,
  deleteImage
} = require('../controllers/imageController');

const router = express.Router();

// Set up multer storage in memory
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

router.post('/', upload.single('image'), uploadImage);
router.get('/auth', getAuthParams);
router.delete('/:fileId', deleteImage);

module.exports = router; 