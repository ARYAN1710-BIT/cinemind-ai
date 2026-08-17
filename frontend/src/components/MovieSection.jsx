import MovieCard from "./MovieCard";
import "./MovieSection.css";

function MovieSection({ title, movies }) {
  return (
    <section className="movie-section">
      <div className="section-header">
        <h2>{title}</h2>

        <button>View All</button>
      </div>

      <div className="movie-row">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default MovieSection;