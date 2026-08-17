export const mapMovie = (movie) => ({
  id: movie.id,
  title: movie.title,
  rating: movie.rating ?? 0,
  poster: movie.poster ?? null,
  backdrop: movie.backdrop ?? null,
  overview: movie.overview ?? "",
  releaseDate: movie.releaseDate ?? null,
});

export const mapMovies = (movies) => {
  return movies.map(mapMovie);
};