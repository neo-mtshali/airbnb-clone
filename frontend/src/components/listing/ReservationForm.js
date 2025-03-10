import React, { useState } from 'react';
import { FaStar, FaChevronDown } from 'react-icons/fa';
import Calendar from './Calendar';
import './ReservationForm.css';

const ReservationForm = ({ price, rating, reviews, maxGuests }) => {
  const [dates, setDates] = useState({ checkIn: null, checkOut: null });
  const [guests, setGuests] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);

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

  const total = calculateTotal();

  return (
    <div className="reservation-form">
      <div className="price-header">
        <div className="price">
          <span className="amount">${price}</span>
          <span className="per-night">night</span>
        </div>
        <div className="rating">
          <FaStar />
          <span>{rating}</span>
          <span className="dot">·</span>
          <span className="reviews">{reviews} reviews</span>
        </div>
      </div>

      <div className="booking-inputs">
        <div className="dates-input" onClick={() => setShowCalendar(true)}>
          <div className="check-in">
            <label>CHECK-IN</label>
            <input 
              type="text" 
              readOnly 
              value={dates.checkIn ? dates.checkIn.toLocaleDateString() : ''} 
              placeholder="Add date"
            />
          </div>
          <div className="check-out">
            <label>CHECKOUT</label>
            <input 
              type="text" 
              readOnly 
              value={dates.checkOut ? dates.checkOut.toLocaleDateString() : ''} 
              placeholder="Add date"
            />
          </div>
        </div>

        <div className="guests-input">
          <label>GUESTS</label>
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
          <Calendar 
            dates={dates}
            setDates={setDates}
            onClose={() => setShowCalendar(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ReservationForm;
