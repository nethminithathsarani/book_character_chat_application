import { useState, useEffect } from 'react';
import Header from '../components/Header';
import UploadSection from '../components/UploadSection';
import BookCard from '../components/BookCard';
import CharacterCard from '../components/CharacterCard';
import { getDefaultBooks, getBookCharacters } from '../services/api';
import '../styles/Home.css';

function Home({ onBookSelect, onGoToLibrary }) {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingCharacters, setLoadingCharacters] = useState(false);

  // Color mapping for books
  const bookColors = {
    'harry_potter_1': '#8B5CF6',
    'chronicles_narnia': '#F59E0B',
    'the_hobbit': '#10B981'
  };

  // Local cover images mapping
  const localCovers = {
    'harry_potter_1': '/src/assets/books_images/Harry Potter.png',
    'chronicles_narnia': '/src/assets/books_images/Narnia.png',
    'the_hobbit': '/src/assets/books_images/The Hobbits.png'
  };

  useEffect(() => {
    loadDefaultBooks();
  }, []);

  const loadDefaultBooks = async () => {
    try {
      const response = await getDefaultBooks();
      // Map API books to existing format with colors and local images
      const booksWithColors = response.books.map(book => ({
        ...book,
        id: book.book_id,
        cover: localCovers[book.book_id] || book.cover_image,
        color: bookColors[book.book_id] || '#8B5CF6'
      }));
      setFeaturedBooks(booksWithColors);
    } catch (error) {
      console.error('Failed to load default books:', error);
      // Fallback to static books if API fails
      setFeaturedBooks([
        {
          id: 'harry_potter_1',
          book_id: 'harry_potter_1',
          title: 'Harry Potter',
          cover: '/src/assets/books_images/Harry Potter.png',
          color: '#8B5CF6'
        },
        {
          id: 'chronicles_narnia',
          book_id: 'chronicles_narnia',
          title: 'The Chronicles of Narnia',
          cover: '/src/assets/books_images/Narnia.png',
          color: '#F59E0B'
        },
        {
          id: 'the_hobbit',
          book_id: 'the_hobbit',
          title: 'The Hobbit',
          cover: '/src/assets/books_images/The Hobbits.png',
          color: '#10B981'
        }
      ]);
    } finally {
      setLoadingBooks(false);
    }
  };

  const handleBookClick = async (book) => {
    setSelectedBook(book);
    setLoadingCharacters(true);
    try {
      const response = await getBookCharacters(book.book_id);
      setCharacters(response.characters);
    } catch (error) {
      console.error('Failed to load characters:', error);
      alert('Failed to load characters. Please try again.');
      setSelectedBook(null);
    } finally {
      setLoadingCharacters(false);
    }
  };

  const handleCharacterClick = (character) => {
    // Pass book and document_id to chat
    onBookSelect(selectedBook, selectedBook.document_id, character.character_id);
  };

  const handleBackToBooks = () => {
    setSelectedBook(null);
    setCharacters([]);
  };

  if (loadingBooks) {
    return (
      <div className="home-container">
        <Header />
        <div className="home-content">
          <div className="loading-state">Loading featured books...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <Header />
      
      <div className="home-content">
        {!selectedBook && <UploadSection onBookSelect={onBookSelect} />}

        {!selectedBook ? (
          <div className="books-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="sparkle">⭐</span>
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
                  onClick={() => handleBookClick(book)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="books-section">
            <div className="section-header">
              <button className="back-button" onClick={handleBackToBooks}>
                ← Back to Books
              </button>
              <h2 className="section-title" style={{ color: selectedBook.color }}>
                {selectedBook.title}
              </h2>
            </div>

            {loadingCharacters ? (
              <div className="loading-state">Loading characters...</div>
            ) : (
              <>
                <h3 className="select-title">Choose a Character to Chat With</h3>
                <div className="characters-grid">
                  {characters.map((char) => (
                    <CharacterCard 
                      key={char.character_id} 
                      character={char}
                      bookColor={selectedBook.color}
                      onClick={() => handleCharacterClick(char)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="floating-elements">
        <div className="float-star">⭐</div>
        <div className="float-heart">💖</div>
        <div className="float-book">📖</div>
      </div>
    </div>
  );
}

export default Home;
