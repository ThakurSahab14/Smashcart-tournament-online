import React from "react";
import { motion } from "framer-motion";
import { useTournament } from "../context/TournamentContext.jsx";

export default function JoinBanner() {
  const { state } = useTournament();
  if (!state) return null;

  const link = state.joinLinks?.[state.mode];

  return (
    <section className="mx-auto max-w-3xl px-5 pb-4 pt-2">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col items-center gap-3 rounded-2xl border border-volt/30 bg-volt/5 px-6 py-5 text-center sm:flex-row sm:justify-between sm:text-left"
      >
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-volt">
            {state.mode === "solo" ? "Solo lobby" : "Team lobby"}
          </p>
          <p className="mt-1 text-sm text-white/60">
            {link
              ? "Race control has opened the lobby — jump in before the flag drops."
              : "The lobby link hasn't been shared yet. Check back soon."}
          </p>
        </div>

        {link ? (
          <motion.a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            animate={{
              boxShadow: [
                "0 0 0px rgba(0,229,255,0.4)",
                "0 0 24px rgba(0,229,255,0.5)",
                "0 0 0px rgba(0,229,255,0.4)",
              ],
            }}
            transition={{ boxShadow: { repeat: Infinity, duration: 2 } }}
            className="shrink-0 whitespace-nowrap rounded-full bg-volt px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-asphalt"
          >
            Join the race →
          </motion.a>
        ) : (
          <span className="shrink-0 rounded-full border border-white/10 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-white/30">
            Link pending
          </span>
        )}
      </motion.div>
    </section>
  );
}
