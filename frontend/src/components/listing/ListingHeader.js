import React from 'react';
import { Link } from 'react-router-dom';
import './ListingHeader.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faBars, faGlobe } from '@fortawesome/free-solid-svg-icons';

const ListingHeader = () => {
  return (
    <header className="listing-header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png" 
              alt="Airbnb" 
              className="airbnb-logo-3" 
            />
          </Link>
        </div>
        
        <div className="search-bar">
          <button className="search-button">
            <span>Start your search</span>
            <div className="search-icon-container">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
            </div>
          </button>
        </div>
        
        <div className="user-menu">
          <Link to="/host" className="become-host-button">Become a Host</Link>
          <button className="language-button">
            <FontAwesomeIcon icon={faGlobe} />
          </button>
          <div className="profile-menu">
            <button className="profile-button">
              <FontAwesomeIcon icon={faBars} className="menu-icon" />
              <div className="user-avatar">
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{display: 'block', height: '100%', width: '100%', fill: 'currentcolor'}}>
                  <path d="m16 .7c-8.437 0-15.3 6.863-15.3 15.3s6.863 15.3 15.3 15.3 15.3-6.863 15.3-15.3-6.863-15.3-15.3-15.3zm0 28c-4.021 0-7.605-1.884-9.933-4.81a12.425 12.425 0 0 1 6.451-4.4 6.507 6.507 0 0 1 -3.018-5.49c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5a6.513 6.513 0 0 1 -3.019 5.491 12.42 12.42 0 0 1 6.452 4.4c-2.328 2.925-5.912 4.809-9.933 4.809z"></path>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ListingHeader;
