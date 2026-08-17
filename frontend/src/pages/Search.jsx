import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { searchMovies } from "../services/movieService";
import { mapMovies } from "../utils/movieMapper";
import MovieCard from "../components/MovieCard";

import "./Search.css";

function Search() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query") || "";

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      if (!query.trim()) {
        setMovies([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await searchMovies(query);

        console.log("TMDB search response:", data);

        const mappedMovies = mapMovies(data);

        console.log("Mapped movies:", mappedMovies);

        setMovies(mappedMovies);
      } catch (error) {
        console.error("Search error:", error);
        setError("Failed to search movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Search Results</h1>

        {query && (
          <p>
            Results for "<strong>{query}</strong>"
          </p>
        )}
      </div>

      {loading && (
        <p className="search-status">
          Searching movies...
        </p>
      )}

      {error && (
        <p className="search-status">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        movies.length === 0 &&
        query && (
          <p className="search-status">
            No movies found.
          </p>
        )}

      {!loading && movies.length > 0 && (
        <div className="search-results">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;