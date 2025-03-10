import { toast } from 'react-toastify';

// Default toast configuration
const defaultConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

/**
 * Show success notification
 * @param {string} message - Message to display
 * @param {object} options - Toast configuration options
 */
export const showSuccess = (message, options = {}) => {
  toast.success(message, { ...defaultConfig, ...options });
};

/**
 * Show error notification
 * @param {string} message - Message to display
 * @param {object} options - Toast configuration options
 */
export const showError = (message, options = {}) => {
  toast.error(message, { ...defaultConfig, ...options });
};

/**
 * Show info notification
 * @param {string} message - Message to display
 * @param {object} options - Toast configuration options
 */
export const showInfo = (message, options = {}) => {
  toast.info(message, { ...defaultConfig, ...options });
};

/**
 * Show warning notification
 * @param {string} message - Message to display
 * @param {object} options - Toast configuration options
 */
export const showWarning = (message, options = {}) => {
  toast.warning(message, { ...defaultConfig, ...options });
};

/**
 * Handle API error and show appropriate notification
 * @param {Error} error - Error object from API call
 * @param {string} fallbackMessage - Fallback message if error doesn't have a response
 */
export const handleApiError = (error, fallbackMessage = 'An error occurred. Please try again.') => {
  console.error('API Error:', error);
  
  // Extract error message from response if available
  const errorMessage = error.response?.data?.message || 
                       error.response?.data?.error || 
                       error.message || 
                       fallbackMessage;
  
  showError(errorMessage);
  
  return errorMessage;
};

export default {
  showSuccess,
  showError,
  showInfo,
  showWarning,
  handleApiError
};
