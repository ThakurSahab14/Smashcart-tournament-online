import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(password);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-white/10 bg-asphalt-light p-8"
      >
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide">
          Admin Login
        </h1>
        <p className="mt-1 text-sm text-white/50">Race control access only.</p>

        <label className="mt-6 block text-xs font-medium uppercase tracking-wide text-white/50">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-lg border border-white/10 bg-asphalt px-4 py-2.5 text-white outline-none focus:border-volt"
          placeholder="••••••••"
          autoFocus
        />

        {error && <p className="mt-3 text-sm text-surge">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-volt py-2.5 font-display font-bold uppercase tracking-wide text-asphalt transition hover:brightness-110 disabled:opacity-50"
        >
          {loading ? "Checking…" : "Enter race control"}
        </button>
      </motion.form>
    </main>
  );
}
