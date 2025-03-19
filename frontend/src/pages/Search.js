import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchHeader from '../components/SearchHeader';
import './Search.css';
import { accommodationApi } from '../services/api';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchCriteria, setSearchCriteria] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: { adults: 0, children: 0, infants: 0, pets: false }
  });

  useEffect(() => {
    const location = searchParams.get('location') || '';
    const checkIn = searchParams.get('checkIn') || '';
    const checkOut = searchParams.get('checkOut') || '';
    const guests = JSON.parse(searchParams.get('guests') || '{}');

    setSearchCriteria({
      location,
      checkIn,
      checkOut,
      guests
    });
  }, [searchParams]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    price: false,
    typeOfPlace: false,
    freeCancellation: false,
    wifi: false,
    kitchen: false,
    airConditioning: false,
    washer: false,
    iron: false,
    dedicatedWorkspace: false,
    freeParking: false,
    dryer: false
  });
  
  const [likedListings, setLikedListings] = useState({});

  const fetchListings = async (criteria = {}) => {
    try {
      setLoading(true);
      
      // Get all listings first (we'll filter client-side)
      const response = await accommodationApi.getAllAccommodations();
      let filteredListings = response.data;
      
      // Apply client-side filtering for location
      if (criteria.location && criteria.location.trim() !== '') {
        const searchLocation = criteria.location.toLowerCase().trim();
        filteredListings = filteredListings.filter(listing => 
          listing.location && listing.location.toLowerCase().includes(searchLocation)
        );
      }
      
      // Apply other filters here if needed (dates, guests, etc.)
      if (criteria.guests?.adults > 0) {
        const totalGuests = criteria.guests.adults + (criteria.guests.children || 0);
        filteredListings = filteredListings.filter(listing => 
          listing.maxGuests >= totalGuests
        );
      }
      
      setListings(filteredListings);
      setError(null);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to fetch listings. Please try again later.');
      // Fallback to mock data if API fails
      const mockListings = [
        {
          _id: '1',
          title: "New York City Loft",
          location: "New York",
          bedrooms: 2,
          bathrooms: 1,
          maxGuests: 4,
          amenities: ["WiFi", "Kitchen", "Free Parking"],
          price: 250,
          images: ["https://via.placeholder.com/400x300"],
        },
        {
          _id: '2',
          title: "Manhattan Penthouse",
          location: "New York",
          bedrooms: 3,
          bathrooms: 2,
          maxGuests: 6,
          amenities: ["WiFi", "Kitchen", "Free Parking"],
          price: 350,
          images: ["https://via.placeholder.com/400x300"],
        }
      ];
      
      // Filter mock data too if location is provided
      if (criteria.location && criteria.location.trim() !== '') {
        const searchLocation = criteria.location.toLowerCase().trim();
        const filteredMockListings = mockListings.filter(listing => 
          listing.location.toLowerCase().includes(searchLocation)
        );
        setListings(filteredMockListings);
      } else {
        setListings(mockListings);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch listings when search criteria changes
  useEffect(() => {
    fetchListings(searchCriteria);
  }, [searchCriteria]);

  const toggleFilter = (filter) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  return (
    <div className="search-page">
      <SearchHeader />


      <div className="filters-row">
        <button className={`filter-btn ${filters.price ? 'active' : ''}`} onClick={() => toggleFilter('price')}>
          <span>Price</span>
          <i className="fas fa-chevron-down"></i>
        </button>
        <button className={`filter-btn ${filters.typeOfPlace ? 'active' : ''}`} onClick={() => toggleFilter('typeOfPlace')}>
          <span>Type of place</span>
          <i className="fas fa-chevron-down"></i>
        </button>
        <button className={`filter-btn ${filters.freeCancellation ? 'active' : ''}`} onClick={() => toggleFilter('freeCancellation')}>
          Free cancellation
        </button>
        <button className={`filter-btn ${filters.wifi ? 'active' : ''}`} onClick={() => toggleFilter('wifi')}>
          Wifi
        </button>
        <button className={`filter-btn ${filters.kitchen ? 'active' : ''}`} onClick={() => toggleFilter('kitchen')}>
          Kitchen
        </button>
        <button className={`filter-btn ${filters.airConditioning ? 'active' : ''}`} onClick={() => toggleFilter('airConditioning')}>
          Air conditioning
        </button>
        <button className={`filter-btn ${filters.washer ? 'active' : ''}`} onClick={() => toggleFilter('washer')}>
          Washer
        </button>
        <button className={`filter-btn ${filters.iron ? 'active' : ''}`} onClick={() => toggleFilter('iron')}>
          Iron
        </button>
        <button className={`filter-btn ${filters.dedicatedWorkspace ? 'active' : ''}`} onClick={() => toggleFilter('dedicatedWorkspace')}>
          Dedicated workspace
        </button>
        <button className={`filter-btn ${filters.freeParking ? 'active' : ''}`} onClick={() => toggleFilter('freeParking')}>
          Free parking
        </button>
        <button className={`filter-btn ${filters.dryer ? 'active' : ''}`} onClick={() => toggleFilter('dryer')}>
          Dryer
        </button>
        <button className="filters-btn">
          <i className="fas fa-sliders-h"></i>
          <span>Filters</span>
        </button>
      </div>

      <div className="search-results">
        <p className="results-count">
          {listings.length} stay{listings.length !== 1 ? 's' : ''} {searchCriteria.location ? `in ${searchCriteria.location}` : 'anywhere'}
        </p>
        
        {loading && <div className="loading">Loading listings...</div>}
        {error && <div className="error-message">{error}</div>}
        
        <div className="listings-grid">
          {listings.map(listing => (
            <div key={listing._id} className="listing-card" onClick={() => navigate(`/listing/${listing._id}`)}>
              <div className="listing-content">
                <div className="listing-img">
                  <img 
                    src={listing.images && listing.images.length > 0 ? listing.images[0] : 'https://via.placeholder.com/400x300'} 
                    alt={listing.title} 
                  />
                </div>
                <button 
                  className="favorite-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setLikedListings(prev => ({
                      ...prev,
                      [listing._id]: !prev[listing._id]
                    }));
                  }}
                >
                  {likedListings[listing._id] ? (
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" className="heart-icon liked">
                      <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.792 0-3.583.684-4.95 2.05l-2.05 2.05-2.05-2.05c-1.367-1.366-3.158-2.05-4.95-2.05-1.792 0-3.583.684-4.95 2.05-1.367 1.367-2.05 3.158-2.05 4.95 0 7 7 12.267 14 17z"></path>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" className="heart-icon">
                      <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.792 0-3.583.684-4.95 2.05l-2.05 2.05-2.05-2.05c-1.367-1.366-3.158-2.05-4.95-2.05-1.792 0-3.583.684-4.95 2.05-1.367 1.367-2.05 3.158-2.05 4.95 0 7 7 12.267 14 17z"></path>
                    </svg>
                  )}
                </button>
                <div className="listing-info">
                  <div className="listing-title">
                    <h3>{`Entire home in ${listing.location}`}</h3>
                    <h2>{listing.title}</h2>
                  </div>
                  <p className="listing-specs">
                    {`${listing.maxGuests}-${listing.maxGuests+2} guests · Entire Home · ${listing.bedrooms} beds · ${listing.bathrooms} bath`}
                  </p>
                  <p className="listing-amenities">
                    {listing.amenities ? listing.amenities.slice(0, 3).join(' · ') : 'Wifi · Kitchen · Free Parking'}
                  </p>
                  <div className="listing-footer">
                    <div className="rating">
                      <span className="rating-value">5.0</span>
                      <span className="star"><i className="fas fa-star"></i></span>
                      <span className="reviews">(318 reviews)</span>
                    </div>
                    <div className="price">
                      <span className="amount">${listing.price}</span>
                      <span className="per-night">/night</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
