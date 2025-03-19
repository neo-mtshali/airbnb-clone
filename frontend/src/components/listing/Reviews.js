import React, { useState } from 'react';
import './Reviews.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Reviews = ({ reviews: providedReviews, rating = 5.0, totalReviews = 7 }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});

  // Define mock data if no reviews provided to match the image
  const mockReviews = [
    {
      id: 1,
      userName: 'Jose',
      date: 'December 2021',
      userImage: 'https://randomuser.me/api/portraits/men/43.jpg',
      text: 'Host was very attentive.'
    },
    {
      id: 2,
      userName: 'Luke',
      date: 'December 2021',
      userImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      text: 'Nice place to stay!'
    },
    {
      id: 3,
      userName: 'Shayna',
      date: 'December 2021',
      userImage: 'https://randomuser.me/api/portraits/women/63.jpg',
      text: 'Wonderful neighborhood, easy access to restaurants and the subway, cozy studio apartment with a super comfortable bed. Great host, super helpful and responsive. Cool murphy bed...'
    },
    {
      id: 4,
      userName: 'Josh',
      date: 'November 2021',
      userImage: 'https://randomuser.me/api/portraits/men/45.jpg',
      text: 'Well designed and fun space, neighborhood has lots of energy and amenities.'
    },
    {
      id: 5,
      userName: 'Vladko',
      date: 'November 2020',
      userImage: 'https://randomuser.me/api/portraits/men/22.jpg',
      text: 'This is amazing place. It has everything one needs for a monthly business stay. Very clean and organized place. Amazing hospitality affordable price.'
    },
    {
      id: 6,
      userName: 'Jennifer',
      date: 'January 2022',
      userImage: 'https://randomuser.me/api/portraits/women/65.jpg',
      text: 'A centric place, near of a sub station and a supermarket with everything you need.\n...'
    }
  ];

  // Define categories with specific scores based on the image
  const categories = {
    cleanliness: 5.0,
    communication: 5.0,
    'check-in': 5.0,
    accuracy: 5.0,
    location: 4.9,
    value: 4.7
  };

  // Use provided reviews or mock data
  const reviews = providedReviews && providedReviews.length > 0 ? providedReviews : mockReviews;
  const displayReviews = showAllReviews ? reviews : reviews.slice(0, 6);
  
  // Toggle show more for individual reviews
  const toggleShowMore = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h2>
          <FontAwesomeIcon icon={faStar} className="star-icon" /> {rating} · {totalReviews} reviews
        </h2>
      </div>

      <div className="rating-categories">
        {Object.entries(categories).map(([category, score]) => (
          <div key={category} className="rating-item">
            <span className="category">
              {category}
            </span>
            <div className="rating-bar">
              <div className="rating-fill" style={{ width: `${(score / 5) * 100}%` }} />
            </div>
            <span className="score">{score.toFixed(1)}</span>
          </div>
        ))}
      </div>

      <div className="reviews-grid">
        {displayReviews.map((review) => {
          const isLongText = review.text.length > 100;
          const isExpanded = expandedReviews[review.id];
          const shouldTruncate = isLongText && !isExpanded;
          
          return (
            <div key={review.id} className="review-card">
              <div className="reviewer-info">
                <img src={review.userImage} alt={review.userName} />
                <div>
                  <h4>{review.userName}</h4>
                  <p>{review.date}</p>
                </div>
              </div>
              <div className="review-content">
                <p className={`review-text ${shouldTruncate ? 'truncated' : ''}`}>
                  {review.text}
                </p>
                {isLongText && (
                  <button 
                    className="show-more-button" 
                    onClick={() => toggleShowMore(review.id)}
                  >
                    Show {isExpanded ? 'less' : 'more'} <span className="show-more-arrow">{isExpanded ? '↑' : '↓'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="show-all-container">
        <button 
          className="show-all-reviews"
          onClick={() => setShowAllReviews(!showAllReviews)}
        >
          {showAllReviews 
            ? 'Show less' 
            : `Show all 12 reviews`}
        </button>
      </div>
    </div>
  );
};

export default Reviews;
