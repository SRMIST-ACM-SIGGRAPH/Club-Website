'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
      if (lenis) {
        lenis.scrollTo(element, { offset: 0, duration: 1.5 });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <ul className="flex flex-col items-end gap-6 pointer-events-auto">
        {navItems.map((item, index) => {
          const activeIndex = navItems.findIndex(n => n.id === activeSection);
          const distance = Math.abs(index - activeIndex);
          const isActive = distance === 0;
          
          // Enhanced wave effect calculations
          let xOffset = 0;
          let scale = 1;
          let lineWidth = 24;
          
          if (distance === 0) {
            xOffset = -32;
            scale = 1.3;
            lineWidth = 48;
          } else if (distance === 1) {
            xOffset = -16;
            scale = 1.15;
            lineWidth = 32;
          } else if (distance === 2) {
            xOffset = -8;
            scale = 1.05;
            lineWidth = 28;
          }

          return (
            <li key={item.id} className="relative group flex items-center justify-end">
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(item.id);
                }}
                className="flex items-center gap-4 relative py-3 pl-8 outline-none cursor-pointer"
                title={item.label}
              >
                {/* Active Indicator Wave - Orange Theme */}
                <motion.div
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-px"
                  style={{ backgroundColor: isActive ? '#ff8c00' : 'rgba(255, 140, 0, 0.3)' }}
                  initial={false}
                  animate={{
                    width: lineWidth,
                    right: '100%',
                    marginRight: '1rem',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />

                <motion.span
                  className="flex items-center justify-center"
                  initial={false}
                  animate={{
                    x: xOffset,
                    color: isActive ? '#ff8c00' : 'rgba(255, 255, 255, 0.4)',
                    scale: scale,
                  }}
                  whileHover={{
                    color: '#ff8c00',
                    scale: scale * 1.1,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  {item.icon}
                </motion.span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
