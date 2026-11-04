import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function OtpStep({ email, onBack }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const verify = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError("");
    setInfo("");
    try {
      await api.post("/auth/resend-otp", { email });
      setInfo("A new code has been sent");
      setCooldown(60);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <h2>Enter the code</h2>
      <p className="muted">We sent a 6 digit code to {email}</p>
      <form onSubmit={verify}>
        <input
          className="otp-input"
          inputMode="numeric"
          maxLength={6}
          placeholder="------"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          autoFocus
        />
        <button type="submit" disabled={loading || otp.length !== 6}>
          {loading ? "Please wait..." : "Verify"}
        </button>
      </form>
      {info && <p className="success">{info}</p>}
      {error && <p className="error">{error}</p>}
      <p className="link">
        {cooldown > 0 ? (
          <span>Resend code in {cooldown}s</span>
        ) : (
          <a href="#resend" onClick={(e) => { e.preventDefault(); resend(); }}>
            Resend code
          </a>
        )}
        {" | "}
        <a href="#back" onClick={(e) => { e.preventDefault(); onBack(); }}>
          Change email
        </a>
      </p>
    </>
  );
}