import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { TournamentProvider } from "./context/TournamentContext.jsx";
import Navbar from "./components/Navbar.jsx";
import MatchAnnouncement from "./components/MatchAnnouncement.jsx";
import CompanionKart from "./components/CompanionKart.jsx";
import Home from "./pages/Home.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  const location = useLocation();
  return (
    <TournamentProvider>
      <div className="min-h-screen bg-asphalt text-white font-body">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <MatchAnnouncement />
        {location.pathname === "/" && <CompanionKart />}
      </div>
    </TournamentProvider>
  );
}
