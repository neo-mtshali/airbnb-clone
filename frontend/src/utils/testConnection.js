import axios from 'axios';

// Test connection to backend
const testBackendConnection = async () => {
  try {
    const response = await axios.get('http://localhost:5001/api/users');
    console.log('Backend connection successful:', response.data);
    return true;
  } catch (error) {
    console.error('Backend connection failed:', error.message);
    return false;
  }
};

export default testBackendConnection;
