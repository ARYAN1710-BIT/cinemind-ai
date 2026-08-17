import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import {
  getWatchlist,
  removeFromWatchlist,
} from "../services/userService";
import { getMovieDetails } from "../services/movieService";
import "./Watchlist.css";

function Watchlist() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const watchlist = await getWatchlist();

        const movieDetails = await Promise.all(
          watchlist.map((item) =>
            getMovieDetails(item.movie_id)
          )
        );

        setMovies(movieDetails);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.detail ||
            "Failed to load watchlist."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  const handleRemove = async (movieId) => {
    try {
      await removeFromWatchlist(movieId);

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
    return <p>Loading watchlist...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="watchlist-page">
      <h1>My Watchlist</h1>

      {movies.length === 0 ? (
        <div className="watchlist-empty">
          <p>No movies in your watchlist yet.</p>
        </div>
      ) : (
        <div className="watchlist-grid">
          {movies.map((movie) => (
            <div
              className="watchlist-movie"
              key={movie.id}
            >
              <MovieCard movie={movie} />

              <button
                onClick={() =>
                  handleRemove(movie.id)
                }
              >
                Remove from Watchlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;