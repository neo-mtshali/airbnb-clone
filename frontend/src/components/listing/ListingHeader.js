import React from 'react';
import { FaSearch, FaGlobe, FaUserCircle, FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './ListingHeader.css';

const ListingHeader = () => {
  return (
    <header className="listing-header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png" 
              alt="Airbnb" 
              className="airbnb-logo" 
            />
          </Link>
        </div>
        
        <div className="search-bar">
          <button className="search-button">
            <span>Start your search</span>
            <div className="search-icon-container">
              <FaSearch className="search-icon" />
            </div>
          </button>
        </div>
        
        <div className="user-menu">
          <button className="become-host-button">Become a Host</button>
          <button className="language-button">
            <FaGlobe />
          </button>
          <div className="profile-menu">
            <button className="profile-button">
              <FaBars />
              <FaUserCircle className="user-icon" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ListingHeader;
