const Accommodation = require('../models/Accommodation');

// Get all accommodations
exports.getAllAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find()
      .populate('host', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(accommodations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accommodations', error: error.message });
  }
};

// Get single accommodation by ID
exports.getAccommodationById = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id)
      .populate('host', 'name email');
    
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
    const newAccommodation = new Accommodation({
      ...req.body,
      host: req.user._id // Assuming we have user info from auth middleware
    });

    const savedAccommodation = await newAccommodation.save();
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

    await accommodation.remove();
    res.status(200).json({ message: 'Accommodation deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting accommodation', error: error.message });
  }
};
