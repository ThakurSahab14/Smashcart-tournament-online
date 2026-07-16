import React from "react";
import { motion } from "framer-motion";
import { useTournament } from "../context/TournamentContext.jsx";

const podiumStyle = [
  { key: "champion", place: 1, label: "Champion", color: "#FFC93C", height: 140, order: 2 },
  { key: "second", place: 2, label: "2nd", color: "#C9D6DF", height: 100, order: 1 },
  { key: "third", place: 3, label: "3rd", color: "#D98C4A", height: 72, order: 3 },
];

export default function PrizePodium() {
  const { state } = useTournament();
  if (!state) return null;

  const isSolo = state.mode === "solo";
  const pool = isSolo
    ? (Number(state.soloPrizePool) || 0)
    : (Number(state.prizePool) || 0);
  const split = state.soloSplit || { champion: 50, second: 30, third: 20 };

  const latestSoloMatch = state.matches?.find((m) => m.mode === "solo");
  const nameByPlace = {};
  latestSoloMatch?.results?.forEach((r) => {
    nameByPlace[r.place] = r.name;
  });

  const latestTeamMatch = state.matches?.find((m) => m.mode === "team");
  const winningTeamName = latestTeamMatch?.results?.find((r) => r.place === 1)?.name;

  return (
    <section id="leaderboard" className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-10 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-volt">
          Live prize pool
        </span>
        <h2 className="mt-2 font-display text-4xl font-bold">
          ₹{pool.toLocaleString("en-IN")}
        </h2>
        <p className="mt-2 text-sm text-white/50">
          {isSolo
            ? "Split across the top 3 finishers when the race ends."
            : "Awarded in full to the winning team."}
        </p>
      </div>

      {isSolo ? (
        <div className="flex items-end justify-center gap-4 sm:gap-8">
          {[...podiumStyle]
            .sort((a, b) => a.order - b.order)
            .map((p) => (
              <div key={p.key} className="flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-2 text-center"
                >
                  <p className="font-display text-lg font-bold" style={{ color: p.color }}>
                    ₹{Math.round((pool * split[p.key]) / 100).toLocaleString("en-IN")}
                  </p>
                  <p className="font-mono text-[11px] text-white/40">{split[p.key]}%</p>
                </motion.div>
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: p.height }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex w-20 flex-col items-center justify-start rounded-t-lg pt-2 sm:w-28"
                  style={{ backgroundColor: p.color }}
                >
                  <span className="font-display text-sm font-bold text-asphalt">{p.label}</span>
                  <span className="mt-0.5 max-w-[90%] truncate font-mono text-[11px] font-semibold text-asphalt/70">
                    {nameByPlace[p.place] || "—"}
                  </span>
                </motion.div>
              </div>
            ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-sm flex-col items-center rounded-2xl border border-surge/30 bg-surge/5 p-8 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-surge">
            Winner takes all
          </span>
          <p className="mt-2 font-display text-3xl font-bold">
            ₹{pool.toLocaleString("en-IN")}
          </p>
          {winningTeamName && (
            <p className="mt-2 font-display text-lg font-bold text-surge">{winningTeamName}</p>
          )}
          <p className="mt-2 text-xs text-white/50">
            Handed to the champion team's captain to split with teammates.
          </p>
        </motion.div>
      )}
    </section>
  );
}
