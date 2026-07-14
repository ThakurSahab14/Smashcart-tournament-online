import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
} from "framer-motion";
import confetti from "canvas-confetti";
import KartMesh from "./three/KartMesh.jsx";

function IdleCompanion({ tiltRef, boosted }) {
  const group = useRef();

  useFrame((state, delta) => {
    if (!group.current) return;

    const t = state.clock.getElapsedTime();

    group.current.position.y = Math.sin(t * 3) * 0.06;
    group.current.rotation.z = tiltRef.current * 0.6;

    const targetScale = boosted ? 1.15 : 1;

    group.current.scale.setScalar(
      group.current.scale.x +
        (targetScale - group.current.scale.x) * Math.min(delta * 6, 1)
    );
  });

  return (
    <group ref={group} rotation={[0, Math.PI * 0.15, 0]} scale={1}>
      <KartMesh bodyColor="#1E3A8A" scoopColor="#E11D2E" scale={0.62} />
    </group>
  );
}

export default function CompanionKart() {
  const { scrollYProgress } = useScroll();
  const velocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(velocity, {
    stiffness: 120,
    damping: 20,
  });

  const tilt = useTransform(
    smoothVelocity,
    [-2, 0, 2],
    [0.6, 0, -0.6],
    { clamp: true }
  );

  const tiltRef = useRef(0);

  const [popup, setPopup] = useState(false);
  const [boosted, setBoosted] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const messages = [
    
    "Aur zor se!",
    "Press Harder!💋 ",
    "Bas itna hi dum hai?🍌 ",
    "Yes Honey 🍆!",
    "Ohh baby paani nikal diyaa! 💦",
    "Lode, tournament join kar le...",
    "Tu tou Kart tod dega! 🏎️",
  ];

  // Loop through messages - start from beginning when reaching the end
  const currentMessage = messages[clickCount % messages.length];

  useEffect(() => {
    const unsubscribe = tilt.on("change", (v) => {
      tiltRef.current = v;
    });

    return () => unsubscribe();
  }, [tilt]);

  function handleClick() {
    setClickCount((prev) => prev + 1);

    setPopup(true);
    setBoosted(true);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { x: 0.92, y: 0.85 },
      colors: ["#00E5FF", "#FF2E92", "#FFC93C"],
    });

    setTimeout(() => setBoosted(false), 500);
    setTimeout(() => setPopup(false), 3000);
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-3 z-30 sm:bottom-6 sm:right-6">
      <motion.div
        className="pointer-events-auto relative h-24 w-24 cursor-pointer select-none sm:h-28 sm:w-28"
        onClick={handleClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
       {popup && (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.85 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.25 }}
    className="absolute -top-28 left-1/2 -translate-x-1/2 z-50
               max-w-[220px] rounded-lg
               bg-volt/95 px-3 py-2
               text-[10px] font-semibold text-asphalt
               shadow-2xl whitespace-normal text-center"
  >
    {currentMessage}
  </motion.div>
)}

        <Canvas
          camera={{ position: [0, 1.1, 3.4], fov: 40 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[3, 4, 3]} intensity={1} />

          <IdleCompanion tiltRef={tiltRef} boosted={boosted} />
        </Canvas>
      </motion.div>
    </div>
  );
}