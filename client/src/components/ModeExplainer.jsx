import React from "react";
import { motion } from "framer-motion";
import { useTournament } from "../context/TournamentContext.jsx";

function ModeCard({ accent, title, tag, children, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5, delay }}
      className="relative flex-1 rounded-2xl border border-white/10 bg-asphalt-light p-6 sm:p-8"
      style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.02), 0 20px 60px -30px ${accent}66` }}
    >
      <span
        className="font-mono text-xs uppercase tracking-[0.2em]"
        style={{ color: accent }}
      >
        {tag}
      </span>
      <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide">{title}</h3>
      <div className="mt-4 text-sm leading-relaxed text-white/70">{children}</div>
    </motion.div>
  );
}

function SplitBar({ label, pct, color }) {
  return (
    <div className="mt-3 flex items-center gap-3">
      <span className="w-16 shrink-0 font-mono text-xs text-white/50">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="w-10 shrink-0 text-right font-mono text-xs text-white/70">{pct}%</span>
    </div>
  );
}

export default function ModeExplainer() {
  const { state } = useTournament();
  const split = state?.soloSplit || { champion: 50, second: 30, third: 20 };

  return (
    <section id="modes" className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-bold uppercase tracking-wide">
          Two ways to race
        </h2>
        <p className="mt-2 text-sm text-white/50">
          Pick your lane — go it alone or roll with a crew.
        </p>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row">
        <ModeCard accent="#00E5FF" tag="1 driver, 1 seat" title="Solo Mode" delay={0}>
          <p>
            Every racer competes individually. When the checkered flag drops, the top three
            finishers split the prize pool — Champion takes the biggest cut, 2nd a smaller
            share, 3rd the rest.
          </p>
          <SplitBar label="Champion" pct={split.champion} color="#FFC93C" />
          <SplitBar label="2nd" pct={split.second} color="#C9D6DF" />
          <SplitBar label="3rd" pct={split.third} color="#D98C4A" />
          <p className="mt-3 text-xs text-white/40">
            Split percentages are set by the admin and always add up to 100% of whatever
            prize pool is live.
          </p>
        </ModeCard>

        <ModeCard accent="#FF2E92" tag="1 crew, 1 trophy" title="Team Mode" delay={0.12}>
          <p>
            Racers group into teams with a captain. When a team wins, the entire prize pool
            goes to that team as one lump sum — the captain decides how it's shared among
            teammates.
          </p>
          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="font-mono text-xs uppercase tracking-widest text-surge">
              Winning team takes
            </p>
            <p className="mt-1 font-display text-3xl font-bold">100%</p>
            <p className="mt-1 text-xs text-white/40">of the live prize pool, no split by place</p>
          </div>
        </ModeCard>
      </div>
    </section>
  );
}
