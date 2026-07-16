import React from "react";
import { motion } from "framer-motion";
import Hero3D from "../components/Hero3D.jsx";
import TournamentInfo from "../components/TournamentInfo.jsx";
import JoinBanner from "../components/JoinBanner.jsx";
import ModeExplainer from "../components/ModeExplainer.jsx";
import PrizePodium from "../components/PrizePodium.jsx";
import PastResults from "../components/PastResults.jsx";
import Roster from "../components/Roster.jsx";
import { useTournament } from "../context/TournamentContext.jsx";

export default function Home() {
  const { state } = useTournament();
  const matches = state?.matches || [];

  return (
    <main>
      <Hero3D />
      <TournamentInfo />
      <JoinBanner />
      <ModeExplainer />
      <PrizePodium />
      <PastResults />
      <Roster />

      {matches.length > 0 && (
        <section className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="mb-6 text-center font-display text-3xl font-bold uppercase tracking-wide">
            Race history
          </h2>
          <div className="space-y-3">
            {matches.slice(0, 8).map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-asphalt-light px-5 py-3 text-sm"
              >
                <span className="font-mono text-xs text-white/40">
                  {new Date(m.timestamp).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
                <span className="flex gap-4">
                  {m.payouts
                    .sort((a, b) => a.place - b.place)
                    .map((p) => (
                      <span key={p.place} className="text-white/80">
                        {p.place === 1 ? "🥇" : p.place === 2 ? "🥈" : "🥉"} {p.name}
                      </span>
                    ))}
                </span>
                <span className="font-mono text-xs text-volt">
                  ₹{m.prizePool.toLocaleString("en-IN")}
                </span>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <footer className="border-t border-white/5 py-8 text-center text-xs text-white/30">
        BrowserStack SmashKart Tournament — built for OG's, made by Gaurav with ❤️.
      </footer>
    </main>
  );
}
