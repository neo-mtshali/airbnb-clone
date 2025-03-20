import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  InputAdornment,
  CircularProgress,
  Alert,
  FormControlLabel,
  Switch,
  IconButton,
  Container
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAccommodation, updateAccommodation } from '../../services/api';
import { toast } from 'react-toastify';
import { useCurrency } from '../../../context/CurrencyContext';
import './UpdateListing.css';

// Amenities options
const amenitiesOptions = [
  'WiFi',
  'Kitchen',
  'Free parking',
  'TV',
  'Air conditioning',
  'Heating',
  'Washer',
  'Dryer',
  'Pool',
  'Hot tub',
  'Gym',
  'Breakfast',
  'Indoor fireplace',
  'Smoking allowed',
  'Pets allowed',
  'Wheelchair accessible'
];

const UpdateListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { currency } = useCurrency();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    host_location: '',
    price: '',
    bedrooms: '',
    beds: '',
    bathrooms_text: '',
    accommodates: '',
    property_type: '',
    room_type: '',
    amenities: [],
    images: [],
    number_of_reviews: 0,
    review_scores_rating: 0,
    isActive: true
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [originalImages, setOriginalImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newAmenity, setNewAmenity] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        // Use mock data matching the ViewListings component until the API is ready
        const mockData = [
          {
            _id: '1',
            title: 'Sandton City Hotel',
            description: '3 Room Bedroom',
            location: 'Sandton',
            capacity: '4-6 guests',
            bedrooms: 3,
            beds: 5,
            baths: 3,
            type: 'Entire Home',
            amenities: ['Wifi', 'Kitchen', 'Free Parking'],
            price: 325,
            rating: 5.0,
            reviews: 318,
            images: ['https://a0.muscache.com/im/pictures/miso/Hosting-47181423/original/39c9d4e7-78d0-4807-9f0d-3029d987d02a.jpeg']
          },
          {
            _id: '2',
            title: 'Woodmead City Hotel',
            description: 'Entire home in Bordeaux',
            location: 'Bordeaux',
            capacity: '4-6 guests',
            bedrooms: 3,
            beds: 5,
            baths: 3,
            type: 'Entire Home',
            amenities: ['Wifi', 'Kitchen', 'Free Parking'],
            price: null,
            rating: 5.0,
            reviews: 318,
            images: ['https://a0.muscache.com/im/pictures/miso/Hosting-22916467/original/dc5fe83e-37d5-4c3e-8d69-a2e46b938be2.jpeg']
          },
          {
            _id: '3',
            title: 'Historic City Center Home',
            description: 'Entire home in Bordeaux',
            location: 'Bordeaux',
            capacity: '4-6 guests',
            bedrooms: 3,
            beds: 5,
            baths: 3,
            type: 'Entire Home',
            amenities: ['Wifi', 'Kitchen', 'Free Parking'],
            price: 125,
            rating: 5.0,
            reviews: 318,
            images: ['https://a0.muscache.com/im/pictures/miso/Hosting-52800305/original/3ae97076-6969-4191-a71a-1343c5576ac0.jpeg']
          }
        ];
        
        // Find the listing with the matching ID
        const listing = mockData.find(item => item._id === id) || mockData[0];
        
        // Format the data for the form
        setFormData({
          name: listing.title || '', // Using title field from mock data for name
          description: listing.description || '',
          host_location: listing.location || '', // Using location field from mock data for host_location
          price: listing.price || '',
          bedrooms: listing.bedrooms || '',
          beds: listing.beds || '',
          bathrooms_text: listing.baths ? `${listing.baths} baths` : '', // Convert numeric baths to text format
          accommodates: listing.capacity ? listing.capacity.split('-')[1].split(' ')[0] : '', // Extract max guests from capacity
          property_type: listing.type || '',
          room_type: listing.type === 'Entire Home' ? 'Entire home/apt' : 'Private room', // Convert type to room_type
          amenities: listing.amenities || [],
          number_of_reviews: listing.reviews || 0,
          review_scores_rating: listing.rating ? listing.rating * 20 : 0, // Convert 5-star rating to 100-point scale
          isActive: true
        });
        
        // Store original images
        setOriginalImages(listing.images || []);
      } catch (err) {
        setError('Failed to load listing details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'isActive' ? checked : value
    });

    // Clear validation error when field is updated
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const handleAmenityChange = (e) => {
    setNewAmenity(e.target.value);
  };

  const addAmenity = () => {
    if (newAmenity.trim() !== '') {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()]
      });
      setNewAmenity('');
    }
  };

  const handleAmenitiesChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData({
      ...formData,
      amenities: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  const removeOriginalImage = (index) => {
    const newOriginalImages = [...originalImages];
    newOriginalImages.splice(index, 1);
    setOriginalImages(newOriginalImages);
  };

  const removeNewImage = (index) => {
    const updatedNewImages = [...newImages];
    updatedNewImages.splice(index, 1);
    setNewImages(updatedNewImages);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name) errors.name = 'Listing name is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.host_location) errors.host_location = 'Location is required';
    
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      errors.price = 'Price must be a positive number';
    }
    
    if (!formData.bedrooms) {
      errors.bedrooms = 'Number of bedrooms is required';
    } else if (isNaN(formData.bedrooms) || Number(formData.bedrooms) <= 0) {
      errors.bedrooms = 'Bedrooms must be a positive number';
    }
    
    if (!formData.beds) {
      errors.beds = 'Number of beds is required';
    } else if (isNaN(formData.beds) || Number(formData.beds) <= 0) {
      errors.beds = 'Beds must be a positive number';
    }
    
    if (!formData.bathrooms_text) {
      errors.bathrooms_text = 'Bathrooms information is required';
    }
    
    if (!formData.accommodates) {
      errors.accommodates = 'Number of guests is required';
    } else if (isNaN(formData.accommodates) || Number(formData.accommodates) <= 0) {
      errors.accommodates = 'Accommodates must be a positive number';
    }
    
    if (!formData.property_type) errors.property_type = 'Property type is required';
    if (!formData.room_type) errors.room_type = 'Room type is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      // Convert form data to the format expected by the API
      const accommodationData = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        beds: Number(formData.beds),
        accommodates: Number(formData.accommodates),
        number_of_reviews: Number(formData.number_of_reviews || 0),
        review_scores_rating: Number(formData.review_scores_rating || 0),
        review_scores_accuracy: Number(formData.review_scores_accuracy || 0),
        review_scores_cleanliness: Number(formData.review_scores_cleanliness || 0),
        review_scores_checkin: Number(formData.review_scores_checkin || 0),
        review_scores_communication: Number(formData.review_scores_communication || 0),
        review_scores_location: Number(formData.review_scores_location || 0),
        review_scores_value: Number(formData.review_scores_value || 0)
      };
      
      accommodationData.images = [
        ...originalImages,
        ...newImages.map((_, index) => `https://example.com/new-image${index + 1}.jpg`)
      ];
      
      await updateAccommodation(id, accommodationData);
      toast.success('Listing updated successfully!');
      navigate('/admin/view-listings');
    } catch (err) {
      setError(err.message || 'Failed to update listing');
      toast.error('Failed to update listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Container className="update-listing-container">
        {/* Page Title & Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Button 
            variant="outlined" 
            component={RouterLink} 
            to="/admin/view-listings"
            className="view-listings-btn"
          >
            View my listings
          </Button>
        </Box>

        <Typography className="update-listing-title">
          Update Listing
        </Typography>
        
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Listing Name */}
          <Box className="form-section">
            <Typography className="field-label">Listing Name</Typography>
            <TextField
              fullWidth
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!validationErrors.name}
              helperText={validationErrors.name}
              variant="outlined"
              size="small"
            />
          </Box>

          {/* Rooms, Baths, Type Row */}
          <Grid container spacing={2} className="form-section">
            <Grid item xs={4}>
              <Typography className="field-label">Rooms</Typography>
              <TextField
                id="bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                error={!!validationErrors.bedrooms}
                helperText={validationErrors.bedrooms}
                variant="outlined"
                size="small"
                fullWidth
                type="number"
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography className="field-label">Baths</Typography>
              <TextField
                id="bathrooms_text"
                name="bathrooms_text"
                value={formData.bathrooms_text}
                onChange={handleChange}
                error={!!validationErrors.bathrooms_text}
                helperText={validationErrors.bathrooms_text}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <Typography className="field-label">Type</Typography>
              <FormControl fullWidth size="small" error={!!validationErrors.property_type}>
                <Select
                  id="property_type"
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleChange}
                  displayEmpty
                  className="type-dropdown"
                  IconComponent={() => <span>&#9660;</span>}
                >
                  <MenuItem value=""><em>Select</em></MenuItem>
                  <MenuItem value="House">House</MenuItem>
                  <MenuItem value="Apartment">Apartment</MenuItem>
                  <MenuItem value="Condo">Condo</MenuItem>
                  <MenuItem value="Villa">Villa</MenuItem>
                  <MenuItem value="Hotel">Hotel</MenuItem>
                  <MenuItem value="Guesthouse">Guesthouse</MenuItem>
                  <MenuItem value="Loft">Loft</MenuItem>
                </Select>
                {validationErrors.property_type && (
                  <Typography variant="caption" color="error">
                    {validationErrors.property_type}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
          
          {/* Location */}
          <Grid container spacing={2} className="form-section">
            <Grid item xs={12}>
              <Typography className="field-label">Location</Typography>
              <TextField
                fullWidth
                id="host_location"
                name="host_location"
                value={formData.host_location}
                onChange={handleChange}
                error={!!validationErrors.host_location}
                helperText={validationErrors.host_location}
                variant="outlined"
                size="small"
              />
            </Grid>
          </Grid>

          {/* Description */}
          <Box className="form-section">
            <Typography className="field-label">Description</Typography>
            <TextField
              fullWidth
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!validationErrors.description}
              helperText={validationErrors.description}
              variant="outlined"
              multiline
              rows={4}
            />
          </Box>

          {/* Amenities */}
          <Box className="form-section">
            <Typography className="field-label">Amenities</Typography>
            <div className="amenities-container">
              <TextField
                id="newAmenity"
                value={newAmenity}
                onChange={handleAmenityChange}
                variant="outlined"
                size="small"
                fullWidth
                placeholder="Add amenity"
              />
              <Button 
                onClick={addAmenity} 
                variant="contained" 
                className="add-amenity-btn"
              >
                Add
              </Button>
            </div>
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.amenities.map((amenity, index) => (
                <Chip
                  key={index}
                  label={amenity}
                  onDelete={() => {
                    const newAmenities = [...formData.amenities];
                    newAmenities.splice(index, 1);
                    setFormData({ ...formData, amenities: newAmenities });
                  }}
                />
              ))}
            </Box>
          </Box>
            
          {/* Price */}
          <Box className="form-section">
            <Typography className="field-label">Price</Typography>
            <TextField
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              error={!!validationErrors.price}
              helperText={validationErrors.price}
              variant="outlined"
              size="small"
              fullWidth
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                id="weeklyDiscount"
                name="weeklyDiscount"
                label="Weekly Discount (%)"
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                value={formData.weeklyDiscount}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                id="cleaningFee"
                name="cleaningFee"
                label="Cleaning Fee"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={formData.cleaningFee}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                id="serviceFee"
                name="serviceFee"
                label="Service Fee"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={formData.serviceFee}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                id="occupancyTaxes"
                name="occupancyTaxes"
                label="Occupancy Taxes"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={formData.occupancyTaxes}
                onChange={handleChange}
              />
            </Grid>
            
            {/* Images */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Images
              </Typography>
            </Grid>
            
          {/* Images Section */}
          <Box className="form-section">
            <Typography className="field-label">Images</Typography>
            
            <Box className="images-container">
              {/* Current Images */}
              {originalImages.length > 0 && originalImages.map((image, index) => (
                <Box
                  key={`original-${index}`}
                  className="image-box"
                >
                  <img
                    src={image}
                    alt={`Listing ${index}`}
                    className="listing-image"
                  />
                  <Button
                    className="delete-btn"
                    onClick={() => removeOriginalImage(index)}
                  >
                    ×
                  </Button>
                </Box>
              ))}
              
              {/* New Images */}
              {newImages.map((image, index) => (
                <Box
                  key={`new-${index}`}
                  className="image-box"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`New ${index}`}
                    className="listing-image"
                  />
                  <Button
                    className="delete-btn"
                    onClick={() => removeNewImage(index)}
                  >
                    ×
                  </Button>
                </Box>
              ))}
              
              {/* Upload Button */}
              <Box className="upload-box">
                <Button
                  component="label"
                  className="upload-btn"
                >
                  <AddIcon />
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
              </Box>
            </Box>
          </Box>
          
          {/* Submit Button */}
          <Box className="buttons-container">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
              className="update-btn"
            >
              {submitting ? <CircularProgress size={24} /> : 'Update Listing'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/view-listings')}
              className="cancel-btn"
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default UpdateListing;
