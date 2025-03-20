const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  // Core listing information
  id: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  picture_url: {
    type: String
  },
  images: [{
    type: String
  }],
  
  // Host information
  host_id: {
    type: String
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  host_name: {
    type: String
  },
  host_location: {
    type: String
  },
  host_since: {
    type: Date
  },
  host_is_superhost: {
    type: Boolean,
    default: false
  },
  host_thumbnail_url: {
    type: String
  },
  host_picture_url: {
    type: String
  },
  
  // Property details
  property_type: {
    type: String
  },
  room_type: {
    type: String
  },
  accommodates: {
    type: Number,
    required: true
  },
  bathrooms_text: {
    type: String
  },
  bedrooms: {
    type: Number,
    required: true
  },
  beds: {
    type: Number,
    required: true
  },
  amenities: [{
    type: String
  }],
  
  // Location and pricing
  price: {
    type: Number,
    required: true
  },
  
  // Reviews
  number_of_reviews: {
    type: Number,
    default: 0
  },
  review_scores_rating: {
    type: Number,
    default: 0
  },
  review_scores_accuracy: {
    type: Number,
    default: 0
  },
  review_scores_cleanliness: {
    type: Number,
    default: 0
  },
  review_scores_checkin: {
    type: Number,
    default: 0
  },
  review_scores_communication: {
    type: Number,
    default: 0
  },
  review_scores_location: {
    type: Number,
    default: 0
  },
  review_scores_value: {
    type: Number,
    default: 0
  },
  
  // System fields
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for faster searching
accommodationSchema.index({ name: 'text', description: 'text', host_location: 'text', property_type: 'text', room_type: 'text' });
accommodationSchema.index({ accommodates: 1 });
accommodationSchema.index({ price: 1 });
accommodationSchema.index({ bedrooms: 1 });
accommodationSchema.index({ host_location: 1 });

module.exports = mongoose.model('Accommodation', accommodationSchema);
