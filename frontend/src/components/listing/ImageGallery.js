import React, { useState } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ images, picture_url }) => {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  // Function to construct full image URL from backend path
  const getImageUrl = (imagePath) => {
    // If the image path is already an absolute URL, return it as is
    if (imagePath && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
      return imagePath;
    }
    
    // If it's a relative path from the backend, construct the full URL
    if (imagePath && imagePath.startsWith('/uploads/')) {
      // Use the backend URL from environment or default to localhost
      const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      return `${backendUrl}${imagePath}`;
    }
    
    // Return a placeholder if image path is missing or invalid
    return 'https://via.placeholder.com/500x300?text=No+Image+Available';
  };

  // Prepare image array ensuring we have the correct display order
  const prepareImageArray = () => {
    let imageArray = [];
    
    // If picture_url is provided, use it as the first image
    if (picture_url) {
      imageArray.push(picture_url);
    }

    // Add all unique images from the images array
    if (images && Array.isArray(images)) {
      images.forEach(img => {
        // Only add if it's not already in the array (to avoid duplicates if picture_url is also in images)
        if (!imageArray.includes(img)) {
          imageArray.push(img);
        }
      });
    }
    
    return imageArray;
  };

  const allImages = prepareImageArray();

  // Handle empty images array
  if (allImages.length === 0) {
    return (
      <div className="image-gallery">
        <div className="gallery-grid">
          <div className="main-image">
            <img src="https://via.placeholder.com/800x500?text=No+Images+Available" alt="No images available" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="image-gallery">
      <div className="gallery-grid">
        <div className="main-image">
          <img src={getImageUrl(allImages[0])} alt="Main view" />
        </div>
        <div className="secondary-images">
          {allImages.slice(1, 5).map((image, index) => (
            <div key={index} className="secondary-image">
              <img src={getImageUrl(image)} alt={`View ${index + 2}`} />
            </div>
          ))}
        </div>
        {allImages.length > 1 && (
          <button 
            className="show-all-photos"
            onClick={() => setShowAllPhotos(true)}
          >
            <i className="fas fa-expand"></i> Show all photos
          </button>
        )}
      </div>

      {showAllPhotos && (
        <div className="all-photos-modal">
          <button 
            className="close-modal"
            onClick={() => setShowAllPhotos(false)}
          >
            × Close
          </button>
          <div className="photos-grid">
            {allImages.map((image, index) => (
              <div key={index} className="photo-item">
                <img src={getImageUrl(image)} alt={`View ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
