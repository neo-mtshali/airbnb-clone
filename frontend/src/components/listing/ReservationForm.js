import React, { useState, useEffect } from 'react';
import DatePicker from '../../components/DatePicker';
import GuestSearchModal from '../../components/GuestSearchModal';
import './ReservationForm.css';
import { useCurrency } from '../../context/CurrencyContext';

const ReservationForm = ({ price = 125, rating = 4.92, reviews = 372, maxGuests = 4, dates = {}, setDates = () => {} }) => {
  // Use the dates passed from the parent component
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: false
  });
  const { formatPrice } = useCurrency();

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

  const handleCloseDatePicker = () => {
    setShowDatePicker(false);
  };

  const handleCloseGuestModal = () => {
    setShowGuestModal(false);
  };
  
  const handleDateSelect = (startDate, endDate) => {
    setDates({
      checkIn: startDate,
      checkOut: endDate
    });
    setShowDatePicker(false);
  };
  
  const totalGuests = guests.adults + guests.children;

  const total = calculateTotal();

  return (
    <div className="reservation-form">
      <div className="price-header">
        <div className="price">
          <span className="amount">{formatPrice(price)}</span>
          <span className="per-night">night</span>
        </div>
        <div className="rating">
          {typeof rating === 'number' ? (
            <>
              <i className="fas fa-star"></i>
              <span>{rating}</span>
              <span className="dot">·</span>
              <span className="reviews">{reviews} reviews</span>
            </>
          ) : (
            <>
              <i className="fas fa-star"></i>
              <span>New</span>
              <span className="dot">·</span>
              <span className="reviews">{reviews || 0} reviews</span>
            </>
          )}
        </div>
      </div>

      {dates.checkIn && dates.checkOut && (
        <div className="form-title">
          <h3>
            {Math.ceil((dates.checkOut - dates.checkIn) / (1000 * 60 * 60 * 24))} nights in New York
          </h3>
          <p className="date-range">{formatDateWithYear(dates.checkIn)} - {formatDateWithYear(dates.checkOut)}</p>
        </div>
      )}

      <div className="booking-inputs">
        <div className="dates-row">
          <div className="dates-input" onClick={() => setShowDatePicker(true)}>
            <div className="check-in">
              <label>CHECK-IN</label>
              <div className="date-value">{dates.checkIn ? formatDate(dates.checkIn) : 'Add date'}</div>
            </div>
            <div className="check-out">
              <label>CHECKOUT</label>
              <div className="date-value">{dates.checkOut ? formatDate(dates.checkOut) : 'Add date'}</div>
            </div>
          </div>
        </div>
        
        <div className="guests-row">
          <div className="guests-input" onClick={() => setShowGuestModal(true)}>
            <label>GUESTS</label>
            <div className="guest-value-wrapper">
              <div className="guest-value">
                {`${totalGuests} guest${totalGuests !== 1 ? 's' : ''}`}
              </div>
              <i className="fas fa-chevron-down select-icon"></i>
            </div>
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
            <span>{formatPrice(price)} × {total.nights} nights</span>
            <span>{formatPrice(total.subtotal)}</span>
          </div>
          <div className="price-item">
            <span>Cleaning fee</span>
            <span>{formatPrice(total.cleaningFee)}</span>
          </div>
          <div className="price-item">
            <span>Service fee</span>
            <span>{formatPrice(total.serviceFee)}</span>
          </div>
          <div className="total">
            <span>Total</span>
            <span>{formatPrice(total.total)}</span>
          </div>
        </div>
      )}

      <DatePicker 
        isOpen={showDatePicker} 
        onClose={handleCloseDatePicker} 
        onDateSelect={handleDateSelect} 
      />

      <GuestSearchModal
        isOpen={showGuestModal}
        onClose={handleCloseGuestModal}
        guests={guests}
        onGuestsChange={setGuests}
      />
    </div>
  );
};

export default ReservationForm;
