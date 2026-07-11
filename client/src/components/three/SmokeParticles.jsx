import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SmokeParticles() {
  const particles = useRef();

  const data = useMemo(() => {
    return Array.from({ length: 18 }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 0.12,
        0.22,
        -1.55
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.003,
        0.006 + Math.random() * 0.004,
        -0.015 - Math.random() * 0.015
      ),
      life: Math.random(),
      scale: 0.08 + Math.random() * 0.08,
    }));
  }, []);

  useFrame((state, delta) => {
    if (!particles.current) return;

    particles.current.children.forEach((mesh, i) => {
      const p = data[i];

      p.life += delta;

      p.position.addScaledVector(p.velocity, delta * 60);

      mesh.position.copy(p.position);
      mesh.rotation.z += delta * 0.4;

      const s = p.scale + p.life * 0.18;

      mesh.scale.setScalar(s);

      mesh.material.opacity = Math.max(
        0,
        0.45 - p.life * 0.28
      );

      if (p.life > 1.6) {
        p.life = 0;

        p.position.set(
          (Math.random() - 0.5) * 0.12,
          0.22,
          -1.55
        );

        p.velocity.set(
          (Math.random() - 0.5) * 0.003,
          0.006 + Math.random() * 0.004,
          -0.015 - Math.random() * 0.015
        );
      }

      mesh.lookAt(state.camera.position);
    });
  });

  return (
    <group ref={particles}>
      {data.map((_, i) => (
        <mesh key={i}>
          <planeGeometry args={[0.18, 0.18]} />

          <meshBasicMaterial
         color="#BFC7CF"
            transparent
            opacity={0.45}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}