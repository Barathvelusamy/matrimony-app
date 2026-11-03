import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProfileForm from "./pages/ProfileForm";
import Search from "./pages/Search";
import Interests from "./pages/Interests";
import Admin from "./pages/Admin";
import ProfileView from "./pages/ProfileView";

function PageBackground() {
  const { pathname } = useLocation();

  useEffect(() => {
    let name = "default";
    if (pathname.startsWith("/search")) name = "search";
    else if (pathname.startsWith("/interests")) name = "interests";
    else if (pathname.startsWith("/profile")) name = "profile";
    else if (pathname.startsWith("/dashboard")) name = "dashboard";
    else if (pathname.startsWith("/login") || pathname.startsWith("/register")) name = "login";
    document.body.setAttribute("data-page", name);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <PageBackground />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfileForm />} />
          <Route path="/profile/:userId" element={<ProfileView />} />
          <Route path="/search" element={<Search />} />
          <Route path="/interests" element={<Interests />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </>
  );
}