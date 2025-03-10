import React from 'react';
import './GuestSearchModal.css';
import { FaMinus, FaPlus } from 'react-icons/fa';

const GuestSearchModal = ({ isOpen, onClose, guests, onGuestsChange }) => {
  const incrementGuest = (type) => {
    onGuestsChange({
      ...guests,
      [type]: guests[type] + 1
    });
  };

  const decrementGuest = (type) => {
    if (guests[type] > 0) {
      onGuestsChange({
        ...guests,
        [type]: guests[type] - 1
      });
    }
  };

  const togglePets = () => {
    onGuestsChange({
      ...guests,
      pets: !guests.pets
    });
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    // Only close if clicking the overlay itself, not its children
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="guest-modal">
        <div className="guest-options">
          <div className="guest-option">
            <div className="guest-info">
              <h3>Adults</h3>
              <p>Ages 13 or above</p>
            </div>
            <div className="guest-controls">
              <button 
                onClick={() => decrementGuest('adults')}
                className={`control-btn ${guests.adults <= 0 ? 'disabled' : ''}`}
                aria-label="Decrease adults"
              >
                <FaMinus />
              </button>
              <span>{guests.adults || 0}</span>
              <button 
                onClick={() => incrementGuest('adults')}
                className="control-btn"
                aria-label="Increase adults"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          <div className="guest-option">
            <div className="guest-info">
              <h3>Children</h3>
              <p>Ages 2–12</p>
            </div>
            <div className="guest-controls">
              <button 
                onClick={() => decrementGuest('children')}
                className={`control-btn ${guests.children <= 0 ? 'disabled' : ''}`}
                aria-label="Decrease children"
              >
                <FaMinus />
              </button>
              <span>{guests.children || 0}</span>
              <button 
                onClick={() => incrementGuest('children')}
                className="control-btn"
                aria-label="Increase children"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          <div className="guest-option">
            <div className="guest-info">
              <h3>Infants</h3>
              <p>Under 2</p>
            </div>
            <div className="guest-controls">
              <button 
                onClick={() => decrementGuest('infants')}
                className={`control-btn ${guests.infants <= 0 ? 'disabled' : ''}`}
                aria-label="Decrease infants"
              >
                <FaMinus />
              </button>
              <span>{guests.infants || 0}</span>
              <button 
                onClick={() => incrementGuest('infants')}
                className="control-btn"
                aria-label="Increase infants"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          <div className="guest-option">
            <div className="guest-info">
              <h3>Pets</h3>
              <p>Are you bringing a pet?</p>
            </div>
            <div className="guest-controls">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={guests.pets || false}
                  onChange={togglePets}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GuestSearchModal;
