import { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import NotificationBell from "./NotificationBell";

function Icon({ name }) {
  const p = {
    home: (
      <>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
    heart: (
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    ),
    user: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </>
    ),
    login: (
      <>
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" y1="12" x2="3" y2="12" />
      </>
    ),
    menu: (
      <>
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </>
    ),
    close: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    back: (
      <>
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </>
    ),
  };
  return (
    <svg
      className="nv-ico"
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

const linkClass = ({ isActive }) => (isActive ? "nav-item active" : "nav-item");

export default function Layout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const logout = () => {
    localStorage.removeItem("token");
    close();
    navigate("/login");
  };

  const goBack = () => {
    // History irundha back, illana Home
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <div className="app-shell">
      <nav className="navbar">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark">
            <svg viewBox="0 0 32 32" fill="none">
              <circle cx="12" cy="16" r="8" stroke="white" strokeWidth="2.6" />
              <circle cx="21" cy="16" r="8" stroke="#ffe0b2" strokeWidth="2.6" />
            </svg>
          </span>
          <span className="brand-text">
            <strong>Manamalai</strong>
            <small>Matrimony</small>
          </span>
        </Link>

        {token && (
          <div className="bell-top">
            <NotificationBell />
          </div>
        )}

        <button
          type="button"
          className="nav-toggle"
          aria-label="Menu"
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>

        <div className={open ? "nav-links open" : "nav-links"}>
          <NavLink to="/" end className={linkClass} onClick={close}>
            <Icon name="home" /> Home
          </NavLink>

          {token ? (
            <>
              <NavLink to="/search" className={linkClass} onClick={close}>
                <Icon name="search" /> Search
              </NavLink>
              <NavLink to="/interests" className={linkClass} onClick={close}>
                <Icon name="heart" /> Interests
              </NavLink>
              <NavLink to="/profile" end className={linkClass} onClick={close}>
                <Icon name="user" /> My Profile
              </NavLink>
              <NavLink to="/dashboard" className={linkClass} onClick={close}>
                <Icon name="grid" /> Account
              </NavLink>
              <button className="nav-btn" onClick={logout}>
                <Icon name="logout" /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass} onClick={close}>
                <Icon name="login" /> Login
              </NavLink>
              <Link to="/register" className="nav-cta" onClick={close}>
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="main">
        <Outlet />
      </main>

      {pathname === "/" && <Footer />}

      {pathname !== "/" && (
        <button
          type="button"
          className="back-fab"
          onClick={goBack}
          aria-label="Go back"
        >
          <Icon name="back" />
          <span>Back</span>
        </button>
      )}
    </div>
  );
}