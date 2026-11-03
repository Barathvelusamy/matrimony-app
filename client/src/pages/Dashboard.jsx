import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import Loader from "../components/Loader";

const FIELDS = ["photo", "city", "education", "occupation", "dateOfBirth"];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const me = await api.get("/auth/me");
        setUser(me.data);

        const [p, r, s] = await Promise.all([
          api.get("/profile/me").then((x) => x.data).catch(() => null),
          api.get("/interests/received").then((x) => x.data).catch(() => []),
          api.get("/interests/sent").then((x) => x.data).catch(() => []),
        ]);
        setProfile(p);
        setReceived(r);
        setSent(s);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    load();
  }, [navigate]);

  if (!user) return <Loader text="Loading your account..." />;

  const filled = FIELDS.filter((f) => profile && profile[f]).length;
  const pct = Math.round((filled / FIELDS.length) * 100);
  const pending = received.filter((i) => i.status === "pending").length;
  const accepted =
    received.filter((i) => i.status === "accepted").length +
    sent.filter((i) => i.status === "accepted").length;
  const recent = received.slice(0, 4);

  return (
    <div className="dg">
      <aside className="dg-side">
        <div className="dg-cover" />
        {profile?.photo ? (
          <img className="dg-photo" src={profile.photo} alt={user.name} />
        ) : (
          <div className="dg-photo dg-initial">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <h2>{user.name}</h2>
        <p className="muted">{user.email}</p>
        <div className="dash-badges dg-badges">
          <span className="badge">{user.role}</span>
          {profile?.status && (
            <span className={`status status-${profile.status}`}>
              Profile {profile.status}
            </span>
          )}
        </div>

        <div className="dg-progress">
          <div className="dash-progress-top">
            <strong>Profile completion</strong>
            <span>{pct}%</span>
          </div>
          <div className="dash-bar">
            <div className="dash-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <Link to="/profile" className="btn-primary dg-btn">
          Edit profile
        </Link>
        {user.role === "admin" && (
          <button className="btn-secondary dg-btn" onClick={() => navigate("/admin")}>
            Admin Panel
          </button>
        )}
      </aside>

      <main className="dg-main">
        <div className="dg-hello">
          <h2>Welcome back, {user.name} 👋</h2>
          <p>Here is what is happening with your account.</p>
        </div>

        <div className="dg-tiles">
          <Link to="/interests" className="int-tile t1">
            <strong>{received.length}</strong>
            <span>Received</span>
          </Link>
          <Link to="/interests" className="int-tile t2">
            <strong>{pending}</strong>
            <span>Waiting for your reply</span>
          </Link>
          <Link to="/interests" className="int-tile t3">
            <strong>{accepted}</strong>
            <span>Accepted</span>
          </Link>
          <Link to="/interests" className="int-tile t4">
            <strong>{sent.length}</strong>
            <span>Sent</span>
          </Link>
        </div>

        <div className="dg-panel">
          <h3>Quick actions</h3>
          <div className="dg-actions">
            <Link to="/search" className="dg-action">
              <span className="dash-icon">🔍</span>
              <div>
                <strong>Search</strong>
                <small>Find new profiles</small>
              </div>
            </Link>
            <Link to="/interests" className="dg-action">
              <span className="dash-icon">💌</span>
              <div>
                <strong>Interests</strong>
                <small>Received and sent</small>
              </div>
            </Link>
            <Link to="/profile" className="dg-action">
              <span className="dash-icon">👤</span>
              <div>
                <strong>My Profile</strong>
                <small>View and edit</small>
              </div>
            </Link>
          </div>
        </div>

        <div className="dg-panel">
          <div className="dg-panel-head">
            <h3>Recent interests</h3>
            <Link to="/interests">View all →</Link>
          </div>

          {recent.length === 0 && (
            <p className="muted">No interests received yet.</p>
          )}

          <div className="dg-recent">
            {recent.map((i) => (
              <div className="dg-row" key={i._id}>
                {i.profile?.photo ? (
                  <img className="dg-mini" src={i.profile.photo} alt={i.from?.name} />
                ) : (
                  <div className="dg-mini dg-initial">
                    {i.from?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="dg-row-text">
                  <strong>{i.from?.name}</strong>
                  <small>
                    {[i.profile?.city, i.profile?.occupation]
                      .filter(Boolean)
                      .join(" · ") || "Sent you an interest"}
                  </small>
                </div>
                <span className={`status status-${i.status}`}>{i.status}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}