import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Admin() {
  const [tab, setTab] = useState("pending");
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    <div className="card wide">
      <h2>Admin Panel</h2>

      <div className="pager">
        {["pending", "approved", "blocked"].map((s) => (
          <button
            key={s}
            className={tab === s ? "" : "secondary"}
            onClick={() => setTab(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}
      {profiles.length === 0 && !error && <p>No {tab} profiles.</p>}

      {profiles.map((p) => (
        <div className="profile-item" key={p._id}>
          <h3>{p.user?.name}</h3>
          <p>{p.user?.email}</p>
          <p>
            {p.gender} | {p.education} | {p.city}
          </p>
          <div className="pager">
            {p.status !== "approved" && (
              <button onClick={() => setStatus(p._id, "approved")}>Approve</button>
            )}
            {p.status !== "blocked" && (
              <button className="secondary" onClick={() => setStatus(p._id, "blocked")}>
                Block
              </button>
            )}
          </div>
        </div>
      ))}

      <button className="secondary" onClick={() => navigate("/dashboard")}>
        Back to dashboard
      </button>
    </div>
  );
}