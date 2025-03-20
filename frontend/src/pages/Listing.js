import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageGallery from '../components/listing/ImageGallery';
import ListingHeader from '../components/listing/ListingHeader';
import ReservationForm from '../components/listing/ReservationForm';
import Amenities from '../components/listing/Amenities';
import DatePicker from '../components/DatePicker';
import Reviews from '../components/listing/Reviews';
import Rules from '../components/listing/Rules';
import Host from '../components/listing/Host';
import Sleep from '../components/listing/Sleep';
import ExploreOptions from '../components/listing/ExploreOptions';
import { accommodationApi } from '../services/api';
import avatarImage from '../assets/Avatar.png';
import superhostBadge from '../assets/Airbnb Superhost Badge.png';
import './Listing.css';
import { useCurrency } from '../context/CurrencyContext';

const Listing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({ checkIn: null, checkOut: null });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await accommodationApi.getAccommodationById(id);
        
        // Transform API data to match our component needs
        const listingData = {
          ...response.data,
          // Extract host properties directly for new component approach
          host_name: response.data.host_name,
          host_picture_url: response.data.host_picture_url,
          host_since: response.data.host_since,
          host_is_superhost: response.data.host_is_superhost,
          number_of_reviews: response.data.number_of_reviews,
          // Keep the legacy host object for backward compatibility
          host: response.data.host || {
            name: response.data.host_name || 'Host',
            image: response.data.host_picture_url || 'https://via.placeholder.com/64',
            joinDate: response.data.host_since || 'January 2023',
            isSuperhost: response.data.host_is_superhost || false
          },
          images: response.data.images && response.data.images.length > 0 
            ? response.data.images 
            : ['https://via.placeholder.com/800x600', 'https://via.placeholder.com/800x600'],
          rating: response.data.rating || 'New',
          reviews: response.data.reviews || 0,
          amenities: response.data.amenities 
            ? response.data.amenities.map(amenity => ({ name: amenity, icon: amenity.toLowerCase().replace(/\s+/g, '') }))
            : [],
          rules: [],
          checkIn: response.data.checkIn || '3:00 PM',
          checkOut: response.data.checkOut || '11:00 AM'
        };
        
        setListing(listingData);
        setError(null);
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Failed to fetch listing details. Please try again later.');
        
        // Fallback to mock data
        setListing({
          id,
          title: 'Charming Pottery',
          location: 'Cape Town, South Africa',
          host: {
            name: 'Megan',
            image: 'https://randomuser.me/api/portraits/women/42.jpg',
            joinDate: 'January 2020',
            isSuperhost: false
          },
          images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
            'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
            'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
            'https://images.unsplash.com/photo-1560185008-a33f5c7b1306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
          ],
          price: 120,
          bedrooms: 1,
          bathrooms: 1,
          maxGuests: 3,
          description: 'Entire rental unit hosted by Megan. Enjoy this beautiful, spacious apartment with modern amenities and stylish decor. Perfect for a comfortable stay in the heart of the city.',
          rating: 4.92,
          reviews: 13,
          amenities: [
            { name: 'WiFi', icon: 'wifi' },
            { name: 'Kitchen', icon: 'kitchen' },
            { name: 'Washer', icon: 'washer' },
            { name: 'Dryer', icon: 'dryer' },
            { name: 'Air conditioning', icon: 'airconditioning' },
            { name: 'Dedicated workspace', icon: 'dedicatedworkspace' },
            { name: 'TV', icon: 'tv' },
            { name: 'Free parking', icon: 'parking' },
            { name: 'Elevator', icon: 'elevator' }
          ],
          rules: [],
          checkIn: '3:00 PM',
          checkOut: '11:00 AM'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading listing details...</div>;
  }
  
  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/search')}>Back to Search</button>
      </div>
    );
  }
  
  if (!listing) {
    return <div className="not-found">Listing not found</div>;
  }

  return (
    <>
      <ListingHeader />
      <div className="listing-container">
        <div className="listing-details-header">
          <h1>{listing.title}</h1>
          <div className="listing-subheader">
            <div className="listing-rating">
              <i className="fas fa-star star-icon"></i>
              <span>{listing.rating || 'New'}</span>
              <span className="dot">·</span>
              <span className="reviews-count">{listing.reviews || 0} reviews</span>
              <span className="dot">·</span>
              <span className="listing-location"><i className="fas fa-map-marker-alt"></i> {listing.location}</span>
            </div>
            <div className="listing-actions">
              <button className="action-button">
                <i className="fas fa-share"></i> Share
              </button>
              <button className="action-button">
                <i className="far fa-heart"></i> Save
              </button>
            </div>
          </div>
        </div>

      <ImageGallery images={listing.images} picture_url={listing.picture_url} />

      <div className="listing-content">
        <div className="listing-main">
          <div className="listing-description-container">
            <div className="listing-description">
              <h2>Entire rental unit hosted by {listing.host_name || (listing.host && listing.host.name) || 'Host'}</h2>
              <div className="property-specs">
                <span>{listing.maxGuests} guests</span>
                <span>{listing.bedrooms} bedroom</span>
                <span>{listing.bedrooms} bed</span>
                <span>{listing.bathrooms} bath</span>
              </div>
            </div>
            <div className="host-avatar">
              <img src={listing.host_picture_url || (listing.host && listing.host.image) || avatarImage} alt={`${listing.host_name || (listing.host && listing.host.name) || 'Host'}`} />
              {(listing.host_is_superhost || (listing.host && listing.host.isSuperhost)) && (
                <div className="superhost-badge-container">
                  <img src={superhostBadge} alt="Superhost" className="superhost-badge" />
                </div>
              )}
            </div>
          </div>

          <div className="divider"></div>

          <div className="listing-quick-details">
            <div className="quick-detail-item">
              <div className="quick-detail-icon">
                <i className="fas fa-home"></i>
              </div>
              <div className="quick-detail-text">
                <h3>Entire home</h3>
                <p>You'll have the apartment to yourself</p>
              </div>
            </div>
            
            <div className="quick-detail-item">
              <div className="quick-detail-icon">
                <i className="fas fa-star"></i>
              </div>
              <div className="quick-detail-text">
                <h3>Enhanced Clean</h3>
                <p>This Host committed to Airbnb's 5-step enhanced cleaning process. <span className="show-more">Show more</span></p>
              </div>
            </div>
            
            <div className="quick-detail-item">
              <div className="quick-detail-icon">
                <i className="fas fa-door-open"></i>
              </div>
              <div className="quick-detail-text">
                <h3>Self check-in</h3>
                <p>Check yourself in with the keypad.</p>
              </div>
            </div>
            
            <div className="quick-detail-item">
              <div className="quick-detail-icon">
                <i className="far fa-calendar-alt"></i>
              </div>
              <div className="quick-detail-text">
                <h3>
                  {dates.checkIn ? 
                    `Free cancellation before ${new Date(dates.checkIn.getTime() - (5 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}` :
                    'Free cancellation before check-in'
                  }
                </h3>
                <p>Cancel before check-in for a partial refund.</p>
              </div>
            </div>
          </div>
          
          <div className="divider"></div>

          <p>{listing.description}</p>

          <div className="divider"></div>
          
          <Sleep 
            bedrooms={listing.bedrooms} 
            beds={[
              listing.bedrooms > 0 ? '1 queen bed' : '',
              listing.bedrooms > 1 ? '1 double bed' : '',
              listing.bedrooms > 2 ? '2 single beds' : '',
            ].filter(Boolean)}
            images={listing.images && listing.images.length > 0 ? 
              [listing.images[0], ...listing.images.slice(1, listing.bedrooms)] : 
              undefined
            }
          />

          <div className="divider"></div>

          <Amenities amenities={listing.amenities} />
          
          <div className="divider"></div>

          <div className="listing-availability-section">
            <h2>Availability</h2>
            <p>Add your travel dates for exact pricing</p>
            <button 
              className="availability-button" 
              onClick={() => setShowDatePicker(true)}
            >
              {dates.checkIn && dates.checkOut 
                ? `${dates.checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${dates.checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` 
                : 'Check availability'}
            </button>
            <DatePicker 
              isOpen={showDatePicker} 
              onClose={() => setShowDatePicker(false)} 
              onDateSelect={(startDate, endDate) => {
                setDates({
                  checkIn: startDate,
                  checkOut: endDate
                });
                setShowDatePicker(false);
              }} 
            />
          </div>

          <div className="divider"></div>

          <Reviews 
            reviews={Array.isArray(listing.reviews) ? listing.reviews : []}
            rating={listing.rating}
            totalReviews={typeof listing.reviews === 'number' ? listing.reviews : 0}
          />

          

          <Host 
            host_picture_url={listing.host_picture_url}
            host_name={listing.host_name}
            host_since={listing.host_since}
            number_of_reviews={listing.number_of_reviews || listing.reviews || 0}
            host_is_superhost={listing.host_is_superhost}
            /* Keep old props for backward compatibility */
            hostImage={listing.host?.image}
            hostName={listing.host?.name}
            joinDate={listing.host?.joinDate}
            reviews={listing.reviews || 0}
            isSuperhost={listing.host?.isSuperhost}
          />

          <div className="divider"></div>

          <Rules 
            rules={listing.rules || []}
            checkIn={listing.checkIn || '3:00 PM'}
            checkOut={listing.checkOut || '11:00 AM'}
          />
        </div>

        <div className="listing-sidebar">
          <ReservationForm 
            price={listing.price}
            rating={listing.rating}
            reviews={listing.reviews || 0}
            maxGuests={listing.maxGuests}
            dates={dates}
            setDates={setDates}
          />
        </div>
      </div>
      

    </div>
    <ExploreOptions country="France" />
    </>
  );
};

export default Listing;
