"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import type { BodyProfile } from "@/lib/types";

function Avatar({ profile }: { profile: BodyProfile }) {
  const bmi = profile.weight / Math.pow(profile.height / 100, 2);
  const sx = 0.78 + (bmi - 18) * 0.025;
  return (
    <group scale={[sx, 0.9 + (profile.height - 155) / 180, sx]} position={[0, -1.55, 0]}>
      <mesh position={[0, 2.75, 0]}><sphereGeometry args={[0.36, 32, 32]} /><meshStandardMaterial color="#cda98f" roughness={0.75} /></mesh>
      <mesh position={[0, 1.65, 0]}><capsuleGeometry args={[0.52, 1.15, 12, 24]} /><meshStandardMaterial color="#a54031" roughness={0.8} /></mesh>
      <mesh position={[-0.28, 0.05, 0]}><capsuleGeometry args={[0.2, 1.35, 10, 18]} /><meshStandardMaterial color="#424744" /></mesh>
      <mesh position={[0.28, 0.05, 0]}><capsuleGeometry args={[0.2, 1.35, 10, 18]} /><meshStandardMaterial color="#424744" /></mesh>
    </group>
  );
}

export default function ThreePreview({ profile }: { profile: BodyProfile }) {
  return <Canvas camera={{ position: [0, 1.2, 7], fov: 34 }}><ambientLight intensity={1.8} /><directionalLight position={[3, 5, 4]} intensity={2} /><Avatar profile={profile} /><OrbitControls enablePan={false} minDistance={5} maxDistance={9} target={[0, 0.7, 0]} /><Environment preset="studio" /></Canvas>;
}
