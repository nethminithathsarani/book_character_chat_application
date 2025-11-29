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

  // Local cover images mapping (only those that exist; others fall back gracefully)
  // Images are served from public/books_images folder
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
        document_id: book.document_id, // Preserve document_id from API
        cover: localCovers[book.book_id] || book.cover_image || '/books_images/placeholder.png',
        color: pickColor(book.book_id)
      }));
      setAllBooks(booksWithColors);
    } catch (error) {
      console.error('Failed to load books:', error);
      // Fallback to static books
      setAllBooks([
        {
          id: 'harry_potter_1',
          book_id: 'harry_potter_1',
          document_id: 'default_hp1_doc_001',
          title: 'Harry Potter',
          cover: '/books_images/Harry Potter.png',
          color: '#8B5CF6',
          author: 'J.K. Rowling'
        },
        {
          id: 'chronicles_narnia',
          book_id: 'chronicles_narnia',
          document_id: 'default_narnia_doc_002',
          title: 'The Chronicles of Narnia',
          cover: '/books_images/Narnia.png',
          color: '#F59E0B',
          author: 'C.S. Lewis'
        },
        {
          id: 'the_hobbit',
          book_id: 'the_hobbit',
          document_id: 'default_hobbit_doc_003',
          title: 'The Hobbit',
          cover: '/books_images/The Hobbits.png',
          color: '#10B981',
          author: 'J.R.R. Tolkien'
        },
        // Additional defaults (minimal data; update covers if assets added)
        { id: 'lord_of_the_rings', book_id: 'lord_of_the_rings', document_id: 'default_lotr_doc_004', title: 'The Lord of the Rings', cover: '/books_images/LOTR.png', color: pickColor('lord_of_the_rings'), author: 'J.R.R. Tolkien' },
        { id: 'frankenstein', book_id: 'frankenstein', document_id: 'default_frankenstein_doc_005', title: 'Frankenstein', cover: '/books_images/Frankenstein.png', color: pickColor('frankenstein'), author: 'Mary Shelley' },
        { id: 'percy_jackson', book_id: 'percy_jackson', document_id: 'default_percy_jackson_doc_006', title: 'Percy Jackson', cover: '/books_images/Percy Jackson.png', color: pickColor('percy_jackson'), author: 'Rick Riordan' },
        { id: 'dracula', book_id: 'dracula', document_id: 'default_dracula_doc_007', title: 'Dracula', cover: '/books_images/Dracula.jpg', color: pickColor('dracula'), author: 'Bram Stoker' },
        { id: 'sherlock_holmes', book_id: 'sherlock_holmes', document_id: 'default_sherlock_doc_008', title: 'Sherlock Holmes', cover: '/books_images/Sherlock Holmes.png', color: pickColor('sherlock_holmes'), author: 'Arthur Conan Doyle' },
        { id: 'dune', book_id: 'dune', document_id: 'default_dune_doc_009', title: 'Dune', cover: '/books_images/Dune.png', color: pickColor('dune'), author: 'Frank Herbert' },
        { id: 'wimpy_kid', book_id: 'wimpy_kid', document_id: 'default_wimpy_kid_doc_010', title: 'Diary of a Wimpy Kid', cover: '/books_images/Diary of a Wimpy Kid.png', color: pickColor('wimpy_kid'), author: 'Jeff Kinney' },
        { id: 'hunger_games', book_id: 'hunger_games', document_id: 'default_hunger_games_doc_011', title: 'The Hunger Games', cover: '/books_images/Hunger Games.png', color: pickColor('hunger_games'), author: 'Suzanne Collins' }
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
