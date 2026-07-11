import React, { forwardRef } from "react";

/**
 * A stylized kart inspired by the SmashKarts "popsicle" racer:
 * https://sketchfab.com/3d-models/smash-karts-popsicle-character-e223d11bb23d4dd5969be16831d012c8
 * Built entirely from primitive geometries (no external model file needed),
 * so it loads instantly and carries no licensing baggage.
 */
const KartMesh = forwardRef(function KartMesh(
  { bodyColor = "#1E3A8A", scoopColor = "#E11D2E", scale = 1 },
  ref
) {
  return (
    <group ref={ref} dispose={null} scale={scale}>
      {/* chassis */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[1.6, 0.4, 2.6]} />
        <meshStandardMaterial color={bodyColor} roughness={0.35} metalness={0.15} />
      </mesh>

      {/* front scoop / shield */}
      <mesh position={[0, 0.32, 1.15]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[1.3, 0.55, 0.9]} />
        <meshStandardMaterial color={scoopColor} roughness={0.3} metalness={0.2} />
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
      {[
        [-0.95, -0.15, 0.9],
        [0.95, -0.15, 0.9],
        [-0.95, -0.15, -0.9],
        [0.95, -0.15, -0.9],
      ].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.32, 20]} />
            <meshStandardMaterial color="#6B7280" roughness={0.75} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[pos[0] > 0 ? 0.17 : -0.17, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.04, 20]} />
            <meshStandardMaterial color="#E7ECF3" roughness={0.3} metalness={0.5} />
          </mesh>
        </group>
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
        </group>
      ))}

      {/* rear spoiler */}
      <mesh position={[0, 0.55, -1.25]}>
        <boxGeometry args={[1.5, 0.08, 0.25]} />
        <meshStandardMaterial color="#12161F" />
      </mesh>
    </group>
  );
});

export default KartMesh;
