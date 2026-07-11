import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LetterBurst, { wordBurstDuration } from "./LetterBurst.jsx";
import ParticlesOverlay from "./ParticlesOverlay.jsx";
import SmokeOverlay from "./SmokeOverlay.jsx";

const WORDS = {
  welcome: { text: "WELCOME TO", className: "text-white/80" },
  smash: { text: "SMASHKART", className: "text-volt", shine: true },
  tour: { text: "TOURNAMENT", className: "text-surge" },
};

const SHAKE_KEYFRAMES = {
  x: [0, -10, 9, -7, 5, -3, 0],
  y: [0, 6, -5, 4, -2, 1, 0],
  rotate: [0, -1.2, 1, -0.6, 0.4, -0.2, 0],
};

/**
 * Full timeline (durations computed from word length so it stays in sync
 * if you change the copy):
 *   black + particles -> WELCOME TO bursts in -> flash -> SMASHKART bursts
 *   in with a gold shine -> TOURNAMENT bursts in -> camera shake -> smoke
 *   clears -> onKartReveal() fires -> onComplete() fires (buttons etc.)
 */
export default function CinematicIntro({ onKartReveal, onComplete }) {
  const [stage, setStage] = useState(null);
  const [flashKey, setFlashKey] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const [smoke, setSmoke] = useState(false);
  const [particlesFading, setParticlesFading] = useState(false);
  const [blackoutDone, setBlackoutDone] = useState(false);
  const firedKartReveal = useRef(false);
  const firedComplete = useRef(false);

  useEffect(() => {
    const timers = [];
    const w1 = wordBurstDuration(WORDS.welcome.text) * 1000;
    const w2 = wordBurstDuration(WORDS.smash.text) * 1000;
    const w3 = wordBurstDuration(WORDS.tour.text) * 1000;

    let t = 300;
    timers.push(setTimeout(() => setStage("welcome"), t));

    t += w1 + 200;
    timers.push(
      setTimeout(() => {
        setFlashKey((k) => k + 1);
        setStage(null);
      }, t)
    );

    t += 300;
    timers.push(setTimeout(() => setStage("smash"), t));

    t += w2 + 300;
    timers.push(setTimeout(() => setStage(null), t));

    t += 200;
    timers.push(setTimeout(() => setStage("tour"), t));

    t += w3 + 200;
    timers.push(
      setTimeout(() => {
        setStage(null);
        setShakeKey((k) => k + 1);
      }, t)
    );

    t += 450;
    timers.push(
      setTimeout(() => {
        setSmoke(true);
        setParticlesFading(true);
        if (!firedKartReveal.current) {
          firedKartReveal.current = true;
          onKartReveal?.();
        }
      }, t)
    );

    t += 900;
    timers.push(
      setTimeout(() => {
        setBlackoutDone(true);
        if (!firedComplete.current) {
          firedComplete.current = true;
          onComplete?.();
        }
      }, t)
    );

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeWord = stage ? WORDS[stage] : null;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden bg-asphalt"
      animate={{ opacity: blackoutDone ? 0 : 1 }}
      transition={{ duration: 0.6 }}
      style={{ pointerEvents: blackoutDone ? "none" : "auto" }}
    >
      <ParticlesOverlay fadeOut={particlesFading} />

      <motion.div
        key={shakeKey}
        animate={shakeKey > 0 ? SHAKE_KEYFRAMES : {}}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className="relative flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {activeWord && (
            <motion.div
              key={stage}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="px-4 text-center font-display text-4xl font-bold uppercase tracking-wide sm:text-7xl"
            >
              <LetterBurst
                text={activeWord.text}
                className={activeWord.className}
                shine={activeWord.shine}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <SmokeOverlay active={smoke} />

      {/* electric flash */}
      <motion.div
        key={flashKey}
        className="pointer-events-none absolute inset-0 bg-white mix-blend-screen"
        initial={{ opacity: 0 }}
        animate={flashKey > 0 ? { opacity: [0, 0.9, 0, 0.5, 0] } : { opacity: 0 }}
        transition={{ duration: 0.35, times: [0, 0.15, 0.35, 0.6, 1] }}
      />
    </motion.div>
  );
}