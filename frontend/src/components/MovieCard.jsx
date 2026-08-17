import { Link } from "react-router-dom";
import "./MovieCard.css";

function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`}>
        <div className="movie-poster">
          {movie.poster ? (
            <img
              src={movie.poster}
              alt={movie.title}
            />
          ) : (
            <div className="movie-poster-placeholder">
              No Poster
            </div>
          )}

          <div className="movie-rating">
            ⭐ {movie.rating}
          </div>
        </div>

        <div className="movie-card-info">
          <h3>{movie.title}</h3>
        </div>
      </Link>
    </div>
  );
}

export default MovieCard;