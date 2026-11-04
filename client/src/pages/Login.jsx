import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import OtpStep from "../components/OtpStep";

export default function Login() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/login", { email });
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
        <OtpStep email={email.trim().toLowerCase()} onBack={() => setStep("email")} />
      ) : (
        <>
          <h2>Welcome back</h2>
          <p className="muted">Enter your email and we will send you a login code.</p>
          <form onSubmit={sendCode}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
            New here? <Link to="/register">Create an account</Link>
          </p>
        </>
      )}
    </div>
  );
}