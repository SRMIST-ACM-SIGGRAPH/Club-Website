'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const navItems = [
  { 
    id: 'hero', 
    label: 'Home', 
    icon: (
      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-black shadow-lg overflow-hidden border border-white/20">
        <img src="/icon.svg" alt="Home" className="w-full h-full object-cover scale-110" />
      </div>
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

const joinNavItems = [
  { 
    id: 'home-redirect', 
    label: 'Home', 
    icon: (
      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-black shadow-lg overflow-hidden border border-white/20">
        <img src="/icon.svg" alt="Home" className="w-full h-full object-cover scale-110" />
      </div>
    ),
    href: '/'
  },
  { 
    id: 'application-form', 
    label: 'Form', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    )
  }
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const lenis = useLenis();
  const pathname = usePathname();

  const activeItems = pathname === '/join' ? joinNavItems : navItems;

  // Global Auth Listener: Catches OAuth tokens if Supabase falls back to root URL
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && window.location.hash.includes('access_token')) {
        // We caught a token! If we are on root, redirect them back to the form
        if (window.location.pathname === '/') {
          window.location.href = '/join';
        }
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Effect runs on all pages, but logic is safe
  useEffect(() => {
    const handleScroll = () => {
      let currentActive = activeItems[0].id;
      for (const item of activeItems) {
        if ('href' in item && item.href) continue;
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
  }, [activeItems]);

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
          {activeItems.map((item) => {
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
                {('href' in item && item.href) ? (
                  <Link
                    href={item.href}
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
                  </Link>
                ) : (
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
                )}

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
