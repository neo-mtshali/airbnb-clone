const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
  getAllAccommodations,
  getAccommodationById,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
  uploadImages,
  getListingStatistics,
  searchAccommodations
} = require('../controllers/accommodationController');

// Public routes
router.get('/', getAllAccommodations);
router.get('/search', searchAccommodations);
router.get('/statistics', getListingStatistics);
router.get('/:id', getAccommodationById);

// Protected routes (require authentication)
router.post('/', protect, createAccommodation);
router.put('/:id', protect, updateAccommodation);
router.delete('/:id', protect, deleteAccommodation);

// Image upload route
router.post('/:id/upload', protect, upload.array('images', 10), uploadImages);

module.exports = router;