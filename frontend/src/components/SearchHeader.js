import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './SearchHeader.css';
import SearchTabs from './SearchTabs';
import airbnbLogo from '../assets/airbnb-logo.svg';

const SearchHeader = () => {
  const [searchParams] = useSearchParams();
  
  const searchInfo = {
    location: searchParams.get('location'),
    checkIn: searchParams.get('checkIn'),
    checkOut: searchParams.get('checkOut'),
    guests: JSON.parse(searchParams.get('guests') || '{}')
  };
  return (
    <header className="search-header">
      <div className="search-header__left">
        <Link to="/" className="search-header__logo">
          <img src={airbnbLogo} alt="Airbnb" className="airbnb-logo-2" />
        </Link>
      </div>

      <SearchTabs searchInfo={searchInfo} />

      <div className="search-header__right">
        <button className="header-btn">Become a Host</button>
        <button className="header-btn">
          <i className="fas fa-globe"></i>
        </button>
        <div className="user-menu">
          <button className="user-menu-btn">
            <i className="fas fa-bars"></i>
            <i className="fas fa-user-circle"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;
