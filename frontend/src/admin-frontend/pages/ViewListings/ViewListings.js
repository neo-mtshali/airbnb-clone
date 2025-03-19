import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Grid,
  Rating,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Container
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { getAccommodations, deleteAccommodation } from '../../services/api';
import { toast } from 'react-toastify';

import './ViewListings.css';

const ViewListings = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accommodationToDelete, setAccommodationToDelete] = useState(null);

  useEffect(() => {
    fetchAccommodations();
  }, []);

  const fetchAccommodations = async () => {
    setLoading(true);
    try {
      // For now, we'll use mock data that matches the image
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
          price: null, // No price shown in image for this property
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
      
      setAccommodations(mockData);
      // Uncomment this when ready to use real API
      // const data = await getAccommodations();
      // setAccommodations(data);
    } catch (err) {
      setError('Failed to load listings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (accommodation) => {
    setAccommodationToDelete(accommodation);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!accommodationToDelete) return;
    
    try {
      await deleteAccommodation(accommodationToDelete._id);
      setAccommodations(accommodations.filter(acc => acc._id !== accommodationToDelete._id));
      toast.success('Listing deleted successfully');
    } catch (err) {
      toast.error('Failed to delete listing');
      console.error(err);
    } finally {
      setDeleteDialogOpen(false);
      setAccommodationToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAccommodationToDelete(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={fetchAccommodations}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Container maxWidth="xl" className="view-listings-container">
        {/* Navigation Buttons */}
        <Box className="nav-pills">
          <Button variant="outlined" className="nav-pill" component={RouterLink} to="/admin/reservations">View Reservations</Button>
          <Button variant="outlined" className="nav-pill active" component={RouterLink} to="/admin/view-listings">View Listings</Button>
          <Button variant="outlined" className="nav-pill" component={RouterLink} to="/admin/create-listing">Create Listing</Button>
        </Box>
      
      {/* Property Listings Grid */}
      <Grid container spacing={5}>
        {accommodations.map((accommodation) => (
          <Grid item xs={12} key={accommodation._id} sx={{ mb: 2, borderBottom: '1px solid #eaeaea', pb: 5 }}>
            <Box sx={{ boxShadow: 'none', border: 'none', background: 'transparent' }}>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, height: 'auto' }}>
                <Box sx={{ 
                  width: { xs: '100%', sm: '40%' }, 
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <CardMedia
                    component="img"
                    className="listing-image"
                    image={accommodation.images[0]}
                    alt={accommodation.title}
                    sx={{ height: { xs: '200px', sm: '220px' }, borderRadius: '10px' }}
                  />
                  
                  {/* Vertical buttons under the image */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 3,
                    p: 2
                  }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      component={RouterLink}
                      to={`/admin/update-listing/${accommodation._id}`}
                      className="update-button"
                      sx={{ borderRadius: '4px', height: '48px', textTransform: 'none', fontSize: '16px' }}
                    >
                      Update
                    </Button>
                    <Button 
                      variant="contained" 
                      color="error" 
                      fullWidth
                      onClick={() => handleDeleteClick(accommodation)}
                      className="delete-button"
                      sx={{ borderRadius: '4px', height: '48px', textTransform: 'none', fontSize: '16px' }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
                
                <Box sx={{ width: { xs: '100%', sm: '60%' }, display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: '1 0 auto', padding: '16px' }}>
                    {/* Description above title */}
                    <Typography variant="body2" color="text.secondary">
                      {accommodation.description}
                    </Typography>
                    
                    {/* Hotel name as title */}
                    <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                      {accommodation.title}
                    </Typography>
                    
                    {/* Guest and amenities info */}
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {accommodation.capacity} · {accommodation.type} · {accommodation.beds} beds · {accommodation.baths} bath
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {accommodation.amenities.join(' · ')}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    {/* Rating and price section */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                          {accommodation.rating}
                        </Typography>
                        <Rating
                          value={1}
                          max={1}
                          readOnly
                          icon={<StarIcon fontSize="inherit" color="warning" />}
                          emptyIcon={<StarBorderIcon fontSize="inherit" />}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                          ({accommodation.reviews} reviews)
                        </Typography>
                      </Box>
                      
                      {accommodation.price && (
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          ${accommodation.price} <Typography component="span" variant="body2">/night</Typography>
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the listing "{accommodationToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    </Box>
  );
};

export default ViewListings;
