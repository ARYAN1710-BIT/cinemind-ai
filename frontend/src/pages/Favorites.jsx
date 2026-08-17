import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import {
  getFavorites,
  removeFromFavorites,
} from "../services/userService";
import { getMovieDetails } from "../services/movieService";
import "./Favorites.css";
function Favorites() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favorites = await getFavorites();

        const movieDetails = await Promise.all(
          favorites.map((favorite) =>
            getMovieDetails(favorite.movie_id)
          )
        );

        setMovies(movieDetails);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.detail ||
            "Failed to load favorites."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemove = async (movieId) => {
    try {
      await removeFromFavorites(movieId);

      setMovies((currentMovies) =>
        currentMovies.filter(
          (movie) => movie.id !== movieId
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading favorites...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="favorites-page">
      <h1>My Favorites</h1>

      {movies.length === 0 ? (
        <p>No favorite movies yet.</p>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.id}>
              <MovieCard movie={movie} />

              <button
                onClick={() => handleRemove(movie.id)}
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;