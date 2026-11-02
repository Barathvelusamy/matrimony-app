import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

const linkClass = ({ isActive }) => (isActive ? "nav-item active" : "nav-item");

export default function Layout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <nav className="navbar">
        <Link to="/" className="brand">
          Matrimony
        </Link>
        <div className="nav-links">
          {token ? (
            <>
              <NavLink to="/search" className={linkClass}>
                Search
              </NavLink>
              <NavLink to="/interests" className={linkClass}>
                Interests
              </NavLink>
              <NavLink to="/profile" end className={linkClass}>
                My Profile
              </NavLink>
              <NavLink to="/dashboard" className={linkClass}>
                Account
              </NavLink>
              <button className="nav-btn" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <Link to="/register" className="nav-cta">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <p>Matrimony App, a portfolio project by Barath</p>
        <p>
          <a href="https://github.com/Barathvelusamy/matrimony-app" target="_blank" rel="noreferrer">
            View source on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}