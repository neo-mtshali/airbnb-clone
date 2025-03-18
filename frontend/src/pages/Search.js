import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchHeader from '../components/SearchHeader';
import './Search.css';
import { FaHeart } from 'react-icons/fa';
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

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await accommodationApi.getAllAccommodations();
        setListings(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to fetch listings. Please try again later.');
        // Fallback to mock data if API fails
        setListings([
          {
            _id: '1',
            title: "Bordeaux Getaway",
            location: "Bordeaux",
            bedrooms: 3,
            bathrooms: 2,
            maxGuests: 6,
            amenities: ["WiFi", "Kitchen", "Free Parking"],
            price: 325,
            images: ["https://via.placeholder.com/400x300"],
          },
          {
            _id: '2',
            title: "Charming Waterfront Condo",
            location: "Bordeaux",
            bedrooms: 2,
            bathrooms: 1,
            maxGuests: 4,
            amenities: ["WiFi", "Kitchen", "Free Parking"],
            price: 200,
            images: ["https://via.placeholder.com/400x300"],
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

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
          Price
        </button>
        <button className={`filter-btn ${filters.typeOfPlace ? 'active' : ''}`} onClick={() => toggleFilter('typeOfPlace')}>
          Type of place
        </button>
        <button className={`filter-btn ${filters.freeCancellation ? 'active' : ''}`} onClick={() => toggleFilter('freeCancellation')}>
          Free cancellation
        </button>
        <button className={`filter-btn ${filters.wifi ? 'active' : ''}`} onClick={() => toggleFilter('wifi')}>
          WiFi
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
          <span className="filters-icon">⚙️</span> Filters
        </button>
      </div>

      <div className="search-results">
        <p className="results-count">{listings.length} stays in {searchCriteria.location || 'Bordeaux'}</p>
        
        {loading && <div className="loading">Loading listings...</div>}
        {error && <div className="error-message">{error}</div>}
        
        <div className="listings-grid">
          {listings.map(listing => (
            <div key={listing._id} className="listing-card" onClick={() => navigate(`/listing/${listing._id}`)}>
              <div className="listing-image">
                <img 
                  src={listing.images && listing.images.length > 0 ? listing.images[0] : 'https://via.placeholder.com/400x300'} 
                  alt={listing.title} 
                />
                <button className="favorite-btn"><FaHeart /></button>
              </div>
              <div className="listing-info">
                <div className="listing-title">
                  <h3>{`Entire home in ${listing.location}`}</h3>
                  <h2>{listing.title}</h2>
                </div>
                <p className="listing-specs">
                  {`${listing.maxGuests} guests · ${listing.bedrooms} bedrooms · ${listing.bathrooms} baths`}
                </p>
                <p className="listing-amenities">
                  {listing.amenities && listing.amenities.slice(0, 3).join(' · ')}
                </p>
                <div className="listing-footer">
                  <div className="rating">
                    <span className="star">★</span>
                    <span>New</span>
                    <span className="reviews">(0 reviews)</span>
                  </div>
                  <div className="price">
                    <span className="amount">${listing.price}</span>
                    <span className="per-night">/ night</span>
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
