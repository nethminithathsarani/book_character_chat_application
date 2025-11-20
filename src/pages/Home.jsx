import { useState, useEffect } from 'react';
import Header from '../components/Header';
import UploadSection from '../components/UploadSection';
import BookCard from '../components/BookCard';
import MovieCard from '../components/MovieCard';
import CharacterCard from '../components/CharacterCard';
import { getDefaultBooks, getBookCharacters, getDefaultMovies, getMovieCharacters } from '../services/api';
import '../styles/Home.css';

function Home({ onBookSelect, onGoToLibrary }) {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // Can be book or movie
  const [characters, setCharacters] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingCharacters, setLoadingCharacters] = useState(false);
  const [activeTab, setActiveTab] = useState('books'); // 'books' or 'movies'

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

  // Movie color and cover mapping
  const movieColors = {
    'the_shawshank_redemption': '#2C5F2D',
    'the_godfather': '#8B0000',
    'inception': '#1E3A8A'
  };

  const movieCovers = {
    'the_shawshank_redemption': '/src/assets/movies_images/shawshank.jpg',
    'the_godfather': '/src/assets/movies_images/godfather.jpg',
    'inception': '/src/assets/movies_images/inception.jpg'
  };

  useEffect(() => {
    loadDefaultBooks();
    loadDefaultMovies();
  }, []);

  const loadDefaultBooks = async () => {
    try {
      const response = await getDefaultBooks();
      // Map API books to existing format with colors and local images
      const booksWithColors = response.books.map(book => ({
        ...book,
        id: book.book_id,
        cover: localCovers[book.book_id] || book.cover_image,
        color: bookColors[book.book_id] || '#8B5CF6',
        type: 'book'
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
          color: '#8B5CF6',
          type: 'book'
        },
        {
          id: 'chronicles_narnia',
          book_id: 'chronicles_narnia',
          title: 'The Chronicles of Narnia',
          cover: '/src/assets/books_images/Narnia.png',
          color: '#F59E0B',
          type: 'book'
        },
        {
          id: 'the_hobbit',
          book_id: 'the_hobbit',
          title: 'The Hobbit',
          cover: '/src/assets/books_images/The Hobbits.png',
          color: '#10B981',
          type: 'book'
        }
      ]);
    } finally {
      setLoadingBooks(false);
    }
  };

  const loadDefaultMovies = async () => {
    try {
      const response = await getDefaultMovies();
      const moviesWithColors = response.movies.map(movie => ({
        ...movie,
        id: movie.movie_id,
        cover: movieCovers[movie.movie_id] || movie.cover_image,
        color: movieColors[movie.movie_id] || '#1E3A8A',
        type: 'movie'
      }));
      setFeaturedMovies(moviesWithColors);
    } catch (error) {
      console.error('Failed to load default movies:', error);
      setFeaturedMovies([]);
    } finally {
      setLoadingMovies(false);
    }
  };

  const handleBookClick = async (item) => {
    setSelectedItem(item);
    setLoadingCharacters(true);
    try {
      const response = item.type === 'movie' 
        ? await getMovieCharacters(item.movie_id || item.id)
        : await getBookCharacters(item.book_id || item.id);
      setCharacters(response.characters);
    } catch (error) {
      console.error('Failed to load characters:', error);
      alert('Failed to load characters. Please try again.');
      setSelectedItem(null);
    } finally {
      setLoadingCharacters(false);
    }
  };

  const handleCharacterClick = (character) => {
    // Pass item and document_id to chat
    onBookSelect(selectedItem, selectedItem.document_id, character.character_id);
  };

  const handleBackToBooks = () => {
    setSelectedItem(null);
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
        {!selectedItem && <UploadSection onBookSelect={onBookSelect} />}

        {!selectedItem ? (
          <>
            <div className="content-tabs">
              <button 
                className={`tab-button ${activeTab === 'books' ? 'active' : ''}`}
                onClick={() => setActiveTab('books')}
              >
                📚 Books
              </button>
              <button 
                className={`tab-button ${activeTab === 'movies' ? 'active' : ''}`}
                onClick={() => setActiveTab('movies')}
              >
                🎬 Movies
              </button>
            </div>

            {activeTab === 'books' ? (
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
                  <h2 className="section-title">
                    <span className="sparkle">🎬</span>
                    Featured Movies
                  </h2>
                </div>
                
                <div className="books-grid">
                  {featuredMovies.map((movie) => (
                    <MovieCard 
                      key={movie.id} 
                      movie={movie}
                      onClick={() => handleBookClick(movie)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="books-section">
            <div className="section-header">
              <button className="back-button" onClick={handleBackToBooks}>
                ← Back to {activeTab === 'books' ? 'Books' : 'Movies'}
              </button>
              <h2 className="section-title" style={{ color: selectedItem.color }}>
                {selectedItem.title}
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
                      bookColor={selectedItem.color}
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
