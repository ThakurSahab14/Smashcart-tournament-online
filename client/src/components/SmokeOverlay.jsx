import React from "react";
import { motion } from "framer-motion";

const BLOBS = [
  { x: "20%", y: "60%", size: 260, delay: 0 },
  { x: "50%", y: "70%", size: 340, delay: 0.08 },
  { x: "78%", y: "58%", size: 280, delay: 0.15 },
  { x: "38%", y: "50%", size: 220, delay: 0.22 },
  { x: "65%", y: "45%", size: 240, delay: 0.1 },
];

export default function SmokeOverlay({ active }) {
  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            marginLeft: -b.size / 2,
            marginTop: -b.size / 2,
            background:
              "radial-gradient(circle, rgba(230,230,235,0.35) 0%, rgba(230,230,235,0) 70%)",
            filter: "blur(18px)",
          }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.4, 1.4, 1.9] }}
          transition={{ delay: b.delay, duration: 1.1, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}