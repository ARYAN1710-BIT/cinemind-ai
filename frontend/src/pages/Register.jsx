import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");
    setLoading(true);

    try {
      await registerUser(formData);

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      setFormData({
        username: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error(error);

      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        const messages = detail
          .map((item) => item.msg)
          .filter(Boolean)
          .join(", ");

        setError(messages || "Registration failed.");
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Registration failed.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
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

        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}

        {success && (
          <p className="auth-success">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating Account..."
            : "Register"}
        </button>

      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login">
          Login
        </Link>
      </p>

    </div>
  );
}

export default Register;