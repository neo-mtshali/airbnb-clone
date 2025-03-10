import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Switch
} from '@mui/material';
import { getAccommodation, updateAccommodation } from '../../services/api';
import { toast } from 'react-toastify';

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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    guests: '',
    type: '',
    amenities: [],
    images: [],
    weeklyDiscount: '',
    cleaningFee: '',
    serviceFee: '',
    occupancyTaxes: '',
    isActive: true
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [originalImages, setOriginalImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const data = await getAccommodation(id);
        
        // Format the data for the form
        setFormData({
          title: data.title || '',
          description: data.description || '',
          location: data.location || '',
          price: data.price || '',
          bedrooms: data.bedrooms || '',
          bathrooms: data.bathrooms || '',
          guests: data.guests || '',
          type: data.type || '',
          amenities: data.amenities || [],
          weeklyDiscount: data.weeklyDiscount || '',
          cleaningFee: data.cleaningFee || '',
          serviceFee: data.serviceFee || '',
          occupancyTaxes: data.occupancyTaxes || '',
          isActive: data.isActive !== undefined ? data.isActive : true
        });
        
        // Store original images
        setOriginalImages(data.images || []);
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
    
    if (!formData.title) errors.title = 'Title is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.location) errors.location = 'Location is required';
    
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
    
    if (!formData.bathrooms) {
      errors.bathrooms = 'Number of bathrooms is required';
    } else if (isNaN(formData.bathrooms) || Number(formData.bathrooms) <= 0) {
      errors.bathrooms = 'Bathrooms must be a positive number';
    }
    
    if (!formData.guests) {
      errors.guests = 'Number of guests is required';
    } else if (isNaN(formData.guests) || Number(formData.guests) <= 0) {
      errors.guests = 'Guests must be a positive number';
    }
    
    if (!formData.type) errors.type = 'Property type is required';
    
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
        bathrooms: Number(formData.bathrooms),
        guests: Number(formData.guests),
        weeklyDiscount: formData.weeklyDiscount ? Number(formData.weeklyDiscount) : undefined,
        cleaningFee: formData.cleaningFee ? Number(formData.cleaningFee) : undefined,
        serviceFee: formData.serviceFee ? Number(formData.serviceFee) : undefined,
        occupancyTaxes: formData.occupancyTaxes ? Number(formData.occupancyTaxes) : undefined
      };
      
      // In a real app, you would handle image uploads separately
      // For now, we'll just combine original and new images
      accommodationData.images = [
        ...originalImages,
        ...newImages.map((_, index) => `https://example.com/new-image${index + 1}.jpg`)
      ];
      
      await updateAccommodation(id, accommodationData);
      toast.success('Listing updated successfully!');
      navigate('/view-listings');
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
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Update Listing
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={9}>
              <TextField
                required
                fullWidth
                id="title"
                name="title"
                label="Title"
                value={formData.title}
                onChange={handleChange}
                error={!!validationErrors.title}
                helperText={validationErrors.title}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleChange}
                    name="isActive"
                    color="primary"
                  />
                }
                label="Active Listing"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                error={!!validationErrors.description}
                helperText={validationErrors.description}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="location"
                name="location"
                label="Location"
                value={formData.location}
                onChange={handleChange}
                error={!!validationErrors.location}
                helperText={validationErrors.location}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!validationErrors.type}>
                <InputLabel id="type-label">Property Type</InputLabel>
                <Select
                  labelId="type-label"
                  id="type"
                  name="type"
                  value={formData.type}
                  label="Property Type"
                  onChange={handleChange}
                >
                  <MenuItem value="House">House</MenuItem>
                  <MenuItem value="Apartment">Apartment</MenuItem>
                  <MenuItem value="Condo">Condo</MenuItem>
                  <MenuItem value="Villa">Villa</MenuItem>
                  <MenuItem value="Cabin">Cabin</MenuItem>
                  <MenuItem value="Cottage">Cottage</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
                {validationErrors.type && (
                  <Typography variant="caption" color="error">
                    {validationErrors.type}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="price"
                name="price"
                label="Price per Night"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={formData.price}
                onChange={handleChange}
                error={!!validationErrors.price}
                helperText={validationErrors.price}
              />
            </Grid>
            
            {/* Property Details */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Property Details
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                id="bedrooms"
                name="bedrooms"
                label="Bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleChange}
                error={!!validationErrors.bedrooms}
                helperText={validationErrors.bedrooms}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                id="bathrooms"
                name="bathrooms"
                label="Bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleChange}
                error={!!validationErrors.bathrooms}
                helperText={validationErrors.bathrooms}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                id="guests"
                name="guests"
                label="Max Guests"
                type="number"
                value={formData.guests}
                onChange={handleChange}
                error={!!validationErrors.guests}
                helperText={validationErrors.guests}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="amenities-label">Amenities</InputLabel>
                <Select
                  labelId="amenities-label"
                  id="amenities"
                  multiple
                  value={formData.amenities}
                  onChange={handleAmenitiesChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Amenities" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {amenitiesOptions.map((amenity) => (
                    <MenuItem key={amenity} value={amenity}>
                      {amenity}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Additional Fees */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Additional Fees
              </Typography>
            </Grid>
            
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
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Current Images
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {originalImages.length > 0 ? (
                  originalImages.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        width: 100,
                        height: 100,
                        border: '1px solid #ccc',
                        borderRadius: 1,
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        src={image}
                        alt={`Listing ${index}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          minWidth: 'auto',
                          width: 20,
                          height: 20,
                          p: 0
                        }}
                        onClick={() => removeOriginalImage(index)}
                      >
                        ×
                      </Button>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No images available
                  </Typography>
                )}
              </Box>
              
              <Typography variant="subtitle2" gutterBottom>
                Add New Images
              </Typography>
              
              <Button
                variant="outlined"
                component="label"
                sx={{ mb: 2 }}
              >
                Upload Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {newImages.map((image, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      width: 100,
                      height: 100,
                      border: '1px solid #ccc',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New ${index}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Button
                      size="small"
                      color="error"
                      variant="contained"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        minWidth: 'auto',
                        width: 20,
                        height: 20,
                        p: 0
                      }}
                      onClick={() => removeNewImage(index)}
                    >
                      ×
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid>
            
            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                sx={{ mr: 2 }}
              >
                {submitting ? <CircularProgress size={24} /> : 'Update Listing'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/view-listings')}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default UpdateListing;
