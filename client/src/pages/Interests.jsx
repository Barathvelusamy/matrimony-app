import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Interests() {
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    <div className="card wide">
      <h2>Interests</h2>
      {error && <p className="error">{error}</p>}

      <h3>Received</h3>
      {received.length === 0 && <p>No interests received yet.</p>}
      {received.map((i) => (
        <div className="profile-item" key={i._id}>
          <h3>{i.from?.name}</h3>
          <p className="badge">{i.status}</p>
          {i.status === "pending" && (
            <div className="pager">
              <button onClick={() => respond(i._id, "accepted")}>Accept</button>
              <button className="secondary" onClick={() => respond(i._id, "rejected")}>
                Reject
              </button>
            </div>
          )}
        </div>
      ))}

      <h3>Sent</h3>
      {sent.length === 0 && <p>You have not sent any interests.</p>}
      {sent.map((i) => (
        <div className="profile-item" key={i._id}>
          <h3>{i.to?.name}</h3>
          <p className="badge">{i.status}</p>
        </div>
      ))}

      <button className="secondary" onClick={() => navigate("/dashboard")}>
        Back to dashboard
      </button>
    </div>
  );
}