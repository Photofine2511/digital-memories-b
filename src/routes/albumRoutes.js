const express = require('express');
const { 
  getAlbums, 
  getAlbumById, 
  verifyAlbumPassword,
  createAlbum, 
  updateAlbum, 
  deleteAlbum 
} = require('../controllers/albumController');

const router = express.Router();

router.route('/')
  .get(getAlbums)
  .post(createAlbum);

router.route('/:id')
  .get(getAlbumById)
  .put(updateAlbum)
  .delete(deleteAlbum);

router.route('/:id/verify')
  .post(verifyAlbumPassword);

module.exports = router; 