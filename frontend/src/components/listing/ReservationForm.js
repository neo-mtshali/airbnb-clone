import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import './ReservationForm.css';

const ReservationForm = ({ price = 125, rating = 4.92, reviews = 372, maxGuests = 4, dates = {}, setDates = () => {} }) => {
  // Use the dates passed from the parent component
  const [guests, setGuests] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);

  const formatDate = (date) => {
    if (!date) return '';
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Format date for display in the title (Feb 19, 2022 - Feb 26, 2022)
  const formatDateWithYear = (date) => {
    if (!date) return '';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const calculateTotal = () => {
    if (!dates.checkIn || !dates.checkOut) return null;
    
    const nights = Math.ceil(
      (dates.checkOut - dates.checkIn) / (1000 * 60 * 60 * 24)
    );
    
    const subtotal = price * nights;
    const cleaningFee = 85;
    const serviceFee = Math.round(subtotal * 0.15);
    
    return {
      subtotal,
      cleaningFee,
      serviceFee,
      total: subtotal + cleaningFee + serviceFee,
      nights
    };
  };

  const handleCloseCalendar = () => {
    setShowCalendar(false);
  };

  const total = calculateTotal();

  return (
    <div className="reservation-form">
      <div className="price-header">
        <div className="price">
          <span className="amount">${price}</span>
          <span className="per-night">night</span>
        </div>
        <div className="rating">
          <i className="fas fa-star"></i>
          <span>{rating}</span>
          <span className="dot">·</span>
          <span className="reviews">{reviews} reviews</span>
        </div>
      </div>

      <div className="form-title">
        {dates.checkIn && dates.checkOut && (
          <h3>
            {Math.ceil((dates.checkOut - dates.checkIn) / (1000 * 60 * 60 * 24))} nights in New York
          </h3>
        )}
        {dates.checkIn && dates.checkOut && (
          <p className="date-range">{formatDateWithYear(dates.checkIn)} - {formatDateWithYear(dates.checkOut)}</p>
        )}
      </div>

      <div className="booking-inputs">
        <div className="dates-input" onClick={() => setShowCalendar(true)}>
          <div className="check-in">
            <label>CHECK-IN</label>
            <input 
              type="text" 
              readOnly 
              value={dates.checkIn ? formatDate(dates.checkIn) : 'Add date'} 
              placeholder="Add date"
            />
          </div>
          <div className="check-out">
            <label>CHECKOUT</label>
            <input 
              type="text" 
              readOnly 
              value={dates.checkOut ? formatDate(dates.checkOut) : 'Add date'} 
              placeholder="Add date"
            />
          </div>
        </div>

        <div className="guests-input">
          <label>GUESTS</label>
          <div className="select-wrapper">
            <select 
              value={guests} 
              onChange={(e) => setGuests(Number(e.target.value))}
            >
              {[...Array(maxGuests)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} guest{i !== 0 ? 's' : ''}
                </option>
              ))}
            </select>
            <i className="fas fa-chevron-down select-icon"></i>
          </div>
        </div>
      </div>

      <button className="reserve-button">
        Reserve
      </button>
      
      <p className="no-charge-text">You won't be charged yet</p>

      {total && (
        <div className="price-breakdown">
          <div className="price-item">
            <span>${price} × {total.nights} nights</span>
            <span>${total.subtotal}</span>
          </div>
          <div className="price-item">
            <span>Cleaning fee</span>
            <span>${total.cleaningFee}</span>
          </div>
          <div className="price-item">
            <span>Service fee</span>
            <span>${total.serviceFee}</span>
          </div>
          <div className="total">
            <span>Total</span>
            <span>${total.total}</span>
          </div>
        </div>
      )}

      {showCalendar && (
        <div className="calendar-modal">
          <div className="calendar-overlay" onClick={handleCloseCalendar}></div>
          <div className="calendar-container">
            <button className="close-calendar" onClick={handleCloseCalendar}>×</button>
            <Calendar 
              dates={dates}
              setDates={setDates}
              onClose={handleCloseCalendar}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationForm;
