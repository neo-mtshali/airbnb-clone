import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  FormControl,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { createAccommodation } from '../../services/api';
import { toast } from 'react-toastify';
import './CreateListing.css';

const CreateListing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    host_location: '',
    property_type: '',
    room_type: '',
    bedrooms: '',
    beds: '',
    bathrooms_text: '',
    accommodates: '',
    price: '',
    amenities: [],
    images: []
  });
  const [newAmenity, setNewAmenity] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // Store the actual file objects to be uploaded later
    setFormData({
      ...formData,
      images: [...formData.images, ...files]
    });
    
    // Clear any validation errors for images when files are added
    if (validationErrors.images && files.length > 0) {
      setValidationErrors({
        ...validationErrors,
        images: ''
      });
    }
  };
  
  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      formData.images.forEach(image => {
        if (image instanceof File && URL.createObjectURL) {
          URL.revokeObjectURL(URL.createObjectURL(image));
        }
      });
    };
  }, [formData.images]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name) errors.name = 'Listing name is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.host_location) errors.host_location = 'Location is required';
    if (!formData.bedrooms) errors.bedrooms = 'Number of bedrooms is required';
    if (!formData.beds) errors.beds = 'Number of beds is required';
    if (!formData.bathrooms_text) errors.bathrooms_text = 'Number of bathrooms is required';
    if (!formData.property_type) errors.property_type = 'Property type is required';
    if (!formData.room_type) errors.room_type = 'Room type is required';
    if (!formData.accommodates) errors.accommodates = 'Number of guests is required';
    if (!formData.price) errors.price = 'Price is required';
    if (formData.images.length === 0) errors.images = 'At least one image is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Convert form data to the format expected by the API
      const accommodationData = {
        ...formData,
        bedrooms: Number(formData.bedrooms),
        beds: Number(formData.beds),
        accommodates: Number(formData.accommodates),
        price: Number(formData.price),
        number_of_reviews: 0,
        review_scores_rating: 0,
        review_scores_accuracy: 0,
        review_scores_cleanliness: 0,
        review_scores_checkin: 0,
        review_scores_communication: 0,
        review_scores_location: 0,
        review_scores_value: 0
      };
      
      // Create a new accommodation without images first
      const newAccommodation = await createAccommodation(accommodationData);
      
      // Now handle the image uploads if there are any
      if (formData.images.length > 0) {
        const formDataImages = new FormData();
        formData.images.forEach(image => {
          formDataImages.append('images', image);
        });
        
        try {
          // Upload images to the newly created accommodation
          const response = await fetch(`http://localhost:5001/api/accommodations/${newAccommodation._id}/upload`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formDataImages
          });
          
          if (!response.ok) {
            throw new Error('Failed to upload images');
          }
          
          const imageResult = await response.json();
          
          // Update the accommodation with the image URLs
          if (imageResult.imageUrls && imageResult.imageUrls.length > 0) {
            const updateData = {
              images: imageResult.imageUrls,
              picture_url: imageResult.imageUrls[0]
            };
            
            await fetch(`http://localhost:5001/api/accommodations/${newAccommodation._id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(updateData)
            });
          }
        } catch (imageErr) {
          console.error('Error uploading images:', imageErr);
          // Continue despite image upload error - we'll still have the listing
          toast.warning('Listing created but failed to upload images properly');
        }
      }
      
      toast.success('Listing created successfully!');
      navigate('/admin/view-listings');
    } catch (err) {
      console.error('Error creating listing:', err);
      setError(err.message || 'Failed to create listing');
      toast.error('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/admin/view-listings');
  };

  return (
    <>

      
      <Container className="create-listing-container">
        {/* Page Title & Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" className="create-listing-title">
            Create Listing
          </Typography>
          
          <Button 
            variant="outlined" 
            component={RouterLink} 
            to="/admin/view-listings"
            className="view-listings-btn"
          >
            View my listings
          </Button>
        </Box>

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

        {/* Property Details Row */}
        <Grid container spacing={2} className="form-section">
          <Grid item xs={4}>
            <Typography className="field-label">Bedrooms</Typography>
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
            <Typography className="field-label">Beds</Typography>
            <TextField
              id="beds"
              name="beds"
              value={formData.beds}
              onChange={handleChange}
              error={!!validationErrors.beds}
              helperText={validationErrors.beds}
              variant="outlined"
              size="small"
              fullWidth
              type="number"
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography className="field-label">Bathrooms</Typography>
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
              placeholder="e.g., 1.5 baths"
            />
          </Grid>
        </Grid>
        
        {/* Property Type and Room Type Row */}
        <Grid container spacing={2} className="form-section">
          <Grid item xs={6}>
            <Typography className="field-label">Property Type</Typography>
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
          <Grid item xs={6}>
            <Typography className="field-label">Room Type</Typography>
            <FormControl fullWidth size="small" error={!!validationErrors.room_type}>
              <Select
                id="room_type"
                name="room_type"
                value={formData.room_type}
                onChange={handleChange}
                displayEmpty
                className="type-dropdown"
                IconComponent={() => <span>&#9660;</span>}
              >
                <MenuItem value=""><em>Select</em></MenuItem>
                <MenuItem value="Entire home/apt">Entire home/apt</MenuItem>
                <MenuItem value="Private room">Private room</MenuItem>
                <MenuItem value="Shared room">Shared room</MenuItem>
                <MenuItem value="Hotel room">Hotel room</MenuItem>
              </Select>
              {validationErrors.room_type && (
                <Typography variant="caption" color="error">
                  {validationErrors.room_type}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>

        {/* Location and Guests Row */}
        <Grid container spacing={2} className="form-section">
          <Grid item xs={6}>
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
              placeholder="e.g., New York, NY"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className="field-label">Accommodates (# of Guests)</Typography>
            <TextField
              fullWidth
              id="accommodates"
              name="accommodates"
              value={formData.accommodates}
              onChange={handleChange}
              error={!!validationErrors.accommodates}
              helperText={validationErrors.accommodates}
              variant="outlined"
              size="small"
              type="number"
              inputProps={{ min: 1 }}
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
            size="small"
            multiline
            rows={4}
          />
        </Box>

        {/* Amenities */}
        <Box className="form-section">
          <Typography className="field-label">Amenities</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                id="amenity"
                value={newAmenity}
                onChange={handleAmenityChange}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              <Button 
                variant="contained" 
                onClick={addAmenity}
                className="add-btn"
              >
                Add
              </Button>
            </Box>
          </Box>
          
          {/* Display added amenities */}
          {formData.amenities.length > 0 && (
            <Box className="amenities-tags" sx={{ mt: 2, display: 'flex', flexWrap: 'wrap' }}>
              {formData.amenities.map((amenity, index) => (
                <Box 
                  key={index} 
                  className="amenity-tag"
                >
                  {amenity}
                  <Button 
                    size="small" 
                    sx={{ minWidth: '24px', ml: 0.5 }}
                    onClick={() => {
                      const updatedAmenities = [...formData.amenities];
                      updatedAmenities.splice(index, 1);
                      setFormData({
                        ...formData,
                        amenities: updatedAmenities
                      });
                    }}
                  >
                    ×
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Images */}
        <Box className="form-section">
          <Typography className="field-label">Images</Typography>
          <Box>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="contained-button-file">
              <Button 
                variant="contained" 
                component="span"
                className="upload-button"
              >
                Upload Image
              </Button>
            </label>
          </Box>
          <Box className="images-area">
            {formData.images.length > 0 && (
              <Grid container spacing={2}>
                {formData.images.map((image, index) => (
                  <Grid item xs={4} key={index}>
                    <Box 
                      sx={{ 
                        position: 'relative',
                        height: '100px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Preview ${index}`} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }} 
                      />
                      <Button 
                        size="small" 
                        sx={{ 
                          position: 'absolute', 
                          top: 0, 
                          right: 0, 
                          minWidth: '24px', 
                          bgcolor: 'rgba(255,255,255,0.7)',
                          color: '#e31c5f',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.9)',
                          }
                        }}
                        onClick={() => {
                          const updatedImages = [...formData.images];
                          updatedImages.splice(index, 1);
                          setFormData({
                            ...formData,
                            images: updatedImages
                          });
                        }}
                      >
                        ×
                      </Button>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
            {validationErrors.images && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {validationErrors.images}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Divider Line */}
        <Box sx={{ width: '100%', height: '1px', backgroundColor: '#e5e5e5', my: 4 }}></Box>
        
        {/* Action Buttons */}
        <Box className="action-buttons">
          <Button
            type="submit"
            variant="contained"
            className="create-button"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create'}
          </Button>
          <Button
            variant="contained"
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
    </>
  );
};

export default CreateListing;
