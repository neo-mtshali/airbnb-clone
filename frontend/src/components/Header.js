import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      {/* Left: Logo */}
      <div className="header__logo">
        <span>airbnb</span>
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
        <p>Become a Host</p>
        <div className="header__globe">
          <i className="fas fa-globe"></i>
        </div>
        <div className="header__profile">
          <i className="fas fa-bars"></i>
          <i className="fas fa-user-circle"></i>
        </div>
      </div>
    </header>
  );
}

export default Header;
