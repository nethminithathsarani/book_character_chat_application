import '../styles/BookCard.css';

function BookCard({ book, onClick }) {
  // Remove cloud emoji from title and author
  const cleanTitle = book.title ? book.title.replace(/☁️|☁/g, '').trim() : '';
  const cleanAuthor = book.author ? book.author.replace(/☁️|☁/g, '').trim() : '';
  
  return (
    <div 
      className="book-card"
      onClick={onClick}
      style={{ '--book-color': book.color }}
    >
      <div className="book-cover">
        <img src={book.cover} alt={cleanTitle} />
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
