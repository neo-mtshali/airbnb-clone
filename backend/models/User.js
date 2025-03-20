const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic user information
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  
  // Host information (derived from CSV)
  host_id: {
    type: String,
    unique: true,
    sparse: true  // Allow null/undefined values to not trigger uniqueness constraints
  },
  isHost: {
    type: Boolean,
    default: false
  },
  isSuperhost: {
    type: Boolean,
    default: false
  },
  host_location: {
    type: String
  },
  host_since: {
    type: Date
  },
  host_thumbnail_url: {
    type: String
  },
  host_picture_url: {
    type: String
  },
  
  // System fields
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
