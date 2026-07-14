import React from "react";
import { motion } from "framer-motion";
import { useTournament } from "../context/TournamentContext.jsx";

function PlaceRow({ emoji, name, amount }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/80">
        {emoji} {name}
      </span>
      <span className="font-mono text-xs text-volt">₹{amount.toLocaleString("en-IN")}</span>
    </div>
  );
}

export default function PastResults() {
  const { state } = useTournament();
  if (!state) return null;

  const soloMatch = state.matches?.find((m) => m.mode === "solo");
  const teamMatch = state.matches?.find((m) => m.mode === "team");

  if (!soloMatch && !teamMatch) return null;

  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl font-bold uppercase tracking-wide">
          Latest results
        </h2>
        <p className="mt-2 text-sm text-white/50">
          Stays up until an admin resets it for the next tournament.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {soloMatch && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-asphalt-light p-6"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-volt">
              Solo · {new Date(soloMatch.timestamp).toLocaleDateString("en-IN", {
                dateStyle: "medium",
              })}
            </span>
            <div className="mt-4 space-y-2">
              {soloMatch.payouts
                .sort((a, b) => a.place - b.place)
                .map((p) => (
                  <PlaceRow
                    key={p.place}
                    emoji={p.place === 1 ? "🥇" : p.place === 2 ? "🥈" : "🥉"}
                    name={p.name}
                    amount={p.amount}
                  />
                ))}
            </div>
          </motion.div>
        )}

        {teamMatch && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-asphalt-light p-6"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-surge">
              Team · {new Date(teamMatch.timestamp).toLocaleDateString("en-IN", {
                dateStyle: "medium",
              })}
            </span>
            <div className="mt-4">
              <p className="font-display text-xl font-bold text-surge">
                🏆 {teamMatch.payouts[0]?.name}
              </p>
              {teamMatch.payouts[0]?.captain && (
                <p className="mt-0.5 text-xs text-white/40">
                  Captain: {teamMatch.payouts[0].captain}
                </p>
              )}
              {teamMatch.payouts[0]?.members?.length > 0 && (
                <p className="mt-2 text-sm text-white/70">
                  {teamMatch.payouts[0].members.join(" · ")}
                </p>
              )}
              <p className="mt-3 font-mono text-xs text-volt">
                ₹{teamMatch.payouts[0]?.amount.toLocaleString("en-IN")} total
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
