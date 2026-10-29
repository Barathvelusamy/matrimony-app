import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
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
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfileForm />} />
        <Route path="/search" element={<Search />} />
        <Route path="/interests" element={<Interests />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}