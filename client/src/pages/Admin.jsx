import { useEffect, useState } from "react";
import api from "../api";

export default function Admin() {
  const [tab, setTab] = useState("pending");
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState("");

  const load = async (status) => {
    setError("");
    try {
      const res = await api.get("/admin/profiles", { params: { status } });
      setProfiles(res.data.profiles);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    load(tab);
  }, [tab]);

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/admin/profiles/${id}/status`, { status });
      load(tab);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="page">
      <h2 className="page-title">Admin Panel</h2>

      <div className="tabs">
        {["pending", "approved", "blocked"].map((s) => (
          <button
            key={s}
            className={tab === s ? "tab active" : "tab"}
            onClick={() => setTab(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}
      {profiles.length === 0 && !error && <p className="muted">No {tab} profiles.</p>}

      <div className="interest-list">
        {profiles.map((p) => (
          <div className="interest-card" key={p._id}>
            <div className="avatar small">
              {p.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="interest-info">
              <h4>{p.user?.name}</h4>
              <p className="muted">{p.user?.email}</p>
              <p className="muted">
                {p.gender} | {p.education} | {p.city}
              </p>
            </div>
            <div className="interest-actions">
              {p.status !== "approved" && (
                <button className="btn-primary" onClick={() => setStatus(p._id, "approved")}>
                  Approve
                </button>
              )}
              {p.status !== "blocked" && (
                <button className="btn-secondary" onClick={() => setStatus(p._id, "blocked")}>
                  Block
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}