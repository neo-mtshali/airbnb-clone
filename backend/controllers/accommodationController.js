const Accommodation = require('../models/Accommodation');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Get all accommodations
exports.getAllAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find()
      .populate('host', 'name email isSuperhost host_location host_since host_thumbnail_url host_picture_url')
      .sort({ createdAt: -1 });
    res.status(200).json(accommodations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accommodations', error: error.message });
  }
};

// Optimized search for accommodations
exports.searchAccommodations = async (req, res) => {
  try {
    const { location, guests, checkIn, checkOut, minPrice, maxPrice, beds, bedrooms, amenities, propertyType, roomType } = req.query;
    
    // Build query object
    const query = {};
    
    // Text search for location
    if (location && location.trim() !== '') {
      // Use text index for location search
      query.$or = [
        { $text: { $search: location } },
        { host_location: { $regex: location, $options: 'i' } }
      ];
    }
    
    // Filter by number of guests
    if (guests) {
      query.accommodates = { $gte: parseInt(guests) };
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    
    // Filter by beds
    if (beds) {
      query.beds = { $gte: parseInt(beds) };
    }
    
    // Filter by bedrooms
    if (bedrooms) {
      query.bedrooms = { $gte: parseInt(bedrooms) };
    }
    
    // Filter by property type
    if (propertyType) {
      query.property_type = propertyType;
    }
    
    // Filter by room type
    if (roomType) {
      query.room_type = roomType;
    }
    
    // Filter by amenities (if provided as comma-separated string)
    if (amenities) {
      const amenitiesList = amenities.split(',').map(item => item.trim());
      query.amenities = { $all: amenitiesList };
    }
    
    // Execute query with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Only select necessary fields to improve performance
    const accommodations = await Accommodation.find(query)
      .select('name description picture_url images host_id host host_name host_location host_is_superhost host_thumbnail_url host_picture_url property_type room_type accommodates bathrooms_text bedrooms beds amenities price number_of_reviews review_scores_rating')
      .populate('host', 'name email isSuperhost host_location host_since host_thumbnail_url host_picture_url')
      .sort({ review_scores_rating: -1, number_of_reviews: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance
    
    // Get total count for pagination info
    const total = await Accommodation.countDocuments(query);
    
    res.status(200).json({
      data: accommodations,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error searching accommodations', error: error.message });
  }
};

// Get single accommodation by ID
exports.getAccommodationById = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id)
      .populate('host', 'name email isSuperhost host_location host_since host_thumbnail_url host_picture_url');
    
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    
    res.status(200).json(accommodation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accommodation', error: error.message });
  }
};

// Create new accommodation
exports.createAccommodation = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Create new accommodation with expanded fields
    const newAccommodation = new Accommodation({
      ...req.body,
      host: req.user._id,
      host_id: user.host_id || req.user._id.toString(),
      host_name: user.name,
      host_location: user.host_location,
      host_since: user.host_since,
      host_is_superhost: user.isSuperhost,
      host_thumbnail_url: user.host_thumbnail_url,
      host_picture_url: user.host_picture_url
    });

    const savedAccommodation = await newAccommodation.save();
    
    // Update user to be a host if not already
    if (!user.isHost) {
      user.isHost = true;
      await user.save();
    }
    
    res.status(201).json(savedAccommodation);
  } catch (error) {
    res.status(400).json({ message: 'Error creating accommodation', error: error.message });
  }
};

// Update accommodation
exports.updateAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    // Check if user is the host
    if (accommodation.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this accommodation' });
    }

    // Update user-related fields if the host information changed
    if (req.body.host_name || req.body.host_location || req.body.host_is_superhost) {
      // Update the associated user profile as well
      const user = await User.findById(req.user._id);
      if (req.body.host_name) user.name = req.body.host_name;
      if (req.body.host_location) user.host_location = req.body.host_location;
      if (req.body.host_is_superhost !== undefined) user.isSuperhost = req.body.host_is_superhost;
      await user.save();
    }

    const updatedAccommodation = await Accommodation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedAccommodation);
  } catch (error) {
    res.status(400).json({ message: 'Error updating accommodation', error: error.message });
  }
};

// Delete accommodation
exports.deleteAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    // Check if user is the host
    if (accommodation.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this accommodation' });
    }

    await Accommodation.findByIdAndDelete(req.params.id);
    
    // Check if user has any other accommodations
    const hostAccommodations = await Accommodation.countDocuments({ host: req.user._id });
    
    // If this was the user's last accommodation, update isHost status
    if (hostAccommodations === 0) {
      const user = await User.findById(req.user._id);
      user.isHost = false;
      await user.save();
    }
    
    res.status(200).json({ message: 'Accommodation deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting accommodation', error: error.message });
  }
};

// Upload images for accommodation
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const accommodationId = req.params.id;
    const accommodation = await Accommodation.findById(accommodationId);
    
    if (!accommodation) {
      // Remove uploaded files if accommodation not found
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) console.error('Error removing file:', err);
        });
      });
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    // Check if user is the host
    if (accommodation.host.toString() !== req.user._id.toString()) {
      // Remove uploaded files if not authorized
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) console.error('Error removing file:', err);
        });
      });
      return res.status(403).json({ message: 'Not authorized to update this accommodation' });
    }

    // Get file paths and add them to the accommodation's images array
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    
    // Set the first image as the picture_url if one doesn't exist
    if (!accommodation.picture_url && imagePaths.length > 0) {
      accommodation.picture_url = imagePaths[0];
    }
    
    // Update accommodation with new images
    accommodation.images = [...accommodation.images, ...imagePaths];
    await accommodation.save();
    
    res.status(200).json({ 
      message: 'Images uploaded successfully',
      images: imagePaths,
      accommodation
    });
  } catch (error) {
    res.status(400).json({ message: 'Error uploading images', error: error.message });
  }
};

// Get listing statistics
exports.getListingStatistics = async (req, res) => {
  try {
    // Get count by property type
    const propertyTypes = await Accommodation.aggregate([
      { $group: { _id: '$property_type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get count by room type
    const roomTypes = await Accommodation.aggregate([
      { $group: { _id: '$room_type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get average price
    const priceStats = await Accommodation.aggregate([
      { 
        $group: { 
          _id: null, 
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        } 
      }
    ]);
    
    // Get average rating
    const ratingStats = await Accommodation.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$review_scores_rating' }
        }
      }
    ]);
    
    res.status(200).json({
      propertyTypes,
      roomTypes,
      priceStats: priceStats[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0 },
      ratingStats: ratingStats[0] || { avgRating: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};
