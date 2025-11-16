import BookCard from '../components/BookCard';
import '../styles/Home.css';

function BookLibrary({ onBookSelect, onBack }) {
  const allBooks = [
    {
      id: 'harry-potter',
      title: 'Harry Potter and the Sorcerer\'s Stone',
      cover: '/src/assets/books_images/Harry Potter.png',
      color: '#8B5CF6',
      author: 'J.K. Rowling'
    },
    {
      id: 'narnia',
      title: 'The Chronicles of Narnia',
      cover: '/src/assets/books_images/Narnia.png',
      color: '#F59E0B',
      author: 'C.S. Lewis'
    },
    {
      id: 'hobbit',
      title: 'The Hobbit',
      cover: '/src/assets/books_images/The Hobbits.png',
      color: '#10B981',
      author: 'J.R.R. Tolkien'
    }
  ];

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
        <p className="library-subtitle">Choose a book and start chatting with characters</p>
      </div>

      <div className="home-content">
        <div className="books-section">
          <div className="books-grid">
            {allBooks.map((book) => (
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

export default BookLibrary;
