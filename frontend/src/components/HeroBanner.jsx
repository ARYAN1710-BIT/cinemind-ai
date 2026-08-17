import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTrendingMovies } from "../services/movieService";
import { mapMovies } from "../utils/movieMapper";
import "./HeroBanner.css";

function HeroBanner() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getTrendingMovies();
        setMovies(mapMovies(data).filter((movie) => movie.backdrop));
      } catch (error) {
        console.error("Failed to load hero movies:", error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === movies.length - 1 ? 0 : prev + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [movies]);

  if (movies.length === 0) {
    return (
      <section className="hero-banner">
        <div className="hero-loading">
          Loading...
        </div>
      </section>
    );
  }

  const movie = movies[currentIndex];

  const year = movie.releaseDate
    ? movie.releaseDate.split("-")[0]
    : "";

  const previousMovie = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? movies.length - 1 : prev - 1
    );
  };

  const nextMovie = () => {
    setCurrentIndex((prev) =>
      prev === movies.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section
      className="hero-banner"
      style={{
        backgroundImage: `url(${movie.backdrop})`,
      }}
    >
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <span className="hero-label">
          TRENDING NOW
        </span>

        <h1>{movie.title}</h1>

        <div className="hero-meta">
          <span className="hero-rating">
            ⭐ {movie.rating}
          </span>

          <span>{year}</span>

          <span>Movie</span>
        </div>

        <p className="hero-description">
          {movie.overview}
        </p>

        <div className="hero-buttons">
          <Link
            to={`/movie/${movie.id}`}
            className="hero-play-button"
          >
            ▶ Play
          </Link>

          <button className="hero-list-button">
            ＋ My List
          </button>
        </div>
      </div>

      <div className="hero-controls">
        <button onClick={previousMovie}>‹</button>
        <button onClick={nextMovie}>›</button>
      </div>

      <div className="hero-indicators">
        {movies.slice(0, 6).map((item, index) => (
          <button
            key={item.id}
            className={
              index === currentIndex
                ? "active"
                : ""
            }
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroBanner;