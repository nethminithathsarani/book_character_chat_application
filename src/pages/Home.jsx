import { useState, useEffect } from 'react';
import Header from '../components/Header';
import UploadSection from '../components/UploadSection';
import BookCard from '../components/BookCard';
import MovieCard from '../components/MovieCard';
import CharacterCard from '../components/CharacterCard';
import { getDefaultBooks, getBookCharacters, getDefaultMovies, getMovieCharacters } from '../services/api';
import '../styles/Home.css';

function Home({ onBookSelect, onGoToLibrary, onGoToAllBooks }) {
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
    'the_hobbit': '#10B981',
    'lord_of_the_rings': '#4F46E5',
    'frankenstein': '#6366F1',
    'percy_jackson': '#0EA5E9',
    'dracula': '#DC2626',
    'sherlock_holmes': '#2563EB',
    'dune': '#B45309',
    'wimpy_kid': '#6D28D9',
    'hunger_games': '#EA580C'
  };

  // Local cover images mapping
  const localCovers = {
    'harry_potter_1': '/books_images/Harry Potter.png',
    'chronicles_narnia': '/books_images/Narnia.png',
    'the_hobbit': '/books_images/The Hobbits.png',
    'lord_of_the_rings': '/books_images/LOTR.png',
    'frankenstein': '/books_images/Frankenstein.png',
    'percy_jackson': '/books_images/Percy Jackson.png',
    'dracula': '/books_images/Dracula.jpg',
    'sherlock_holmes': '/books_images/Sherlock Holmes.png',
    'dune': '/books_images/Dune.png',
    'wimpy_kid': '/books_images/Diary of a Wimpy Kid.png',
    'hunger_games': '/books_images/Hunger Games.png'
  };

  // Movie color and cover mapping
  const movieColors = {
    'the_godfather': '#8B0000',
    'inception': '#1E3A8A',
    'scooby_doo': '#3B82F6',
    'scooby_doo_1': '#3B82F6',
    'pirates_of_the_caribbean': '#92400E',
    'pirates_caribbean_1': '#92400E',
    'charlie_and_the_chocolate_factory': '#7C2D12'
  };

  const movieCovers = {
    'the_godfather': '/MovieCovers/The_Godfather.png',
    'inception': '/MovieCovers/Inception.png',
    'scooby_doo': '/MovieCovers/Scooby_Doo.png',
    'scooby_doo_1': '/MovieCovers/Scooby_Doo.png',
    'pirates_of_the_caribbean': '/MovieCovers/Pirates_of_the_Carribean.png',
    'pirates_caribbean_1': '/MovieCovers/Pirates_of_the_Carribean.png',
    'charlie_and_the_chocolate_factory': '/MovieCovers/Charlie_and_the_Chocolate__Factory.png'
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
        document_id: book.document_id, // Preserve document_id from API
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
          document_id: 'default_hp1_doc_001',
          title: 'Harry Potter',
          cover: '/books_images/Harry Potter.png',
          color: '#8B5CF6',
          type: 'book'
        },
        {
          id: 'chronicles_narnia',
          book_id: 'chronicles_narnia',
          document_id: 'default_narnia_doc_002',
          title: 'The Chronicles of Narnia',
          cover: '/books_images/Narnia.png',
          color: '#F59E0B',
          type: 'book'
        },
        {
          id: 'the_hobbit',
          book_id: 'the_hobbit',
          document_id: 'default_hobbit_doc_003',
          title: 'The Hobbit',
          cover: '/books_images/The Hobbits.png',
          color: '#10B981',
          type: 'book'
        },
        {
          id: 'lord_of_the_rings',
          book_id: 'lord_of_the_rings',
          document_id: 'default_lotr_doc_004',
          title: 'The Lord of the Rings',
          cover: '/books_images/LOTR.png',
          color: '#4F46E5',
          type: 'book'
        },
        {
          id: 'frankenstein',
          book_id: 'frankenstein',
          document_id: 'default_frankenstein_doc_005',
          title: 'Frankenstein',
          cover: '/books_images/Frankenstein.png',
          color: '#6366F1',
          type: 'book'
        },
        {
          id: 'percy_jackson',
          book_id: 'percy_jackson',
          document_id: 'default_percy_jackson_doc_006',
          title: 'Percy Jackson',
          cover: '/books_images/Percy Jackson.png',
          color: '#0EA5E9',
          type: 'book'
        },
        {
          id: 'dracula',
          book_id: 'dracula',
          document_id: 'default_dracula_doc_007',
          title: 'Dracula',
          cover: '/books_images/Dracula.jpg',
          color: '#DC2626',
          type: 'book'
        },
        {
          id: 'sherlock_holmes',
          book_id: 'sherlock_holmes',
          document_id: 'default_sherlock_doc_008',
          title: 'Sherlock Holmes',
          cover: '/books_images/Sherlock Holmes.png',
          color: '#2563EB',
          type: 'book'
        },
        {
          id: 'dune',
          book_id: 'dune',
          document_id: 'default_dune_doc_009',
          title: 'Dune',
          cover: '/books_images/Dune.png',
          color: '#B45309',
          type: 'book'
        },
        {
          id: 'wimpy_kid',
          book_id: 'wimpy_kid',
          document_id: 'default_wimpy_kid_doc_010',
          title: 'Diary of a Wimpy Kid',
          cover: '/books_images/Diary of a Wimpy Kid.png',
          color: '#6D28D9',
          type: 'book'
        },
        {
          id: 'hunger_games',
          book_id: 'hunger_games',
          document_id: 'default_hunger_games_doc_011',
          title: 'The Hunger Games',
          cover: '/books_images/Hunger Games.png',
          color: '#EA580C',
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
      console.log('🎬 API Response:', response);
      const moviesWithColors = response.movies.map(movie => {
        console.log('🎥 Processing movie:', {
          movie_id: movie.movie_id,
          title: movie.title,
          hasCoverInMapping: !!movieCovers[movie.movie_id],
          coverFromMapping: movieCovers[movie.movie_id],
          coverFromAPI: movie.cover_image
        });
        return {
          ...movie,
          id: movie.movie_id,
          document_id: movie.document_id, // Preserve document_id from API
          cover: movieCovers[movie.movie_id] || movie.cover_image,
          color: movieColors[movie.movie_id] || '#1E3A8A',
          type: 'movie'
        };
      });
      console.log('🎬 Final movies array:', moviesWithColors);
      setFeaturedMovies(moviesWithColors);
    } catch (error) {
      console.error('Failed to load default movies:', error);
      // Fallback to static movies if API fails
      setFeaturedMovies([
        {
          id: 'the_godfather',
          movie_id: 'the_godfather',
          document_id: 'default_godfather_doc_001',
          title: 'The Godfather',
          cover: '/MovieCovers/The_Godfather.png',
          color: '#8B0000',
          type: 'movie'
        },
        {
          id: 'inception',
          movie_id: 'inception',
          document_id: 'default_inception_doc_002',
          title: 'Inception',
          cover: '/MovieCovers/Inception.png',
          color: '#1E3A8A',
          type: 'movie'
        },
        {
          id: 'scooby_doo',
          movie_id: 'scooby_doo',
          document_id: 'default_scooby_doc_003',
          title: 'Scooby Doo',
          cover: '/MovieCovers/Scooby_Doo.png',
          color: '#3B82F6',
          type: 'movie'
        },
        {
          id: 'pirates_of_the_caribbean',
          movie_id: 'pirates_of_the_caribbean',
          document_id: 'default_pirates_doc_004',
          title: 'Pirates of the Caribbean',
          cover: '/MovieCovers/Pirates_of_the_Carribean.png',
          color: '#92400E',
          type: 'movie'
        },
        {
          id: 'charlie_and_the_chocolate_factory',
          movie_id: 'charlie_and_the_chocolate_factory',
          document_id: 'default_charlie_doc_005',
          title: 'Charlie and the Chocolate Factory',
          cover: '/MovieCovers/Charlie_and_the_Chocolate__Factory.png',
          color: '#7C2D12',
          type: 'movie'
        }
      ]);
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
      // Filter out unwanted characters
      const filteredCharacters = response.characters.filter(
        char => !char.name.includes('Company of Dwarves') && 
               !char.name.includes('Meriadoc Brandybuck') && 
               !char.name.includes('Peregrin Took') &&
               !char.name.includes('Frank & Susan Heffley')
      );
      setCharacters(filteredCharacters);
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
              <button 
                className="tab-button library-button"
                onClick={onGoToLibrary}
              >
                📖 My Library
              </button>
            </div>

            {activeTab === 'books' ? (
              <div className="books-section">
                <div className="section-header">
                  <h2 className="section-title">
                    <span className="sparkle">⭐</span>
                    Featured Books
                  </h2>
                  <button className="view-all-btn" onClick={onGoToAllBooks}>
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
