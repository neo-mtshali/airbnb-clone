import React from 'react';
import './Host.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faShield } from '@fortawesome/free-solid-svg-icons';

function Host({ hostImage, hostName, joinDate, reviews, isSuperhost }) {
  return (
    <div className="host-profile">
      <div className="host-profile__header">
        <img src={hostImage} alt={`${hostName}'s profile`} className="host-profile__image" />
        <div className="host-profile__info">
          <h2>Hosted by {hostName}</h2>
          <p>Joined {joinDate}</p>
        </div>
      </div>
      
      <div className="host-profile__stats">
        {reviews > 0 && (
          <div className="host-profile__stat">
            <FontAwesomeIcon icon={faStar} className="host-profile__icon" />
            <span>{reviews} Reviews</span>
          </div>
        )}
        
        {isSuperhost && (
          <div className="host-profile__stat">
            <FontAwesomeIcon icon={faShield} className="host-profile__icon" />
            <span>Identity verified</span>
          </div>
        )}
        
        {isSuperhost && (
          <div className="host-profile__badge">
            <span>Superhost</span>
          </div>
        )}
      </div>
      
      {isSuperhost && (
        <div className="host-profile__superhost-info">
          <p>{hostName} is a Superhost</p>
          <p>Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
        </div>
      )}
      
      <div className="host-profile__response">
        <div className="host-profile__response-item">
          <span>Response rate: 100%</span>
        </div>
        <div className="host-profile__response-item">
          <span>Response time: within an hour</span>
        </div>
      </div>
      
      <div className="host-profile__contact">
        <button className="host-profile__contact-btn">Contact Host</button>
      </div>
      
      <div className="host-profile__payment-info">
        <div className="host-profile__payment-icon">🛡️</div>
        <p>To protect your payment, never transfer money or communicate outside of the Airbnb website or app.</p>
      </div>
    </div>
  );
}

export default Host;
