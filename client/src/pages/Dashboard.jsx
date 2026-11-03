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

  return (
    <div className="dash">
      <div className="dash-hero">
        {profile?.photo ? (
          <img className="dash-avatar" src={profile.photo} alt={user.name} />
        ) : (
          <div className="dash-avatar dash-initial">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="dash-hero-text">
          <h2>Welcome, {user.name}</h2>
          <p className="muted">{user.email}</p>
          <div className="dash-badges">
            <span className="badge">{user.role}</span>
            {profile?.status && (
              <span className={`status status-${profile.status}`}>
                Profile {profile.status}
              </span>
            )}
          </div>
        </div>
        {user.role === "admin" && (
          <button className="btn-primary" onClick={() => navigate("/admin")}>
            Admin Panel
          </button>
        )}
      </div>

      <div className="dash-progress">
        <div className="dash-progress-top">
          <strong>Profile completion</strong>
          <span>{pct}%</span>
        </div>
        <div className="dash-bar">
          <div className="dash-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        {pct < 100 && (
          <p className="muted">
            Complete profile ku more matches kedaikkum.{" "}
            <Link to="/profile">Complete now</Link>
          </p>
        )}
      </div>

      <div className="int-tiles">
        <div className="int-tile t1">
          <strong>{received.length}</strong>
          <span>Received</span>
        </div>
        <div className="int-tile t2">
          <strong>{pending}</strong>
          <span>Waiting for your reply</span>
        </div>
        <div className="int-tile t3">
          <strong>{accepted}</strong>
          <span>Accepted</span>
        </div>
        <div className="int-tile t4">
          <strong>{sent.length}</strong>
          <span>Sent</span>
        </div>
      </div>

      <h3 className="dash-heading">Quick actions</h3>
      <div className="dash-actions">
        <Link to="/search" className="dash-action">
          <span className="dash-icon">🔍</span>
          <strong>Search</strong>
          <small>Find new profiles</small>
        </Link>
        <Link to="/interests" className="dash-action">
          <span className="dash-icon">💌</span>
          <strong>Interests</strong>
          <small>Received and sent</small>
        </Link>
        <Link to="/profile" className="dash-action">
          <span className="dash-icon">👤</span>
          <strong>My Profile</strong>
          <small>View and edit</small>
        </Link>
      </div>
    </div>
  );
}