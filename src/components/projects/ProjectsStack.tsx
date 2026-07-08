'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase, Project } from '@/lib/supabase';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function ProjectsStack() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedProject]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Fetch projects
  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  // GSAP Fan-Out Animation
  useEffect(() => {
    if (loading || projects.length === 0) return;

    // Small delay to ensure DOM is fully rendered for coordinate calculations
    const timer = setTimeout(() => {
      if (!containerRef.current || cardsRef.current.length === 0) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;

      const ctx = gsap.context(() => {
        cardsRef.current.forEach((card, index) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          // Calculate distance from card's natural position to center of container
          // Note: getBoundingClientRect is relative to viewport, so we need local offsets
          const cardCenterX = card.offsetLeft + card.offsetWidth / 2;
          const cardCenterY = card.offsetTop + card.offsetHeight / 2;
          
          const dx = centerX - cardCenterX;
          const dy = centerY - cardCenterY;
          
          // Randomize stack rotation slightly for a messy deck look
          const initialRot = (index % 2 === 0 ? 1 : -1) * (5 + Math.random() * 10);

          gsap.fromTo(card,
            { 
              x: dx, 
              y: dy, 
              rotation: initialRot, 
              scale: 0.8,
              opacity: 0
            },
            {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              opacity: 1,
              duration: 1.2,
              ease: "back.out(1.2)",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
                toggleActions: "play none none reverse"
              },
              delay: index * 0.1
            }
          );
        });
      }, containerRef);

      return () => ctx.revert(); // Cleanup on unmount
    }, 100);

    return () => clearTimeout(timer);
  }, [loading, projects]);

  if (loading) {
    return (
      <div className="flex flex-wrap justify-center gap-8 w-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-[300px] h-[400px] rounded-2xl bg-[#050505]/40 backdrop-blur-md border border-white/5 animate-pulse flex flex-col p-6 shadow-[0_0_15px_rgba(255,140,0,0.05)]">
            <div className="w-full h-40 bg-white/5 rounded-lg mb-4"></div>
            <div className="h-6 w-3/4 bg-white/5 rounded mb-2"></div>
            <div className="h-4 w-full bg-white/5 rounded mb-1"></div>
            <div className="h-4 w-5/6 bg-white/5 rounded mb-4"></div>
            <div className="mt-auto flex gap-2">
              <div className="h-6 w-16 rounded-full bg-white/5"></div>
              <div className="h-6 w-16 rounded-full bg-white/5"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-50 border border-white/5 rounded-2xl bg-[#050505]/40 backdrop-blur-md">
        <p className="font-mono text-sm tracking-widest uppercase text-[#ff8c00]">Stack Empty</p>
        <p className="text-xs text-neutral-500 mt-2">Awaiting uplinks from Supabase projects table.</p>
      </div>
    );
  }

  return (
    <>
      <div ref={containerRef} className="flex flex-wrap justify-center gap-8 w-full relative">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            ref={(el) => { cardsRef.current[index] = el; }}
            layoutId={`project-${project.id}`}
            className="w-[300px] sm:w-[350px] flex flex-col bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden cursor-pointer group shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            whileHover={{ 
              y: -10, 
              scale: 1.02,
              borderColor: 'rgba(255, 140, 0, 0.5)',
              boxShadow: '0 10px 30px rgba(255, 140, 0, 0.2)'
            }}
            onClick={() => setSelectedProject(project)}
          >
            {/* Project Image */}
            <div className="w-full h-48 relative overflow-hidden bg-black">
              {(project.image_urls?.[0] || project.image_url) ? (
                <img 
                  src={project.image_urls?.[0] || project.image_url} 
                  alt={project.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#ff8c00]/30 font-mono text-xs">
                  NO_IMAGE_DATA
                </div>
              )}
              {/* Overlay glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
            </div>

            {/* Project Info */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-white mb-2 tracking-wide group-hover:text-[#ff8c00] transition-colors">{project.title}</h3>
              <p className="text-neutral-400 text-sm line-clamp-2 mb-4">
                {project.description}
              </p>
              
              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tech_stack?.slice(0, 3).map((tech, i) => (
                  <span key={i} className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full border border-[#ff8c00]/30 text-[#ff8c00]">
                    {tech}
                  </span>
                ))}
                {project.tech_stack?.length > 3 && (
                  <span className="text-[10px] font-mono px-2 py-1 text-neutral-500">+{project.tech_stack.length - 3}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expanded Modal via Framer Motion */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setSelectedProject(null)}
            />

            <motion.div
              layoutId={`project-${selectedProject.id}`}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a0a0a]/90 backdrop-blur-3xl border border-[#ff8c00]/40 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,140,0,0.2)] flex flex-col md:flex-row z-10"
            >
              {/* Image Side */}
              <div className="w-full md:w-1/2 h-64 md:h-auto bg-black relative overflow-hidden group">
                {(() => {
                  const images = selectedProject.image_urls?.length ? selectedProject.image_urls : (selectedProject.image_url ? [selectedProject.image_url] : []);
                  if (images.length === 0) {
                    return (
                      <div className="w-full h-full flex items-center justify-center text-[#ff8c00]/30 font-mono">
                        NO_IMAGE_DATA
                      </div>
                    );
                  }

                  return (
                    <>
                      <AnimatePresence mode="wait">
                        <motion.img 
                          key={currentImageIndex}
                          src={images[currentImageIndex]}
                          alt={`${selectedProject.title} screenshot ${currentImageIndex + 1}`}
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </AnimatePresence>

                      {/* Navigation Arrows */}
                      {images.length > 1 && (
                        <>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#ff8c00]/20 hover:border-[#ff8c00] z-20 shadow-lg"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#ff8c00]/20 hover:border-[#ff8c00] z-20 shadow-lg"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                          </button>

                          {/* Dot Indicators */}
                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/5">
                            {images.map((_, i) => (
                              <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'bg-[#ff8c00] w-6' : 'bg-white/50 hover:bg-white'}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  );
                })()}
                {/* Gradient overlay for blending */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none z-10"></div>
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto custom-scrollbar">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 text-white/50 hover:text-[#ff8c00] transition-colors z-20"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>

                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-wide"
                >
                  {selectedProject.title}
                </motion.h2>

                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-neutral-300 leading-relaxed mb-8"
                >
                  {selectedProject.description}
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8"
                >
                  <h4 className="text-[#ff8c00] font-mono text-xs uppercase tracking-widest mb-3">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech_stack?.map((tech, i) => (
                      <span key={i} className="text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-full border border-[#ff8c00]/50 bg-[#ff8c00]/10 text-white shadow-[0_0_10px_rgba(255,140,0,0.1)]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-auto flex flex-wrap gap-4 pt-4 border-t border-white/10"
                >
                  {selectedProject.github_url && (
                    <a 
                      href={selectedProject.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white font-medium text-sm"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                      Repository
                    </a>
                  )}
                  {selectedProject.demo_url && (
                    <a 
                      href={selectedProject.demo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#ff8c00]/10 hover:bg-[#ff8c00]/20 border border-[#ff8c00]/50 transition-colors text-[#ff8c00] font-medium text-sm shadow-[0_0_15px_rgba(255,140,0,0.15)]"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      Live Demo
                    </a>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
