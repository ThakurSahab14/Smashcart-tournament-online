import React, { useMemo } from "react";
import { motion } from "framer-motion";

function seededRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export default function ParticlesOverlay({ count = 45, fadeOut = false }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: seededRandom(i) * 100,
        top: seededRandom(i + 100) * 100,
        size: 2 + seededRandom(i + 200) * 3,
        delay: seededRandom(i + 300) * 2,
        duration: 1.5 + seededRandom(i + 400) * 2,
        color: i % 5 === 0 ? "#FFC93C" : i % 3 === 0 ? "#FF2E92" : "#00E5FF",
      })),
    [count]
  );

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.8 }}
    >
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            backgroundColor: d.color,
            boxShadow: `0 0 6px ${d.color}`,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0.3, 1, 0], scale: [0.5, 1, 0.8, 1, 0.5] }}
          transition={{
            delay: d.delay,
            duration: d.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}