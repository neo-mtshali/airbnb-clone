import React, { useState, useEffect } from 'react';
import './Calendar.css';

const Calendar = ({ dates = {}, setDates = () => {}, onClose, location = 'New York' }) => {
  // Get current date for initial display
  const today = new Date();
  const [displayDate, setDisplayDate] = useState(new Date(today.getFullYear(), today.getMonth()));
  const [hoverDate, setHoverDate] = useState(null);
  
  // Internal state for dates when none are provided from parent
  const [internalDates, setInternalDates] = useState({ checkIn: null, checkOut: null });
  
  // Use internal state if no dates are provided from parent
  const activeDates = Object.keys(dates).length > 0 ? dates : internalDates;
  const setActiveDates = Object.keys(dates).length > 0 ? setDates : setInternalDates;
  
  // Calculate number of nights between check-in and check-out
  const calculateNights = () => {
    if (activeDates.checkIn && activeDates.checkOut) {
      const diffTime = Math.abs(activeDates.checkOut - activeDates.checkIn);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };
  
  // Format date to display
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Format the month and year for display
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  // Get current month and next month for display
  const currentMonthLabel = formatMonthYear(displayDate);
  const nextMonth = new Date(displayDate);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextMonthLabel = formatMonthYear(nextMonth);
  
  // Format short month display for header
  const formatMonthHeader = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  // Function to handle date selection
  const handleDateClick = (day, month, year) => {
    console.log('Date clicked:', day, month, year);
    const clickedDate = new Date(year, month, day);
    
    if (!activeDates.checkIn) {
      // First click - set check-in date
      setActiveDates({ checkIn: clickedDate, checkOut: null });
    } else if (!activeDates.checkOut) {
      // Second click - set check-out date if after check-in
      if (clickedDate > activeDates.checkIn) {
        setActiveDates({ ...activeDates, checkOut: clickedDate });
      } else {
        // If clicked date is before check-in, make it the new check-in
        setActiveDates({ checkIn: clickedDate, checkOut: null });
      }
    } else {
      // Both dates already set - start over with new check-in
      setActiveDates({ checkIn: clickedDate, checkOut: null });
    }
    
    // Clear hover state after click
    setHoverDate(null);
  };

  // Function to handle date hover for range selection preview
  const handleDateHover = (day, month, year) => {
    if (!activeDates.checkIn || activeDates.checkOut) return;
    
    setHoverDate(new Date(year, month, day));
  };

  // Function to check if a date is selected as check-in or check-out
  const isDateSelected = (date) => {
    if (!activeDates.checkIn && !activeDates.checkOut) return false;
    
    if (activeDates.checkIn && date.getTime() === activeDates.checkIn.getTime()) return 'check-in';
    if (activeDates.checkOut && date.getTime() === activeDates.checkOut.getTime()) return 'check-out';
    
    return false;
  };

  // Function to check if a date is in the selected range
  const isInRange = (date) => {
    if (!activeDates.checkIn) return false;
    
    // If both check-in and check-out are set
    if (activeDates.checkOut) {
      return date > activeDates.checkIn && date < activeDates.checkOut;
    }
    
    // If only check-in is set and we're hovering over a date
    if (hoverDate && date > activeDates.checkIn && date < hoverDate) {
      return true;
    }
    
    return false;
  };

  // Navigation function to move between months
  const navigateMonths = (direction) => {
    const newDate = new Date(displayDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setDisplayDate(newDate);
  };

  // Generate calendar days for a given month
  const renderMonthDays = (monthDate) => {
    const days = [];
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    
    // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Get the last day of the previous month
    const lastDayPrevMonth = new Date(year, month, 0).getDate();
    
    // Add days from previous month to fill the first row
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = lastDayPrevMonth - i;
      const prevMonth = new Date(year, month - 1, day);
      days.push(
        <button 
          key={`prev-${day}`} 
          className="calendar-day different-month" 
          disabled
        >
          {day}
        </button>
      );
    }
    
    // Get the number of days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      // Check if this date is selected or in range
      const isCheckIn = activeDates.checkIn && date.getTime() === activeDates.checkIn.getTime();
      const isCheckOut = activeDates.checkOut && date.getTime() === activeDates.checkOut.getTime();
      
      // Determine if this date is in the selected range
      const isDateInRange = () => {
        if (!activeDates.checkIn) return false;
        
        // If both check-in and check-out are set
        if (activeDates.checkOut) {
          return date > activeDates.checkIn && date < activeDates.checkOut;
        }
        
        // If only check-in is set and we're hovering over a date
        if (hoverDate && date > activeDates.checkIn && date < hoverDate) {
          return true;
        }
        
        return false;
      };
      
      const selectionState = isCheckIn ? 'check-in' : (isCheckOut ? 'check-out' : '');
      
      days.push(
        <button 
          key={dateString} 
          className={`calendar-day 
            ${selectionState ? selectionState : ''}
            ${isDateInRange() ? 'in-range' : ''}
            ${selectionState === 'check-in' || selectionState === 'check-out' ? 'selected' : ''}
          `}
          onClick={() => handleDateClick(day, month, year)}
          onMouseEnter={() => handleDateHover(day, month, year)}
          onMouseLeave={() => setHoverDate(null)}
          type="button"
        >
          {day}
        </button>
      );
    }
    
    // Calculate how many days from the next month we need to add
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
    const nextMonthDays = totalCells - (firstDayOfMonth + daysInMonth);
    
    // Add days from next month to complete the grid
    for (let day = 1; day <= nextMonthDays; day++) {
      days.push(
        <button 
          key={`next-${day}`} 
          className="calendar-day different-month" 
          disabled
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  // Set initial dates to current dates (March 19-26, 2025)
  useEffect(() => {
    if (!activeDates.checkIn && !activeDates.checkOut) {
      // Use March 19-26, 2025
      const checkIn = new Date(2025, 2, 19); // Month is 0-indexed, so 2 = March
      const checkOut = new Date(2025, 2, 26);
      setActiveDates({ checkIn, checkOut });
      setDisplayDate(new Date(2025, 2, 1)); // Set to March 2025
    }
  }, []);

  return (
    <div className="calendar">
      {/* Trip Summary Header */}
      <div className="calendar-trip-summary">
        <h2>{calculateNights()} nights in {location}</h2>
        <p className="date-range">
          {formatDate(activeDates.checkIn)} - {formatDate(activeDates.checkOut)}
        </p>
      </div>
      
      {/* Month Navigation */}
      <div className="calendar-months-navigation">
        <button className="month-nav-button" onClick={() => navigateMonths('prev')} type="button">&lt;</button>
        <div className="month-titles">
          <div className="month-title">{formatMonthHeader(displayDate)}</div>
          <div className="month-title">{formatMonthHeader(nextMonth)}</div>
        </div>
        <button className="month-nav-button" onClick={() => navigateMonths('next')} type="button">&gt;</button>
      </div>

      <div className="calendar-container">
        {/* Current Month */}
        <div className="calendar-month">
          <div className="calendar-grid">
            {/* Day headers */}
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
            
            {/* Calendar days */}
            {renderMonthDays(displayDate)}
          </div>
        </div>
        
        {/* Next Month */}
        <div className="calendar-month">
          <div className="calendar-grid">
            {/* Day headers */}
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
            
            {/* Calendar days */}
            {renderMonthDays(nextMonth)}
          </div>
        </div>
      </div>

      <div className="calendar-footer">
        <button 
          className="clear-dates" 
          onClick={() => setDates({ checkIn: null, checkOut: null })}
          type="button"
        >
          Clear dates
        </button>
      </div>
    </div>
  );
};

export default Calendar;
