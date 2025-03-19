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
    title: '',
    description: '',
    location: '',
    area: '',
    rooms: '',
    baths: '',
    type: '',
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
    // In a real app, you would upload these files to a server/cloud storage
    // For now, we'll just store the file objects
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
    
    if (!formData.title) errors.title = 'Listing name is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.location) errors.location = 'Location is required';
    if (!formData.rooms) errors.rooms = 'Number of rooms is required';
    if (!formData.baths) errors.baths = 'Number of baths is required';
    if (!formData.type) errors.type = 'Property type is required';
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
        rooms: Number(formData.rooms),
        baths: Number(formData.baths),
        price: Number(formData.price),
      };
      
      // In a real app, you would handle image uploads separately
      // For now, we'll just pretend the images are URLs
      accommodationData.images = formData.images.map((_, index) => 
        `https://example.com/image${index + 1}.jpg`
      );
      
      await createAccommodation(accommodationData);
      toast.success('Listing created successfully!');
      navigate('/admin/view-listings');
    } catch (err) {
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
      {/* Custom Header */}
      <Box className="header">
        <Typography className="logo">airbnb</Typography>
        <Box className="user-menu">
          <Typography>John Doe</Typography>
          <IconButton>
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Box>
      
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
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={!!validationErrors.title}
            helperText={validationErrors.title}
            variant="outlined"
            size="small"
          />
        </Box>

        {/* Rooms, Baths, Type Row */}
        <Grid container spacing={2} className="form-section">
          <Grid item xs={4}>
            <Typography className="field-label">Rooms</Typography>
            <TextField
              id="rooms"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              error={!!validationErrors.rooms}
              helperText={validationErrors.rooms}
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
              id="baths"
              name="baths"
              value={formData.baths}
              onChange={handleChange}
              error={!!validationErrors.baths}
              helperText={validationErrors.baths}
              variant="outlined"
              size="small"
              fullWidth
              type="number"
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography className="field-label">Type</Typography>
            <FormControl fullWidth size="small" error={!!validationErrors.type}>
              <Select
                id="type"
                name="type"
                value={formData.type}
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
              </Select>
              {validationErrors.type && (
                <Typography variant="caption" color="error">
                  {validationErrors.type}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>

        {/* Location Row */}
        <Grid container spacing={2} className="form-section">
          <Grid item xs={6}>
            <Typography className="field-label">Location</Typography>
            <TextField
              fullWidth
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={!!validationErrors.location}
              helperText={validationErrors.location}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className="field-label">Location</Typography>
            <TextField
              fullWidth
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
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
