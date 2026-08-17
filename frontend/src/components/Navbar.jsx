import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">CineMind AI</Link>
      </div>

      <SearchBar />

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/watchlist">Watchlist</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  );
}

export default Navbar;  