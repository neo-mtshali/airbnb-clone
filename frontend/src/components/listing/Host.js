import React from 'react';
import './Host.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import avatarImage from '../../assets/Avatar.png';
import frameIcon from '../../assets/Frame.png';
import superhostBadge from '../../assets/Airbnb Superhost Badge.png';

function Host({ hostImage, hostName = 'Ghazal', joinDate = 'May 2021', reviews = 12, isSuperhost = true }) {
  return (
    <div className="host-profile">
      <div className="host-profile__header">
        <img src={avatarImage} alt={`${hostName}'s profile`} className="host-profile__image" />
        <div className="host-profile__info">
          <h2>Hosted by {hostName}</h2>
          <p>Joined {joinDate}</p>
        </div>
      </div>
      
      <div className="host-profile__stats">
        <div className="host-profile__stat reviews">
          <FontAwesomeIcon icon={faStar} className="host-profile__icon star" />
          <span>{reviews} Reviews</span>
        </div>
        
        <div className="host-profile__stat verified">
          <FontAwesomeIcon icon={faCircleCheck} className="host-profile__icon check" />
          <span>Identity verified</span>
        </div>
        
        <div className="host-profile__stat superhost">
          <img src={superhostBadge} alt="Superhost" className="superhost-badge" />
          <span>Superhost</span>
        </div>
      </div>
      
      <div className="host-profile__superhost-info">
        <p className="superhost-title">{hostName} is a Superhost</p>
        <p className="superhost-description">Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
      </div>
      
      <div className="host-profile__response">
        <p className="response-info">Response rate: 100%</p>
        <p className="response-info">Response time: within an hour</p>
      </div>
      
      <div className="host-profile__contact">
        <button className="host-profile__contact-btn">Contact Host</button>
      </div>
      
      <div className="host-profile__payment-info">
        <div className="host-profile__payment-icon">
          <img src={frameIcon} alt="Payment protection" />
        </div>
        <p>To protect your payment, never transfer money or communicate outside of the Airbnb website or app.</p>
      </div>
    </div>
  );
}

export default Host;
