'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger);


export function HeroText() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollFadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollFadeRef.current) return;

    const ctx = gsap.context(() => {

      // ── Scroll: fade + scale back the whole hero ───────────
      ScrollTrigger.create({
        trigger: scrollFadeRef.current,
        start: 'top top',
        end: '+=600',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(scrollFadeRef.current, {
            opacity: 1 - p,
            scale: 1 - p * 0.12,
          });
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="absolute inset-0 pointer-events-none">
      {/* Logos Container */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-4 md:gap-6 z-50 pointer-events-auto">
        <img src="/images/srm-logo-white.svg" alt="SRM Logo" className="h-10 md:h-14 w-auto object-contain" />
        <img src="/images/siggraph-logo-left.svg" alt="ACM SIGGRAPH Logo" className="h-10 md:h-14 w-auto object-contain" />
      </div>

      <div ref={scrollFadeRef} className="absolute inset-0 flex flex-col items-center justify-end pb-[14vh]">
        {/* Scroll hint */}
        <div className="mt-10 flex flex-col items-center gap-1 opacity-40">
          <span
            className="text-xs tracking-[0.3em] uppercase text-neutral-500"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            Scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-neutral-500 to-transparent" />
        </div>
      </div>
    </div>
  );
}
