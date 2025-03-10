import React, { useState } from 'react';
import { FaClock, FaSmokingBan, FaPaw, FaUsers } from 'react-icons/fa';
import './Rules.css';

const Rules = ({ rules, checkIn, checkOut }) => {
  const [showAll, setShowAll] = useState(false);

  const defaultRules = [
    {
      icon: FaClock,
      title: 'Check-in',
      description: `${checkIn} or later`
    },
    {
      icon: FaClock,
      title: 'Checkout',
      description: `Before ${checkOut}`
    },
    {
      icon: FaSmokingBan,
      title: 'No smoking',
      description: 'Smoking is not allowed on the property'
    },
    {
      icon: FaPaw,
      title: 'No pets',
      description: 'Pets are not allowed on the property'
    },
    {
      icon: FaUsers,
      title: 'No parties',
      description: 'No parties or events allowed'
    }
  ];

  // Check if rules is an array, if not, use an empty array
  const rulesArray = Array.isArray(rules) ? rules : [];
  const allRules = [...defaultRules, ...rulesArray];
  const displayRules = showAll ? allRules : allRules.slice(0, 5);

  return (
    <div className="rules-section">
      <h2>Things to know</h2>
      
      <div className="rules-grid">
        <div className="rules-column">
          <h3>House rules</h3>
          {displayRules.map((rule, index) => {
            const Icon = rule.icon;
            return (
              <div key={index} className="rule-item">
                <Icon />
                <div className="rule-content">
                  <h4>{rule.title}</h4>
                  <p>{rule.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rules-column">
          <h3>Safety & property</h3>
          <div className="rule-item">
            <FaClock />
            <div className="rule-content">
              <h4>Security camera/recording device</h4>
              <p>None reported</p>
            </div>
          </div>
          {/* Add more safety items as needed */}
        </div>

        <div className="rules-column">
          <h3>Cancellation policy</h3>
          <p>Free cancellation before check-in. Get details</p>
        </div>
      </div>

      {allRules.length > 5 && (
        <button 
          className="show-all-rules"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export default Rules;
