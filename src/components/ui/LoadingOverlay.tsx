'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function RefinedLoader() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-16 h-16 mb-8">
        {/* Glowing pulsing rings */}
        <motion.div
          className="absolute inset-0 rounded-full border border-white/20"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-t-2 border-l-2 border-white"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <motion.h2
        className="text-white/60 tracking-[0.3em] text-xs uppercase"
        style={{ fontFamily: 'var(--font-geist-mono)' }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        Initializing System...
      </motion.h2>
    </div>
  );
}

function ParticleLoader() {
  // Simple particle dispersion effect using framer-motion
  const particles = Array.from({ length: 40 });
  
  return (
    <div className="flex flex-col items-center justify-center relative w-full h-full">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ 
              x: 0, 
              y: 0, 
              scale: 0,
              opacity: 0
            }}
            animate={{ 
              x: (Math.random() - 0.5) * 150, 
              y: (Math.random() - 0.5) * 150,
              scale: [0, Math.random() * 2 + 1, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{ 
              duration: 2.5, 
              ease: "circOut",
            }}
          />
        ))}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, letterSpacing: '0.1em' }}
          animate={{ opacity: [0, 1, 1, 0], scale: 1, letterSpacing: '0.3em' }}
          transition={{ duration: 2.5, times: [0, 0.3, 0.7, 1] }}
          className="absolute font-bold text-white tracking-[0.3em] uppercase text-xl"
        >
          SIGGRAPH
        </motion.div>
      </div>
    </div>
  );
}

export function LoadingOverlay() {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'refined' | 'particles'>('refined');

  useEffect(() => {
    // Simulate loading for 2.5s
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [mode, loading]); // restart loading when triggered

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            {mode === 'refined' ? <RefinedLoader /> : <ParticleLoader />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dev Toggle */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-[200] flex gap-2">
          <button
            onClick={() => { setMode('refined'); setLoading(true); }}
            className={`px-3 py-1 text-xs border rounded transition-colors ${mode === 'refined' ? 'border-white bg-white text-black' : 'border-white/20 bg-black/50 text-white'}`}
          >
            Refined Loader
          </button>
          <button
            onClick={() => { setMode('particles'); setLoading(true); }}
            className={`px-3 py-1 text-xs border rounded transition-colors ${mode === 'particles' ? 'border-white bg-white text-black' : 'border-white/20 bg-black/50 text-white'}`}
          >
            Particle Loader
          </button>
        </div>
      )}
    </>
  );
}
