import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const HOVER_COLORS = ["#FF2E92", "#FFC93C", "#7ED957", "#00E5FF"];
const BASE_COLOR = "#00E5FF";

export default function InteractiveKart({ hovered, pointer }) {
  const group = useRef();
  const twinA = useRef();
  const flameRefs = useRef([]);
  const twinB = useRef();
  const colorRef = useRef(new THREE.Color(BASE_COLOR));
  const targetColor = useRef(new THREE.Color(BASE_COLOR));
  const materialRefsA = useRef([]);
  const materialRefsB = useRef([]);

  useEffect(() => {
    if (hovered) {
      targetColor.current.set(HOVER_COLORS[Math.floor(Math.random() * HOVER_COLORS.length)]);
    } else {
      targetColor.current.set(BASE_COLOR);
    }
  }, [hovered]);

  useFrame((state, delta) => {
    if (!group.current || !twinA.current || !twinB.current) return;
    const t = state.clock.getElapsedTime();
    // Animate exhaust flames
flameRefs.current.forEach((flame, i) => {

  if (!flame) return;

  const pulse =
    1 +
    Math.sin(t * 10 + i) * 0.25;

  const s = hovered ? 1.7 : 1;

flame.scale.set(
    pulse * s,
    pulse * s,
    pulse * (hovered ? 2.2 : 1.2)
);
flame.position.z =
    -0.75 +
    Math.sin(t * 20 + i) * 0.04;

});
    const lerpSpeed = 1 - Math.pow(0.001, delta);

    // idle bob
    group.current.position.y = Math.sin(t * 2.4) * 0.05;

    // full rotation driven by cursor X, anywhere on the page - lets you
    // see the kart from every angle, just like spinning the admin dice
    const px = pointer?.current?.x || 0;
    const py = pointer?.current?.y || 0;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      px * Math.PI,
      lerpSpeed * 0.6
    );
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, py * 0.15, lerpSpeed);

    // split into two smaller twins on hover, instead of zooming
    const targetOffset = hovered ? 1.35 : 0;
    const targetScale = hovered ? 0.66 : 1;
    const targetSpin = hovered ? 0.5 : 0;

    twinA.current.position.x = THREE.MathUtils.lerp(twinA.current.position.x, -targetOffset, lerpSpeed);
    twinB.current.position.x = THREE.MathUtils.lerp(twinB.current.position.x, targetOffset, lerpSpeed);
    twinA.current.scale.setScalar(THREE.MathUtils.lerp(twinA.current.scale.x, targetScale, lerpSpeed));
    twinB.current.scale.setScalar(THREE.MathUtils.lerp(twinB.current.scale.x, targetScale, lerpSpeed));
    twinA.current.rotation.y = THREE.MathUtils.lerp(twinA.current.rotation.y, targetSpin, lerpSpeed);
    twinB.current.rotation.y = THREE.MathUtils.lerp(twinB.current.rotation.y, -targetSpin, lerpSpeed);

    // color lerp across both twins' materials
    colorRef.current.lerp(targetColor.current, 0.06);
    [...materialRefsA.current, ...materialRefsB.current].forEach((mat) => {
      if (mat) mat.color.copy(colorRef.current);
    });
  });

  return (
    <group ref={group}>
      <group ref={twinA}>
       <KartBody
    materialRefs={materialRefsA}
    flameRefs={flameRefs}
/>
      </group>
      <group ref={twinB}>
       <KartBody
   materialRefs={materialRefsB}
   flameRefs={flameRefs}
/>
      </group>
    </group>
  );
}

function Wheel({ position }) {

  const ref = useRef();

  useFrame((state, delta) => {

    if (!ref.current) return;

ref.current.rotation.x += delta * 8;  });

  return (

    <group
      ref={ref}
      position={position}
    >

   {/* Tyre */}
<mesh rotation={[0, 0, Math.PI / 2]}>
  <cylinderGeometry args={[0.42, 0.42, 0.32, 24]} />
  <meshStandardMaterial
    color="#1E232B"
    roughness={0.95}
    metalness={0.1}
  />
</mesh>

{/* Silver Rim */}
<mesh rotation={[0, 0, Math.PI / 2]}>
  <cylinderGeometry args={[0.28, 0.28, 0.05, 24]} />
  <meshStandardMaterial
    color="#DCE3EA"
    metalness={1}
    roughness={0.08}
  />
</mesh>

{/* 6 Spokes */}
{Array.from({ length: 6 }).map((_, i) => (
  <mesh
    key={i}
    rotation={[0, (Math.PI / 3) * i, Math.PI / 2]}
  >
    <boxGeometry args={[0.035, 0.42, 0.025]} />
    <meshStandardMaterial
      color="#BFC9D4"
      metalness={1}
      roughness={0.12}
    />
  </mesh>
))}

{/* Cyan Center Cap */}
<mesh rotation={[0, 0, Math.PI / 2]}>
  <cylinderGeometry args={[0.08, 0.08, 0.08, 20]} />
  <meshStandardMaterial
    color="#00E5FF"
    emissive="#00E5FF"
    emissiveIntensity={0.5}
    metalness={1}
    roughness={0.1}
  />
</mesh>

      <mesh
        rotation={[0,0,Math.PI/2]}
        position={[
          position[0] > 0
            ? 0.17
            : -0.17,
          0,
          0,
        ]}
      >

        <cylinderGeometry
          args={[0.2,0.2,0.04,20]}
        />

        <meshStandardMaterial
          color="#E7ECF3"
          metalness={0.6}
        />

      </mesh>

    </group>

  );

}
// Wraps the kart geometry but grabs refs to its color materials so
// InteractiveKart can animate them every frame without re-rendering React.
function KartBody({
   materialRefs,
   flameRefs,
}){
  const bodyMatRef = useRef();
  const scoopMatRef = useRef();

  useEffect(() => {
    materialRefs.current = [bodyMatRef.current, scoopMatRef.current];
  }, [materialRefs]);

  return (
    <group>
      {/* chassis */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.6, 0.4, 2.6]} />
        <meshStandardMaterial ref={bodyMatRef} color={BASE_COLOR} roughness={0.3} metalness={0.2} />
      </mesh>

      {/* front scoop / shield */}
      <mesh position={[0, 0.32, 1.15]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[1.3, 0.55, 0.9]} />
        <meshStandardMaterial ref={scoopMatRef} color="#E11D2E" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.32, 1.5]} rotation={[-0.9, 0, 0]}>
        <boxGeometry args={[1.15, 0.45, 0.5]} />
        <meshStandardMaterial color="#C9D6DF" roughness={0.2} metalness={0.4} />
      </mesh>

      {/* popsicle head: purple cap / red band with eyes / yellow band / green band */}
      <group position={[0, 0.55, 0.1]}>
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.34, 20, 20, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
          <meshStandardMaterial color="#6D28D9" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.34, 0.36, 0.42, 20]} />
          <meshStandardMaterial color="#E11D2E" roughness={0.4} />
        </mesh>
        <mesh position={[-0.14, 0.6, 0.28]}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.14, 0.6, 0.28]}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.14, 0.6, 0.36]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color="#0B0E14" />
        </mesh>
        <mesh position={[0.14, 0.6, 0.36]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color="#0B0E14" />
        </mesh>
        <mesh position={[0, 0.34, 0]}>
          <cylinderGeometry args={[0.36, 0.37, 0.1, 20]} />
          <meshStandardMaterial color="#FFD400" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.37, 0.4, 0.3, 20]} />
          <meshStandardMaterial color="#22C55E" roughness={0.4} />
        </mesh>
      </group>

      {/* arms reaching toward the wheel */}
      {[-1, 1].map((side, i) => (
        <group key={i} position={[side * 0.55, 0.35, 0.3]}>
          <mesh rotation={[0.3, 0, side * 0.9]}>
            <cylinderGeometry args={[0.08, 0.08, 0.55, 10]} />
            <meshStandardMaterial color="#F4F4F5" roughness={0.5} />
          </mesh>
          <mesh position={[side * -0.28, 0.32, 0.18]} rotation={[0.2, 0, side * 0.3]}>
            <cylinderGeometry args={[0.08, 0.08, 0.4, 10]} />
            <meshStandardMaterial color="#F4F4F5" roughness={0.5} />
          </mesh>
          <mesh position={[side * -0.4, 0.48, 0.3]}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial color="#12161F" />
          </mesh>
        </group>
      ))}

      {/* wheels */}
     {/* Wheels */}
{[
  [-0.95, -0.15, 0.9],
  [0.95, -0.15, 0.9],
  [-0.95, -0.15, -0.9],
  [0.95, -0.15, -0.9],
].map((pos, i) => (
  <Wheel
    key={i}
    position={pos}
  />
))}

      {/* rear exhaust pipes */}
      {[-0.55, 0.55].map((x, i) => (
        <group key={i} position={[x, 0.3, -1.35]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.7, 16]} />
            <meshStandardMaterial color="#12161F" metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, -0.35]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.15, 0.04, 8, 16]} />
            <meshStandardMaterial color="#3B82F6" />
          </mesh>
          {/* Flame */}
{/* Outer Flame */}
<mesh
  ref={(el) => (flameRefs.current[i * 3] = el)}
  position={[0, 0, -0.82]}
  rotation={[Math.PI / 2, 0, 0]}
>
  <coneGeometry args={[0.11, 0.48, 20]} />
  <meshBasicMaterial
    color="#00BFFF"
    transparent
    opacity={0.45}
  />
</mesh>

{/* Middle Flame */}
<mesh
  ref={(el) => (flameRefs.current[i * 3 + 1] = el)}
  position={[0, 0, -0.72]}
  rotation={[Math.PI / 2, 0, 0]}
>
  <coneGeometry args={[0.07, 0.32, 20]} />
  <meshBasicMaterial
    color="#4FDFFF"
    transparent
    opacity={0.8}
  />
</mesh>

{/* Core */}
<mesh
  ref={(el) => (flameRefs.current[i * 3 + 2] = el)}
  position={[0, 0, -0.63]}
  rotation={[Math.PI / 2, 0, 0]}
>
  <coneGeometry args={[0.035, 0.18, 20]} />
  <meshBasicMaterial
    color="#FFFFFF"
  />
</mesh>
        </group>
      ))}

      {/* rear spoiler */}
      <mesh position={[0, 0.55, -1.25]}>
        <boxGeometry args={[1.5, 0.08, 0.25]} />
        <meshStandardMaterial color="#12161F" />
      </mesh>
    </group>
  );
}
