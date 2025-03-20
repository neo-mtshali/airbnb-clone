import React from 'react';
import './Host.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import avatarImage from '../../assets/Avatar.png';
import frameIcon from '../../assets/Frame.png';
import superhostBadge from '../../assets/Airbnb Superhost Badge.png';

function Host({ 
  // Accept both backend property names and legacy prop names for backward compatibility
  host_picture_url, 
  hostImage, 
  host_name, 
  hostName = 'Host', 
  host_since, 
  joinDate = 'May 2021', 
  number_of_reviews, 
  reviews = 0, 
  host_is_superhost, 
  isSuperhost = false 
}) {
  // Use the backend property names if available, fall back to legacy props
  const displayImage = host_picture_url || hostImage || avatarImage;
  const displayName = host_name || hostName;
  const displayJoinDate = host_since ? new Date(host_since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : joinDate;
  const displayReviews = number_of_reviews || reviews;
  const displayIsSuperhost = host_is_superhost !== undefined ? host_is_superhost : isSuperhost;

  return (
    <div className="host-profile">
      <div className="host-profile__header">
        <img src={displayImage} alt={`${displayName}'s profile`} className="host-profile__image" />
        <div className="host-profile__info">
          <h2>Hosted by {displayName}</h2>
          <p>Joined {displayJoinDate}</p>
        </div>
      </div>
      
      <div className="host-profile__stats">
        <div className="host-profile__stat reviews">
          <FontAwesomeIcon icon={faStar} className="host-profile__icon star" />
          <span>{displayReviews} Reviews</span>
        </div>
        
        <div className="host-profile__stat verified">
          <FontAwesomeIcon icon={faCircleCheck} className="host-profile__icon check" />
          <span>Identity verified</span>
        </div>
        
        {displayIsSuperhost && (
          <div className="host-profile__stat superhost">
            <img src={superhostBadge} alt="Superhost" className="superhost-badge" />
            <span>Superhost</span>
          </div>
        )}
      </div>
      
      {displayIsSuperhost && (
        <div className="host-profile__superhost-info">
          <p className="superhost-title">{displayName} is a Superhost</p>
          <p className="superhost-description">Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
        </div>
      )}
      
      <div className="host-profile__response">
        <p className="response-info">Response rate: {(host_is_superhost || isSuperhost) ? '100%' : '95%'}</p>
        <p className="response-info">Response time: within an hour</p>
      </div>
      
      <div className="host-profile__contact">
        <button className="host-profile__contact-btn">Contact {displayName}</button>
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
