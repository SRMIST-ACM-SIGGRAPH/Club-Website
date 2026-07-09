'use client';

import { motion } from 'framer-motion';

const domains = [
  {
    title: 'Web Development',
    description: 'Build cutting-edge web applications using React, Next.js, and Three.js.',
    icon: '💻'
  },
  {
    title: 'Corporate',
    description: 'Manage sponsorships, club finances, and official club operations.',
    icon: '🏢'
  },
  {
    title: 'Creatives',
    description: 'Design UI/UX, edit videos, create 3D assets, and shape the visual identity.',
    icon: '🎨'
  },
  {
    title: 'R&D',
    description: 'Research computer graphics algorithms, ML models, and experimental tech.',
    icon: '🔬'
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
