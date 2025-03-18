import React from 'react';
import { Link } from 'react-router-dom';
import './ExploreOptions.css';

const ExploreOptions = ({ country = 'France' }) => {
  // French cities
  const cities = [
    { name: 'Paris', link: '/s/Paris' },
    { name: 'Nice', link: '/s/Nice' },
    { name: 'Lyon', link: '/s/Lyon' },
    { name: 'Marseille', link: '/s/Marseille' },
    { name: 'Lille', link: '/s/Lille' },
    { name: 'Aix-en-Provence', link: '/s/Aix-en-Provence' },
    { name: 'Rouen', link: '/s/Rouen' },
    { name: 'Amiens', link: '/s/Amiens' },
    { name: 'Toulouse', link: '/s/Toulouse' },
    { name: 'Montpellier', link: '/s/Montpellier' },
    { name: 'Dijon', link: '/s/Dijon' },
    { name: 'Grenoble', link: '/s/Grenoble' }
  ];

  // Unique stays
  const uniqueStays = [
    { name: 'Beach House Rentals', link: '/s/homes?property_type=Beach%20House' },
    { name: 'Camper Rentals', link: '/s/homes?property_type=Camper' },
    { name: 'Glamping Rentals', link: '/s/homes?property_type=Glamping' },
    { name: 'Treehouse Rentals', link: '/s/homes?property_type=Treehouse' },
    { name: 'Cabin Rentals', link: '/s/homes?property_type=Cabin' },
    { name: 'Tiny House Rentals', link: '/s/homes?property_type=Tiny%20House' },
    { name: 'Lakehouse Rentals', link: '/s/homes?property_type=Lakehouse' },
    { name: 'Mountain Chalet Rentals', link: '/s/homes?property_type=Mountain%20Chalet' }
  ];

  // Breadcrumb links
  const breadcrumbs = [
    { name: 'Airbnb', link: '/' },
    { name: 'Europe', link: '/s/Europe' },
    { name: 'France', link: '/s/France' },
    { name: 'Bordeaux', link: '/s/Bordeaux' }
  ];

  return (
    <div className="explore-options-section">
      <div className="explore-options-container">
        <h2>Explore other options in {country}</h2>
        
        <div className="options-grid">
          {cities.map((city, index) => (
            <div key={index} className="option-item">
              <Link to={city.link}>{city.name}</Link>
            </div>
          ))}
        </div>

        <h2>Unique stays on Airbnb</h2>
        
        <div className="options-grid">
          {uniqueStays.map((stay, index) => (
            <div key={index} className="option-item">
              <Link to={stay.link}>{stay.name}</Link>
            </div>
          ))}
        </div>

        <div className="breadcrumbs">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <Link to={crumb.link}>{crumb.name}</Link>
              {index < breadcrumbs.length - 1 && <span className="breadcrumb-separator">›</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreOptions;
