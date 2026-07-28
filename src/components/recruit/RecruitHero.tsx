'use client';

import { motion } from 'framer-motion';

export function RecruitHero() {
  return (
    <div className="relative flex flex-col items-center text-center pt-16 pb-20">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[600px] h-[300px] bg-[#FF6B1A]/10 blur-[100px] rounded-full pointer-events-none z-[-1]" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
          Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B1A] to-[#ffaa00]">ACM SIGGRAPH</span>
        </h1>
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
          We are the premiere student chapter for computer graphics, interactive techniques, and cutting-edge software engineering. 
          Help us push the boundaries of what is possible on the web.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-12"
      >
        <div className="w-[1px] h-24 bg-gradient-to-b from-[#FF6B1A] to-transparent mx-auto opacity-50" />
      </motion.div>
    </div>
  );
}
