import React from "react";
import InteractiveKart from "./InteractiveKart.jsx";
import RoamingKart from "./RoamingKart.jsx";

export default function HeroKartScene({ hovered, pointer }) {
  return (
    <>
      <color attach="background" args={["#0B0E14"]} />
      <fog attach="fog" args={["#0B0E14", 7, 20]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} />
      <directionalLight position={[-4, 3, -3]} intensity={0.4} color="#FF2E92" />

      <InteractiveKart hovered={hovered} pointer={pointer} />

      {Array.from({ length: 5 }).map((_, i) => (
        <RoamingKart key={i} seed={i + 1} />
      ))}

      {/* subtle ground grid glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#12161F" roughness={1} />
      </mesh>
    </>
  );
}
