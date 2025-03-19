import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { login } from '../../services/api';
import { setAuthToken, isAuthenticated } from '../../utils/auth';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated()) {
      navigate('/view-listings');
    }
  }, [navigate]);

  const validate = () => {
    return formData.email && formData.password;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    setError('');
    
    // Temporary admin login bypass for testing
    // This allows using admin@example.com/admin123 to login directly
    if (formData.email === 'admin@example.com' && formData.password === 'admin123') {
      // Create a mock token and set it
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MTYxNjI4MDAsImV4cCI6MTY0NzcwMDgwMH0';
      setAuthToken(mockToken);
      toast.success('Admin login successful!');
      navigate('/view-listings');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Attempting login with:', { email: formData.email });
      const data = await login(formData.email, formData.password);
      console.log('Login response:', data);
      setAuthToken(data.token);
      toast.success('Login successful!');
      navigate('/view-listings');
    } catch (err) {
      console.error('Login error:', err);
      // Display more detailed error information
      if (err.message) {
        setError(`Error: ${err.message}`);
      } else if (err.status) {
        setError(`Server error (${err.status}): Please check if the backend server is running.`);
      } else {
        setError('Service error: Unable to connect to the authentication service. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src="/images/airbnb-logo.png" alt="Airbnb Logo" className="airbnb-logo" />
      </div>
      
      <h1 className="login-title">Login</h1>
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="forgot-password">
          <Link to="/forgot-password">Forgot Password ?</Link>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          type="submit" 
          className="login-button" 
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
