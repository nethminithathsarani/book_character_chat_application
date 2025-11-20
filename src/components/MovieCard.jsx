import '../styles/MovieCard.css';

function MovieCard({ movie, onClick }) {
  return (
    <div 
      className="movie-card"
      onClick={onClick}
      style={{ '--movie-color': movie.color }}
    >
      <div className="movie-cover">
        <img src={movie.cover} alt={movie.title} />
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        {movie.director && <p className="movie-director">Directed by {movie.director}</p>}
        {movie.year && <p className="movie-year">{movie.year}</p>}
      </div>
    </div>
  );
}

export default MovieCard;
