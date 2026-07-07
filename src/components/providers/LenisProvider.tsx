'use client';

import { useRef, useEffect } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ScrollTriggerSync() {
  const lenis = useLenis(({ scroll }) => {
    // Keep ScrollTrigger in sync with Lenis scroll position
    ScrollTrigger.update();
  });

  useEffect(() => {
    // Tell GSAP ScrollTrigger to use Lenis's scroll position
    gsap.ticker.add((time) => {
      lenis?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove((time) => {
        lenis?.raf(time * 1000);
      });
    };
  }, [lenis]);

  return null;
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }} autoRaf={false}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
