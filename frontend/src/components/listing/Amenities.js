import React, { useState } from 'react';
import { FaWifi, FaParking, FaSwimmingPool, FaHotTub, 
         FaUtensils, FaTv, FaWind, FaWater, FaDesktop, 
         FaArrowsAltV, FaSnowflake, FaTshirt } from 'react-icons/fa';
import './Amenities.css';

const Amenities = ({ amenities }) => {
  const [showAll, setShowAll] = useState(false);
  
  // Check if amenities is an array, if not, use an empty array
  const amenitiesArray = Array.isArray(amenities) ? amenities : [];

  const amenityIcons = {
    wifi: FaWifi,
    parking: FaParking,
    pool: FaSwimmingPool,
    hotTub: FaHotTub,
    kitchen: FaUtensils,
    tv: FaTv,
    airConditioning: FaWind,
    waterfront: FaWater,
    workspace: FaDesktop,
    elevator: FaArrowsAltV,
    heating: FaSnowflake,
    washer: FaTshirt
  };

  const displayAmenities = showAll ? amenitiesArray : amenitiesArray.slice(0, 6);

  return (
    <div className="amenities-section">
      <h2>What this place offers</h2>
      <div className="amenities-grid">
        {displayAmenities.map((amenity, index) => {
          const Icon = amenityIcons[amenity.icon] || FaWifi;
          return (
            <div key={index} className="amenity-item">
              <Icon />
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
