import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useTournament } from "../context/TournamentContext.jsx";
import CertificateCard from "./CertificateCard.jsx";

function fireConfetti() {
  const colors = ["#FFC93C", "#00E5FF", "#FF2E92", "#C9D6DF"];
  const duration = 2200;
  const end = Date.now() + duration;

  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, colors });
    confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  confetti({ particleCount: 140, spread: 100, origin: { y: 0.4 }, colors });
}

export default function MatchAnnouncement() {
  const { lastAnnouncement, setLastAnnouncement } = useTournament();

  useEffect(() => {
    if (lastAnnouncement) fireConfetti();
  }, [lastAnnouncement]);

  if (!lastAnnouncement) return null;

  const { payouts, mode } = lastAnnouncement;
  const sorted = [...payouts].sort((a, b) => a.place - b.place);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-asphalt/95 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative w-full max-w-4xl rounded-2xl border border-white/10 bg-asphalt-light p-6 sm:p-10"
        >
          <button
            onClick={() => setLastAnnouncement(null)}
            className="absolute right-4 top-4 rounded-full border border-white/10 px-3 py-1 text-sm text-white/50 hover:text-surge"
          >
            Close ✕
          </button>

          <div className="mb-8 text-center">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-volt">
              Checkered flag
            </span>
            <h2 className="mt-2 font-display text-4xl font-bold uppercase sm:text-5xl">
              Race Results
            </h2>
            <p className="mt-2 text-sm text-white/50">
              {mode === "team"
                ? "Winning team takes the pool — captain distributes it."
                : "Prize pool split across the podium."}
            </p>
          </div>

          <div
            className={`grid gap-8 ${
              sorted.length > 1 ? "sm:grid-cols-3" : "mx-auto max-w-sm"
            }`}
          >
            {sorted.map((p) => (
              <CertificateCard
                key={p.place}
                place={p.place}
                name={p.name}
                prizeAmount={p.amount}
                mode={mode}
                note={p.note}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
