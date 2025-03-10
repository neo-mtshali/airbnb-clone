import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HomeIcon from '@mui/icons-material/Home';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import { getAccommodations, getReservations } from '../../services/api';
import { getUserInfo } from '../../utils/auth';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [accommodations, setAccommodations] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get user info
        const userInfo = getUserInfo();
        setUser(userInfo);

        // Fetch accommodations and reservations
        const [accommodationsData, reservationsData] = await Promise.all([
          getAccommodations(),
          getReservations()
        ]);

        setAccommodations(accommodationsData);
        setReservations(reservationsData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2, display: 'block', mx: 'auto' }}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Welcome, {user?.username || 'Admin'}
        </Typography>
        <Button
          component={RouterLink}
          to="/create-listing"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Create New Listing
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'primary.light',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h6">
                Total Listings
              </Typography>
              <HomeIcon />
            </Box>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              {accommodations.length}
            </Typography>
            <Typography variant="body2" sx={{ mt: 'auto' }}>
              as of {new Date().toLocaleDateString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'secondary.light',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h6">
                Reservations
              </Typography>
              <BookOnlineIcon />
            </Box>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              {reservations.length}
            </Typography>
            <Typography variant="body2" sx={{ mt: 'auto' }}>
              as of {new Date().toLocaleDateString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'info.light',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h6">
                Active Listings
              </Typography>
              <HomeIcon />
            </Box>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              {accommodations.filter(acc => acc.isActive).length}
            </Typography>
            <Typography variant="body2" sx={{ mt: 'auto' }}>
              as of {new Date().toLocaleDateString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'success.light',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h6">
                Revenue
              </Typography>
              <BookOnlineIcon />
            </Box>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              ${reservations.reduce((sum, res) => sum + (res.totalPrice || 0), 0).toFixed(2)}
            </Typography>
            <Typography variant="body2" sx={{ mt: 'auto' }}>
              total earnings
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Listings */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Recent Listings
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {accommodations.slice(0, 3).map((accommodation) => (
          <Grid item xs={12} sm={6} md={4} key={accommodation._id}>
            <Card>
              <Box sx={{ height: 140, bgcolor: 'grey.200', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {accommodation.images && accommodation.images.length > 0 ? (
                  <img
                    src={accommodation.images[0]}
                    alt={accommodation.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <HomeIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                )}
              </Box>
              <CardContent>
                <Typography variant="h6" component="div" noWrap>
                  {accommodation.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {accommodation.location}
                </Typography>
                <Typography variant="body2">
                  ${accommodation.price} / night
                </Typography>
              </CardContent>
              <Divider />
              <CardActions>
                <Button
                  size="small"
                  component={RouterLink}
                  to={`/update-listing/${accommodation._id}`}
                >
                  Edit
                </Button>
                <Button size="small" color="primary">
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {accommodations.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" align="center" sx={{ py: 4 }}>
              No listings found. Create your first listing!
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* View All Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button
          component={RouterLink}
          to="/view-listings"
          variant="outlined"
          startIcon={<ListAltIcon />}
        >
          View All Listings
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
