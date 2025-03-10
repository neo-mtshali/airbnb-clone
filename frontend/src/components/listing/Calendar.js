import React from 'react';
import { format, addMonths, startOfMonth, endOfMonth, 
         eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import './Calendar.css';

const Calendar = ({ dates, setDates, availableDates, onClose }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = React.useState(today);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));

  const handleDateClick = (day) => {
    if (!dates.checkIn) {
      setDates({ checkIn: day, checkOut: null });
    } else if (!dates.checkOut && day > dates.checkIn) {
      setDates({ ...dates, checkOut: day });
    } else {
      setDates({ checkIn: day, checkOut: null });
    }
  };

  const isDateAvailable = (day) => {
    return Array.isArray(availableDates) ? availableDates.some(date => 
      isSameDay(new Date(date), day)
    ) : true;
  };

  const isDateSelected = (day) => {
    return (dates.checkIn && isSameDay(dates.checkIn, day)) ||
           (dates.checkOut && isSameDay(dates.checkOut, day));
  };

  const isDateInRange = (day) => {
    return dates.checkIn && dates.checkOut &&
           day > dates.checkIn && day < dates.checkOut;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
        <button onClick={nextMonth}>&gt;</button>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}

        {monthDays.map(day => (
          <button
            key={day.toString()}
            className={`calendar-day ${
              !isSameMonth(day, currentMonth) ? 'different-month' : ''
            } ${isDateSelected(day) ? 'selected' : ''} 
            ${isDateInRange(day) ? 'in-range' : ''} 
            ${!isDateAvailable(day) ? 'unavailable' : ''}`}
            onClick={() => isDateAvailable(day) && handleDateClick(day)}
            disabled={!isDateAvailable(day)}
          >
            {format(day, 'd')}
          </button>
        ))}
      </div>

      <div className="calendar-footer">
        <button className="clear-dates" onClick={() => setDates({ checkIn: null, checkOut: null })}>
          Clear dates
        </button>
        <button className="close-calendar" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Calendar;
