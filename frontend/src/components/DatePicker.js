import React, { useState } from 'react';
import './DatePicker.css';

const DatePicker = ({ isOpen, onClose, onDateSelect }) => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);

  const handleClickOutside = (e) => {
    if (!e.target.closest('.date-picker-content')) {
      onClose();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const generateCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add the days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isDateInRange = (date) => {
    if (!selectedStartDate || !date) return false;
    if (!selectedEndDate && !hoverDate) return false;
    
    const endDate = selectedEndDate || hoverDate;
    return date > selectedStartDate && date < endDate;
  };

  const isDateSelected = (date) => {
    if (!date) return false;
    return (
      date.toDateString() === selectedStartDate?.toDateString() ||
      date.toDateString() === selectedEndDate?.toDateString()
    );
  };

  const handleDateClick = (date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      if (date < selectedStartDate) {
        setSelectedStartDate(date);
        setSelectedEndDate(null);
      } else {
        setSelectedEndDate(date);
        onDateSelect(selectedStartDate, date);
      }
    }
  };

  const currentDate = new Date();
  const baseMonth = currentDate.getMonth();
  const baseYear = currentDate.getFullYear();

  const firstMonth = new Date(baseYear, baseMonth + currentMonthOffset);
  const secondMonth = new Date(baseYear, baseMonth + currentMonthOffset + 1);

  const days = generateCalendarDays(firstMonth.getFullYear(), firstMonth.getMonth());
  const nextMonthDays = generateCalendarDays(secondMonth.getFullYear(), secondMonth.getMonth());

  const handlePrevMonth = () => {
    setCurrentMonthOffset(prev => prev - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonthOffset(prev => prev + 1);
  };

  if (!isOpen) return null;

  return (
    <div className="date-picker-modal">
      <div className="date-picker-overlay" />
      <div className="date-picker-content">
        <div className="date-picker-tabs">
          <button 
            className={`date-picker-tab ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            Calendar
          </button>
          <button 
            className={`date-picker-tab ${activeTab === 'flexible' ? 'active' : ''}`}
            onClick={() => setActiveTab('flexible')}
          >
            I'm flexible
          </button>
        </div>
        <div className="calendars-container">
          <div className="calendar">
            <div className="calendar-navigation">
              <button onClick={handlePrevMonth}>&lt;</button>
              <h3>{firstMonth.toLocaleString('default', { month: 'long' })} {firstMonth.getFullYear()}</h3>
            </div>
            <div className="calendar-grid">
              <div className="weekdays">
                <div>Su</div>
                <div>Mo</div>
                <div>Tu</div>
                <div>We</div>
                <div>Th</div>
                <div>Fr</div>
                <div>Sa</div>
              </div>
              <div className="days">
                {days.map((date, index) => (
                  <div
                    key={index}
                    className={`day ${!date ? 'empty' : ''} ${
                      isDateSelected(date) ? 'selected' : ''
                    } ${isDateInRange(date) ? 'in-range' : ''}`}
                    onClick={() => date && handleDateClick(date)}
                    onMouseEnter={() => date && !selectedEndDate && setHoverDate(date)}
                    onMouseLeave={() => setHoverDate(null)}
                  >
                    {date?.getDate()}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="calendar">
            <div className="calendar-navigation">
              <h3>{secondMonth.toLocaleString('default', { month: 'long' })} {secondMonth.getFullYear()}</h3>
              <button onClick={handleNextMonth}>&gt;</button>
            </div>
            <div className="calendar-grid">
              <div className="weekdays">
                <div>Su</div>
                <div>Mo</div>
                <div>Tu</div>
                <div>We</div>
                <div>Th</div>
                <div>Fr</div>
                <div>Sa</div>
              </div>
              <div className="days">
                {nextMonthDays.map((date, index) => (
                  <div
                    key={index}
                    className={`day ${!date ? 'empty' : ''} ${
                      isDateSelected(date) ? 'selected' : ''
                    } ${isDateInRange(date) ? 'in-range' : ''}`}
                    onClick={() => date && handleDateClick(date)}
                    onMouseEnter={() => date && !selectedEndDate && setHoverDate(date)}
                    onMouseLeave={() => setHoverDate(null)}
                  >
                    {date?.getDate()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
