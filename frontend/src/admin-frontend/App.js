import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

// Pages
import Login from './pages/Login/Login';
import CreateListing from './pages/CreateListing/CreateListing';
import ViewListings from './pages/ViewListings/ViewListings';
import UpdateListing from './pages/UpdateListing/UpdateListing';
import Reservations from './pages/Reservations';

// Components
import Layout from './components/Layout/Layout';

// Utils
import { isAuthenticated } from './utils/auth';

// Create Emotion cache
const emotionCache = createCache({
  key: 'mui-style',
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5A5F', // Airbnb primary color
    },
    secondary: {
      main: '#00A699', // Airbnb secondary color
    },
  },
  typography: {
    fontFamily: '"Circular", "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
});

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/admin/login" />;
    }
    return children;
  };

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="/" element={<Navigate to="view-listings" replace />} />
          <Route path="reservations" element={
            <ProtectedRoute>
              <Layout>
                <Reservations />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="create-listing" element={
            <ProtectedRoute>
              <Layout>
                <CreateListing />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="view-listings" element={
            <ProtectedRoute>
              <Layout>
                <ViewListings />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="update-listing/:id" element={
            <ProtectedRoute>
              <Layout>
                <UpdateListing />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
