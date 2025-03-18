import React from 'react';
import { FaClock, FaSmokingBan, FaPaw, FaUsers, FaChild, FaLock } from 'react-icons/fa';
import { BiAlarm } from 'react-icons/bi';
import { MdOutlineCleaningServices, MdOutlineHealthAndSafety, MdOutlineSecurity } from 'react-icons/md';
import './Rules.css';

const Rules = () => {
  return (
    <div className="rules-section">
      <h2>Things to know</h2>
      
      <div className="rules-grid">
        <div className="rules-column">
          <h3>House rules</h3>
          <div className="rule-item">
            <FaClock className="rule-icon" />
            <div className="rule-content">
              <p>Check-in: After 4:00 PM</p>
            </div>
          </div>
          <div className="rule-item">
            <FaClock className="rule-icon" />
            <div className="rule-content">
              <p>Checkout: 10:00 AM</p>
            </div>
          </div>
          <div className="rule-item">
            <FaLock className="rule-icon" />
            <div className="rule-content">
              <p>Self check-in with lockbox</p>
            </div>
          </div>
          <div className="rule-item">
            <FaChild className="rule-icon" />
            <div className="rule-content">
              <p>Not suitable for infants (under 2 years)</p>
            </div>
          </div>
          <div className="rule-item">
            <FaSmokingBan className="rule-icon" />
            <div className="rule-content">
              <p>No smoking</p>
            </div>
          </div>
          <div className="rule-item">
            <FaPaw className="rule-icon" />
            <div className="rule-content">
              <p>No pets</p>
            </div>
          </div>
          <div className="rule-item">
            <FaUsers className="rule-icon" />
            <div className="rule-content">
              <p>No parties or events</p>
            </div>
          </div>
        </div>

        <div className="rules-column">
          <h3>Health & safety</h3>
          <div className="rule-item">
            <MdOutlineCleaningServices className="rule-icon" />
            <div className="rule-content">
              <p>Committed to Airbnb's enhanced cleaning process. Show more</p>
            </div>
          </div>
          <div className="rule-item">
            <MdOutlineHealthAndSafety className="rule-icon" />
            <div className="rule-content">
              <p>Airbnb's social-distancing and other COVID-19-related guidelines apply</p>
            </div>
          </div>
          <div className="rule-item">
            <BiAlarm className="rule-icon" />
            <div className="rule-content">
              <p>Carbon monoxide alarm</p>
            </div>
          </div>
          <div className="rule-item">
            <BiAlarm className="rule-icon" />
            <div className="rule-content">
              <p>Smoke alarm</p>
            </div>
          </div>
          <div className="rule-item">
            <MdOutlineSecurity className="rule-icon" />
            <div className="rule-content">
              <p>Security Deposit - if you damage the home, you may be charged up to $566</p>
            </div>
          </div>
          <button className="show-more-btn">Show more ›</button>
        </div>

        <div className="rules-column">
          <h3>Cancellation policy</h3>
          <p>Free cancellation before Feb 14</p>
          <button className="show-more-btn">Show more ›</button>
        </div>
      </div>
    </div>
  );
};

export default Rules;
