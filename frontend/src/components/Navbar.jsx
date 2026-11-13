
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">CineMind AI</Link>
      </div>

      <SearchBar />

      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/favorites">Favorites</Link>
            <Link to="/watchlist">Watchlist</Link>
            <Link to="/profile">Profile</Link>

      
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
