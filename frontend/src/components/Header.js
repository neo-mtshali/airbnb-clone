import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import airbnbLogo from "../assets/airbnb-logo.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faBars, faUserCircle, faUser, faBookmark, faCog, faSignOutAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

function Header() {
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
    <header className="header">
      {/* Left: Logo */}
      <div className="header__logo">
        <Link to="/">
          <img src={airbnbLogo} alt="Airbnb" className="airbnb-logo-1" />
        </Link>
      </div>

      {/* Center: Nav Links */}
      <nav className="header__nav">
        <ul>
          <li>Places to Stay</li>
          <li>Experiences</li>
          <li>Online Experiences</li>
        </ul>
      </nav>

      {/* Right: Become a Host, Globe, Profile */}
      <div className="header__right">
        <Link to="/admin" className="become-host-link">
          <p>Become a Host</p>
        </Link>
        <button className="header__globe">
          <FontAwesomeIcon icon={faGlobe} />
        </button>
        <div className="header__profile" ref={dropdownRef}>
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
    </header>
  );
}

export default Header;
