import { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import CharacterCard from '../components/CharacterCard';
import { getDefaultBooks, getBookCharacters, getLibraryBooks, getLibraryBookCharacters, removeFromLibrary, toggleFavorite, checkBookCharacters } from '../services/api';
import defaultBookImage from '../assets/default_book.png';
import '../styles/Home.css';

function BookLibrary({ onBookSelect, onBack, showOnlyLibrary = true }) {
  const [allBooks, setAllBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingCharacters, setLoadingCharacters] = useState(false);

  // Base color mapping for known books; others will be assigned deterministically
  const bookColors = {
    'harry_potter_1': '#402e04ff',
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
  const palette = ['#5c390bff','#F59E0B','#10B981','#4F46E5','#6366F1','#0EA5E9','#DC2626','#2563EB','#B45309','#6D28D9','#EA580C'];
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
      if (showOnlyLibrary) {
        // Fetch only user's library books (uploaded books)
        const libraryBooksResponse = await getLibraryBooks();

        // Process library books (user-uploaded)
        const libraryBooks = libraryBooksResponse.books?.map(book => ({
          ...book,
          id: book.book_id || book.id,
          document_id: book.document_id,
          cover: book.cover_image || defaultBookImage,
          color: '#3E2723',
          isLibrary: true,
          isFavorite: book.is_favorite || false
        })) || [];

        setAllBooks(libraryBooks);
      } else {
        // Fetch both default books and user's library books
        const [defaultBooksResponse, libraryBooksResponse] = await Promise.all([
          getDefaultBooks(),
          getLibraryBooks()
        ]);

        // Process default books
        const defaultBooks = defaultBooksResponse.books.map(book => ({
          ...book,
          id: book.book_id,
          document_id: book.document_id,
          cover: localCovers[book.book_id] || book.cover_image || '/books_images/placeholder.png',
          color: '#3E2723',
          isDefault: true
        }));

        // Process library books (user-uploaded)
        const libraryBooks = libraryBooksResponse.books?.map(book => ({
          ...book,
          id: book.book_id || book.id,
          document_id: book.document_id,
          cover: book.cover_image || defaultBookImage,
          color: '#3E2723',
          isLibrary: true,
          isFavorite: book.is_favorite || false
        })) || [];

        // Combine: library books first, then default books
        const allBooks = [...libraryBooks, ...defaultBooks];
        setAllBooks(allBooks);
      }
    } catch (error) {
      console.error('Failed to load books:', error);
      // Show empty library on error
      setAllBooks([]);
    } finally {
      setLoadingBooks(false);
    }
  };

  const handleBookClick = async (book) => {
    setSelectedBook(book);
    setLoadingCharacters(true);
    try {
      // Determine the correct book identifier for the unified API
      // Priority: 
      // 1. For library books: library_{book_id}
      // 2. For uploaded books with document_id: document_id directly
      // 3. For default books: book_id
      let bookIdentifier;
      if (book.isLibrary) {
        bookIdentifier = `library_${book.book_id || book.id}`;
      } else if (book.document_id && !book.isDefault) {
        // Uploaded book - use document_id directly
        bookIdentifier = book.document_id;
      } else {
        // Default book - use book_id
        bookIdentifier = book.book_id;
      }

      console.log('📚 Checking characters for book:', book.title);
      console.log('🔑 Book identifier:', bookIdentifier);
      console.log('📋 Book type:', book.isLibrary ? 'Library' : book.isDefault ? 'Default' : 'Uploaded');

      // Check if characters are already extracted using unified API
      const { exists, data } = await checkBookCharacters(bookIdentifier);
      
      if (exists) {
        // Characters already extracted - show them
        console.log('✅ Characters already extracted:', data.characters.length);
        // Filter out unwanted characters
        const filteredCharacters = data.characters.filter(
          char => !char.name.includes('Company of Dwarves') && 
                 !char.name.includes('Meriadoc Brandybuck') && 
                 !char.name.includes('Peregrin Took') &&
                 !char.name.includes('Frank & Susan Heffley')
        );
        setCharacters(filteredCharacters);
      } else {
        // Characters not extracted yet - trigger extraction
        console.log('❌ Characters not extracted yet - need to extract');
        
        // For library books, try to extract characters
        if (book.isLibrary) {
          console.log('🔄 Attempting to extract characters for library book...');
          try {
            const response = await getLibraryBookCharacters(book.book_id || book.id);
            // Filter out unwanted characters
            const filteredCharacters = response.characters.filter(
              char => !char.name.includes('Company of Dwarves') && 
                     !char.name.includes('Meriadoc Brandybuck') && 
                     !char.name.includes('Peregrin Took') &&
                     !char.name.includes('Frank & Susan Heffley')
            );
            setCharacters(filteredCharacters);
            console.log('✅ Characters extracted successfully:', filteredCharacters.length);
          } catch (extractError) {
            console.error('❌ Failed to extract characters:', extractError);
            alert('Failed to extract characters. Please try again.');
            setSelectedBook(null);
          }
        } else {
          // Default books should always have characters
          console.error('❌ Default book missing characters - this should not happen');
          alert('Failed to load characters for this book.');
          setSelectedBook(null);
        }
      }
    } catch (error) {
      console.error('Failed to check/load characters:', error);
      alert('Failed to load characters. Please try again.');
      setSelectedBook(null);
    } finally {
      setLoadingCharacters(false);
    }
  };

  const handleCharacterClick = (character) => {
    const documentId = selectedBook.document_id;
    
    console.log('🎯 Character clicked:', character.name, character.character_id);
    console.log('📖 Book:', selectedBook.title);
    console.log('📄 Document ID:', documentId);
    console.log('📚 Is Library:', selectedBook.isLibrary);
    console.log('✨ Is Default:', selectedBook.isDefault);
    
    // Characters are already extracted (we loaded them successfully)
    // Ensure isLibrary flag is set for library books
    const bookToSend = { ...selectedBook };
    if (!bookToSend.isLibrary && showOnlyLibrary) {
      bookToSend.isLibrary = true;
    }
    // Navigate directly to chat page for ALL books (default, library, uploaded)
    console.log('✅ Characters already extracted - navigating to chat');
    onBookSelect(bookToSend, documentId, character.character_id);
  };

  const handleBackToBooks = () => {
    setSelectedBook(null);
    setCharacters([]);
  };

  const handleDeleteBook = async (book) => {
    try {
      const bookId = book.book_id || book.id;
      console.log('Deleting book:', bookId);
      
      // Call the API to remove from library
      await removeFromLibrary(bookId, true); // true = delete files as well
      
      // Reload the books list
      await loadBooks();
      
      // If the deleted book was selected, clear the selection
      if (selectedBook && (selectedBook.book_id === bookId || selectedBook.id === bookId)) {
        setSelectedBook(null);
        setCharacters([]);
      }
    } catch (error) {
      console.error('Failed to delete book:', error);
      alert(`Failed to delete book: ${error.message}`);
    }
  };

  if (loadingBooks) {
    return (
      <div className="home-container library-page">
        <div className="home-content">
          <div className="books-section">
            <div className="section-header">
              <button className="back-button" onClick={onBack}>
                ← Back to Home
              </button>
            </div>
            <div className="loading-state">Loading books...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container library-page">
      <div className="home-content">
        <div className="books-section">
          {!selectedBook ? (
            <>
              <div className="section-header">
                <button className="back-button" onClick={onBack}>
                  ← Back to Home
                </button>
              </div>
              {allBooks.length > 0 ? (
                <div className="books-grid">
                  {allBooks.map((book) => (
                    <BookCard 
                      key={book.id} 
                      book={book}
                      onClick={() => handleBookClick(book)}
                      onDelete={showOnlyLibrary ? handleDeleteBook : undefined}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-library">
                  <div className="empty-library-icon">📚</div>
                  <h3>Your Library is Empty</h3>
                  <p>Upload books from the home page to add them to your library</p>
                  <button className="back-button" onClick={onBack}>
                    ← Go to Home
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="section-header">
                <button className="back-button" onClick={handleBackToBooks}>
                  ← Back to {showOnlyLibrary ? 'My Library' : 'All Books'}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookLibrary;
