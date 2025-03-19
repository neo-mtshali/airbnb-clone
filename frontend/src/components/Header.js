import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import airbnbLogo from "../assets/airbnb-logo.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faBars, faUserCircle } from '@fortawesome/free-solid-svg-icons';

function Header() {
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
        <div className="header__profile">
          <button className="profile-button">
            <FontAwesomeIcon icon={faBars} className="menu-icon" />
            <div className="user-avatar">
              <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
