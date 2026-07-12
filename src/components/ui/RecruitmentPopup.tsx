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
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-[101] w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-6"
          >
            {/* Tech container */}
            <div className="relative overflow-hidden bg-black/80 p-8 shadow-[0_0_40px_rgba(0,255,204,0.15)] backdrop-blur-xl border border-[#00ffcc]/30">
              
              {/* Tech corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ffcc]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ffcc]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ffcc]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ffcc]" />

              {/* Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,204,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,204,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:linear-gradient(to_bottom,black,transparent)] pointer-events-none" />

              {/* Abstract background glows */}
              <div className="absolute -left-1/2 -top-1/2 -z-10 h-full w-full rounded-full bg-[#FF6B1A]/20 blur-[100px]" />
              <div className="absolute -bottom-1/2 -right-1/2 -z-10 h-full w-full rounded-full bg-[#00ffcc]/20 blur-[100px]" />

              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 rounded-sm p-1.5 text-[#00ffcc]/50 transition-colors hover:bg-[#00ffcc]/20 hover:text-[#00ffcc] z-10"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="relative text-center">
                {/* Tech Header */}
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FF6B1A]/40 bg-[#FF6B1A]/10 px-3 py-1 text-xs font-mono text-[#FF6B1A]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6B1A] opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF6B1A]"></span>
                  </span>
                  SYSTEM.UPDATE_AVAILABLE
                </div>

                <h3 className="mb-4 text-2xl font-bold tracking-tight text-white font-mono uppercase">
                  Recruitments <span className="text-[#00ffcc]">Open</span>
                </h3>
                
                <div className="mb-8 text-left text-xs sm:text-sm text-white/70 font-mono leading-relaxed bg-black/40 p-4 border-l-2 border-[#FF6B1A]/50">
                  <span className="text-[#00ffcc]">&gt;</span> INITIALIZING TEAM PROTOCOL...<br/>
                  <span className="text-[#00ffcc]">&gt;</span> READY TO SHAPE THE FUTURE OF COMPUTER GRAPHICS AND INTERACTIVE TECHNIQUES?<br/>
                  <span className="text-[#00ffcc]">&gt;</span> JOIN ACM SIGGRAPH SRM.
                </div>

                <Link
                  href="/join"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="group relative inline-flex w-full items-center justify-center overflow-hidden border border-[#00ffcc]/50 bg-[#00ffcc]/10 px-8 py-3 font-mono font-semibold text-[#00ffcc] transition-all duration-500 ease-out hover:shadow-[0_0_15px_rgba(0,255,204,0.2)]"
                >
                  {/* Expanding faded light effect from center */}
                  <span className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-[#00ffcc]/40 to-transparent opacity-0 scale-x-50 group-hover:scale-x-100 group-hover:opacity-100 origin-center transition-all duration-500 ease-out" />

                  <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-500 ease-out">
                    INITIATE_JOIN_SEQUENCE()
                    <svg className="w-4 h-4 transition-transform duration-500 ease-out group-hover:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
