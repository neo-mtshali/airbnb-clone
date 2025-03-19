import React from "react";
import "./Home.css";
import SearchBar from "../components/SearchBar";
import heroImage from "../assets/Big Card.jpg";
import inspocard1 from "../assets/Rectangle 1.jpg";
import inspocard2 from "../assets/Rectangle 1-1.jpg";
import inspocard3 from "../assets/Rectangle 1-2.jpg";
import inspocard4 from "../assets/Rectangle 1-3.jpg";
import giftCardImage from "../assets/Gift Cards.jpg";
import hostingImage from "../assets/Host.png";  // Import the hosting section image
import Host from "../components/listing/Host"; // Import the Host component
import experienceTripImage from "../assets/images/experience-trip.jpg"; // Import trip experiences image
import experienceHomeImage from "../assets/images/experience-home.jpg"; // Import home experiences image

// Future Getaways destination data
const destinations = {
  arts: [
    { city: 'Phoenix', region: 'Arizona' },
    { city: 'San Francisco', region: 'California' },
    { city: 'Keswick', region: 'England' },
  ],
  outdoor: [
    { city: 'Hot Springs', region: 'Arkansas' },
    { city: 'Barcelona', region: 'Catalonia' },
    { city: 'London', region: 'England' },
  ],
  popular: [
    { city: 'Los Angeles', region: 'California' },
    { city: 'Prague', region: 'Czechia' },
    { city: 'Scarborough', region: 'England' },
  ],
  unique: [
    { city: 'San Diego', region: 'California' },
    { city: 'Washington', region: 'District of Columbia' },
  ],
};


function Home() {
  return (
    <main className="home">
      {/* HERO SECTION WITH SEARCHBAR */}
      <div className="hero-container">
        <SearchBar />
        <section className="hero">
          <div className="hero__background">
            <img
              src={heroImage}
              alt="Modern House"
            />
          </div>
          <div className="hero__content">
            <h1>Not sure where to go? Perfect.</h1>
            <button className="hero__button"><span>I'm flexible</span></button>
          </div>
        </section>
      </div>

      {/* INSPIRATION SECTION */}
      <section className="inspiration">
        <h2>Inspiration for your next trip</h2>
        <div className="inspiration__cards">
          <div className="inspiration__card">
            <div className="inspiration__card-img">
              <img src={inspocard1} alt="Sandton City Hotel" />
            </div>
            <div className="inspiration__card-text pink">
              <h3>Sandton City Hotel</h3>
              <p>53 km away</p>
            </div>
          </div>
          <div className="inspiration__card">
            <div className="inspiration__card-img">
              <img src={inspocard2} alt="Joburg City Hotel" />
            </div>
            <div className="inspiration__card-text magenta">
              <h3>Joburg City Hotel</h3>
              <p>168 km away</p>
            </div>
          </div>
          <div className="inspiration__card">
            <div className="inspiration__card-img">
              <img src={inspocard3} alt="Woodmead Hotel" />
            </div>
            <div className="inspiration__card-text orange">
              <h3>Woodmead Hotel</h3>
              <p>30 miles away</p>
            </div>
          </div>
          <div className="inspiration__card">
            <div className="inspiration__card-img">
              <img src={inspocard4} alt="Hyde Park Hotel" />
            </div>
            <div className="inspiration__card-text red">
              <h3>Hyde Park Hotel</h3>
              <p>34 km away</p>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCES SECTION */}
      <section className="experiences">
        <h2>Discover Airbnb Experiences</h2>
        <div className="experiences__cards">
          <div 
            className="experiences__card experiences__card-left"
            style={{ 
              background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${experienceTripImage}) center/cover no-repeat` 
            }}
          >
            <h3>Things to do on your trip</h3>
            <button>Experiences</button>
          </div>
          <div 
            className="experiences__card experiences__card-right"
            style={{ 
              background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${experienceHomeImage}) center/cover no-repeat` 
            }}
          >
            <h3>Things to do from home</h3>
            <button>Online Experiences</button>
          </div>
        </div>
      </section>

      {/* GIFT CARDS SECTION */}
      <section className="giftcards">
        <div className="giftcards__text">
          <h2>Shop Airbnb gift cards</h2>
          <button>Learn more</button>
        </div>
        <div className="giftcards__images">
          <img
            src={giftCardImage}
            alt="Gift Card"
          />
        </div>
      </section>


      {/* HOSTING SECTION */}
      <section 
        className="hosting"
        style={{ 
          background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${hostingImage}) center/cover no-repeat` 
        }}
      >
        <div className="hosting__content">
          <h2>Questions about hosting?</h2>
          <button className="hosting__button">Ask a Superhost</button>
        </div>
      </section>

      {/* FUTURE GETAWAYS SECTION */}
      <section className="future-getaways">
        <h2>Inspiration for future getaways</h2>
        
        {/* Navigation Section */}
        <nav className="future-getaways__nav">
          <div className="future-getaways__tabs">
            <button className="active">Destinations for arts & culture</button>
            <button>Destinations for outdoor adventure</button>
            <button>Mountain cabins</button>
            <button>Beach destinations</button>
            <button>Popular destinations</button>
            <button>Unique Stays</button>
          </div>
        </nav>

        {/* Destinations Grid Section */}
        <div className="future-getaways__grid">
          {/* Column 1 - Arts & Culture */}
          <div className="future-getaways__column">
            {destinations.arts.map((dest, index) => (
              <div key={index} className="future-getaways__destination">
                <h3>{dest.city}</h3>
                <p>{dest.region}</p>
              </div>
            ))}
          </div>

          {/* Column 2 - Outdoor Adventure */}
          <div className="future-getaways__column">
            {destinations.outdoor.map((dest, index) => (
              <div key={index} className="future-getaways__destination">
                <h3>{dest.city}</h3>
                <p>{dest.region}</p>
              </div>
            ))}
          </div>

          {/* Column 3 - Popular Destinations */}
          <div className="future-getaways__column">
            {destinations.popular.map((dest, index) => (
              <div key={index} className="future-getaways__destination">
                <h3>{dest.city}</h3>
                <p>{dest.region}</p>
              </div>
            ))}
          </div>

          {/* Column 4 - Unique Stays */}
          <div className="future-getaways__column">
            {destinations.unique.map((dest, index) => (
              <div key={index} className="future-getaways__destination">
                <h3>{dest.city}</h3>
                <p>{dest.region}</p>
              </div>
            ))}
            <button className="future-getaways__show-more">Show more</button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
