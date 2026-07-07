'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Starfield ────────────────────────────────────────────────────────────────
function BackgroundStarfield() {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const [positions, sizes] = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
      sizes[i] = Math.random() * 0.04 + 0.01;
    }
    return [positions, sizes];
  }, []);

  // Fade in on mount
  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.opacity = 0;
    gsap.to(materialRef.current, { opacity: 0.65, duration: 2.5, ease: 'power2.inOut', delay: 0.2 });
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Very slow drift
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.008;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.004) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute args={[positions, 3]} attach="attributes-position" />
          <bufferAttribute args={[sizes, 1]}     attach="attributes-size" />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          color="#ffffff"
          size={0.03}
          sizeAttenuation
          transparent
          opacity={0}
        />
      </points>
    </group>
  );
}

// ─── Single Wireframe Shape ───────────────────────────────────────────────────
interface ShapeProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  speed: number;
  type: 'box' | 'octahedron' | 'tetrahedron';
  index: number;
}

function BackgroundShape({ position, rotation, scale, speed, type, index }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  const geometry = useMemo(() => {
    switch (type) {
      case 'octahedron':  return new THREE.OctahedronGeometry(1, 0);
      case 'tetrahedron': return new THREE.TetrahedronGeometry(1, 0);
      default:            return new THREE.BoxGeometry(1, 1, 1);
    }
  }, [type]);

  useEffect(() => {
    if (!meshRef.current || !materialRef.current) return;
    meshRef.current.scale.setScalar(0);
    materialRef.current.opacity = 0;
    const delay = 0.4 + index * 0.12;
    gsap.to(meshRef.current.scale, { x: scale, y: scale, z: scale, duration: 1.6, ease: 'back.out(1.4)', delay });
    gsap.to(materialRef.current,   { opacity: 0.2, duration: 1.2, ease: 'power2.out', delay });
  }, [index, scale]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += speed * 0.007;
    meshRef.current.rotation.y += speed * 0.011;
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * speed * 0.35 + position[0]) * 0.25;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={0} geometry={geometry}>
      <meshBasicMaterial ref={materialRef} color="#8B4513" wireframe transparent opacity={0} />
    </mesh>
  );
}

const SHAPES: Omit<ShapeProps, 'index'>[] = [
  { position: [-7,   3,   -4], rotation: [0.3, 0.5, 0.0], scale: 1.1, speed: 0.6, type: 'box' },
  { position: [ 7.5,-2,   -5], rotation: [0.1, 0.2, 0.4], scale: 0.9, speed: 0.8, type: 'octahedron' },
  { position: [-6,  -4,   -3], rotation: [0.5, 0.1, 0.2], scale: 0.7, speed: 1.1, type: 'tetrahedron' },
  { position: [ 6,   4,   -6], rotation: [0.2, 0.6, 0.1], scale: 1.4, speed: 0.5, type: 'box' },
  { position: [-8,   1,   -7], rotation: [0.4, 0.3, 0.5], scale: 0.6, speed: 0.9, type: 'octahedron' },
  { position: [ 8,  -4,   -4], rotation: [0.6, 0.1, 0.3], scale: 1.0, speed: 0.7, type: 'tetrahedron' },
  { position: [ 3,   5.5, -8], rotation: [0.1, 0.4, 0.6], scale: 0.8, speed: 1.2, type: 'box' },
  { position: [-4,  -5,   -5], rotation: [0.3, 0.7, 0.2], scale: 0.75,speed: 0.65,type: 'octahedron' },
  { position: [ 5,  -5.5, -6], rotation: [0.5, 0.2, 0.4], scale: 1.2, speed: 0.55,type: 'box' },
  { position: [-5,   5,   -9], rotation: [0.2, 0.5, 0.1], scale: 0.95,speed: 1.0, type: 'tetrahedron' },
];


// ─── Scroll Parallax Rig ──────────────────────────────────────────────────────
function ParallaxRig({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const { camera } = useThree();

  useFrame(() => {
    // Slowly drift the camera up as the user scrolls down
    const t = scrollProgress.current;
    camera.position.y += (-t * 2.5 - camera.position.y) * 0.05;
    camera.position.z  = 7 + t * 1.5; // Subtly zoom out
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Scene Content ────────────────────────────────────────────────────────────
function SceneContent({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  return (
    <>
      <color attach="background" args={['#050505']} />
      <ambientLight intensity={0.1} />

      <ParallaxRig scrollProgress={scrollProgress} />

      <BackgroundStarfield />

      {SHAPES.map((shape, i) => (
        <BackgroundShape key={i} index={i} {...shape} />
      ))}

      <EffectComposer>
        <Bloom
          intensity={0.8}
          mipmapBlur
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          radius={0.6}
        />
      </EffectComposer>
    </>
  );
}

// ─── Exported Component ───────────────────────────────────────────────────────
export function PersistentBackground() {
  const scrollProgress = useRef(0);

  useEffect(() => {
    // Register a ScrollTrigger that tracks page scroll 0→1
    const trigger = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <SceneContent scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
