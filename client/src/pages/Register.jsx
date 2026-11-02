import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      setMessage(res.data.message + ". You can login now.");
      setForm({ name: "", email: "", password: "" });
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
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={handleChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Register"}
        </button>
      </form>
      {loading && (
        <p className="hint">
          If this takes long, the server is waking up. Please wait up to a minute.
        </p>
      )}
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <p className="link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}