import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { toast } from 'react-toastify';
import './Reservations.css';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      // For now, we'll use mock data that matches the image
      const mockReservations = [
        {
          id: '1',
          bookedBy: 'Johann Coetzee',
          property: 'Property 1',
          checkin: '19/06/2024',
          checkout: '24/06/2024'
        },
        {
          id: '2',
          bookedBy: 'Asif Hassam',
          property: 'Property 2',
          checkin: '19/06/2024',
          checkout: '19/06/2024'
        },
        {
          id: '3',
          bookedBy: 'Kago Kola',
          property: 'Property 1',
          checkin: '25/06/2024',
          checkout: '30/06/2024'
        }
      ];
      
      setReservations(mockReservations);
      // Uncomment this when ready to use real API
      // const data = await getReservations();
      // setReservations(data);
    } catch (err) {
      setError('Failed to load reservations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReservation = async (id) => {
    try {
      // Simulate API call
      // await deleteReservation(id);
      
      // Update local state
      setReservations(reservations.filter(reservation => reservation.id !== id));
      toast.success('Reservation deleted successfully');
    } catch (err) {
      toast.error('Failed to delete reservation');
      console.error(err);
    }
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
          onClick={fetchReservations}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Container maxWidth="xl" className="reservations-container">
        {/* Navigation Buttons */}
        <Box className="nav-pills">
          <Button variant="outlined" className="nav-pill active" component={RouterLink} to="/admin/reservations">View Reservations</Button>
          <Button variant="outlined" className="nav-pill" component={RouterLink} to="/admin/view-listings">View Listings</Button>
          <Button variant="outlined" className="nav-pill" component={RouterLink} to="/admin/create-listing">Create Listing</Button>
        </Box>

        {/* Reservations Title */}
        <Typography variant="h4" component="h1" className="page-title">
          My Reservations
        </Typography>

        {/* Reservations Table */}
        <TableContainer component={Paper} className="reservations-table-container">
          <Table sx={{ minWidth: 650 }} aria-label="reservations table">
            <TableHead>
              <TableRow>
                <TableCell>Booked by</TableCell>
                <TableCell>Property</TableCell>
                <TableCell>Checkin</TableCell>
                <TableCell>Checkout</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell component="th" scope="row">
                    {reservation.bookedBy}
                  </TableCell>
                  <TableCell>{reservation.property}</TableCell>
                  <TableCell>{reservation.checkin}</TableCell>
                  <TableCell>{reservation.checkout}</TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="error" 
                      onClick={() => handleDeleteReservation(reservation.id)}
                      className="delete-button"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default Reservations;
