import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import KartIcon from "./KartIcon.jsx";
import { useTournament } from "../context/TournamentContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { connected } = useTournament();
  const { isAdmin, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-asphalt/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <KartIcon className="h-8 w-14" />
          <span className="font-display text-lg font-bold tracking-wide text-white">
            SMASH<span className="text-volt">KART</span>{" "}
            <span className="hidden font-body text-xs font-medium text-white/40 sm:inline">
              × BrowserStack Tournament
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
            <motion.span
              animate={{ opacity: connected ? [1, 0.4, 1] : 0.3 }}
              transition={{ repeat: connected ? Infinity : 0, duration: 1.6 }}
              className={`h-2 w-2 rounded-full ${connected ? "bg-volt" : "bg-white/30"}`}
            />
            {connected ? "Live" : "Connecting…"}
          </span>

          {isAdmin ? (
            <>
              <Link
                to="/admin"
                className={`rounded-full px-4 py-1.5 font-medium transition ${
                  location.pathname === "/admin"
                    ? "bg-volt text-asphalt"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Admin Panel
              </Link>
              <button
                onClick={logout}
                className="rounded-full border border-white/10 px-4 py-1.5 text-white/60 hover:text-surge"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              className="rounded-full border border-volt/40 px-4 py-1.5 font-medium text-volt transition hover:bg-volt hover:text-asphalt"
            >
              Admin Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
