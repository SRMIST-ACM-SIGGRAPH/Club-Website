'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

// --- Dummy Data ---
const P_PHOTO = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";
const M_PHOTO = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop";

const teamData = {
  facultyCoordinator: { name: "Dr. Jane Doe", photo: P_PHOTO, role: "Faculty Coordinator", socials: { instagram: "#", linkedin: "#", github: "#" } },
  hod: { name: "Dr. John Smith", photo: M_PHOTO, role: "HOD", socials: { instagram: "#", linkedin: "#", github: "#" } },
  boardMembers: [
    { name: "Alice Adams", photo: P_PHOTO, role: "President", socials: { instagram: "#", linkedin: "#", github: "#" } },
    { name: "Bob Brown", photo: M_PHOTO, role: "Vice President", socials: { instagram: "#", linkedin: "#", github: "#" } },
    { name: "Charlie Clark", photo: M_PHOTO, role: "Secretary", socials: { instagram: "#", linkedin: "#", github: "#" } },
    { name: "Diana Davis", photo: P_PHOTO, role: "Treasurer", socials: { instagram: "#", linkedin: "#", github: "#" } },
    { name: "Eve Evans", photo: P_PHOTO, role: "Director", socials: { instagram: "#", linkedin: "#", github: "#" } },
    { name: "Frank Ford", photo: M_PHOTO, role: "Director", socials: { instagram: "#", linkedin: "#", github: "#" } },
  ],
  domains: [
    {
      domainName: "Technical",
      head: { name: "Grace Green", photo: P_PHOTO, role: "Technical Head", socials: { instagram: "#", linkedin: "#", github: "#" } },
      leads: [
        { name: "Harry Hill", photo: M_PHOTO, role: "Tech Lead", socials: { instagram: "#", linkedin: "#", github: "#" } },
        { name: "Ivy Irwin", photo: P_PHOTO, role: "Tech Lead", socials: { instagram: "#", linkedin: "#", github: "#" } }
      ]
    },
    {
      domainName: "Events",
      head: { name: "Jack Jones", photo: M_PHOTO, role: "Events Head", socials: { instagram: "#", linkedin: "#", github: "#" } },
      leads: [
        { name: "Karen King", photo: P_PHOTO, role: "Events Lead", socials: { instagram: "#", linkedin: "#", github: "#" } },
        { name: "Leo Lewis", photo: M_PHOTO, role: "Events Lead", socials: { instagram: "#", linkedin: "#", github: "#" } }
      ]
    },
    {
      domainName: "Creatives",
      head: { name: "Mia Moore", photo: P_PHOTO, role: "Creatives Head", socials: { instagram: "#", linkedin: "#", github: "#" } },
      leads: [
        { name: "Noah Nelson", photo: M_PHOTO, role: "Design Lead", socials: { instagram: "#", linkedin: "#", github: "#" } },
        { name: "Olivia Owen", photo: P_PHOTO, role: "Video Lead", socials: { instagram: "#", linkedin: "#", github: "#" } }
      ]
    },
    {
      domainName: "Management",
      head: { name: "Pete Perez", photo: M_PHOTO, role: "Management Head", socials: { instagram: "#", linkedin: "#", github: "#" } },
      leads: [
        { name: "Quinn Quinn", photo: P_PHOTO, role: "PR Lead", socials: { instagram: "#", linkedin: "#", github: "#" } },
        { name: "Ryan Reed", photo: M_PHOTO, role: "Logistics Lead", socials: { instagram: "#", linkedin: "#", github: "#" } }
      ]
    }
  ]
};

// --- Components ---

function PersonCard({ person, size = 'medium', className = '' }: { person: any, size?: 'large' | 'medium' | 'small', className?: string }) {
  const sizeClasses = {
    large: 'w-40 h-40 md:w-48 md:h-48',
    medium: 'w-28 h-28 md:w-32 md:h-32',
    small: 'w-20 h-20 md:w-24 md:h-24',
  };

  return (
    <div className={`group flex flex-col items-center text-center ${className}`}>
      <div className={`relative rounded-full overflow-hidden mb-4 border border-[#FF6B1A]/30 shadow-[0_0_15px_rgba(255,107,26,0.15)] transition-all duration-500 group-hover:scale-105 group-hover:border-[#FF6B1A] group-hover:shadow-[0_0_30px_rgba(255,107,26,0.6)] ${sizeClasses[size]}`}>
        <img src={person.photo} alt={person.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      </div>
      <h3 className={`font-bold text-white tracking-wide ${size === 'small' ? 'text-base' : 'text-lg'}`}>{person.name}</h3>
      <p className="text-[#FF6B1A] font-mono text-xs md:text-sm tracking-wider mt-1 mb-3" style={{ textShadow: '0 0 10px rgba(255,107,26,0.5)' }}>{person.role}</p>
      
      <div className="flex space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
        const line = divider.querySelector('.divider-line');
        gsap.fromTo(line, 
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: divider,
              start: "top 85%",
              end: "top 65%",
              scrub: 1
            }
          }
        );
        gsap.fromTo(divider.querySelector('h2'),
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: divider,
              start: "top 85%",
              end: "top 75%",
              scrub: 1
            }
          }
        );
      });

      // 2. Parallax Leadership Cards
      leadershipCardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "top 60%",
              scrub: 1
            }
          }
        );
      });

      // 3. Board Stagger Fade-in (No horizontal pin)
      if (boardRowRef.current) {
        const boardItems = Array.from(boardRowRef.current.children);
        
        gsap.fromTo(boardItems,
          { opacity: 0, scale: 0.8, y: 50 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            stagger: 0.1,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: boardRowRef.current,
              start: "top 85%",
              end: "top 60%",
              scrub: 1
            }
          }
        );
      }

      // 4. Domains Stagger Wipe
      domainSectionsRef.current.forEach((domain, i) => {
        if (!domain) return;
        gsap.fromTo(domain,
          { y: 150, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power3.out",
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
    <section id="team" ref={containerRef} className="relative w-full min-h-screen pb-32 overflow-hidden" style={{ background: 'transparent' }}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Tier 1: Leadership */}
        <div ref={el => { dividersRef.current[0] = el; }} className="relative flex items-center justify-center mt-24 mb-16">
          <div className="divider-line absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF6B1A] to-transparent opacity-50 shadow-[0_0_10px_#FF6B1A] origin-center" />
          <h2 className="relative px-6 bg-[#050505]/80 backdrop-blur-md font-mono text-2xl tracking-widest text-[#FF6B1A] uppercase" style={{ textShadow: '0 0 15px rgba(255,107,26,0.6)' }}>
            The Leadership
          </h2>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-32">
          <div ref={el => { leadershipCardsRef.current[0] = el; }}>
            <PersonCard person={teamData.facultyCoordinator} size="large" />
          </div>
          <div ref={el => { leadershipCardsRef.current[1] = el; }}>
            <PersonCard person={teamData.hod} size="large" />
          </div>
        </div>

        {/* Tier 2: Board */}
        <div ref={el => { dividersRef.current[1] = el; }} className="relative flex items-center justify-center mt-32 mb-16">
          <div className="divider-line absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF6B1A] to-transparent opacity-50 shadow-[0_0_10px_#FF6B1A] origin-center" />
          <h2 className="relative px-6 bg-[#050505]/80 backdrop-blur-md font-mono text-2xl tracking-widest text-[#FF6B1A] uppercase" style={{ textShadow: '0 0 15px rgba(255,107,26,0.6)' }}>
            The Board
          </h2>
        </div>
        
        <div className="w-full relative py-10">
          <div ref={boardRowRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-12 gap-x-6">
            {teamData.boardMembers.map((member, i) => (
              <div key={i} className="flex justify-center">
                <PersonCard person={member} size="medium" />
              </div>
            ))}
          </div>
        </div>

        {/* Tier 3: Domains */}
        <div ref={el => { dividersRef.current[2] = el; }} className="relative flex items-center justify-center mt-32 mb-24">
          <div className="divider-line absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF6B1A] to-transparent opacity-50 shadow-[0_0_10px_#FF6B1A] origin-center" />
          <h2 className="relative px-6 bg-[#050505]/80 backdrop-blur-md font-mono text-2xl tracking-widest text-[#FF6B1A] uppercase" style={{ textShadow: '0 0 15px rgba(255,107,26,0.6)' }}>
            The Domains
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8 pt-10">
          {teamData.domains.map((domain, i) => (
            <div key={i} ref={el => { domainSectionsRef.current[i] = el; }} className="flex flex-col items-center">
              <h4 className="font-mono text-lg text-white/50 uppercase tracking-widest mb-10 border-b border-[#FF6B1A]/20 pb-3 w-full text-center">
                {domain.domainName}
              </h4>
              
              <div className="mb-10">
                <PersonCard person={domain.head} size="medium" />
              </div>
              
              <div className="flex justify-center gap-6 w-full">
                {domain.leads.map((lead, j) => (
                  <PersonCard key={j} person={lead} size="small" />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
