import React, { useState } from 'react';
import './LocationSearchModal.css';

const LocationSearchModal = ({ isOpen, onClose, location, onLocationChange }) => {
  const [searchValue, setSearchValue] = useState(location || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLocationChange(searchValue);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="location-modal">
        <div className="modal-header">
          <button className="close-btn" onClick={onClose}>&times;</button>
          <h2>Where to?</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="search-input-container">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search destinations"
              autoFocus
            />
          </div>
          <div className="suggested-locations">
            <h3>Popular destinations</h3>
            <div className="location-grid">
              {['Paris', 'London', 'New York', 'Tokyo', 'Barcelona', 'Rome'].map((city) => (
                <button
                  key={city}
                  type="button"
                  className="location-suggestion"
                  onClick={() => {
                    setSearchValue(city);
                    onLocationChange(city);
                    onClose();
                  }}
                >
                  <div className="location-icon">🌍</div>
                  <div className="location-name">{city}</div>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationSearchModal;
