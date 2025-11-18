import { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import CharacterCard from '../components/CharacterCard';
import { getDefaultBooks, getBookCharacters } from '../services/api';
import '../styles/Home.css';

function BookLibrary({ onBookSelect, onBack }) {
  const [allBooks, setAllBooks] = useState([]);
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

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await getDefaultBooks();
      const booksWithColors = response.books.map(book => ({
        ...book,
        id: book.book_id,
        cover: book.cover_image,
        color: bookColors[book.book_id] || '#8B5CF6'
      }));
      setAllBooks(booksWithColors);
    } catch (error) {
      console.error('Failed to load books:', error);
      // Fallback to static books
      setAllBooks([
        {
          id: 'harry_potter_1',
          book_id: 'harry_potter_1',
          title: 'Harry Potter',
          cover: '/src/assets/books_images/Harry Potter.png',
          color: '#8B5CF6',
          author: 'J.K. Rowling'
        },
        {
          id: 'chronicles_narnia',
          book_id: 'chronicles_narnia',
          title: 'The Chronicles of Narnia',
          cover: '/src/assets/books_images/Narnia.png',
          color: '#F59E0B',
          author: 'C.S. Lewis'
        },
        {
          id: 'the_hobbit',
          book_id: 'the_hobbit',
          title: 'The Hobbit',
          cover: '/src/assets/books_images/The Hobbits.png',
          color: '#10B981',
          author: 'J.R.R. Tolkien'
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
    onBookSelect(selectedBook, selectedBook.document_id, character.character_id);
  };

  const handleBackToBooks = () => {
    setSelectedBook(null);
    setCharacters([]);
  };

  if (loadingBooks) {
    return (
      <div className="home-container library-page">
        <div className="library-header">
          <button className="back-button" onClick={onBack}>
            ← Back to Home
          </button>
          <h1 className="library-title">
            <span className="book-emoji">📚</span>
            Book Library
          </h1>
        </div>
        <div className="home-content">
          <div className="loading-state">Loading books...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container library-page">
      <div className="library-header">
        <button className="back-button" onClick={selectedBook ? handleBackToBooks : onBack}>
          ← {selectedBook ? 'Back to Library' : 'Back to Home'}
        </button>
        <h1 className="library-title">
          <span className="book-emoji">📚</span>
          {selectedBook ? selectedBook.title : 'Book Library'}
        </h1>
        <p className="library-subtitle">
          {selectedBook ? 'Choose a character to chat with' : 'Choose a book and start chatting with characters'}
        </p>
      </div>

      <div className="home-content">
        <div className="books-section">
          {!selectedBook ? (
            <div className="books-grid">
              {allBooks.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book}
                  onClick={() => handleBookClick(book)}
                />
              ))}
            </div>
          ) : loadingCharacters ? (
            <div className="loading-state">Loading characters...</div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default BookLibrary;
