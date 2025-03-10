import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';
import { FaSearch } from 'react-icons/fa';
import DatePicker from './DatePicker';
import GuestPicker from './GuestPicker';

function SearchBar() {
  const navigate = useNavigate();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [datePickerType, setDatePickerType] = useState(null); // 'check-in' or 'check-out'
  const [guests, setGuests] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    pets: false
  });

  const getGuestsText = () => {
    const totalGuests = guests.adults + guests.children;
    let text = `${totalGuests} guest${totalGuests !== 1 ? 's' : ''}`;
    
    if (guests.infants) {
      text += `, ${guests.infants} infant${guests.infants !== 1 ? 's' : ''}`;
    }
    if (guests.pets) {
      text += ', pets';
    }
    return text;
  };

  const handleDateSelect = (startDate, endDate) => {
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    };

    setCheckInDate(formatDate(startDate));
    setCheckOutDate(formatDate(endDate));
    setIsDatePickerOpen(false);
  };

  const openDatePicker = (type) => {
    setDatePickerType(type);
    setIsDatePickerOpen(true);
  };

  return (
    <div className="search-bar">
      <div className="search-bar__inputs">
        <div className="search-input location">
          <label>Location</label>
          <input type="text" placeholder="Where are you going?" />
        </div>
        <div className="search-input check-in">
          <label>Check in</label>
          <input
            type="text"
            placeholder="Add dates"
            value={checkInDate}
            onClick={() => openDatePicker('check-in')}
            readOnly
          />
        </div>
        <div className="search-input check-out">
          <label>Check out</label>
          <input
            type="text"
            placeholder="Add dates"
            value={checkOutDate}
            onClick={() => openDatePicker('check-out')}
            readOnly
          />
        </div>
        <div className="search-input guests">
          <label>Guests</label>
          <input 
            type="text" 
            placeholder="Add guests" 
            value={getGuestsText()}
            onClick={() => setIsGuestPickerOpen(true)}
            readOnly
          />
          {isGuestPickerOpen && (
            <GuestPicker
              isOpen={isGuestPickerOpen}
              onClose={() => setIsGuestPickerOpen(false)}
              guests={guests}
              onGuestsChange={setGuests}
            />
          )}
        </div>
        <button 
          className="search-button"
          onClick={() => {
            const searchParams = new URLSearchParams({
              location: document.querySelector('.location input').value,
              checkIn: checkInDate,
              checkOut: checkOutDate,
              guests: JSON.stringify(guests)
            });
            navigate(`/search?${searchParams.toString()}`);
          }}
        >
          <FaSearch />
        </button>
      </div>

      <DatePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onDateSelect={handleDateSelect}
      />
    </div>
  );
}

export default SearchBar;
