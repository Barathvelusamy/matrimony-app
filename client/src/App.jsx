import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProfileForm from "./pages/ProfileForm";
import Search from "./pages/Search";
import Interests from "./pages/Interests";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<ProfileForm />} />
      <Route path="/search" element={<Search />} />
      <Route path="/interests" element={<Interests />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}