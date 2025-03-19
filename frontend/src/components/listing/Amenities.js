import React, { useState } from 'react';
import './Amenities.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';

const Amenities = ({ amenities }) => {
  const [showAll, setShowAll] = useState(false);
  
  // Check if amenities is an array, if not, use an empty array
  const amenitiesArray = Array.isArray(amenities) ? amenities : [];

  const amenityIcons = {
    wifi: 'fas fa-wifi',
    parking: 'fas fa-parking',
    pool: 'fas fa-swimming-pool',
    hotTub: 'fas fa-hot-tub',
    kitchen: 'fas fa-utensils',
    tv: 'fas fa-tv',
    airConditioning: 'fas fa-wind',
    waterfront: 'fas fa-water',
    workspace: 'fas fa-desktop',
    elevator: 'fas fa-arrows-alt-v',
    heating: 'fas fa-snowflake',
    washer: 'fas fa-tshirt',
    patio: { type: 'fa', icon: faTag },
    beachfront: { type: 'fa', icon: faTag }
  };

  const displayAmenities = showAll ? amenitiesArray : amenitiesArray.slice(0, 6);

  return (
    <div className="amenities-section">
      <h2>What this place offers</h2>
      <div className="amenities-grid">
        {displayAmenities.map((amenity, index) => {
          const iconData = amenityIcons[amenity.icon];
          return (
            <div key={index} className="amenity-item">
              {iconData ? (
                typeof iconData === 'string' ? (
                  <i className={iconData}></i>
                ) : iconData.type === 'fa' ? (
                  <FontAwesomeIcon icon={iconData.icon} />
                ) : (
                  <FontAwesomeIcon icon={faTag} className="fa-thin" />
                )
              ) : (
                <FontAwesomeIcon icon={faTag} className="fa-thin" />
              )}
              <span>{amenity.name}</span>
            </div>
          );
        })}
      </div>
      {amenitiesArray.length > 6 && (
        <button 
          className="show-all-amenities"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show less' : `Show all ${amenitiesArray.length} amenities`}
        </button>
      )}
    </div>
  );
};

export default Amenities;
