import jwtDecode from 'jwt-decode';

// Set token to localStorage
export const setAuthToken = (token) => {
  localStorage.setItem('adminToken', token);
};

// Get token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

// Remove token from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem('adminToken');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  // For development - always return true to bypass authentication
  return true;
  
  /* Original authentication logic - commented out for now
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    // Check if token is expired
    if (decoded.exp < Date.now() / 1000) {
      removeAuthToken();
      return false;
    }
    return true;
  } catch (error) {
    removeAuthToken();
    return false;
  }
  */
};

// Get user info from token
export const getUserInfo = () => {
  // For development - return mock user data
  return {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  };
  
  /* Original implementation - commented out for now
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
  */
};

// Check if user is admin
export const isAdmin = () => {
  const user = getUserInfo();
  return user && user.role === 'admin';
};
