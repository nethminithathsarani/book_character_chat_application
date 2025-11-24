import '../styles/MovieCard.css';

function MovieCard({ movie, onClick }) {
  const coverSrc = movie.cover || '/MovieCovers/placeholder.png';
  
  console.log('🎬 MovieCard:', {
    title: movie.title,
    movieId: movie.movie_id || movie.id,
    coverPath: coverSrc,
    fullMovie: movie
  });
  
  return (
    <div 
      className="movie-card"
      onClick={onClick}
      style={{ '--movie-color': movie.color }}
    >
      <div className="movie-cover">
        <img 
          src={coverSrc} 
          alt={movie.title}
          onError={(e) => { 
            console.error('❌ Failed to load movie cover:', coverSrc);
            e.target.onerror = null; 
            e.target.src = '/MovieCovers/placeholder.png'; 
          }}
          onLoad={() => console.log('✅ Successfully loaded:', coverSrc)}
        />
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
