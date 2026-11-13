
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  if (loading) {
    return (
      <div className="profile-status">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-status">
        {error}
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const initial =
    user.username?.charAt(0).toUpperCase() || "U";

  return (
    <div className="profile-page">
      <div className="profile-background"></div>

      <div className="profile-container">

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {initial}
          </div>

          <div className="profile-header-info">
            <h1>{user.username}</h1>
            <p>{user.email}</p>

            <span className="profile-member">
              CineMind Member
            </span>
          </div>
        </div>

        {/* Profile Information */}
        <div className="profile-section">
          <h2>Account Information</h2>

          <div className="profile-info-grid">
            <div className="profile-info-box">
              <span>Username</span>
              <strong>{user.username}</strong>
            </div>

            <div className="profile-info-box">
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>

            <div className="profile-info-box">
              <span>User ID</span>
              <strong>#{user.id}</strong>
            </div>

            <div className="profile-info-box">
              <span>Account</span>
              <strong>Active</strong>
            </div>
          </div>
        </div>

        {/* CineMind Activity */}
        <div className="profile-section">
          <h2>Your CineMind</h2>

          <div className="profile-stats">
            <div
              className="profile-stat"
              onClick={() => navigate("/favorites")}
            >
              <div className="profile-stat-icon">
                ❤️
              </div>

              <div>
                <strong>Favorites</strong>
                <span>View your favorite movies</span>
              </div>
            </div>

            <div
              className="profile-stat"
              onClick={() => navigate("/watchlist")}
            >
              <div className="profile-stat-icon">
                🎬
              </div>

              <div>
                <strong>Watchlist</strong>
                <span>Movies you want to watch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="profile-actions">
          <button
            className="profile-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}

export default Profile;
