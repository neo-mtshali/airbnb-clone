import React, { useState } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ images }) => {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  return (
    <div className="image-gallery">
      <div className="gallery-grid">
        <div className="main-image">
          <img src={images[0]} alt="Main view" />
        </div>
        <div className="secondary-images">
          {images.slice(1, 5).map((image, index) => (
            <div key={index} className="secondary-image">
              <img src={image} alt={`View ${index + 2}`} />
            </div>
          ))}
        </div>
        <button 
          className="show-all-photos"
          onClick={() => setShowAllPhotos(true)}
        >
          <i className="fas fa-expand"></i> Show all photos
        </button>
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
            {images.map((image, index) => (
              <div key={index} className="photo-item">
                <img src={image} alt={`View ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
