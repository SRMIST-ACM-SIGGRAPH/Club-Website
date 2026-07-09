'use client';

import { motion } from 'framer-motion';

const domains = [
  {
    title: 'Web Development',
    description: 'Build cutting-edge web applications using React, Next.js, and Three.js.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-[#FF6B1A]">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    )
  },
  {
    title: 'Corporate',
    description: 'Manage sponsorships, club finances, and official club operations.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-[#FF6B1A]">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    )
  },
  {
    title: 'Creatives',
    description: 'Design UI/UX, edit videos, create 3D assets, and shape the visual identity.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-[#FF6B1A]">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.18-.62-1.61-.38-.43-.61-1.02-.61-1.63 0-1.28 1.05-2.33 2.33-2.33h1.83c2.51 0 4.57-2.06 4.57-4.57C22 7.17 17.52 2 12 2z" />
        <circle cx="6.5" cy="11.5" r="1.5" fill="currentColor" />
        <circle cx="9.5" cy="7.5" r="1.5" fill="currentColor" />
        <circle cx="14.5" cy="7.5" r="1.5" fill="currentColor" />
        <circle cx="17.5" cy="11.5" r="1.5" fill="currentColor" />
      </svg>
    )
  },
  {
    title: 'R&D',
    description: 'Research computer graphics algorithms, ML models, and experimental tech.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-[#FF6B1A]">
        <path d="M10 2v2" /><path d="M14 2v2" /><path d="M18 2v2" />
        <path d="M6 22v-2" /><path d="M10 22v-2" /><path d="M14 22v-2" /><path d="M18 22v-2" />
        <path d="M2 6h2" /><path d="M2 10h2" /><path d="M2 14h2" /><path d="M2 18h2" />
        <path d="M22 6h-2" /><path d="M22 10h-2" /><path d="M22 14h-2" /><path d="M22 18h-2" />
        <rect x="6" y="6" width="12" height="12" rx="2" />
      </svg>
    )
  }
];

export function DomainShowcase() {
  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-mono text-[#FF6B1A] uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,107,26,0.6)]">
          Our Domains
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {domains.map((domain, index) => (
          <motion.div
            key={domain.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FF6B1A]/50 transition-colors group"
          >
            <div className="text-4xl mb-4 opacity-80 group-hover:opacity-100 transition-opacity">{domain.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{domain.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">{domain.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
