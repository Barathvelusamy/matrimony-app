import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();
  useLocation();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="brand">
          Matrimony
        </Link>
        <div className="nav-links">
          {token ? (
            <>
              <Link to="/search">Search</Link>
              <Link to="/interests">Interests</Link>
              <Link to="/profile">My Profile</Link>
              <Link to="/dashboard">Account</Link>
              <button className="nav-btn" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
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
    </>
  );
}