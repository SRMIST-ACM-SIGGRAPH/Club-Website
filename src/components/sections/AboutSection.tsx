'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current || !textGroupRef.current) return;

    const mm = gsap.matchMedia();
    const texts = textGroupRef.current.children;

    // Desktop: Pin and scrub animation
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 1,
        }
      });

      gsap.set(imageRef.current, { opacity: 0, scale: 0.8, y: 0 });
      gsap.set(texts, { opacity: 0, y: 50 });

      tl.to(imageRef.current, 
        { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }
      );

      tl.to(texts, 
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out' },
        "-=0.6"
      );

      tl.to(imageRef.current, {
        y: -40,
        duration: 1,
        ease: 'none'
      }, "-=0.2");
    });

    // Mobile: Non-pinning, standard scroll reveals
    mm.add("(max-width: 767px)", () => {
      gsap.set(imageRef.current, { opacity: 0, scale: 0.95, y: 0 });
      gsap.set(texts, { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      });

      tl.to(imageRef.current, 
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
      );

      tl.to(texts, 
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
        "-=0.4"
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <div id="about" className="relative w-full">
      <section
        ref={containerRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: 'transparent' }}
      >
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        
        {/* Left: Image */}
        <div className="flex justify-center md:justify-end">
          <div 
            ref={imageRef}
            className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,255,204,0.15)] border border-[#00ffcc]/30"
          >
            {/* Dark backing */}
            <div className="absolute inset-0 bg-[#050505]" />
            
            {/* Placeholder Image (Tech/Circuit themed) */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-screen"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')" }} 
            />
            
            {/* Subtle inner glowing vignette */}
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_30px_rgba(0,255,204,0.2)] pointer-events-none" />
          </div>
        </div>

        {/* Right: Text */}
        <div ref={textGroupRef} className="space-y-6 max-w-lg">
          <h2 className="text-4xl md:text-5xl font-bold font-mono text-[#00ffcc]">
            About Us
          </h2>
          <p className="text-lg text-neutral-300 leading-relaxed font-sans">
            We are a community of creators, developers, and visionaries pushing the boundaries of interactive media. ACM SIGGRAPH SRM is dedicated to the advancement of computer graphics, animation, UI/UX, and emerging digital frontiers.
          </p>
          <p className="text-lg text-neutral-300 leading-relaxed font-sans">
            Our mission is to foster innovation by providing a collaborative platform where students can build, design, and explore the technologies that will shape tomorrow's digital experiences.
          </p>
          <div className="pt-4">
            <button className="px-8 py-3 rounded-full bg-transparent border border-[#00ffcc] text-[#00ffcc] hover:bg-[#00ffcc] hover:text-[#050505] transition-all duration-300 font-mono text-sm uppercase tracking-wider font-bold">
              Discover Our Work
            </button>
          </div>
        </div>

      </div>
      </section>
    </div>
  );
}
