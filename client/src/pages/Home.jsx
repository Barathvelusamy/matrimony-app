import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

// My Profile page URL veru na (example "/profile"), inga mattum maathunga
const PROFILE_PATH = "/profile";

const faqs = [
  {
    q: "Is it free to join?",
    a: "Yes. You can register, create a profile and search for free.",
  },
  {
    q: "Why is my profile pending?",
    a: "Every new profile is reviewed by an admin. It shows in search once it is approved.",
  },
  {
    q: "Who can see my photos?",
    a: "Only logged in members can see approved profiles and their photos.",
  },
  {
    q: "How do interests work?",
    a: "Send an interest to a profile you like. They can accept or reject it, and you can track the status on the Interests page.",
  },
];

const steps = [
  {
    no: 1,
    title: "Create your profile",
    text: "Add your education, job, city, photos and a few lines about yourself.",
    to: PROFILE_PATH,
  },
  {
    no: 2,
    title: "Search matches",
    text: "Filter by age, city, education and religion to find the right people.",
    to: "/search",
  },
  {
    no: 3,
    title: "Send interest",
    text: "Send an interest and connect when the other person accepts.",
    to: "/interests",
  },
];

const features = [
  {
    icon: "✔",
    title: "Approved profiles",
    text: "Every new profile is reviewed by an admin before it appears in search.",
    to: "/search",
  },
  {
    icon: "⌕",
    title: "Smart filters",
    text: "Narrow results by age range, city, education and religion.",
    to: "/search",
  },
  {
    icon: "▣",
    title: "Photo gallery",
    text: "Add a main photo and up to five more to show on your profile.",
    to: PROFILE_PATH,
  },
  {
    icon: "♥",
    title: "Interest system",
    text: "Send, accept or reject interests and track their status in one page.",
    to: "/interests",
  },
];

const age = (dob) =>
  dob
    ? Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

export default function Home() {
  const token = localStorage.getItem("token");
  const [me, setMe] = useState(null);

  // Login pannala na login page ku, pannirundha andha page ku
  const go = (path) => (token ? path : "/login");

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const [user, profile, received] = await Promise.all([
          api.get("/auth/me").then((x) => x.data),
          api.get("/profile/me").then((x) => x.data).catch(() => null),
          api.get("/interests/received").then((x) => x.data).catch(() => []),
        ]);
        setMe({ user, profile, received });
      } catch (err) {
        setMe(null);
      }
    };
    load();
  }, [token]);

  // Hero floating cards: real data (login aana), illana sample
  const name = me?.user?.name;
  const p = me?.profile;
  const years = p ? age(p.dateOfBirth) : null;
  const pending = me ? me.received.filter((i) => i.status === "pending").length : 0;

  const card1Title = name ? `${name}${years ? `, ${years}` : ""}` : "Your name, 25";
  const card1Sub = name
    ? [p?.city, p?.education].filter(Boolean).join(" · ") || "Complete your profile"
    : "Your city · Your education";

  let card2Title = "Get interests";
  let card2Sub = "Login to see yours";
  if (me) {
    card2Title =
      pending > 0
        ? `${pending} new interest${pending > 1 ? "s" : ""}`
        : "No new interests yet";
    card2Sub = `${me.received.length} received in total`;
  }

  let card3Title = "Admin approved";
  let card3Sub = "Every profile is reviewed";
  let card3Icon = "✅";
  if (me) {
    if (!p) {
      card3Title = "Create your profile";
      card3Sub = "Add your details to get started";
      card3Icon = "📝";
    } else if (p.status === "approved") {
      card3Title = "Profile approved";
      card3Sub = "You are live in search";
    } else if (p.status === "rejected") {
      card3Title = "Profile rejected";
      card3Sub = "Update your details and save again";
      card3Icon = "⚠️";
    } else {
      card3Title = "Profile pending";
      card3Sub = "Waiting for admin approval";
      card3Icon = "⏳";
    }
  }

  return (
    <div className="home">
      <section className="hero hero-image hx">
        <div className="hx-blob b1" />
        <div className="hx-blob b2" />
        <div className="hx-blob b3" />

        <div className="hx-inner">
          <div className="hx-text">
            <span className="hero-tag">💜 Free to join</span>
            <h1>
              Find your <span className="hx-grad">life partner</span>
            </h1>
            <p>
              Create your profile, search matches and send interests, all in
              one place.
            </p>
            <div className="hero-actions">
              {token ? (
                <Link to="/search" className="btn">
                  Search profiles
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn">
                    Get started
                  </Link>
                  <Link to="/login" className="btn btn-outline">
                    Login
                  </Link>
                </>
              )}
            </div>
            <div className="hx-trust">
              <span>✔ Admin reviewed</span>
              <span>🔒 Members only photos</span>
              <span>💸 100% free</span>
            </div>
          </div>

          <div className="hx-visual">
            <Link to={go(PROFILE_PATH)} className="hx-card c1">
              {p?.photo ? (
                <img className="hx-ava hx-ava-img" src={p.photo} alt={name} />
              ) : (
                <div className="hx-ava">
                  {name ? name.charAt(0).toUpperCase() : "?"}
                </div>
              )}
              <div>
                <strong>{card1Title}</strong>
                <small>{card1Sub}</small>
              </div>
            </Link>

            <Link to={go("/interests")} className="hx-card c2">
              <span className="hx-emoji">💌</span>
              <div>
                <strong>{card2Title}</strong>
                <small>{card2Sub}</small>
              </div>
            </Link>

            <Link to={go("/dashboard")} className="hx-card c3">
              <span className="hx-emoji">{card3Icon}</span>
              <div>
                <strong>{card3Title}</strong>
                <small>{card3Sub}</small>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stat">
          <strong>100%</strong>
          <span>Admin reviewed profiles</span>
        </div>
        <div className="stat">
          <strong>6</strong>
          <span>Photos per profile</span>
        </div>
        <div className="stat">
          <strong>4</strong>
          <span>Smart search filters</span>
        </div>
        <div className="stat">
          <strong>Free</strong>
          <span>To register and search</span>
        </div>
      </section>

      <div className="home-bg">
        <h2 className="section-heading">How it works</h2>
        <section className="steps">
          {steps.map((s) => (
            <Link to={go(s.to)} className="step home-link" key={s.no}>
              <span className="step-no">{s.no}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <span className="go-link">
                {token ? "Go to page →" : "Login to continue →"}
              </span>
            </Link>
          ))}
        </section>

        <h2 className="section-heading">Why this app</h2>
        <section className="features">
          {features.map((f) => (
            <Link to={go(f.to)} className="feature home-link" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
              <span className="go-link">
                {token ? "Go to page →" : "Login to continue →"}
              </span>
            </Link>
          ))}
        </section>
      </div>

      <h2 className="section-heading">Questions</h2>
      <section className="faq">
        {faqs.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>

      {!token && (
        <section className="cta">
          <h2>Ready to find your match?</h2>
          <Link to="/register" className="btn">
            Create free account
          </Link>
        </section>
      )}
    </div>
  );
}