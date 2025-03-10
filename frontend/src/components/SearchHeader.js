import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './SearchHeader.css';
import { FaAirbnb, FaGlobe, FaBars, FaUserCircle } from 'react-icons/fa';
import SearchTabs from './SearchTabs';

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
          <FaAirbnb className="airbnb-logo" />
          <span className="logo-text">airbnb</span>
        </Link>
      </div>

      <SearchTabs searchInfo={searchInfo} />

      <div className="search-header__right">
        <button className="header-btn">Become a Host</button>
        <button className="header-btn">
          <FaGlobe />
        </button>
        <div className="user-menu">
          <button className="user-menu-btn">
            <FaBars />
            <FaUserCircle />
          </button>
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;
