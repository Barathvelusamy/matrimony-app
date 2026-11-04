import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import OtpStep from "../components/OtpStep";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [step, setStep] = useState("form");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      setStep("code");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      {step === "code" ? (
        <OtpStep email={form.email.trim().toLowerCase()} onBack={() => setStep("form")} />
      ) : (
        <>
          <h2>Create your account</h2>
          <p className="muted">Join free. We will email you a code to confirm your address.</p>
          <form onSubmit={sendCode}>
            <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <button type="submit" disabled={loading}>
              {loading ? "Please wait..." : "Send code"}
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
        </>
      )}
    </div>
  );
}