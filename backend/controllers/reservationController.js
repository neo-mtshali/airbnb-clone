const Reservation = require('../models/Reservation');
const Accommodation = require('../models/Accommodation');

// Create a new reservation
exports.createReservation = async (req, res) => {
  try {
    const { accommodation, checkIn, checkOut, guests, totalPrice } = req.body;

    // Verify accommodation exists
    const accommodationExists = await Accommodation.findById(accommodation);
    if (!accommodationExists) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    // Check if dates are valid
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Check if accommodation is available for these dates
    const conflictingReservation = await Reservation.findOne({
      accommodation,
      status: { $ne: 'cancelled' },
      $or: [
        { checkIn: { $lte: checkOutDate }, checkOut: { $gte: checkInDate } }
      ]
    });

    if (conflictingReservation) {
      return res.status(400).json({ message: 'Accommodation is not available for these dates' });
    }

    // Create reservation
    const newReservation = new Reservation({
      accommodation,
      guest: req.user._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      status: 'pending'
    });

    const savedReservation = await newReservation.save();

    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(400).json({ message: 'Error creating reservation', error: error.message });
  }
};

// Get all reservations for a user (as guest)
exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ guest: req.user._id })
      .populate('accommodation')
      .sort({ createdAt: -1 });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations', error: error.message });
  }
};

// Get all reservations for a host
exports.getHostReservations = async (req, res) => {
  try {
    // Find all accommodations owned by this host
    const accommodations = await Accommodation.find({ host: req.user._id });
    const accommodationIds = accommodations.map(acc => acc._id);

    // Find all reservations for these accommodations
    const reservations = await Reservation.find({ 
      accommodation: { $in: accommodationIds } 
    })
      .populate('accommodation')
      .populate('guest', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching host reservations', error: error.message });
  }
};

// Get a single reservation by ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('accommodation')
      .populate('guest', 'name email');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if user is authorized to view this reservation
    const isGuest = reservation.guest._id.toString() === req.user._id.toString();
    const accommodation = await Accommodation.findById(reservation.accommodation._id);
    const isHost = accommodation && accommodation.host.toString() === req.user._id.toString();

    if (!isGuest && !isHost) {
      return res.status(403).json({ message: 'Not authorized to view this reservation' });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservation', error: error.message });
  }
};

// Update reservation status (confirm or cancel)
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check authorization
    const accommodation = await Accommodation.findById(reservation.accommodation);
    const isHost = accommodation && accommodation.host.toString() === req.user._id.toString();
    const isGuest = reservation.guest.toString() === req.user._id.toString();

    // Only host can confirm, both host and guest can cancel
    if ((status === 'confirmed' && !isHost) || (!isHost && !isGuest)) {
      return res.status(403).json({ message: 'Not authorized to update this reservation' });
    }

    reservation.status = status;
    const updatedReservation = await reservation.save();

    res.status(200).json(updatedReservation);
  } catch (error) {
    res.status(400).json({ message: 'Error updating reservation', error: error.message });
  }
};

// Delete a reservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if user is authorized to delete this reservation
    const isGuest = reservation.guest.toString() === req.user._id.toString();
    
    if (!isGuest) {
      return res.status(403).json({ message: 'Not authorized to delete this reservation' });
    }

    // Only allow deletion if status is pending
    if (reservation.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot delete a confirmed or cancelled reservation' });
    }

    await Reservation.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reservation', error: error.message });
  }
};