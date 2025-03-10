const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createReservation,
  getUserReservations,
  getHostReservations,
  getReservationById,
  updateReservationStatus,
  deleteReservation
} = require('../controllers/reservationController');

// All reservation routes require authentication
router.use(protect);

// Create a new reservation
router.post('/', createReservation);

// Get user's reservations (as guest)
router.get('/user', getUserReservations);

// Get host's reservations
router.get('/host', getHostReservations);

// Get, update, or delete a specific reservation
router.get('/:id', getReservationById);
router.put('/:id/status', updateReservationStatus);
router.delete('/:id', deleteReservation);

module.exports = router;