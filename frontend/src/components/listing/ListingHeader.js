import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ListingHeader.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faBars, faGlobe, faUserCircle, faUser, faBookmark, faCog, faSignOutAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const ListingHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef(null);
  
  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
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
          <div className="profile-menu" ref={dropdownRef}>
            <button className="profile-button" onClick={toggleDropdown}>
              <FontAwesomeIcon icon={faBars} className="menu-icon" />
              <div className="user-avatar">
                <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
              </div>
            </button>
            {isDropdownOpen && (
              <div className="profile-dropdown">
                {isLoggedIn ? (
                  /* Logged in user dropdown */
                  <>
                    <div className="dropdown-section">
                      <Link to="/profile" className="dropdown-item">
                        <FontAwesomeIcon icon={faUser} className="dropdown-icon" />
                        <span>Profile</span>
                      </Link>
                      <Link to="/trips" className="dropdown-item">
                        <FontAwesomeIcon icon={faBookmark} className="dropdown-icon" />
                        <span>Trips</span>
                      </Link>
                      <Link to="/settings" className="dropdown-item">
                        <FontAwesomeIcon icon={faCog} className="dropdown-icon" />
                        <span>Settings</span>
                      </Link>
                    </div>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-section">
                      <Link to="/host/homes" className="dropdown-item">
                        <span>Host your home</span>
                      </Link>
                      <Link to="/host/experiences" className="dropdown-item">
                        <span>Host an experience</span>
                      </Link>
                    </div>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-section">
                      <Link to="/help" className="dropdown-item">
                        <span>Help</span>
                      </Link>
                      <button onClick={handleLogout} className="dropdown-item logout-button">
                        <FontAwesomeIcon icon={faSignOutAlt} className="dropdown-icon" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  /* Not logged in user dropdown */
                  <div className="dropdown-section">
                    <Link to="/login" className="dropdown-item">
                      <FontAwesomeIcon icon={faUser} className="dropdown-icon" />
                      <span>Log in</span>
                    </Link>
                    <Link to="/signup" className="dropdown-item">
                      <FontAwesomeIcon icon={faUserPlus} className="dropdown-icon" />
                      <span>Sign up</span>
                    </Link>
                    <div className="dropdown-divider"></div>
                    <Link to="/host/homes" className="dropdown-item">
                      <span>Host your home</span>
                    </Link>
                    <Link to="/help" className="dropdown-item">
                      <span>Help</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ListingHeader;
