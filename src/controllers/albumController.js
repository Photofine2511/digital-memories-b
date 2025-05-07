const asyncHandler = require('express-async-handler');
const Album = require('../models/albumModel');
const imagekit = require('../config/imagekit');

// @desc    Get all albums
// @route   GET /api/albums
// @access  Public
const getAlbums = asyncHandler(async (req, res) => {
  const albums = await Album.find({}).sort({ createdAt: -1 });
  
  // Don't send passwords in the response
  const albumsWithoutPassword = albums.map(album => {
    const albumObj = album.toObject();
    delete albumObj.password;
    return albumObj;
  });
  
  res.json(albumsWithoutPassword);
});

// @desc    Get album by ID
// @route   GET /api/albums/:id
// @access  Public
const getAlbumById = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (album) {
    // Don't send password in the response
    const albumObj = album.toObject();
    delete albumObj.password;
    
    res.json(albumObj);
  } else {
    res.status(404);
    throw new Error('Album not found');
  }
});

// @desc    Verify album password
// @route   POST /api/albums/:id/verify
// @access  Public
const verifyAlbumPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const album = await Album.findById(req.params.id);

  if (!album) {
    res.status(404);
    throw new Error('Album not found');
  }

  if (!album.isPasswordProtected) {
    res.json({ verified: true });
    return;
  }

  if (!password) {
    res.status(400);
    throw new Error('Password is required');
  }

  const isPasswordCorrect = album.password === password;

  res.json({
    verified: isPasswordCorrect
  });
});

// @desc    Create new album
// @route   POST /api/albums
// @access  Public
const createAlbum = asyncHandler(async (req, res) => {
  const { title, photographerName, password, coverImage, images } = req.body;

  if (!title || !photographerName || !coverImage || !images || images.length === 0) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const isPasswordProtected = !!password;

  const album = await Album.create({
    title,
    photographerName,
    password,
    isPasswordProtected,
    coverImage,
    images
  });

  if (album) {
    // Don't return the password in the response
    const albumObj = album.toObject();
    delete albumObj.password;
    
    res.status(201).json(albumObj);
  } else {
    res.status(400);
    throw new Error('Invalid album data');
  }
});

// @desc    Update album
// @route   PUT /api/albums/:id
// @access  Public
const updateAlbum = asyncHandler(async (req, res) => {
  const { title, photographerName, password, coverImage, images } = req.body;

  const album = await Album.findById(req.params.id);

  if (album) {
    album.title = title || album.title;
    album.photographerName = photographerName || album.photographerName;
    
    // Only update password if provided
    if (password !== undefined) {
      album.password = password;
      album.isPasswordProtected = !!password;
    }
    
    album.coverImage = coverImage || album.coverImage;
    album.images = images || album.images;

    const updatedAlbum = await album.save();
    
    // Don't return the password in the response
    const albumObj = updatedAlbum.toObject();
    delete albumObj.password;
    
    res.json(albumObj);
  } else {
    res.status(404);
    throw new Error('Album not found');
  }
});

// @desc    Delete album
// @route   DELETE /api/albums/:id
// @access  Public
const deleteAlbum = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (album) {
    // Delete all images from ImageKit
    const deletePromises = album.images.map(image => {
      if (image.fileId) {
        return imagekit.deleteFile(image.fileId).catch(err => {
          console.error(`Failed to delete image ${image.fileId}:`, err);
          return null; // Continue with deletion even if image deletion fails
        });
      }
      return Promise.resolve(null);
    });

    await Promise.all(deletePromises);
    await album.deleteOne();
    res.json({ message: 'Album removed' });
  } else {
    res.status(404);
    throw new Error('Album not found');
  }
});

module.exports = {
  getAlbums,
  getAlbumById,
  verifyAlbumPassword,
  createAlbum,
  updateAlbum,
  deleteAlbum
}; 