import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import Loader from "../components/Loader";

const TRACKED = {
  photo: "Photo",
  gender: "Gender",
  dateOfBirth: "Date of birth",
  height: "Height",
  religion: "Religion",
  community: "Community",
  star: "Star",
  education: "Education",
  occupation: "Occupation",
  city: "City",
  state: "State",
  about: "About me",
};

const R = 54;
const C = 2 * Math.PI * R;

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const ago = (d) => {
  if (!d) return "";
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(d).toLocaleDateString();
};

function Icon({ name }) {
  const p = {
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
    inbox: (
      <>
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
    check: (
      <>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </>
    ),
    send: (
      <>
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </>
    ),
    user: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    arrow: (
      <>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </>
    ),
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  };
  return (
    <svg
      className="dx-ico"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {p[name]}
    </svg>
  );
}

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

  const keys = Object.keys(TRACKED);
  const missing = keys.filter((k) => !(profile && profile[k]));
  const pct = Math.round(((keys.length - missing.length) / keys.length) * 100);

  const pending = received.filter((i) => i.status === "pending").length;
  const accepted =
    received.filter((i) => i.status === "accepted").length +
    sent.filter((i) => i.status === "accepted").length;
  const recent = received.slice(0, 5);

  let next = {
    title: "Find your match",
    text: "Search profiles that fit what you are looking for.",
    to: "/search",
    cta: "Start searching",
  };
  if (!profile) {
    next = {
      title: "Create your profile",
      text: "Add your details so other members can find you.",
      to: "/profile",
      cta: "Create profile",
    };
  } else if (pending > 0) {
    next = {
      title: `Reply to ${pending} interest${pending > 1 ? "s" : ""}`,
      text: "Someone is waiting to hear back from you.",
      to: "/interests",
      cta: "Open interests",
    };
  } else if (pct < 100) {
    next = {
      title: "Complete your profile",
      text: `${missing.length} detail${missing.length > 1 ? "s" : ""} missing. Complete profiles get more interests.`,
      to: "/profile",
      cta: "Complete now",
    };
  }

  const stats = [
    { icon: "inbox", n: received.length, label: "Received", cls: "a1" },
    { icon: "clock", n: pending, label: "Waiting for reply", cls: "a2" },
    { icon: "check", n: accepted, label: "Accepted", cls: "a3" },
    { icon: "send", n: sent.length, label: "Sent", cls: "a4" },
  ];

  return (
    <div className="dx">
      <div className="dx-bento">
        <section className="dx-glass dx-hero dx-span4">
          <div className="dx-hero-left">
            <div className="dx-ava-ring">
              {profile?.photo ? (
                <img src={profile.photo} alt={user.name} />
              ) : (
                <div className="dx-initial">{user.name.charAt(0).toUpperCase()}</div>
              )}
            </div>
            <div>
              <span className="dx-eyebrow">{greeting()}</span>
              <h1>{user.name}</h1>
              <p className="dx-mail">{user.email}</p>
              <div className="dx-badges">
                <span className="dx-pill role">{user.role}</span>
                {profile?.status && (
                  <span className={`dx-pill ${profile.status}`}>
                    Profile {profile.status}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="dx-hero-actions">
            <Link to="/search" className="dx-btn main">
              <Icon name="search" /> Search profiles
            </Link>
            <Link to="/profile" className="dx-btn ghost">
              <Icon name="user" /> Edit profile
            </Link>
            {user.role === "admin" && (
              <button className="dx-btn ghost" onClick={() => navigate("/admin")}>
                <Icon name="shield" /> Admin panel
              </button>
            )}
          </div>
        </section>

        {stats.map((s) => (
          <Link to="/interests" className={`dx-glass dx-stat ${s.cls}`} key={s.label}>
            <span className="dx-stat-ico">
              <Icon name={s.icon} />
            </span>
            <strong>{s.n}</strong>
            <span className="dx-stat-label">{s.label}</span>
          </Link>
        ))}

        <section className="dx-glass dx-span2">
          <div className="dx-head">
            <h3>Recent activity</h3>
            <Link to="/interests">
              View all <Icon name="arrow" />
            </Link>
          </div>

          {recent.length === 0 && (
            <p className="dx-empty">No interests received yet. Complete your profile to get noticed.</p>
          )}

          <div className="dx-feed">
            {recent.map((i) => (
              <div className="dx-item" key={i._id}>
                {i.profile?.photo ? (
                  <img className="dx-mini" src={i.profile.photo} alt={i.from?.name} />
                ) : (
                  <div className="dx-mini dx-initial">
                    {i.from?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="dx-item-text">
                  <strong>{i.from?.name}</strong>
                  <small>
                    {[i.profile?.city, i.profile?.occupation].filter(Boolean).join(" · ") ||
                      "Sent you an interest"}
                  </small>
                </div>
                <div className="dx-item-right">
                  <span className={`dx-pill ${i.status}`}>{i.status}</span>
                  <small>{ago(i.createdAt)}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dx-glass dx-strength">
          <h3>Profile strength</h3>
          <svg className="dx-ring" viewBox="0 0 140 140">
            <defs>
              <linearGradient id="dxg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffb74d" />
                <stop offset="100%" stopColor="#f06292" />
              </linearGradient>
            </defs>
            <circle cx="70" cy="70" r={R} className="dx-ring-bg" />
            <circle
              cx="70"
              cy="70"
              r={R}
              className="dx-ring-fg"
              stroke="url(#dxg)"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct / 100)}
              transform="rotate(-90 70 70)"
            />
            <text x="70" y="78" textAnchor="middle" className="dx-ring-text">
              {pct}%
            </text>
          </svg>

          {missing.length > 0 ? (
            <div className="dx-missing">
              {missing.slice(0, 4).map((k) => (
                <span key={k}>{TRACKED[k]}</span>
              ))}
              {missing.length > 4 && <span>+{missing.length - 4} more</span>}
            </div>
          ) : (
            <p className="dx-done">All details filled</p>
          )}
        </section>

        <section className="dx-glass dx-next">
          <span className="dx-eyebrow">Next step</span>
          <h3>{next.title}</h3>
          <p>{next.text}</p>
          <Link to={next.to} className="dx-btn main">
            {next.cta} <Icon name="arrow" />
          </Link>
        </section>
      </div>
    </div>
  );
}