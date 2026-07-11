import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import KartMesh from "./KartMesh.jsx";
import SmokeParticles from "./SmokeParticles.jsx";
const PALETTE = ["#00E5FF", "#FF2E92", "#FFC93C", "#7ED957", "#C9D6DF"];

export default function RoamingKart({ seed = 0 }) {
  const group = useRef();
  const smoke = useRef([]);
  const cfg = useMemo(() => {
    const rand = (min, max) => min + ((Math.sin(seed * 999 + min) + 1) / 2) * (max - min);
    return {
      radiusX: rand(4.5, 8),
      radiusZ: rand(2, 4),
      baseY: rand(-1.8, 0.6),
      baseZ: rand(-9, -4),
      speed: rand(0.12, 0.28),
      phase: seed * 1.7,
      scale: rand(0.32, 0.52),
      color: PALETTE[seed % PALETTE.length],
    };
  }, [seed]);

useFrame(({clock,camera}) => {
    if (!group.current) return;
    const t = clock.getElapsedTime() * cfg.speed + cfg.phase;
    const x = Math.sin(t) * cfg.radiusX;
    const z = cfg.baseZ + Math.cos(t) * cfg.radiusZ;
    group.current.position.set(x, cfg.baseY + Math.sin(t * 2) * 0.15, z);
    group.current.rotation.y = -t - Math.PI / 2;
    smoke.current.forEach((p, i) => {

  if (!p) return;

p.position.z -= 0.02;
  p.position.y += 0.008;
p.lookAt(
    camera.position
);
  p.scale.multiplyScalar(1.01);

  p.material.opacity -= 0.008;

  if (p.material.opacity <= 0) {

    p.position.set(
      (Math.random() - 0.5) * 0.12,
      0.18,
      -1.55
    );

    p.scale.setScalar(0.05);

    p.material.opacity = 0.45;

  }

});
  });

  return (
    <group ref={group} scale={cfg.scale}>
      <KartMesh bodyColor={cfg.color} scoopColor="#12161F" />  <SmokeParticles />

      {Array.from({ length: 8 }).map((_, i) => (

  <mesh
    key={i}
    ref={(el) => (smoke.current[i] = el)}
    position={[
   (Math.random()-0.5)*0.18,
   0.28,
   -1.8
]}
  >

   <planeGeometry
  args={[0.35,0.35]}
/>

    <meshBasicMaterial
    color="#ffffff"
    transparent
    opacity={0.28}
    depthWrite={false}
/>

  </mesh>

))}
    </group>
  );
}
