import { useEffect, useState } from "react";
import MovieSection from "./MovieSection";
import { getTrendingMovies } from "../services/movieService";
import { mapMovies } from "../utils/movieMapper";

function TrendingMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getTrendingMovies();
        setMovies(mapMovies(data));
      } catch (error) {
        console.error(error);
        setError("Failed to load trending movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <p>Loading trending movies...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <MovieSection
      title="Trending Movies"
      movies={movies}
    />
  );
}

export default TrendingMovies;