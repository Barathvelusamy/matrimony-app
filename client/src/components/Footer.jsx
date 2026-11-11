import { Link } from "react-router-dom";

const PHONE = "6369683262";
const EMAIL = "bk888493@gmail.com";
const OWNER = "Barath V";

function Icon({ name }) {
  const p = {
    pin: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
    user: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    phone: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    ),
    mail: (
      <>
        <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </>
    ),
    chat: (
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    ),
    up: (
      <>
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </>
    ),
  };
  return (
    <svg
      className="ft-ico"
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

export default function Footer() {
  const token = localStorage.getItem("token");
  const go = (path) => (token ? path : "/login");

  return (
    <footer className="ft">
      <div className="ft-inner">
        <div className="ft-brand">
          <h3 className="ft-logo">Manamalai</h3>
          <p className="ft-tag">Where garlands begin</p>
          <p className="ft-about">
            Manamalai Matrimony helps you create a profile, search matches and
            send interests, all in one place.
          </p>
          <a
            className="ft-wa"
            href={`https://wa.me/91${PHONE}`}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="chat" /> Chat on WhatsApp
          </a>
        </div>

        <div className="ft-col">
          <h4>Quick links</h4>
          <Link to="/">Home</Link>
          <Link to={go("/search")}>Search profiles</Link>
          <Link to={go("/interests")}>Interests</Link>
          <Link to={go("/profile")}>My Profile</Link>
          <Link to={go("/dashboard")}>Account</Link>
        </div>

        <div className="ft-col">
          <h4>Contact us</h4>
          <p>
            <Icon name="user" /> <span>{OWNER} (Owner)</span>
          </p>
          <p>
            <Icon name="phone" />
            <a href={`tel:+91${PHONE}`}>{PHONE}</a>
          </p>
          <p>
            <Icon name="mail" />
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
        </div>

        <div className="ft-col">
          <h4>Our locations</h4>
          <p>
            <Icon name="pin" /> <span>Punjai Puliampatti</span>
          </p>
          <p>
            <Icon name="pin" /> <span>Coimbatore</span>
          </p>
          <p>
            <Icon name="pin" /> <span>Chennai</span>
          </p>
        </div>
      </div>

      <div className="ft-bottom">
        <span>
          © {new Date().getFullYear()} Manamalai Matrimony. All rights reserved.
        </span>
               <span className="ft-note">
          Portfolio project by {OWNER}. Profiles shown are demo data.{" "}
          <a
            href="https://github.com/Barathvelusamy/matrimony-app"
            target="_blank"
            rel="noreferrer"
          >
            View source on GitHub
          </a>
        </span>
        <button
          type="button"
          className="ft-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Icon name="up" /> Back to top
        </button>
      </div>
    </footer>
  );
}