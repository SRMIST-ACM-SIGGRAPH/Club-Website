'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ContactSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Social Links Data
  const socials = [
    {
      id: 'instagram',
      label: '@srm_acm_siggraph',
      href: 'https://www.instagram.com/srm_acm_siggraph',
      color: '#ff8c00', // Using orange instead of IG colors to match theme
      renderIcon: (isHovered: boolean) => (
        <motion.div
          animate={
            isHovered
              ? { rotate: [0, -10, 10, -5, 0], scale: 1.1, filter: 'drop-shadow(0px 0px 10px rgba(255,140,0,0.8))' }
              : { rotate: 0, scale: 1, filter: 'drop-shadow(0px 0px 0px rgba(255,140,0,0))' }
          }
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {/* Base stroke icon */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-neutral-400 relative z-10 transition-colors duration-200 group-hover:text-[#ff8c00]">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </motion.div>
      )
    },
    {
      id: 'email',
      label: 'srmacmsiggraph@gmail.com',
      href: 'mailto:srmacmsiggraph@gmail.com',
      color: '#ff8c00',
      renderIcon: (isHovered: boolean) => (
        <motion.div
          animate={isHovered ? { scale: 1.1, filter: 'drop-shadow(0px 0px 8px rgba(255,140,0,0.6))' } : { scale: 1, filter: 'drop-shadow(0px 0px 0px rgba(255,140,0,0))' }}
          className="relative text-neutral-400 group-hover:text-[#ff8c00] transition-colors duration-200"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <motion.path 
              initial={{ d: "M3 7L12 13L21 7" }}
              animate={{ d: isHovered ? "M3 7L12 2L21 7" : "M3 7L12 13L21 7" }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            />
          </svg>
        </motion.div>
      )
    },
    {
      id: 'linkedin',
      label: 'ACM SIGGRAPH SRM',
      href: 'https://www.linkedin.com/company/srmist-acm-siggraph-student-chapter/',
      color: '#0077b5', // Blue pulse for linkedin
      renderIcon: (isHovered: boolean) => (
        <motion.div
          animate={isHovered ? { y: -5, filter: 'drop-shadow(0px 8px 12px rgba(0,119,181,0.8))' } : { y: 0, filter: 'drop-shadow(0px 0px 0px rgba(0,119,181,0))' }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="relative text-neutral-400 group-hover:text-[#0077b5] transition-colors duration-200"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </motion.div>
      )
    },
    {
      id: 'github',
      label: 'srmacmsiggraph',
      href: 'https://github.com/srmacmsiggraph',
      color: '#ff8c00', // Glitch in orange
      renderIcon: (isHovered: boolean) => (
        <motion.div
          animate={isHovered ? {
            x: [0, -3, 3, -2, 2, 0],
            y: [0, 2, -2, 1, -1, 0],
            skewX: [0, 10, -10, 5, -5, 0],
            filter: [
              'drop-shadow(0 0 0 rgba(255,140,0,0))',
              'drop-shadow(-3px 0 0 red) drop-shadow(3px 0 0 cyan)',
              'drop-shadow(3px 0 0 red) drop-shadow(-3px 0 0 cyan)',
              'drop-shadow(0 0 0 rgba(255,140,0,0.8))'
            ],
            color: ['#a3a3a3', '#ff0000', '#00ffff', '#ff8c00']
          } : {
            x: 0, y: 0, skewX: 0, filter: 'drop-shadow(0 0 0 rgba(255,140,0,0))', color: '#a3a3a3'
          }}
          transition={{ duration: 0.25 }}
          className="relative"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </motion.div>
      )
    }
  ];

  return (
    <section id="contact" className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden py-24" style={{ background: 'transparent' }}>
      
      {/* Terminal background element */}
      <div className="absolute inset-0 max-w-4xl mx-auto h-full flex flex-col items-center justify-center opacity-30 pointer-events-none z-0">
        <div className="w-full h-full border border-[#ff8c00]/20 rounded-lg bg-black/40 backdrop-blur-sm relative" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)' }}>
          {/* Subtle grid lines */}
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#ff8c00 1px, transparent 1px), linear-gradient(90deg, #ff8c00 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.05 }} />
        </div>
      </div>

      <div className="relative z-10 text-center w-full max-w-2xl mx-auto px-6">
        
        {/* Terminal Header */}
        <div className="mb-12">
          <p className="text-[#ff8c00] tracking-widest text-xs md:text-sm font-mono uppercase mb-4 opacity-80 flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#ff8c00] animate-pulse" />
            System.Network.Connect()
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-widest text-white uppercase" style={{ textShadow: '0 0 20px rgba(255,140,0,0.3)' }}>
            Initiate <span className="text-[#ff8c00] font-light">Link</span>
          </h2>
        </div>

        {/* Social Icons Row */}
        <div className="flex items-center justify-center gap-6 md:gap-10">
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group p-4 flex items-center justify-center"
              onMouseEnter={() => setHoveredId(social.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {social.renderIcon(hoveredId === social.id)}

              {/* Animated Tooltip */}
              <AnimatePresence>
                {hoveredId === social.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -bottom-8 whitespace-nowrap px-3 py-1 bg-[#111] border border-[#ff8c00]/30 rounded text-[#ff8c00] font-mono text-[10px] uppercase tracking-widest pointer-events-none shadow-[0_0_10px_rgba(255,140,0,0.2)]"
                  >
                    {social.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </a>
          ))}
        </div>

        {/* Console Prompt */}
        <div className="mt-20 inline-block text-left bg-black/60 border border-white/10 rounded-md p-4 w-full max-w-md font-mono text-xs md:text-sm text-neutral-400 shadow-[0_0_15px_rgba(255,140,0,0.05)]">
          <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            <span className="ml-2 text-[10px] text-neutral-600">bash — root@srm-siggraph</span>
          </div>
          <p><span className="text-[#ff8c00]">root@server</span><span className="text-white">:~#</span> ping acmsiggraphsrm</p>
          <p className="mt-1 opacity-70">PING server (192.168.1.1): 56 data bytes</p>
          <p className="opacity-70">64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=0.250 ms</p>
          <p className="mt-2 text-[#00ffcc] animate-pulse">Connection established _</p>
        </div>

      </div>
    </section>
  );
}
