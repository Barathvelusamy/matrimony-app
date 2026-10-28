import { useState } from "react";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await api.post("/auth/register", form);
      setMessage(res.data.message);
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="card">
      <h2>Create your account</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}