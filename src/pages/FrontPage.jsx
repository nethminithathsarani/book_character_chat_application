// src/pages/FrontPage.jsx
import React, { useState, useEffect } from 'react';
import '../styles/fontpage.css';

function FrontPage({ onGoToHome }) {
  const images = [
    new URL('../assets/font_images/image1.png', import.meta.url).href,
    new URL('../assets/font_images/image2.png', import.meta.url).href,
    new URL('../assets/font_images/image3.png', import.meta.url).href,
    new URL('../assets/font_images/image4.png', import.meta.url).href,
    new URL('../assets/font_images/image5.png', import.meta.url).href,
    new URL('../assets/font_images/image6.png', import.meta.url).href
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);
  const visibleImages = 3;
  const autoAdvanceInterval = 4000;

  const extendedImages = [...images, ...images.slice(0, visibleImages)];

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, autoAdvanceInterval);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentIndex === images.length) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 600);
    }
  }, [currentIndex, images.length]);

  const handleIndicatorClick = (index) => {
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  return (
    <div className={`frontpage ${pageLoaded ? 'loaded' : ''}`}>
      {/* Vintage paper texture overlay */}
      <div className="paper-texture"></div>
      
      {/* Subtle floating elements */}
      <div className="floating-ornaments">
        <div className="ornament ornament-1">📖</div>
        <div className="ornament ornament-2">🖋️</div>
        <div className="ornament ornament-3">📜</div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="decorative-line top-line"></div>
          
          <h1 className="hero-title">
            Where Stories Come Alive
          </h1>
          
          <p className="hero-description">
            Chat with the characters you love. Upload your stories or explore worlds shared by other readers.
          </p>
          
          <blockquote className="hero-quote">
            <span className="quote-mark">"</span>
            Every story has a voice. Now you can speak back.
            <span className="quote-mark closing">"</span>
          </blockquote>
          
          <div className="decorative-line bottom-line"></div>
          
          <button className="explore-btn" onClick={onGoToHome}>
            Explore Books
            <span className="btn-ornament">→</span>
          </button>
        </div>
      </section>

      {/* Image Carousel */}
      <section className="image-map-section">
        <div className="carousel-container">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${currentIndex * 33.333}%)`,
              transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
            }}
          >
            {extendedImages.map((image, index) => (
              <div key={index} className="carousel-slide">
                <div className="image-frame">
                  <img src={image} alt={`Story ${(index % images.length) + 1}`} className="map-image" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === (currentIndex % images.length) ? 'active' : ''}`}
                onClick={() => handleIndicatorClick(index)}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="below-section">
        <div className="section-ornament">✦</div>
        <h2 className="section-title">Discover Magical Worlds</h2>
        <p className="section-text">
          Immerse yourself in stories that leap off the page. From enchanted forests to ancient castles, every tale awaits your adventure.
        </p>
        <div className="section-ornament">✦</div>
      </section>
    </div>
  );
}

export default FrontPage;
