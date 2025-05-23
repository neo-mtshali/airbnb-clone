import React, { useState, useRef, useEffect } from "react";
import "./Footer.css";
import { useCurrency, CURRENCIES } from "../context/CurrencyContext";

function Footer() {
  const { currency, setCurrency, currencies } = useCurrency();
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCurrencyDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleCurrencyChange = (currencyCode) => {
    setCurrency(currencyCode);
    setShowCurrencyDropdown(false);
  };
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Links */}
        <div className="footer-columns">
          <div className="footer-column">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Safety information</a></li>
              <li><a href="#">Cancellation options</a></li>
              <li><a href="#">Our COVID-19 Response</a></li>
              <li><a href="#">Supporting people with disabilities</a></li>
              <li><a href="#">Report a neighborhood concern</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Community</h4>
            <ul>
              <li><a href="#">Airbnb.org: disaster relief housing</a></li>
              <li><a href="#">Support: Afghan refugees</a></li>
              <li><a href="#">Celebrating diversity & belonging</a></li>
              <li><a href="#">Combating discrimination</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Hosting</h4>
            <ul>
              <li><a href="#">Try hosting</a></li>
              <li><a href="#">AirCover: protection for Hosts</a></li>
              <li><a href="#">Explore hosting resources</a></li>
              <li><a href="#">Visit our community forum</a></li>
              <li><a href="#">How to host responsibly</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>About</h4>
            <ul>
              <li><a href="#">Newsroom</a></li>
              <li><a href="#">Learn about new features</a></li>
              <li><a href="#">Letter from our founders</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Investors</a></li>
              <li><a href="#">Airbnb Luxe</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright and Social Links */}
        <div className="footer-bottom">
          <p>© 2022 Airbnb, Inc. · <a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Sitemap</a></p>
          <div className="footer-right">
            <span className="footer-language">🌐 English (US)</span>
            <div className="footer-currency-container" ref={dropdownRef}>
              <button 
                className="footer-currency" 
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              >
                {currencies[currency].symbol} {currency}
              </button>
              {showCurrencyDropdown && (
                <div className="currency-dropdown">
                  {Object.keys(currencies).map((currencyCode) => (
                    <div 
                      key={currencyCode} 
                      className={`currency-option ${currencyCode === currency ? 'active' : ''}`}
                      onClick={() => handleCurrencyChange(currencyCode)}
                    >
                      <span className="currency-symbol">{currencies[currencyCode].symbol}</span>
                      <span className="currency-code">{currencyCode}</span>
                      <span className="currency-name">{currencies[currencyCode].name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className="footer-socials">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
