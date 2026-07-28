'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import teamData from '@/data/team.json';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// --- Icons ---
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

// --- Components ---
type Person = {
  name: string;
  photo: string;
  role: string;
  scale?: number;
  objectPosition?: string;
  socials: {
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
};

function PersonCard({ person, size = 'medium', className = '' }: { person: Person, size?: 'large' | 'medium' | 'small', className?: string }) {
  const sizeClasses = {
    large: 'w-48 h-48 md:w-56 md:h-56',
    medium: 'w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40',
    small: 'w-24 h-24 md:w-26 md:h-26 lg:w-28 lg:h-28',
  };

  const baseScale = person.scale || 1;
  const hoverScale = baseScale * 1.1;

  return (
    <div className={`group flex flex-col items-center text-center ${className}`}>
      <div className={`relative rounded-full overflow-hidden mb-4 border border-[#FF6B1A]/30 shadow-[0_0_15px_rgba(255,107,26,0.15)] transition-all duration-500 group-hover:scale-105 group-hover:border-[#FF6B1A] group-hover:shadow-[0_0_30px_rgba(255,107,26,0.6)] ${sizeClasses[size]}`}>
        <img 
          src={person.photo} 
          alt={person.name} 
          className="w-full h-full object-cover transition-transform duration-700 origin-center [transform:scale(var(--img-scale))] group-hover:[transform:scale(var(--img-hover-scale))]" 
          style={{
            objectPosition: person.objectPosition || 'center 20%',
            '--img-scale': baseScale,
            '--img-hover-scale': hoverScale
          } as React.CSSProperties}
        />
      </div>
      <h3 className={`font-bold text-white tracking-wide whitespace-nowrap ${size === 'small' ? 'text-xs sm:text-sm md:text-base' : 'text-base md:text-lg'}`}>{person.name}</h3>
      <p className="text-[#FF6B1A] font-mono text-xs md:text-sm tracking-wider mt-1 mb-3 whitespace-nowrap" style={{ textShadow: '0 0 10px rgba(255,107,26,0.5)' }}>{person.role}</p>
      
      <div className="flex space-x-3 sm:space-x-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
        {person.socials.instagram && (
          <a href={person.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#FF6B1A] hover:drop-shadow-[0_0_8px_rgba(255,107,26,0.8)] transition-all">
            <InstagramIcon className="w-4 h-4 md:w-5 md:h-5" />
          </a>
        )}
        {person.socials.linkedin && (
          <a href={person.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#FF6B1A] hover:drop-shadow-[0_0_8px_rgba(255,107,26,0.8)] transition-all">
            <LinkedinIcon className="w-4 h-4 md:w-5 md:h-5" />
          </a>
        )}
        {person.socials.github && (
          <a href={person.socials.github} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#FF6B1A] hover:drop-shadow-[0_0_8px_rgba(255,107,26,0.8)] transition-all">
            <GithubIcon className="w-4 h-4 md:w-5 md:h-5" />
          </a>
        )}
      </div>
    </div>
  );
}

export function TeamSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRowRef = useRef<HTMLDivElement>(null);
  const leadershipCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const domainSectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dividersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // 1. Dividers expanding effect
      dividersRef.current.forEach((divider) => {
        if (!divider) return;

        gsap.fromTo(
          divider.querySelector('.divider-line'),
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: divider,
              start: "top 90%",
              end: "top 65%",
              scrub: 0.5
            }
          }
        );
      });

      // 2. Board Members Entrance Animation
      if (boardRowRef.current) {
        const cards = boardRowRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: boardRowRef.current,
              start: "top 85%",
              end: "top 55%",
              scrub: 0.8
            }
          }
        );
      }

      // 3. Domain Columns Entrance Animation
      domainSectionsRef.current.forEach((domain) => {
        if (!domain) return;

        gsap.fromTo(
          domain,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: domain,
              start: "top 95%",
              end: "top 70%",
              scrub: 1
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="team" ref={containerRef} className="relative w-full min-h-fit pb-16 overflow-hidden" style={{ background: 'transparent' }}>
      <div className="max-w-[1530px] mx-auto px-4 sm:px-6">
        
        {/* Tier 1: Board */}
        <div ref={el => { dividersRef.current[0] = el; }} className="relative flex items-center justify-center mt-12 mb-10">
          <div className="divider-line absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF6B1A] to-transparent opacity-50 shadow-[0_0_10px_#FF6B1A] origin-center" />
          <h2 className="relative px-6 bg-[#050505] font-mono text-2xl tracking-widest text-[#FF6B1A] uppercase" style={{ textShadow: '0 0 15px rgba(255,107,26,0.6)' }}>
            The Board
          </h2>
        </div>
        
        <div className="w-full relative py-10">
          <div ref={boardRowRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-12 gap-x-4 sm:gap-x-6">
            {teamData.boardMembers.map((member, i) => (
              <div key={i} className="flex justify-center">
                <PersonCard person={member} size="medium" />
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2: Domains */}
        <div ref={el => { dividersRef.current[1] = el; }} className="relative flex items-center justify-center mt-16 mb-12">
          <div className="divider-line absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF6B1A] to-transparent opacity-50 shadow-[0_0_10px_#FF6B1A] origin-center" />
          <h2 className="relative px-6 bg-[#050505] font-mono text-2xl tracking-widest text-[#FF6B1A] uppercase" style={{ textShadow: '0 0 15px rgba(255,107,26,0.6)' }}>
            The Domains
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 lg:gap-8 xl:gap-12 pt-10">
          {teamData.domains.map((domain, i) => (
            <div key={i} ref={el => { domainSectionsRef.current[i] = el; }} className="flex flex-col items-center w-full">
              <h4 className="font-mono text-lg text-white/60 uppercase tracking-widest mb-8 border-b border-[#FF6B1A]/20 pb-3 w-full text-center">
                {domain.domainName}
              </h4>
              
              <div className="mb-8 flex justify-center w-full">
                <PersonCard person={domain.head} size="medium" />
              </div>
              
              <div className="w-full flex justify-center items-start">
                <div className={`w-full max-w-[330px] ${domain.leads.length > 1 ? 'grid grid-cols-2 gap-6 sm:gap-8' : 'flex justify-center'} justify-items-center`}>
                  {domain.leads.map((lead, j) => (
                    <PersonCard key={j} person={lead} size="small" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
