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

  // Base color mapping for known books; others will be assigned deterministically
  const bookColors = {
    'harry_potter': '#8B5CF6',
    'chronicles_narnia': '#F59E0B',
    'the_hobbit': '#10B981',
    'lotr': '#4F46E5',
    'frankenstein': '#6366F1',
    'percy_jackson': '#0EA5E9',
    'dracula': '#DC2626',
    'sherlock_holmes': '#2563EB',
    'dune': '#B45309',
    'diary_wimpy_kid': '#6D28D9',
    'hunger_games': '#EA580C'
  };

  // Local cover images mapping (only those that exist; others fall back gracefully)
  // Add image files under /src/assets/books_images matching these names if available
  const localCovers = {
    'harry_potter': '/src/assets/books_images/Harry Potter.png',
    'chronicles_narnia': '/src/assets/books_images/Narnia.png',
    'the_hobbit': '/src/assets/books_images/The Hobbits.png',
    'lotr': '/src/assets/books_images/LOTR.png',
    'frankenstein': '/src/assets/books_images/Frankenstein.png',
    'percy_jackson': '/src/assets/books_images/Percy Jackson.png',
    'dracula': '/src/assets/books_images/Dracula.png',
    'sherlock_holmes': '/src/assets/books_images/Sherlock Holmes.png',
    'dune': '/src/assets/books_images/Dune.png',
    'diary_wimpy_kid': '/src/assets/books_images/Diary Wimpy Kid.png',
    'hunger_games': '/src/assets/books_images/Hunger Games.png'
  };

  // Deterministic color generator for any future book IDs not in the map
  const palette = ['#8B5CF6','#F59E0B','#10B981','#4F46E5','#6366F1','#0EA5E9','#DC2626','#2563EB','#B45309','#6D28D9','#EA580C'];
  const pickColor = (id) => {
    if (bookColors[id]) return bookColors[id];
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    return palette[hash % palette.length];
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
        cover: localCovers[book.book_id] || book.cover_image || '/src/assets/books_images/placeholder.png',
        color: pickColor(book.book_id)
      }));
      setAllBooks(booksWithColors);
    } catch (error) {
      console.error('Failed to load books:', error);
      // Fallback to static books
      setAllBooks([
        {
          id: 'harry_potter',
          book_id: 'harry_potter',
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
        },
        // Additional defaults (minimal data; update covers if assets added)
        { id: 'lotr', book_id: 'lotr', title: 'The Lord of the Rings', cover: '/src/assets/books_images/LOTR.png', color: pickColor('lotr'), author: 'J.R.R. Tolkien' },
        { id: 'frankenstein', book_id: 'frankenstein', title: 'Frankenstein', cover: '/src/assets/books_images/Frankenstein.png', color: pickColor('frankenstein'), author: 'Mary Shelley' },
        { id: 'percy_jackson', book_id: 'percy_jackson', title: 'Percy Jackson', cover: '/src/assets/books_images/Percy Jackson.png', color: pickColor('percy_jackson'), author: 'Rick Riordan' },
        { id: 'dracula', book_id: 'dracula', title: 'Dracula', cover: '/src/assets/books_images/Dracula.png', color: pickColor('dracula'), author: 'Bram Stoker' },
        { id: 'sherlock_holmes', book_id: 'sherlock_holmes', title: 'Sherlock Holmes', cover: '/src/assets/books_images/Sherlock Holmes.png', color: pickColor('sherlock_holmes'), author: 'Arthur Conan Doyle' },
        { id: 'dune', book_id: 'dune', title: 'Dune', cover: '/src/assets/books_images/Dune.png', color: pickColor('dune'), author: 'Frank Herbert' },
        { id: 'diary_wimpy_kid', book_id: 'diary_wimpy_kid', title: 'Diary of a Wimpy Kid', cover: '/src/assets/books_images/Diary Wimpy Kid.png', color: pickColor('diary_wimpy_kid'), author: 'Jeff Kinney' },
        { id: 'hunger_games', book_id: 'hunger_games', title: 'The Hunger Games', cover: '/src/assets/books_images/Hunger Games.png', color: pickColor('hunger_games'), author: 'Suzanne Collins' }
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
    const documentId = selectedBook.document_id;
    // Default (preloaded) documents go straight to chat with preselected character
    if ((documentId && documentId.startsWith('default_')) || selectedBook.is_default) {
      onBookSelect(selectedBook, documentId, character.character_id);
      return;
    }
    // Uploaded (non-default) documents still follow existing flow (would normally go to extract)
    // If an extract-characters page is added later, redirect there instead.
    onBookSelect(selectedBook, documentId, character.character_id);
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
