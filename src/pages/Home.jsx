import { useState } from 'react';
import Header from '../components/Header';
import UploadSection from '../components/UploadSection';
import BookCard from '../components/BookCard';
import '../styles/Home.css';

function Home({ onBookSelect, onGoToLibrary }) {
  const featuredBooks = [
    {
      id: 'harry-potter',
      title: 'Harry Potter',
      cover: '/src/assets/books_images/Harry Potter.png',
      color: '#8B5CF6'
    },
    {
      id: 'narnia',
      title: 'The Chronicles of Narnia',
      cover: '/src/assets/books_images/Narnia.png',
      color: '#F59E0B'
    },
    {
      id: 'hobbit',
      title: 'The Hobbit',
      cover: '/src/assets/books_images/The Hobbits.png',
      color: '#10B981'
    }
  ];

  return (
    <div className="home-container">
      <Header />
      
      <div className="home-content">
        <UploadSection onBookSelect={onBookSelect} />

        <div className="books-section">
          <div className="section-header">
            <h2 className="section-title">
             
              Featured Books
            </h2>
            <button className="view-all-btn" onClick={onGoToLibrary}>
              View All →
            </button>
          </div>
          
          <div className="books-grid">
            {featuredBooks.map((book) => (
              <BookCard 
                key={book.id} 
                book={book}
                onClick={() => onBookSelect(book, book.id)}
              />
            ))}
          </div>
        </div>
      </div>

     
    </div>
  );
}

export default Home;
