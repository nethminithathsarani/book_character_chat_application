// src/pages/FrontPage.jsx
import React, { useState, useEffect } from 'react';
import '../styles/fontpage.css';

function FrontPage({ onGoToHome }) {
  // Array of 5 images - use the existing `src/assets/font_images` folder
  const images = [
    new URL('../assets/font_images/image1.png', import.meta.url).href,
    new URL('../assets/font_images/image2.png', import.meta.url).href,
    new URL('../assets/font_images/image3.png', import.meta.url).href,
    new URL('../assets/font_images/image4.png', import.meta.url).href,
    new URL('../assets/font_images/image5.png', import.meta.url).href
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleImages = 3; // Show 3 images at a time
  const autoAdvanceInterval = 2000; // 2 seconds timer for moving to next

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoAdvanceInterval);

    return () => clearInterval(interval);
  }, [images.length, autoAdvanceInterval]);

  return (
    <div className="frontpage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Where Stories Come Alive</h1>
          <p className="hero-description">
            Chat with the characters you love. Upload your stories or explore worlds shared by other readers.
          </p>
          <blockquote className="hero-quote">
            "Every story has a voice. Now you can speak back."
          </blockquote>
          <button className="explore-btn" onClick={onGoToHome}>Explore Books</button>
        </div>
      </section>

      {/* Animated Image Map Section - Full-Width Multi-Image Carousel */}
      <section className="image-map-section">
        <div className="carousel-container">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${(currentIndex * 100) / visibleImages}%)`
            }}
          >
            {images.map((image, index) => (
              <div key={index} className="carousel-slide">
                <img src={image} alt={`Map ${index + 1}`} className="map-image" />
              </div>
            ))}
          </div>
          {/* Optional: Indicators for navigation */}
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                className={index === currentIndex ? 'active' : ''}
                onClick={() => setCurrentIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Below Section (Additional Content) */}
      <section className="below-section">
        <h2>Discover Magical Worlds</h2>
        <p>
          Immerse yourself in stories that leap off the page. From enchanted forests to ancient castles, every tale awaits your adventure.
        </p>
      </section>
    </div>
  );
}

export default FrontPage;
