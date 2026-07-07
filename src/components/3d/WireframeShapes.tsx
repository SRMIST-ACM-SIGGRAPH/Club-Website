'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

interface ShapeProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  speed: number;
  type: 'box' | 'octahedron' | 'tetrahedron';
  index: number;
}

function WireframeShape({ position, rotation, scale, speed, type, index }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    if (!meshRef.current || !materialRef.current) return;
    
    meshRef.current.scale.setScalar(0);
    materialRef.current.opacity = 0;

    const delay = 0.5 + index * 0.1;
    
    gsap.to(meshRef.current.scale, {
      x: scale, y: scale, z: scale,
      duration: 1.5,
      ease: 'back.out(1.5)',
      delay,
    });
    
    gsap.to(materialRef.current, {
      opacity: 0.25,
      duration: 1,
      ease: 'power2.out',
      delay,
    });
  }, [index, scale]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += speed * 0.008;
    meshRef.current.rotation.y += speed * 0.012;
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * speed * 0.4 + position[0]) * 0.3;
  });

  const geometry = useMemo(() => {
    switch (type) {
      case 'octahedron':
        return new THREE.OctahedronGeometry(1, 0);
      case 'tetrahedron':
        return new THREE.TetrahedronGeometry(1, 0);
      default:
        return new THREE.BoxGeometry(1, 1, 1);
    }
  }, [type]);

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={0} geometry={geometry}>
      <meshBasicMaterial ref={materialRef} color="#8B4513" wireframe transparent opacity={0} />
    </mesh>
  );
}

const SHAPES: Omit<ShapeProps, 'index'>[] = [
  { position: [-7, 3, -4], rotation: [0.3, 0.5, 0], scale: 1.1, speed: 0.6, type: 'box' },
  { position: [7.5, -2, -5], rotation: [0.1, 0.2, 0.4], scale: 0.9, speed: 0.8, type: 'octahedron' },
  { position: [-6, -4, -3], rotation: [0.5, 0.1, 0.2], scale: 0.7, speed: 1.1, type: 'tetrahedron' },
  { position: [6, 4, -6], rotation: [0.2, 0.6, 0.1], scale: 1.4, speed: 0.5, type: 'box' },
  { position: [-8, 1, -7], rotation: [0.4, 0.3, 0.5], scale: 0.6, speed: 0.9, type: 'octahedron' },
  { position: [8, -4, -4], rotation: [0.6, 0.1, 0.3], scale: 1.0, speed: 0.7, type: 'tetrahedron' },
  { position: [3, 5.5, -8], rotation: [0.1, 0.4, 0.6], scale: 0.8, speed: 1.2, type: 'box' },
  { position: [-4, -5, -5], rotation: [0.3, 0.7, 0.2], scale: 0.75, speed: 0.65, type: 'octahedron' },
  { position: [5, -5.5, -6], rotation: [0.5, 0.2, 0.4], scale: 1.2, speed: 0.55, type: 'box' },
  { position: [-5, 5, -9], rotation: [0.2, 0.5, 0.1], scale: 0.95, speed: 1.0, type: 'tetrahedron' },
];

export function WireframeShapes() {
  return (
    <group>
      {SHAPES.map((shape, i) => (
        <WireframeShape key={i} index={i} {...shape} />
      ))}
    </group>
  );
}
