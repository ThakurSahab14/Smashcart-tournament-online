import React, { useMemo } from "react";
import { motion } from "framer-motion";

// deterministic pseudo-random so the scatter pattern is stable across renders
function seededRandom(seed) {
  const x = Math.sin(seed * 999.7) * 43758.5453;
  return x - Math.floor(x);
}

const STAGGER = 0.032;

export default function DancingText3D({ segments, className = "" }) {
  const chars = useMemo(() => {
    const out = [];
    let i = 0;
    segments.forEach((seg) => {
      for (const ch of seg.text) {
        out.push({ ch, className: seg.className || "", index: i });
        i++;
      }
    });
    return out;
  }, [segments]);

  return (
    <span className={className} style={{ display: "inline-block", perspective: 1000 }}>
      {chars.map((c) => {
        const rx = (seededRandom(c.index) * 2 - 1) * 260;
        const ry = (seededRandom(c.index + 50) * 2 - 1) * 170;
        const rot = (seededRandom(c.index + 100) * 2 - 1) * 520;
        const rotAxis = seededRandom(c.index + 200) > 0.5 ? "rotate" : "rotateY";

        return (
          <motion.span
            key={c.index}
            className={c.className}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              transformStyle: "preserve-3d",
            }}
            initial={{
              x: rx,
              y: ry,
              opacity: 0,
              scale: 0.3,
              [rotAxis]: rot,
            }}
            animate={{ x: 0, y: 0, opacity: 1, scale: 1, [rotAxis]: 0 }}
            transition={{
              delay: c.index * STAGGER,
              type: "spring",
              damping: 9,
              stiffness: 110,
              mass: 0.6,
            }}
          >
            {c.ch === " " ? "\u00A0" : c.ch}
          </motion.span>
        );
      })}
    </span>
  );
}

export function dancingTextDuration(charCount) {
  return charCount * STAGGER + 0.8;
}
