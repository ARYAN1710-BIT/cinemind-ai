import api from "./api";

// =========================
// Favorites
// =========================

export const addToFavorites = async (movieId) => {
  const response = await api.post(`/favorites/${movieId}`);
  return response.data;
};

export const removeFromFavorites = async (movieId) => {
  await api.delete(`/favorites/${movieId}`);
};

export const getFavorites = async () => {
  const response = await api.get("/favorites");
  return response.data;
};


// =========================
// Watchlist
// =========================

export const addToWatchlist = async (movieId) => {
  const response = await api.post(`/watchlist/${movieId}`);
  return response.data;
};

export const removeFromWatchlist = async (movieId) => {
  await api.delete(`/watchlist/${movieId}`);
};

export const getWatchlist = async () => {
  const response = await api.get("/watchlist");
  return response.data;
};


// =========================
// Ratings
// =========================

export const addRating = async (movieId, value) => {
  const response = await api.post(`/ratings/${movieId}`, {
    value,
  });

  return response.data;
};

export const getRating = async (movieId) => {
  const response = await api.get(`/ratings/${movieId}`);
  return response.data;
};

export const updateRating = async (movieId, value) => {
  const response = await api.put(`/ratings/${movieId}`, {
    value,
  });

  return response.data;
};

export const deleteRating = async (movieId) => {
  await api.delete(`/ratings/${movieId}`);
};


// =========================
// Reviews
// =========================

export const createReview = async (movieId, content) => {
  const response = await api.post(`/reviews/${movieId}`, {
    content,
  });

  return response.data;
};

export const getReviews = async (movieId) => {
  const response = await api.get(`/reviews/${movieId}`);
  return response.data;
};

export const updateReview = async (reviewId, content) => {
  const response = await api.put(`/reviews/${reviewId}`, {
    content,
  });

  return response.data;
};

export const deleteReview = async (reviewId) => {
  await api.delete(`/reviews/${reviewId}`);
};