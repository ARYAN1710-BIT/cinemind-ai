import { useEffect, useState } from "react";
import MovieSection from "./MovieSection";
import { getPopularMovies } from "../services/movieService";
import { mapMovies } from "../utils/movieMapper";

function PopularMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getPopularMovies();
        setMovies(mapMovies(data));
      } catch (error) {
        console.error(error);
        setError("Failed to load popular movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <p>Loading popular movies...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <MovieSection
      title="Popular Movies"
      movies={movies}
    />
  );
}

export default PopularMovies;