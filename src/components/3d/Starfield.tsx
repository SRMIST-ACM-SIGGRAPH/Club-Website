'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

interface StarfieldProps {
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
}

export function Starfield({ mouseX, mouseY }: StarfieldProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.opacity = 0;
    gsap.to(materialRef.current, {
      opacity: 0.7,
      duration: 2.5,
      ease: 'power2.inOut',
      delay: 0.1,
    });
  }, []);

  const [[positions, sizes]] = useState(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
      sz[i] = Math.random() * 0.04 + 0.01;
    }

    return [pos, sz];
  });

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x += (mouseY.current * 0.015 - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (mouseX.current * 0.015 - groupRef.current.rotation.y) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute args={[positions, 3]} attach="attributes-position" />
          <bufferAttribute args={[sizes, 1]} attach="attributes-size" />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          color="#ffffff"
          size={0.03}
          sizeAttenuation
          transparent
          opacity={0.7}
        />
      </points>
    </group>
  );
}
