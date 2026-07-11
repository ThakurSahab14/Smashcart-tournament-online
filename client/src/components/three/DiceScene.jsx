import React, { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";

import img1 from "../../assets/dice/1.png";
import img2 from "../../assets/dice/2.png";
import img3 from "../../assets/dice/3.png";
import img4 from "../../assets/dice/4.jpg";
import img5 from "../../assets/dice/5.png";
import img6 from "../../assets/dice/6.png";

const IMAGES = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
];

function DiceHalf({
  top,
  hovered,
  materials,
}) {

  const ref = useRef();

  useFrame((state, delta) => {

    if (!ref.current) return;

    const targetY = hovered
      ? top
        ? 0.45
        : -0.45
      : 0;

    const targetRot = hovered
      ? top
        ? -0.35
        : 0.35
      : 0;

    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      targetY,
      delta * 6
    );

    ref.current.rotation.z = THREE.MathUtils.lerp(
      ref.current.rotation.z,
      targetRot,
      delta * 6
    );

  });

  return (

    <group ref={ref}>

      <mesh material={materials}>

        <boxGeometry
          args={[
            1.8,
            0.9,
            1.8,
          ]}
        />

      </mesh>

    </group>

  );

}
function RewardImage({
  texture,
  hovered,
}) {

  const ref = useRef();

  useFrame((state, delta) => {

    if (!ref.current) return;

    const targetY = hovered ? 1.35 : 0;

    const targetScale = hovered ? 1 : 0.01;

    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      targetY,
      delta * 5
    );

    ref.current.scale.lerp(
      new THREE.Vector3(
        targetScale,
        targetScale,
        targetScale
      ),
      delta * 5
    );

    ref.current.rotation.y += delta * 2.5;

    ref.current.rotation.z += delta * 0.8;

  });

  return (

    <mesh ref={ref}>

      <planeGeometry
        args={[
          1.4,
          1.4,
        ]}
      />

      <meshBasicMaterial
        map={texture}
        transparent
        side={THREE.DoubleSide}
      />

    </mesh>

  );

}

function FloatingReward({
  texture,
  index,
}) {

  const ref = useRef();

  const radius = 2.8;

  const angle = (index / 6) * Math.PI * 2;

  useFrame(({ clock }) => {

    if (!ref.current) return;

    const t = clock.getElapsedTime() * 0.45 + angle;

    ref.current.position.set(

      Math.cos(t) * radius,

      Math.sin(t * 1.3) * 0.45,

      Math.sin(t) * radius

    );

    ref.current.rotation.y = -t;

    ref.current.rotation.z =
      Math.sin(t * 0.6) * 0.2;

  });

  return (

    <mesh ref={ref}>

      <planeGeometry args={[0.55,0.55]} />

      <meshBasicMaterial
        map={texture}
        transparent
        side={THREE.DoubleSide}
      />

    </mesh>

  );

}
export default function DiceScene({
  hovered,
}) {

  const textures = useLoader(
    TextureLoader,
    IMAGES
  );

  textures.forEach((texture) => {

    texture.colorSpace = THREE.SRGBColorSpace;

    texture.anisotropy = 16;

  });

  const group = useRef();

  const [randomIndex, setRandomIndex] = useState(0);

  useEffect(() => {

    if (hovered) {

      setRandomIndex(
        Math.floor(
          Math.random() * IMAGES.length
        )
      );

    }

  }, [hovered]);

  const materials = useMemo(() => {

    return textures.map((texture) =>

      new THREE.MeshStandardMaterial({

        map: texture,

        roughness: 0.2,

        metalness: 0.35,

      })

    );

  }, [textures]);
  useFrame((state, delta) => {

  if (!group.current) return;

  group.current.rotation.y += delta * (hovered ? 2.3 : 0.45);

  group.current.rotation.x += delta * 0.35;

  group.current.position.y =
    Math.sin(state.clock.elapsedTime * 2) * 0.08;

});
return (

  <>

    <color
      attach="background"
      args={["#0B0E14"]}
    />

    <fog
      attach="fog"
      args={["#0B0E14",4,12]}
    />

    <ambientLight intensity={1} />

    <directionalLight
      position={[4,5,3]}
      intensity={2}
      color="#ffffff"
    />

    <pointLight
      position={[3,2,3]}
      intensity={30}
      color="#00E5FF"
    />

    <pointLight
      position={[-3,-2,2]}
      intensity={25}
      color="#FF2E92"
    />

    <group ref={group}>

      <DiceHalf
        top
        hovered={hovered}
        materials={materials}
      />

      <DiceHalf
        hovered={hovered}
        materials={materials}
      />

      <RewardImage
        hovered={hovered}
        texture={textures[randomIndex]}
      />

      {textures.map((texture, index) => (

  <FloatingReward
    key={index}
    texture={texture}
    index={index}
  />

))}

    </group>

  </>

);
}