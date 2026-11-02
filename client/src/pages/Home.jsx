import { Link } from "react-router-dom";

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

export default function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="home">
      <section className="hero hero-image">
        <span className="hero-tag">Free to join</span>
        <h1>Find your life partner</h1>
        <p>
          Create your profile, search matches and send interests, all in one
          place.
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

      <h2 className="section-heading">How it works</h2>
      <section className="steps">
        <div className="step">
          <span className="step-no">1</span>
          <h3>Create your profile</h3>
          <p>Add your education, job, city, photos and a few lines about yourself.</p>
        </div>
        <div className="step">
          <span className="step-no">2</span>
          <h3>Search matches</h3>
          <p>Filter by age, city, education and religion to find the right people.</p>
        </div>
        <div className="step">
          <span className="step-no">3</span>
          <h3>Send interest</h3>
          <p>Send an interest and connect when the other person accepts.</p>
        </div>
      </section>

      <h2 className="section-heading">Why this app</h2>
      <section className="features">
        <div className="feature">
          <div className="feature-icon">✔</div>
          <h3>Approved profiles</h3>
          <p>Every new profile is reviewed by an admin before it appears in search.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">⌕</div>
          <h3>Smart filters</h3>
          <p>Narrow results by age range, city, education and religion.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">▣</div>
          <h3>Photo gallery</h3>
          <p>Add a main photo and up to five more to show on your profile.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">♥</div>
          <h3>Interest system</h3>
          <p>Send, accept or reject interests and track their status in one page.</p>
        </div>
      </section>

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