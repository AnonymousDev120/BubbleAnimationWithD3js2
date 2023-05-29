import React, { useRef } from "react";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";

function Bubbles({ data }) {
  const meshRef = useRef();

  useFrame(() => {
    data.forEach((bubble, index) => {
      const mesh = meshRef.current?.children[index];
      if (mesh) {
        mesh.position.x = bubble.x + Math.sin(Date.now() * 0.001 + index) * 0.5;
        mesh.position.y = bubble.y + Math.cos(Date.now() * 0.001 + index) * 0.5;
        mesh.position.z = bubble.z;
      }
    });
  });

  return data.map((bubble, index) => (
    <mesh key={index} position={[bubble.x, bubble.y, bubble.z]} ref={meshRef}>
      <sphereBufferGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={0xffffff} />
    </mesh>
  ));
}

export default function ThreeBubbles() {
  const data = [
    { x: 0, y: 0, z: 0 },
    { x: 2, y: 2, z: -5 },
    { x: -3, y: 1, z: -3 },
    { x: 1, y: -2, z: -4 },
    { x: -2, y: -1, z: -2 },
  ];

  return <Bubbles data={data} />;
}
