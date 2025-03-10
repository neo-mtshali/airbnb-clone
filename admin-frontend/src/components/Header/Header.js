import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Link,
  Divider
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import LogoutIcon from '@mui/icons-material/Logout';
import { getUserInfo, removeAuthToken, isAuthenticated } from '../../utils/auth';
import { toast } from 'react-toastify';

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      setAuthenticated(isAuth);
      if (isAuth) {
        setUser(getUserInfo());
      }
    };
    
    checkAuth();
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    removeAuthToken();
    setUser(null);
    setAuthenticated(false);
    toast.success('Logged out successfully');
    navigate('/login');
    handleClose();
  };

  const handleBecomeHost = () => {
    // Logic for becoming a host
    toast.info('Become a host functionality');
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <img 
            src="/airbnb-logo.png" 
            alt="Airbnb Logo" 
            style={{ height: '32px', marginRight: '10px' }}
          />
          Admin Dashboard
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {authenticated ? (
            <>
              <Button
                component={RouterLink}
                to="/"
                color="inherit"
                startIcon={<DashboardIcon />}
              >
                Dashboard
              </Button>
              <Button
                component={RouterLink}
                to="/create-listing"
                color="inherit"
                startIcon={<AddIcon />}
              >
                Create Listing
              </Button>
              <Button
                component={RouterLink}
                to="/view-listings"
                color="inherit"
                startIcon={<ListIcon />}
              >
                View Listings
              </Button>
            </>
          ) : (
            <Button
              color="primary"
              variant="outlined"
              onClick={handleBecomeHost}
            >
              Become a host
            </Button>
          )}
        </Box>

        {/* User Menu */}
        {authenticated ? (
          <Box sx={{ ml: 2 }}>
            <Typography variant="body2" sx={{ mr: 1, display: 'inline' }}>
              Hello, {user?.username || 'Admin'}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                <AccountCircleIcon />
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem component={RouterLink} to="/view-listings" onClick={handleClose}>
                My Listings
              </MenuItem>
              <MenuItem onClick={handleClose}>Reservations</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button
            component={RouterLink}
            to="/login"
            color="primary"
            variant="contained"
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
