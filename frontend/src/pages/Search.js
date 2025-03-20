import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchHeader from '../components/SearchHeader';
import './Search.css';
import { accommodationApi } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 20;
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

  const fetchListings = async (criteria = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching listings with criteria:', criteria);
      
      // Build search parameters for the optimized backend endpoint
      const params = {};
      
      // Add location search parameter
      if (criteria.location && criteria.location.trim() !== '') {
        params.location = criteria.location.trim();
      }
      
      // Add guest count if available
      if (criteria.guests?.adults > 0) {
        params.guests = criteria.guests.adults + (criteria.guests.children || 0);
      }
      
      // Add dates if available
      if (criteria.checkIn) params.checkIn = criteria.checkIn;
      if (criteria.checkOut) params.checkOut = criteria.checkOut;
      
      // Add pagination parameters
      params.page = page;
      params.limit = ITEMS_PER_PAGE; // Show 20 items per page
      
      // Add amenity filters
      const selectedAmenities = [];
      if (filters.wifi) selectedAmenities.push('wifi', 'wi-fi');
      if (filters.kitchen) selectedAmenities.push('kitchen');
      if (filters.freeParking) selectedAmenities.push('free parking');
      if (filters.airConditioning) selectedAmenities.push('air conditioning', 'air-conditioning', 'ac');
      if (filters.washer) selectedAmenities.push('washer');
      if (filters.iron) selectedAmenities.push('iron');
      if (filters.dedicatedWorkspace) selectedAmenities.push('workspace', 'desk');
      if (filters.dryer) selectedAmenities.push('dryer');
      
      // Add amenities to params if any are selected
      if (selectedAmenities.length > 0) {
        params.amenities = selectedAmenities.join(',');
      }
      
      // Make the API call using the optimized search endpoint
      let response;
      if (Object.keys(params).length > 0) {
        console.log('Using optimized search endpoint with params:', params);
        response = await accommodationApi.searchAccommodations(params);
      } else {
        // Get all listings if no specific search criteria
        response = await accommodationApi.getAllAccommodations();
      }
      
      console.log('API response:', response);
      
      // Handle the response format from our new optimized endpoint
      let listings;
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Using the new optimized endpoint which returns { data, pagination }
        listings = response.data.data;
        
        // Extract pagination information
        if (response.data.pagination) {
          // Backend returns 'pages' for total pages
          setTotalPages(response.data.pagination.pages || 1);
          console.log('Pagination info:', response.data.pagination);
        } else {
          // If no pagination info, calculate based on total count and limit
          const totalItems = response.data.total || listings.length;
          setTotalPages(Math.ceil(totalItems / ITEMS_PER_PAGE));
        }
      } else if (response.data && Array.isArray(response.data)) {
        // Fallback to the old format for backward compatibility
        listings = response.data;
        // For old format, estimate pagination
        setTotalPages(Math.ceil(listings.length / ITEMS_PER_PAGE));
      } else {
        throw new Error('Invalid response format from API');
      }
      
      console.log('Fetched listings:', listings);
      setListings(listings);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to fetch listings. Please try again later.');
      // Fallback to empty array instead of mock data for better clarity
      setListings([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch listings when search criteria or page changes
  useEffect(() => {
    fetchListings(searchCriteria, currentPage);
  }, [searchCriteria, currentPage]);
  
  // Reset to page 1 when search criteria or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchCriteria.location, searchCriteria.checkIn, searchCriteria.checkOut, JSON.stringify(searchCriteria.guests), JSON.stringify(filters)]);

  const toggleFilter = (filter) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
    
    // When filters change, we need to fetch listings again
    fetchListings(searchCriteria, 1);
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
          {listings.length === 0 && !loading && (
            <div className="no-results">
              <h3>No listings found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          )}
          {listings.map(listing => (
            <div key={listing._id} className="listing-card" onClick={() => navigate(`/listing/${listing._id}`)}>
              <div className="listing-content">
                <div className="listing-img">
                  <img 
                    src={listing.picture_url ? 
                      (listing.picture_url.startsWith('http') ? listing.picture_url : `http://localhost:5001${listing.picture_url}`) 
                      : (listing.images && listing.images.length > 0 ? 
                        (listing.images[0].startsWith('http') ? listing.images[0] : `http://localhost:5001${listing.images[0]}`) 
                        : 'https://via.placeholder.com/400x300')} 
                    alt={listing.name} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300';
                    }}
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
                    <h3>{`${listing.room_type || 'Entire home'} in ${listing.host_location}`}</h3>
                    <h2>{listing.name}</h2>
                  </div>
                  <p className="listing-specs">
                    {`${listing.accommodates} guests · ${listing.bedrooms} bedrooms · ${listing.bathrooms_text}`}
                  </p>
                  <p className="listing-amenities">
                    {listing.amenities ? listing.amenities.slice(0, 3).join(' · ') : 'Wifi · Kitchen · Free Parking'}
                  </p>
                  <div className="listing-footer">
                    <div className="rating">
                      <span className="rating-value">{listing.review_scores_rating ? listing.review_scores_rating.toFixed(1) : '0.0'}</span>
                      <span className="star"><i className="fas fa-star"></i></span>
                      <span className="reviews">({listing.number_of_reviews || 0} review{listing.number_of_reviews !== 1 ? 's' : ''})</span>
                    </div>
                    <div className="price">
                      <span className="amount">{formatPrice(typeof listing.price === 'string' ? parseFloat(listing.price.replace(/[^0-9.]/g, '')) : listing.price)}</span><span className="per-night">/night</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination Controls */}
        {!loading && listings.length > 0 && (
          <div className="pagination-controls">
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(pageNum => {
                  // Show first page, last page, current page and 1 page before/after current
                  return pageNum === 1 || 
                         pageNum === totalPages || 
                         (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                })
                .map((pageNum, index, array) => {
                  // Add ellipsis between non-consecutive page numbers
                  const showEllipsisBefore = index > 0 && array[index - 1] !== pageNum - 1;
                  return (
                    <React.Fragment key={pageNum}>
                      {showEllipsisBefore && <span className="page-ellipsis">...</span>}
                      <button 
                        className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </React.Fragment>
                  );
                })
              }
            </div>
            <div className="page-navigation">
              <button 
                className="prev-page" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i> Previous
              </button>
              <button 
                className="next-page" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
