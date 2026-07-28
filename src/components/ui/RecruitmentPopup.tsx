'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// -------------------------------------------------------------
// TOGGLE THIS TO FALSE WHEN RECRUITMENTS ARE CLOSED
const RECRUITMENT_OPEN = true;
// -------------------------------------------------------------

export function RecruitmentPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!RECRUITMENT_OPEN) return;
    
    // Show popup after a short delay for better UX
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!RECRUITMENT_OPEN) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed left-1/2 top-1/2 z-[101] w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 p-1"
          >
            {/* Glassmorphism card container */}
            <div className="relative overflow-hidden rounded-2xl bg-neutral-900/60 p-8 shadow-[0_20px_50px_rgba(255,107,26,0.15)] backdrop-blur-xl border border-white/10">
              
              {/* Decorative abstract glows inside the card */}
              <div className="absolute -left-16 -top-16 -z-10 h-36 w-36 rounded-full bg-[#FF6B1A]/10 blur-[40px]" />
              <div className="absolute -bottom-16 -right-16 -z-10 h-36 w-36 rounded-full bg-orange-600/10 blur-[40px]" />

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-5 top-5 rounded-full p-2 text-white/40 hover:text-[#FF6B1A] hover:bg-white/5 transition-all duration-300 z-20 cursor-pointer"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="relative flex flex-col items-center text-center">
                
                {/* Official Logo Badge */}
                <div className="mb-6 relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[#FF6B1A]/20 blur-md animate-pulse" />
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#FF6B1A] shadow-[0_0_20px_rgba(255,107,26,0.4)]">
                    <img src="/logo.jpg" alt="SRMIST ACM SIGGRAPH" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Sub-badge */}
                <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-1 text-[10px] font-mono tracking-widest text-[#FF6B1A] uppercase">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                  </span>
                  Recruitments Active
                </div>

                {/* Heading */}
                <h3 className="mb-3 text-2xl font-bold tracking-tight text-white font-sans">
                  Join the Chapter
                </h3>
                
                {/* Welcoming Description */}
                <p className="mb-8 text-sm text-neutral-400 font-sans leading-relaxed px-1">
                  Ready to shape the future of computer graphics, interactive media, and emerging technology? Apply now to join the creative developers, 3D artists, and visionaries of SRMIST ACM SIGGRAPH.
                </p>

                {/* Call-to-action button */}
                <Link
                  href="/join"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl border border-orange-500/30 bg-orange-500/10 px-8 py-3.5 font-sans font-semibold text-[#FF6B1A] hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(255,107,26,0.1)] hover:shadow-[0_0_25px_rgba(255,107,26,0.3)] hover:bg-[#FF6B1A] hover:border-[#FF6B1A] cursor-pointer"
                >
                  <span className="relative z-10 flex items-center gap-2 tracking-wide text-sm font-bold">
                    Start Your Application
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
