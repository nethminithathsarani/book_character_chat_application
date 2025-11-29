import '../styles/BookCard.css';

function BookCard({ book, onClick, onDelete }) {
  // Remove cloud emoji from title and author
  const cleanTitle = book.title ? book.title.replace(/☁️|☁/g, '').trim() : '';
  const cleanAuthor = book.author ? book.author.replace(/☁️|☁/g, '').trim() : '';
  const coverSrc = book.cover || '/books_images/placeholder.png';
  
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent triggering the card's onClick
    if (onDelete && window.confirm(`Are you sure you want to delete "${cleanTitle}" from your library?`)) {
      onDelete(book);
    }
  };
  
  return (
    <div 
      className="book-card"
      onClick={onClick}
      style={{ '--book-color': book.color }}
    >
      {book.isLibrary && <div className="library-badge">📚 My Library</div>}
      {book.isFavorite && <div className="favorite-badge">⭐</div>}
      {book.isLibrary && onDelete && (
        <button 
          className="delete-button"
          onClick={handleDeleteClick}
          title="Delete from library"
        >
          Delete
        </button>
      )}
      <div className="book-cover">
        <img 
          src={coverSrc} 
          alt={cleanTitle} 
          onError={(e) => { e.target.onerror = null; e.target.src = '/books_images/placeholder.png'; }}
        />
        <div className="book-overlay"></div>
      </div>
      <div className="book-info">
        <h3>{cleanTitle}</h3>
        {cleanAuthor && <p className="book-author">{cleanAuthor}</p>}
      </div>
    </div>
  );
}

export default BookCard;
