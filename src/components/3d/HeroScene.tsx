'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { HolographicLogo } from './HolographicLogo';

interface SceneMouseProps {
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
}

// Only handles mouse-driven camera — the persistent background owns starfield & shapes
function CameraRig({ mouseX, mouseY }: SceneMouseProps) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x += (mouseX.current * 0.8 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY.current * 0.5 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function SceneContent({ mouseX, mouseY }: SceneMouseProps) {
  return (
    <>
      {/* Transparent background — lets PersistentBackground show through */}
      <ambientLight intensity={0.1} />

      <CameraRig mouseX={mouseX} mouseY={mouseY} />

      <Suspense fallback={null}>
        <HolographicLogo mouseX={mouseX} mouseY={mouseY} />
      </Suspense>

      <EffectComposer>
        <Bloom
          intensity={1.0}
          mipmapBlur
          luminanceThreshold={0.5}
          luminanceSmoothing={0.9}
          radius={0.4}
        />
      </EffectComposer>
    </>
  );
}

export function HeroScene({ mouseX, mouseY }: SceneMouseProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      gl={{ antialias: true, alpha: true }}   // alpha: true = transparent canvas
      dpr={[1, 2]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <SceneContent mouseX={mouseX} mouseY={mouseY} />
    </Canvas>
  );
}
