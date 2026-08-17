import { useEffect, useState } from "react";
import MovieSection from "./MovieSection";
import { getTopRatedMovies } from "../services/movieService";
import { mapMovies } from "../utils/movieMapper";

function TopRatedMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getTopRatedMovies();
        setMovies(mapMovies(data));
      } catch (error) {
        console.error(error);
        setError("Failed to load top rated movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <p>Loading top rated movies...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <MovieSection
      title="Top Rated Movies"
      movies={movies}
    />
  );
}

export default TopRatedMovies;