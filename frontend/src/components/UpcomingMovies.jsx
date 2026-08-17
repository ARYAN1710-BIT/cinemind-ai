import { useEffect, useState } from "react";
import MovieSection from "./MovieSection";
import { getUpcomingMovies } from "../services/movieService";
import { mapMovies } from "../utils/movieMapper";

function UpcomingMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getUpcomingMovies();
        setMovies(mapMovies(data));
      } catch (error) {
        console.error(error);
        setError("Failed to load upcoming movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <p>Loading upcoming movies...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <MovieSection
      title="Upcoming Movies"
      movies={movies}
    />
  );
}

export default UpcomingMovies;