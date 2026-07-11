import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, useScroll, useTransform } from "framer-motion";
import confetti from "canvas-confetti";
import HeroKartScene from "./three/HeroKartScene.jsx";
import DancingText3D, { dancingTextDuration } from "./DancingText3D.jsx";

const HEADLINE_SEGMENTS = [
  { text: "Welcome to ", className: "text-white/70" },
  { text: "BrowserStack ", className: "text-white" },
  { text: "SmashKart ", className: "text-volt" },
  { text: "Tournament", className: "text-surge" },
];
const HEADLINE_CHAR_COUNT = HEADLINE_SEGMENTS.reduce((n, s) => n + s.text.length, 0);
const DANCE_DURATION = dancingTextDuration(HEADLINE_CHAR_COUNT);

function burstConfetti() {
  const colors = ["#00E5FF", "#FF2E92", "#FFC93C", "#7ED957"];
  confetti({
    particleCount: 90,
    spread: 100,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.65 },
    colors,
  });
  confetti({ particleCount: 40, angle: 60, spread: 70, origin: { x: 0.1, y: 0.7 }, colors });
  confetti({ particleCount: 40, angle: 120, spread: 70, origin: { x: 0.9, y: 0.7 }, colors });
}

export default function Hero3D() {
  const sectionRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const touchTimeout = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.55]);

  useEffect(() => {
    if (hovered) burstConfetti();
  }, [hovered]);

  // track the cursor across the whole page (not just the hero) so the
  // kart keeps rotating to face you no matter where you scroll to
  useEffect(() => {
    function handleMove(e) {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const py = (e.clientY / window.innerHeight) * 2 - 1;
      pointer.current = { x, y: py };
    }
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  function handleTouch() {
    setHovered(true);
    clearTimeout(touchTimeout.current);
    touchTimeout.current = setTimeout(() => setHovered(false), 1800);
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[78vh] min-h-[520px] overflow-hidden border-b border-white/5"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={handleTouch}
    >
      <motion.div
        style={{ y, opacity }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: DANCE_DURATION, duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Canvas
          camera={{ position: [0, 1.4, 6], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true }}
        >
          <HeroKartScene hovered={hovered} pointer={pointer} />
        </Canvas>
      </motion.div>

      {/* readable gradient so text sits comfortably over the 3D scene */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-asphalt via-transparent to-asphalt/40" />

      <div className="pointer-events-none relative flex h-full flex-col items-center justify-end px-5 pb-12 text-center">
        <h1 className="font-display text-3xl font-bold uppercase leading-tight tracking-wide sm:text-5xl">
          <DancingText3D segments={HEADLINE_SEGMENTS} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: DANCE_DURATION + 0.1, duration: 0.5 }}
          className="mx-auto mt-4 max-w-xl font-mono text-sm text-white/60 sm:text-base"
        >
          🎮 Sirf dekhne se kuch nahi hoga!
Agar lagta hai tu sabse best hai, toh abhi tournament join kar!
Admin se contact karo, race jeeto aur Cash Prizes ghar le jao! 🚀
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: DANCE_DURATION + 0.3, duration: 0.5 }}
          className="pointer-events-auto mt-7 flex justify-center gap-3"
        >
          <a
            href="#modes"
            className="rounded-full bg-volt px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-asphalt transition hover:brightness-110"
          >
            See the modes
          </a>
          <a
            href="#leaderboard"
            className="rounded-full border border-white/15 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-white/80 transition hover:border-surge hover:text-surge"
          >
            Live grid
          </a>
        </motion.div>
      </div>
    </section>
  );
}
