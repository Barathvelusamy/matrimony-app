import { useEffect, useState } from "react";
import api from "../api";

export default function Interests() {
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [r, s] = await Promise.all([
        api.get("/interests/received"),
        api.get("/interests/sent"),
      ]);
      setReceived(r.data);
      setSent(s.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const respond = async (id, status) => {
    try {
      await api.patch(`/interests/${id}`, { status });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="page">
      <h2 className="page-title">Interests</h2>
      {error && <p className="error">{error}</p>}

      <h3 className="section-title">Received</h3>
      {received.length === 0 && <p className="muted">No interests received yet.</p>}
      <div className="interest-list">
        {received.map((i) => (
          <div className="interest-card" key={i._id}>
            <div className="avatar small">
              {i.from?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="interest-info">
              <h4>{i.from?.name}</h4>
              <span className={`status status-${i.status}`}>{i.status}</span>
            </div>
            {i.status === "pending" && (
              <div className="interest-actions">
                <button className="btn-primary" onClick={() => respond(i._id, "accepted")}>
                  Accept
                </button>
                <button className="btn-secondary" onClick={() => respond(i._id, "rejected")}>
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <h3 className="section-title">Sent</h3>
      {sent.length === 0 && <p className="muted">You have not sent any interests.</p>}
      <div className="interest-list">
        {sent.map((i) => (
          <div className="interest-card" key={i._id}>
            <div className="avatar small">
              {i.to?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="interest-info">
              <h4>{i.to?.name}</h4>
              <span className={`status status-${i.status}`}>{i.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}