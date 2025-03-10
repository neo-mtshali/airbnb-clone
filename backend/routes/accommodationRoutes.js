const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllAccommodations,
  getAccommodationById,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation
} = require('../controllers/accommodationController');

// Public routes
router.get('/', getAllAccommodations);
router.get('/:id', getAccommodationById);

// Protected routes (require authentication)
router.post('/', protect, createAccommodation);
router.put('/:id', protect, updateAccommodation);
router.delete('/:id', protect, deleteAccommodation);

module.exports = router;