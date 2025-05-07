const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  fileId: {
    type: String,
    required: true
  },
  isCover: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  }
});

const albumSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  photographerName: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    trim: true
  },
  isPasswordProtected: {
    type: Boolean,
    default: false
  },
  coverImage: {
    type: String,
    required: true
  },
  images: [imageSchema],
}, {
  timestamps: true
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album; 