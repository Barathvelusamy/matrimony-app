import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Create your account</h2>
      <p className="muted">Join free and start finding your match.</p>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="username"
          placeholder="Choose a username"
          autoComplete="username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <p className="hint">3 to 20 characters: letters, numbers and underscore.</p>
        <input
          name="password"
          type="password"
          placeholder="Password (min 6 characters)"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Create account"}
        </button>
      </form>
      {loading && (
        <p className="hint">
          If this takes long, the server is waking up. Please wait up to a minute.
        </p>
      )}
      {error && <p className="error">{error}</p>}
      <p className="link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}