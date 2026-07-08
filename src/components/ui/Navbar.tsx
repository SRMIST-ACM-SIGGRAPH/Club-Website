'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from 'lenis/react';

const navItems = [
  { 
    id: 'hero', 
    label: 'Home', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ) 
  },
  { 
    id: 'about', 
    label: 'About', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
      </svg>
    )
  },
  { 
    id: 'team', 
    label: 'Team', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )
  },
  { 
    id: 'events', 
    label: 'Events', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
      </svg>
    )
  },
  { 
    id: 'projects', 
    label: 'Projects', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>
      </svg>
    )
  },
  { 
    id: 'contact', 
    label: 'Contact Us', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    )
  },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      let currentActive = 'hero';
      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentActive = item.id;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // The 'about' section is pinned by GSAP for 100vh and starts invisible.
      // We offset by 80% of the window height so it's fully visible when jumped to.
      const offset = id === 'about' ? window.innerHeight * 0.8 : 0;
      
      if (lenis) {
        lenis.scrollTo(element, { offset: offset, duration: 1.5 });
      } else {
        if (id === 'about') {
          window.scrollTo({ top: element.offsetTop + offset, behavior: 'smooth' });
        } else {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        <ul className="flex flex-col items-center gap-4">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const isHovered = hoveredNav === item.id;
            const isCurrentTarget = (hoveredNav || activeSection) === item.id;

            return (
              <li 
                key={item.id} 
                className="relative group flex items-center justify-center w-12 h-12"
                onMouseEnter={() => setHoveredNav(item.id)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(item.id);
                  }}
                  className="relative z-10 flex items-center justify-center w-full h-full outline-none cursor-pointer"
                >
                  {/* Fluid Curved Blob Background */}
                  {isCurrentTarget && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-gradient-to-br from-[#ff8c00]/40 to-[#ff8c00]/10 border border-[#ff8c00]/50 shadow-[0_0_20px_rgba(255,140,0,0.4)] mix-blend-screen"
                      animate={{
                        borderRadius: [
                          "40% 60% 70% 30% / 40% 50% 60% 50%",
                          "60% 40% 30% 70% / 60% 30% 70% 40%",
                          "50% 50% 20% 80% / 25% 80% 20% 75%",
                          "40% 60% 70% 30% / 40% 50% 60% 50%"
                        ]
                      }}
                      transition={{ 
                        borderRadius: { repeat: Infinity, duration: 4, ease: "linear" },
                        layout: { type: 'spring', stiffness: 400, damping: 30 } 
                      }}
                    />
                  )}

                  <motion.span
                    className="relative z-10 flex items-center justify-center"
                    animate={{
                      color: isActive ? '#ffffff' : (isHovered ? '#ff8c00' : 'rgba(255, 255, 255, 0.4)'),
                      scale: isActive ? 1.1 : (isHovered ? 1.1 : 1),
                      filter: isActive ? 'drop-shadow(0px 0px 8px rgba(255,255,255,0.5))' : 'none',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {item.icon}
                  </motion.span>
                </a>

                {/* Enhanced Bouncing Tooltip with Pointer */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: 20, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 10, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className="absolute right-[115%] top-1/2 -translate-y-1/2 px-4 py-2 bg-[#0a0a0a] border border-[#ff8c00]/40 rounded-lg text-[#ff8c00] font-mono text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,140,0,0.2)] pointer-events-none whitespace-nowrap flex items-center z-50"
                    >
                      {item.label}
                      {/* Triangle Pointer */}
                      <div className="absolute -right-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#0a0a0a] border-r border-t border-[#ff8c00]/40 rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
