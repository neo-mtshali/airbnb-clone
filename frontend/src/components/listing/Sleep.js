import React from 'react';
import './Sleep.css';
import bedroomImage from '../../assets/Rectangle 3.png';

const Sleep = ({ beds, bedrooms, images }) => {
  return (
    <div className="sleep-container">
      <h2>Where you'll sleep</h2>
      <div className="sleep-items">
        {Array.from({ length: bedrooms || 1 }, (_, i) => {
          // Use Rectangle 3.png as the bedroom image
          const bedImage = bedroomImage;
          
          return (
            <div key={i} className="sleep-item">
              <div className="sleep-image">
                <img src={bedImage} alt={`Bedroom ${i + 1}`} />
              </div>
              <div className="sleep-details">
                <h3>Bedroom</h3>
                <p>{beds && beds[i] ? beds[i] : '1 queen bed'}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sleep;