import "./Auth.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(formData);

      // Update authentication context
      login(data.access_token);

      // Navigate to Home
      navigate("/");
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.detail || "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  
return (
  <div className="auth-page">
    <div className="auth-card">
      <div className="auth-logo">🎬 CINEMIND AI</div>

      <h1>Welcome Back</h1>
      <p className="auth-subtitle">
        Sign in to continue your movie journey
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="auth-footer">
        Don't have an account?{" "}
        <Link to="/register">Create Account</Link>
      </p>
    </div>
  </div>
);
}

export default Login;
