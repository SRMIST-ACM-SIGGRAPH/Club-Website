'use client';

import { motion } from 'framer-motion';

interface ComingSoonBannerProps {
  message?: string;
}

export function ComingSoonBanner({ message = "Our team is currently building and polishing student projects, 3D graphics demos, and technical showcases. Check back soon for official releases!" }: ComingSoonBannerProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-[#0a0a0a]/80 p-10 md:p-14 text-center border border-[#ff8c00]/30 shadow-[0_0_40px_rgba(255,140,0,0.15)] backdrop-blur-xl max-w-xl w-full"
      >
        <div className="absolute -left-16 -top-16 -z-10 h-40 w-40 rounded-full bg-[#ff8c00]/10 blur-[50px]" />
        <div className="absolute -bottom-16 -right-16 -z-10 h-40 w-40 rounded-full bg-orange-600/10 blur-[50px]" />

        <div className="inline-flex items-center gap-2 rounded-full border border-[#ff8c00]/40 bg-[#ff8c00]/10 px-4 py-1.5 text-xs font-mono text-[#ff8c00] uppercase tracking-widest mb-6">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff8c00] opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff8c00]"></span>
          </span>
          STATUS: IN DEVELOPMENT
        </div>

        <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4 font-sans">
          COMING SOON
        </h3>

        <p className="text-neutral-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
          {message}
        </p>
      </motion.div>
    </div>
  );
}
