import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { getAccommodations, deleteAccommodation } from '../../services/api';
import { toast } from 'react-toastify';

const ViewListings = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accommodationToDelete, setAccommodationToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAccommodations, setFilteredAccommodations] = useState([]);

  useEffect(() => {
    fetchAccommodations();
  }, []);

  useEffect(() => {
    if (accommodations.length > 0) {
      const filtered = accommodations.filter(
        (accommodation) =>
          accommodation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          accommodation.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          accommodation.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAccommodations(filtered);
    }
  }, [searchTerm, accommodations]);

  const fetchAccommodations = async () => {
    setLoading(true);
    try {
      const data = await getAccommodations();
      setAccommodations(data);
      setFilteredAccommodations(data);
    } catch (err) {
      setError('Failed to load listings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
      setFilteredAccommodations(filteredAccommodations.filter(acc => acc._id !== accommodationToDelete._id));
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
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
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Property Listings
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

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            placeholder="Search listings..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <Typography variant="body2" color="text.secondary">
            {filteredAccommodations.length} listings found
          </Typography>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="listings table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAccommodations.length > 0 ? (
                filteredAccommodations
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((accommodation) => (
                    <TableRow key={accommodation._id}>
                      <TableCell component="th" scope="row">
                        {accommodation.title}
                      </TableCell>
                      <TableCell>{accommodation.location}</TableCell>
                      <TableCell>{accommodation.type}</TableCell>
                      <TableCell align="right">${accommodation.price}</TableCell>
                      <TableCell>
                        {accommodation.guests} guests · {accommodation.bedrooms} bedrooms · {accommodation.bathrooms} bathrooms
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={accommodation.isActive ? 'Active' : 'Inactive'}
                          color={accommodation.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          component={RouterLink}
                          to={`/update-listing/${accommodation._id}`}
                          color="primary"
                          size="small"
                          title="Edit"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          title="Delete"
                          onClick={() => handleDeleteClick(accommodation)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          color="info"
                          size="small"
                          title="View Details"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {searchTerm ? 'No listings match your search' : 'No listings found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAccommodations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

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
    </Box>
  );
};

export default ViewListings;
