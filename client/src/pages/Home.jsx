import { Link } from "react-router-dom";

export default function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="home">
      <section className="hero">
        <h1>Find your life partner</h1>
        <p>
          Create your profile, search matches and send interests, all in one place.
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

      <section className="steps">
        <div className="step">
          <span className="step-no">1</span>
          <h3>Create your profile</h3>
          <p>Add your education, job, city and a few lines about yourself.</p>
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
    </div>
  );
}