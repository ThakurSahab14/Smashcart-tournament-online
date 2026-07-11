
import React from "react";
import { motion } from "framer-motion";
import { useTournament } from "../context/TournamentContext.jsx";

export default function Roster() {
  const { state } = useTournament();
  if (!state) return null;

  const isSolo = state.mode === "solo";

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-10 text-center">
        <h2 className="font-display text-4xl font-bold uppercase tracking-wider">
          {isSolo ? "On the Grid" : "Teams"}
        </h2>

        <p className="mt-3 text-white/50">
          {isSolo
            ? "Racers entered for this event."
            : "Rosters, captains, and crews."}
        </p>
      </div>

      {isSolo ? (
        state.players?.length ? (
          <div className="flex flex-wrap justify-center gap-3">
            {state.players.map((p, i) => (
              <motion.span
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="
group
relative
overflow-hidden
rounded-full
border
border-cyan-400/30
bg-gradient-to-r
from-[#141923]
to-[#0D1118]
px-6
py-3
font-display
text-lg
font-bold
tracking-wide
text-white
shadow-[0_0_20px_rgba(0,229,255,.08)]
transition-all
duration-300
hover:-translate-y-1
hover:border-cyan-400
hover:shadow-[0_0_30px_rgba(0,229,255,.25)]
"
              >
<>
  <span className="mr-3 text-cyan-300">
    #{i + 1}
  </span>

  <span className="text-white">
    {p.name}
  </span>
</>              </motion.span>
            ))}
          </div>
        ) : (
          <p className="text-center text-white/40">
            No racers added yet.
          </p>
        )
      ) : state.teams?.length ? (
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 place-items-center">
          {state.teams.map((team, i) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                y: -8,
                rotateX: 4,
                rotateY: -4,
                scale: 1.02,
              }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="group relative w-full max-w-md overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-[#151922] to-[#0E1218] p-6 shadow-xl"
            >
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl transition-all duration-500 group-hover:bg-cyan-400/20" />

              <p className="relative font-display text-2xl font-bold uppercase tracking-wide text-cyan-300">
                {team.name}
              </p>

              {team.captain && (
                <p className="mt-2 font-mono text-sm text-cyan-200/70">
                  👑 Captain: {team.captain}
                </p>
              )}

              <ul className="mt-5 space-y-2">
                {team.members.length ? (
                  team.members.map((m) => (
                    <li
                      key={m.id}
                      className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm text-white/80 transition-all duration-300 hover:border-cyan-400/20 hover:bg-cyan-400/10 hover:text-cyan-300"
                    >
                      ⚡ {m.name}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-white/30">
                    No members added yet
                  </li>
                )}
              </ul>

              <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

              <div className="mt-4 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-white/40">
                  Members
                </span>

                <span className="rounded-full bg-cyan-400/10 px-3 py-1 font-mono text-xs font-bold text-cyan-300">
                  {team.members.length}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-white/40">
          No teams added yet.
        </p>
      )}
    </section>
  );
}
