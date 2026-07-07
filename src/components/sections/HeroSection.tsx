'use client';

import { useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Load the 3D canvas client-side only (no SSR — Three.js needs window)
const HeroScene = dynamic(
  () => import('@/components/3d/HeroScene').then((m) => m.HeroScene),
  { ssr: false }
);

export function HeroSection() {
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    mouseX.current = (clientX / width - 0.5) * 2;   // -1 → +1
    mouseY.current = (clientY / height - 0.5) * 2;  // -1 → +1
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full h-screen overflow-hidden"
      style={{ background: 'transparent' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.current = 0;
        mouseY.current = 0;
      }}
    >
      {/* Soft CSS Radial Glow behind the logo */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '80vw',
          height: '80vw',
          background: 'radial-gradient(circle, rgba(255,140,0,0.15) 0%, rgba(200,80,0,0.05) 30%, rgba(0,0,0,0) 70%)',
          filter: 'blur(100px)',
          zIndex: -1,
        }}
      />
      {/* 3D Canvas — transparent, just the holographic logo */}
      <HeroScene mouseX={mouseX} mouseY={mouseY} />
    </section>
  );
}
