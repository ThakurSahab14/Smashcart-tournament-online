import React, { useState } from "react";
import { motion } from "framer-motion";

export default function TournamentInfo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-asphalt py-12">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-cyan-500/10 to-transparent" />
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-purple-500/10 to-transparent" />
      </div>

      {/* Main Flip Card Container */}
      <div
        className="relative w-full max-w-lg mx-auto px-5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative min-h-[380px] w-full"
          style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
          animate={{ rotateY: isHovered ? 180 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Front Side */}
          <div className="absolute inset-0 rounded-3xl border-2 border-cyan-400/50 bg-gradient-to-br from-[#151c2c] to-[#0d1118] p-6 shadow-2xl shadow-cyan-500/20 backface-hidden">
            {/* Glow effects */}
            <div className="absolute -left-20 -top-20 h-60 w-60 animate-pulse rounded-full bg-cyan-400/20 blur-[80px]" />
            <div className="absolute -bottom-20 -right-20 h-60 w-60 animate-pulse rounded-full bg-purple-400/20 blur-[80px]" />

            <div className="relative flex h-full flex-col items-center justify-center text-center">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-6xl mb-4"
              >
                🏆
              </motion.div>

              <h2 className="font-display text-4xl font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-[length:200%_auto] animate-gradient">
                Tournament
              </h2>
              <p className="mt-2 font-display text-xl text-white/50">
                Details
              </p>

              <motion.div
                whileHover={{ scale: 1.1 }}
                className="mt-8 flex items-center gap-3 rounded-full border-2 border-white/20 bg-white/5 px-5 py-2"
              >
                <motion.span
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="h-3 w-3 rounded-full bg-cyan-400"
                />
                <span className="text-lg font-medium text-white/70">Hover to Reveal</span>
              </motion.div>

              {/* Corner Decorations */}
              <div className="absolute left-4 top-4 h-4 w-4 border-l-2 border-t-2 border-cyan-400" />
              <div className="absolute right-4 top-4 h-4 w-4 border-r-2 border-t-2 border-cyan-400" />
              <div className="absolute bottom-4 left-4 h-4 w-4 border-l-2 border-b-2 border-cyan-400" />
              <div className="absolute bottom-4 right-4 h-4 w-4 border-r-2 border-b-2 border-cyan-400" />
            </div>
          </div>

          {/* Back Side - Details */}
          <div className="absolute inset-0 rotate-y-180 rounded-3xl border-2 border-purple-400/50 bg-gradient-to-br from-[#1a1530] to-[#0d1118] p-5 shadow-2xl shadow-purple-500/20 backface-hidden">
            <div className="absolute -left-20 -top-20 h-60 w-60 animate-pulse rounded-full bg-purple-500/20 blur-[80px]" />
            <div className="absolute -bottom-20 -right-20 h-60 w-60 animate-pulse rounded-full bg-cyan-500/20 blur-[80px]" />

            <div className="relative h-full overflow-y-auto">
              {/* Solo Section */}
              <h3 className="text-center font-display text-xl font-bold uppercase tracking-wider text-cyan-300">
                ⚡ Solo Tournament
              </h3>
              <div className="mt-3 space-y-2">
                <motion.div whileHover={{ x: 6 }} className="flex items-center gap-3 rounded-lg bg-cyan-500/10 p-3 border border-cyan-400/20">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/30 text-sm font-bold text-cyan-300">1</span>
                  <div>
                    <p className="text-white text-sm font-bold">1 Round</p>
                    <p className="text-xs text-white/50">20 mins</p>
                  </div>
                </motion.div>
                <motion.div whileHover={{ x: 6 }} className="flex items-center gap-3 rounded-lg bg-cyan-500/10 p-3 border border-cyan-400/20">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/30 text-sm font-bold text-cyan-300">2</span>
                  <div>
                    <p className="text-white text-sm font-bold">Map: Smash Island</p>
                    <p className="text-xs text-white/50">Total ~25 mins</p>
                  </div>
                </motion.div>
                <motion.div whileHover={{ x: 6 }} className="flex items-center gap-3 rounded-lg bg-cyan-500/10 p-3 border border-cyan-400/20">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/30 text-sm font-bold text-cyan-300">3</span>
                  <div>
                    <p className="text-white text-sm font-bold">Total Time: ~30 mins</p>
                    <p className="text-xs text-white/50">Quick and intense matches</p>
                  </div>
                </motion.div>
              </div>

              {/* Team Section */}
              <h3 className="mt-4 text-center font-display text-xl font-bold uppercase tracking-wider text-purple-300">
                🚩 Team Flag Tournament
              </h3>
              <div className="mt-3 space-y-2">
                <motion.div whileHover={{ x: 6 }} className="flex items-center gap-3 rounded-lg bg-purple-500/10 p-3 border border-purple-400/20">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/30 text-sm font-bold text-purple-300">1</span>
                  <div>
                    <p className="text-white text-sm font-bold">3 Rounds total</p>
                    <p className="text-xs text-white/50">Play through all rounds</p>
                  </div>
                </motion.div>
                <motion.div whileHover={{ x: 6 }} className="flex items-center gap-3 rounded-lg bg-purple-500/10 p-3 border border-purple-400/20">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/30 text-sm font-bold text-purple-300">2</span>
                  <div>
                    <p className="text-white text-sm font-bold">Flag Score Target: 10</p>
                    <p className="text-xs text-white/50">First team to reach 10 wins</p>
                  </div>
                </motion.div>
                <motion.div whileHover={{ x: 6 }} className="flex items-center gap-3 rounded-lg bg-purple-500/10 p-3 border border-purple-400/20">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/30 text-sm font-bold text-purple-300">3</span>
                  <div>
                    <p className="text-white text-sm font-bold">Map: Smash Island</p>
                    <p className="text-xs text-white/50">Capture the flag mode</p>
                  </div>
                </motion.div>
                <motion.div whileHover={{ x: 6 }} className="flex items-center gap-3 rounded-lg bg-volt/20 p-3 border border-volt/40">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-volt/30 text-sm">🏆</span>
                  <div>
                    <p className="text-white text-sm font-bold">Best of 3 wins</p>
                    <p className="text-xs text-white/50">Whichever team wins 2 matches takes the prize</p>
                  </div>
                </motion.div>
              </div>

              {/* Time Notice */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="mt-4 flex items-center justify-center gap-2 rounded-full border-2 border-volt bg-volt/20 px-4 py-2"
              >
                <span className="text-lg">⏰</span>
                <span className="font-display text-sm font-bold text-volt">Tournament starts at 8:00 PM Sharp!</span>
              </motion.div>
              <p className="mt-1 text-center text-xs text-white/50">
                Make sure you're online on time • Tournament: 8:00 PM - 9:30 PM
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}