import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <button onClick={() => navigate("/profile")}>My Profile</button>
      <button onClick={() => navigate("/search")}>Search Profiles</button>
      <button onClick={() => navigate("/interests")}>Interests</button>
      {user.role === "admin" && (
        <button onClick={() => navigate("/admin")}>Admin Panel</button>
      )}
      <button onClick={logout}>Logout</button>
    </div>
  );
}