'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProjectsStack } from '@/components/projects/ProjectsStack';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const ctx = gsap.context(() => {
      // Create a cool circle clip-path reveal transition
      gsap.fromTo(sectionRef.current,
        { clipPath: 'circle(5% at 50% 0%)', opacity: 0.8 },
        {
          clipPath: 'circle(150% at 50% 0%)',
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="relative w-full py-24 px-6 md:px-12 z-20 min-h-[80vh] overflow-hidden" style={{ clipPath: 'circle(150% at 50% 0%)' }}>
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="w-full text-center mb-16">
          <p className="text-[#ff8c00] tracking-widest text-xs uppercase mb-4" style={{ fontFamily: 'var(--font-geist-mono)' }}>
            — Student Work —
          </p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-[#ff8c00]/50">
            OUR PROJECTS
          </h2>
        </div>

        {/* Interactive Stack Component */}
        <ProjectsStack />
      </div>
    </section>
  );
}
