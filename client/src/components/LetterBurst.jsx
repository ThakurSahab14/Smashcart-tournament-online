import React, { useMemo } from "react";
import { motion } from "framer-motion";

// deterministic pseudo-random so the scatter pattern is stable across renders
function seededRandom(seed) {
  const x = Math.sin(seed * 999.7) * 43758.5453;
  return x - Math.floor(x);
}

const STAGGER = 0.06;
const SETTLE = 1.0;

export function wordBurstDuration(text) {
  return text.length * STAGGER + SETTLE;
}

/**
 * Renders `text` as individual characters that start scattered across a
 * wide radius with random 3D rotation, then spring-bounce into their
 * resting position to spell the word out. Pass `shine` to sweep a gold
 * highlight across the finished word once it lands.
 */
export default function LetterBurst({ text, className = "", shine = false, onDone }) {
  const chars = useMemo(() => text.split("").map((ch, i) => ({ ch, i })), [text]);
  const duration = wordBurstDuration(text);

  return (
    <span
      style={{ position: "relative", display: "inline-block", perspective: 1200 }}
      className={className}
    >
      {chars.map(({ ch, i }) => {
        const rx = (seededRandom(i) * 2 - 1) * 520;
        const ry = (seededRandom(i + 50) * 2 - 1) * 340;
        const rz = (seededRandom(i + 75) * 2 - 1) * 900;
        const rot = (seededRandom(i + 100) * 2 - 1) * 720;
        const rotAxis = seededRandom(i + 200) > 0.5 ? "rotateX" : "rotateY";

        return (
          <motion.span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              transformStyle: "preserve-3d",
            }}
            initial={{
              x: rx,
              y: ry,
              z: rz,
              opacity: 0,
              scale: 0.25,
              [rotAxis]: rot,
            }}
            animate={{ x: 0, y: 0, z: 0, opacity: 1, scale: 1, [rotAxis]: 0 }}
            transition={{
              delay: i * STAGGER,
              type: "spring",
              damping: 10,
              stiffness: 100,
              mass: 0.75,
            }}
            onAnimationComplete={i === chars.length - 1 ? onDone : undefined}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        );
      })}

      {shine && (
        <motion.span
          initial={{ x: "-60%" }}
          animate={{ x: "160%" }}
          transition={{ delay: duration * 0.55, duration: 0.6, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "35%",
            height: "100%",
            background:
              "linear-gradient(100deg, transparent, rgba(255,215,0,0.9), transparent)",
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      )}
    </span>
  );
}