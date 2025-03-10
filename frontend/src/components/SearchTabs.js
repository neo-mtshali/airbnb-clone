import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './SearchTabs.css';
import DatePicker from './DatePicker';
import LocationSearchModal from './LocationSearchModal';
import GuestSearchModal from './GuestSearchModal';

const SearchTabs = ({ searchInfo }) => {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [currentSearchInfo, setCurrentSearchInfo] = useState(searchInfo);
  const navigate = useNavigate();
  const { location, checkIn, checkOut, guests } = currentSearchInfo;

  // Format guests text
  const getGuestsText = () => {
    if (!guests) return '2 guests';
    
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

  const handleSearch = () => {
    const searchParams = new URLSearchParams({
      location: location || '',
      checkIn: checkIn || '',
      checkOut: checkOut || '',
      guests: JSON.stringify(guests || {})
    });
    navigate(`/search?${searchParams.toString()}`);
  };

  const handleLocationChange = (newLocation) => {
    setCurrentSearchInfo(prev => ({
      ...prev,
      location: newLocation
    }));
  };

  const handleDateSelect = (startDate, endDate) => {
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    };

    setCurrentSearchInfo(prev => ({
      ...prev,
      checkIn: formatDate(startDate),
      checkOut: formatDate(endDate)
    }));
    setIsDatePickerOpen(false);
  };

  const handleGuestsChange = (newGuests) => {
    setCurrentSearchInfo(prev => ({
      ...prev,
      guests: newGuests
    }));
  };

  return (
    <div className="search-header__center">
      <div className="search-header__tabs">
        <button 
          className="search-tab"
          onClick={() => setIsLocationModalOpen(true)}
        >
          {location || 'Anywhere'}
        </button>
        <button 
          className="search-tab"
          onClick={() => setIsDatePickerOpen(true)}
        >
          {checkIn && checkOut ? `${checkIn} - ${checkOut}` : 'Any week'}
        </button>
        <button 
          className="search-tab"
          onClick={() => setIsGuestModalOpen(true)}
        >
          {getGuestsText()}
        </button>
        <button 
          className="search-tab search-icon-tab"
          onClick={handleSearch}
          aria-label="Search"
        >
          <FaSearch />
        </button>

        <LocationSearchModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          location={location}
          onLocationChange={handleLocationChange}
        />

        <DatePicker
          isOpen={isDatePickerOpen}
          onClose={() => setIsDatePickerOpen(false)}
          onDateSelect={handleDateSelect}
        />

        <GuestSearchModal
          isOpen={isGuestModalOpen}
          onClose={() => setIsGuestModalOpen(false)}
          guests={guests || { adults: 0, children: 0, infants: 0, pets: false }}
          onGuestsChange={handleGuestsChange}
        />
      </div>
    </div>
  );
};

export default SearchTabs;
