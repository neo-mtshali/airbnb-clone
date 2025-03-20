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
  Container,
  Pagination
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { getAccommodations, deleteAccommodation } from '../../services/api';
import { toast } from 'react-toastify';
import { useCurrency } from '../../../context/CurrencyContext';

import './ViewListings.css';

const ViewListings = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accommodationToDelete, setAccommodationToDelete] = useState(null);
  const { formatPrice } = useCurrency();
  
  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchAccommodations();
  }, []);

  const fetchAccommodations = async () => {
    setLoading(true);
    try {
      const data = await getAccommodations();
      setAccommodations(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
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

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0); // Scroll to top when changing pages
  };

  // Get current page accommodations
  const getCurrentPageItems = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return accommodations.slice(startIndex, endIndex);
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
        {getCurrentPageItems().map((accommodation) => (
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
                    image={accommodation.picture_url ? accommodation.picture_url : 
                      accommodation.images && accommodation.images.length > 0 
                      ? accommodation.images[0].startsWith('http') 
                        ? accommodation.images[0] 
                        : `http://localhost:5001${accommodation.images[0]}` 
                      : 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={accommodation.name || accommodation.title}
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
                      {accommodation.name || accommodation.title}
                    </Typography>
                    
                    {/* Guest and amenities info */}
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {accommodation.accommodates || accommodation.maxGuests} guests · {accommodation.bedrooms} bedrooms · {accommodation.bathrooms_text || accommodation.bathrooms + ' bath'}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {accommodation.amenities.join(' · ')}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    {/* Rating and price section */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                          {accommodation.review_scores_rating || accommodation.rating || 'New'}
                        </Typography>
                        {(accommodation.review_scores_rating > 0 || accommodation.rating > 0) && (
                          <>
                            <Rating
                              value={1}
                              max={1}
                              readOnly
                              icon={<StarIcon fontSize="inherit" color="warning" />}
                              emptyIcon={<StarBorderIcon fontSize="inherit" />}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                              ({accommodation.number_of_reviews || accommodation.reviews || 0} reviews)
                            </Typography>
                          </>
                        )}
                      </Box>
                      
                      {accommodation.price && (
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {formatPrice(accommodation.price)} <Typography component="span" variant="body2">/night</Typography>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
            size="large"
            siblingCount={1}
            boundaryCount={1}
          />
        </Box>
      )}

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
            Are you sure you want to delete the listing "{accommodationToDelete?.name || accommodationToDelete?.title}"? This action cannot be undone.
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
