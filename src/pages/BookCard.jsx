function BookCard({ book, onClick }) {
  return (
    <div className="book-card" onClick={onClick}>
      <div className="cover">
        <img src={book.cover} alt={book.title} style={{ maxHeight: '100%', maxWidth:'100%' }} />
      </div>
      <div className="card-footer">
        <div className="title">{book.title}</div>
        <div className="author">{book.author}</div>
      </div>
    </div>
  );
}