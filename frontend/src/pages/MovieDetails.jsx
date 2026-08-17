import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails } from "../services/movieService";

import {
  addToFavorites,
  addToWatchlist,
  addRating,
  createReview,
  getReviews,
  updateReview,
  deleteReview,
} from "../services/userService";

import "./MovieDetails.css";

function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Rating
  const [userRating, setUserRating] = useState("");
  const [ratingMessage, setRatingMessage] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  // Edit review
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews(id);
        setReviews(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReviews();
  }, [id]);

  // Add to Favorites
  const handleFavorite = async () => {
    try {
      setActionLoading(true);
      setMessage("");

      await addToFavorites(movie.id);

      setMessage("Added to Favorites ❤️");
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.detail ||
          "Failed to add to Favorites."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Add to Watchlist
  const handleWatchlist = async () => {
    try {
      setActionLoading(true);
      setMessage("");

      await addToWatchlist(movie.id);

      setMessage("Added to Watchlist ✓");
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.detail ||
          "Failed to add to Watchlist."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Save Rating
  const handleRating = async () => {
    if (!userRating) {
      setRatingMessage("Please select a rating.");
      return;
    }

    try {
      setRatingLoading(true);
      setRatingMessage("");

      await addRating(id, Number(userRating));

      setRatingMessage("Rating saved successfully.");
    } catch (error) {
      console.error(error);

      setRatingMessage(
        error.response?.data?.detail ||
          "Failed to save rating."
      );
    } finally {
      setRatingLoading(false);
    }
  };

  // Create Review
  const handleReviewSubmit = async () => {
    if (!reviewContent.trim()) {
      setReviewMessage("Please write a review.");
      return;
    }

    try {
      setReviewLoading(true);
      setReviewMessage("");

      const newReview = await createReview(
        id,
        reviewContent
      );

      setReviews((currentReviews) => [
        newReview,
        ...currentReviews,
      ]);

      setReviewContent("");
      setReviewMessage("Review added successfully.");
    } catch (error) {
      console.error(error);

      setReviewMessage(
        error.response?.data?.detail ||
          "Failed to add review."
      );
    } finally {
      setReviewLoading(false);
    }
  };

  // Start editing review
  const handleEditStart = (review) => {
    setEditingReviewId(review.id);
    setEditingContent(review.content);
  };

  // Update review
  const handleReviewUpdate = async (reviewId) => {
    if (!editingContent.trim()) {
      return;
    }

    try {
      const updatedReview = await updateReview(
        reviewId,
        editingContent
      );

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === reviewId
            ? updatedReview
            : review
        )
      );

      setEditingReviewId(null);
      setEditingContent("");
    } catch (error) {
      console.error(error);
    }
  };

  // Delete review
  const handleReviewDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);

      setReviews((currentReviews) =>
        currentReviews.filter(
          (review) => review.id !== reviewId
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="movie-details-status">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-details-status">
        {error}
      </div>
    );
  }

  if (!movie) {
    return null;
  }

  const year = movie.releaseDate
    ? movie.releaseDate.split("-")[0]
    : "N/A";

  return (
    <div
      className="movie-details"
      style={{
        backgroundImage: movie.backdrop
          ? `url(${movie.backdrop})`
          : "none",
      }}
    >
      <div className="movie-details-overlay"></div>

      <div className="movie-details-content">

        <img
          className="movie-details-poster"
          src={movie.poster || ""}
          alt={movie.title}
        />

        <div className="movie-details-info">

          <h1>{movie.title}</h1>

          <div className="movie-details-meta">

            <span>
              ⭐{" "}
              {movie.rating != null
                ? Number(movie.rating).toFixed(1)
                : "N/A"}
            </span>

            <span>{year}</span>

            <span>
              {movie.runtime
                ? `${movie.runtime} min`
                : "N/A"}
            </span>

          </div>

          <div className="movie-genres">
            {movie.genres?.map((genre) => (
              <span key={genre.id}>
                {genre.name}
              </span>
            ))}
          </div>

          <p className="movie-overview">
            {movie.overview ||
              "No overview available."}
          </p>

          {/* Rating */}

          <div className="movie-user-rating">

            <h3>Your Rating</h3>

            <select
              value={userRating}
              onChange={(e) =>
                setUserRating(e.target.value)
              }
            >
              <option value="">
                Select rating
              </option>

              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                (rating) => (
                  <option
                    key={rating}
                    value={rating}
                  >
                    {rating}/10
                  </option>
                )
              )}
            </select>

            <button
              onClick={handleRating}
              disabled={ratingLoading}
            >
              {ratingLoading
                ? "Saving..."
                : "Save Rating"}
            </button>

            {ratingMessage && (
              <p>{ratingMessage}</p>
            )}

          </div>

          {/* Favorites / Watchlist */}

          <div className="movie-details-actions">

            <button
              onClick={handleWatchlist}
              disabled={actionLoading}
            >
              ＋ Add to Watchlist
            </button>

            <button
              onClick={handleFavorite}
              disabled={actionLoading}
            >
              ♡ Add to Favorites
            </button>

          </div>

          {message && (
            <p>{message}</p>
          )}

          {/* Reviews */}

          <div className="movie-reviews">

            <h2>Reviews</h2>

            {/* Add Review */}

            <div className="review-form">

              <textarea
                value={reviewContent}
                onChange={(e) =>
                  setReviewContent(e.target.value)
                }
                placeholder="Write your review..."
                rows="4"
              />

              <button
                onClick={handleReviewSubmit}
                disabled={reviewLoading}
              >
                {reviewLoading
                  ? "Submitting..."
                  : "Submit Review"}
              </button>

              {reviewMessage && (
                <p>{reviewMessage}</p>
              )}

            </div>

            {/* Review List */}

            <div className="review-list">

              {reviews.length === 0 ? (
                <p>
                  No reviews yet. Be the first to
                  review this movie!
                </p>
              ) : (
                reviews.map((review) => (
                  <div
                    className="review-item"
                    key={review.id}
                  >

                    <div className="review-header">
                      <strong>
                        {review.username}
                      </strong>
                    </div>

                    {editingReviewId === review.id ? (
                      <div className="review-edit">

                        <textarea
                          value={editingContent}
                          onChange={(e) =>
                            setEditingContent(
                              e.target.value
                            )
                          }
                          rows="3"
                        />

                        <button
                          onClick={() =>
                            handleReviewUpdate(
                              review.id
                            )
                          }
                        >
                          Save
                        </button>

                        <button
                          onClick={() => {
                            setEditingReviewId(null);
                            setEditingContent("");
                          }}
                        >
                          Cancel
                        </button>

                      </div>
                    ) : (
                      <>
                        <p>{review.content}</p>

                        <div className="review-actions">

                          <button
                            onClick={() =>
                              handleEditStart(review)
                            }
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleReviewDelete(
                                review.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>
                      </>
                    )}

                  </div>
                ))
              )}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default MovieDetails;