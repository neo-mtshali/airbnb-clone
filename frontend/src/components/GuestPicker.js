import React, { useEffect, useRef } from 'react';
import './GuestPicker.css';

function GuestPicker({ isOpen, onClose, guests, onGuestsChange }) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const handleIncrement = (type) => {
    const newGuests = { ...guests };
    newGuests[type] += 1;
    onGuestsChange(newGuests);
  };

  const handleDecrement = (type) => {
    const newGuests = { ...guests };
    if (newGuests[type] > 0) {
      newGuests[type] -= 1;
      onGuestsChange(newGuests);
    }
  };

  const handlePetsToggle = () => {
    onGuestsChange({ ...guests, pets: !guests.pets });
  };

  return (
    <div className="guest-picker" ref={modalRef}>
      <div className="guest-type">
        <div className="guest-info">
          <h3>Adults</h3>
          <p>Ages 13 or above</p>
        </div>
        <div className="guest-controls">
          <button 
            className="control-button"
            onClick={() => handleDecrement('adults')}
            disabled={guests.adults === 0}
          >
            -
          </button>
          <span>{guests.adults}</span>
          <button 
            className="control-button"
            onClick={() => handleIncrement('adults')}
          >
            +
          </button>
        </div>
      </div>

      <div className="guest-type">
        <div className="guest-info">
          <h3>Children</h3>
          <p>Ages 2-12</p>
        </div>
        <div className="guest-controls">
          <button 
            className="control-button"
            onClick={() => handleDecrement('children')}
            disabled={guests.children === 0}
          >
            -
          </button>
          <span>{guests.children}</span>
          <button 
            className="control-button"
            onClick={() => handleIncrement('children')}
          >
            +
          </button>
        </div>
      </div>

      <div className="guest-type">
        <div className="guest-info">
          <h3>Infants</h3>
          <p>Under 2</p>
        </div>
        <div className="guest-controls">
          <button 
            className="control-button"
            onClick={() => handleDecrement('infants')}
            disabled={guests.infants === 0}
          >
            -
          </button>
          <span>{guests.infants}</span>
          <button 
            className="control-button"
            onClick={() => handleIncrement('infants')}
          >
            +
          </button>
        </div>
      </div>

      <div className="guest-type pets">
        <div className="guest-info">
          <h3>Pets</h3>
          <p>Are you bringing a pet?</p>
        </div>
        <div className="guest-controls">
          <label className="switch">
            <input 
              type="checkbox"
              checked={guests.pets}
              onChange={handlePetsToggle}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default GuestPicker;
