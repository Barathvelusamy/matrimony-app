import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Loader from "../components/Loader";

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

  if (!user) return <Loader text="Loading your account..." />;

  return (
    <div className="card account">
      <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
      <h2>Welcome, {user.name}</h2>
      <p className="muted">{user.email}</p>
      <span className="badge">{user.role}</span>
      {user.role === "admin" && (
        <button onClick={() => navigate("/admin")}>Admin Panel</button>
      )}
    </div>
  );
}