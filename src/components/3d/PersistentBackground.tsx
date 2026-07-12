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
  drift: [number, number, number];
  index: number;
}

function BackgroundShape({ position, rotation, scale, speed, type, drift, index }: ShapeProps) {
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
    const delay = 0.1 + (index % 10) * 0.05;
    gsap.to(meshRef.current.scale, { x: scale, y: scale, z: scale, duration: 1.6, ease: 'back.out(1.4)', delay });
    gsap.to(materialRef.current,   { opacity: 0.2, duration: 1.2, ease: 'power2.out', delay });
  }, [index, scale]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Spin
    meshRef.current.rotation.x += speed * 0.007;
    meshRef.current.rotation.y += speed * 0.011;
    
    // Float and drift
    meshRef.current.position.x += drift[0];
    meshRef.current.position.y += drift[1] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.005;
    meshRef.current.position.z += drift[2];
    
    // Wrap around camera to create infinite space
    const camY = state.camera.position.y;
    if (meshRef.current.position.y > camY + 15) meshRef.current.position.y -= 50;
    if (meshRef.current.position.y < camY - 35) meshRef.current.position.y += 50;
    
    if (meshRef.current.position.x > 20) meshRef.current.position.x = -20;
    if (meshRef.current.position.x < -20) meshRef.current.position.x = 20;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={0} geometry={geometry}>
      <meshBasicMaterial ref={materialRef} color="#FF6B1A" wireframe transparent opacity={0} />
    </mesh>
  );
}

// Generate 40 dynamic shapes scattered across a massive vertical space
const SHAPES = Array.from({ length: 40 }).map((_, i) => ({
  position: [
    (Math.random() - 0.5) * 30, // X
    10 - Math.random() * 50,    // Y (from 10 down to -40)
    (Math.random() - 0.5) * 20 - 5 // Z
  ] as [number, number, number],
  rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
  scale: Math.random() * 1.0 + 0.6,
  speed: Math.random() * 1.5 + 0.5,
  type: ['box', 'octahedron', 'tetrahedron'][Math.floor(Math.random() * 3)] as 'box' | 'octahedron' | 'tetrahedron',
  drift: [
    (Math.random() - 0.5) * 0.015,
    (Math.random() - 0.5) * 0.015,
    (Math.random() - 0.5) * 0.015,
  ] as [number, number, number]
}));

// ─── Scroll Parallax Rig ──────────────────────────────────────────────────────
function ParallaxRig({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const { camera } = useThree();

  useFrame(() => {
    const t = scrollProgress.current;
    
    // Deep dive down the Y axis as user scrolls
    const targetY = -t * 35; 
    camera.position.y += (targetY - camera.position.y) * 0.05;
    
    // Subtle cinematic zoom out and horizontal drift
    camera.position.z = 7 + t * 5; 
    camera.position.x = Math.sin(t * Math.PI) * 3;
    
    // Keep looking forward
    camera.lookAt(camera.position.x * 0.5, camera.position.y, 0);
  });

  return null;
}

// ─── Scene Content ────────────────────────────────────────────────────────────
function SceneContent({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const { size } = useThree();
  const isMobile = size.width < 768;

  return (
    <>
      <color attach="background" args={['#050505']} />
      <ambientLight intensity={0.1} />

      <ParallaxRig scrollProgress={scrollProgress} />

      <BackgroundStarfield />

      {SHAPES.map((shape, i) => (
        <BackgroundShape key={i} index={i} {...shape} />
      ))}

      {!isMobile && (
        <EffectComposer>
          <Bloom
            intensity={0.8}
            mipmapBlur
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            radius={0.6}
          />
        </EffectComposer>
      )}
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
