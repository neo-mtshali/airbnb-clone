import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './Reviews.css';

const Reviews = ({ reviews, rating, totalReviews }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);

  const categories = {
    cleanliness: rating,
    communication: rating,
    checkIn: rating,
    accuracy: rating,
    location: rating,
    value: rating
  };

  // Check if reviews is an array, if not, use an empty array
  const reviewsArray = Array.isArray(reviews) ? reviews : [];
  const displayReviews = showAllReviews ? reviewsArray : reviewsArray.slice(0, 6);

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h2>
          <FaStar /> {rating} · {totalReviews} reviews
        </h2>
      </div>

      <div className="rating-categories">
        {Object.entries(categories).map(([category, score]) => (
          <div key={category} className="rating-item">
            <span className="category">
              {category.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </span>
            <div className="rating-bar">
              <div className="rating-fill" style={{ width: `${(score / 5) * 100}%` }} />
            </div>
            <span className="score">{score}</span>
          </div>
        ))}
      </div>

      <div className="reviews-grid">
        {displayReviews.map((review, index) => (
          <div key={index} className="review-card">
            <div className="reviewer-info">
              <img src={review.userImage} alt={review.userName} />
              <div>
                <h4>{review.userName}</h4>
                <p>{review.date}</p>
              </div>
            </div>
            <p className="review-text">{review.text}</p>
          </div>
        ))}
      </div>

      {reviewsArray.length > 6 && (
        <button 
          className="show-all-reviews"
          onClick={() => setShowAllReviews(!showAllReviews)}
        >
          {showAllReviews 
            ? 'Show less reviews' 
            : `Show all ${totalReviews} reviews`}
        </button>
      )}
    </div>
  );
};

export default Reviews;
