import '../styles/BookCard.css';

function BookCard({ book, onClick }) {
  return (
    <div 
      className="book-card"
      onClick={onClick}
      style={{ '--book-color': book.color }}
    >
      <div className="book-cover">
        <img src={book.cover} alt={book.title} />
        <div className="book-overlay">
         
        </div>
      </div>
      <div className="book-info">
        <h3>{book.title}</h3>
        {book.author && <p className="book-author">{book.author}</p>}
      </div>
    </div>
  );
}

export default BookCard;
