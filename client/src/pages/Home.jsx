import { Link } from "react-router-dom";

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

export default function Home() {
  const token = localStorage.getItem("token");

  // Login pannala na login page ku, pannirundha andha page ku
  const go = (path) => (token ? path : "/login");

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
            <div className="hx-card c1">
              <div className="hx-ava">P</div>
              <div>
                <strong>Priya, 26</strong>
                <small>Coimbatore · MCA</small>
              </div>
            </div>
            <div className="hx-card c2">
              <span className="hx-emoji">💌</span>
              <div>
                <strong>New interest received</strong>
                <small>Tap to view profile</small>
              </div>
            </div>
            <div className="hx-card c3">
              <span className="hx-emoji">✅</span>
              <div>
                <strong>Profile approved</strong>
                <small>You are live in search</small>
              </div>
            </div>
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