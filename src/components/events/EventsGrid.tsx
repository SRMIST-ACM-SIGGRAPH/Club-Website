'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, EventRecord } from '@/lib/supabase';
import Image from 'next/image';

function formatUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function getDisplayHost(url: string): string {
  try {
    const formatted = formatUrl(url);
    const parsed = new URL(formatted);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function EventsGrid() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

      if (!error && data) {
        setEvents(data);
      }
      setLoading(false);
    }
    fetchEvents();
  }, []);

  // Prevent scrolling when modal is open — use class toggle to avoid forced layout
  useEffect(() => {
    if (selectedEventId) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [selectedEventId]);

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="w-full text-center py-24 text-neutral-500 font-mono text-sm border border-neutral-800/50 rounded-xl bg-black/20 backdrop-blur-md">
        <p className="text-orange-500/80 mb-2 tracking-widest uppercase">EVENTS ARCHIVE EMPTY</p>
        <p>Awaiting records from Supabase.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <motion.div
            key={event.id}
            layoutId={`event-${event.id}`}
            onClick={() => setSelectedEventId(event.id)}
            className="group relative aspect-video cursor-pointer rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {/* Poster Image */}
            <Image
              src={event.poster_url}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Glowing Border overlay on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 border-2 border-orange-500/50 rounded-xl transition-opacity duration-300 pointer-events-none shadow-[0_0_20px_rgba(249,115,22,0.3)_inset]" />

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

            {/* Text Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
              <div className="flex items-center justify-between gap-2 mb-2">
                <motion.span 
                  layoutId={`event-date-${event.id}`}
                  className="text-orange-500 font-mono text-xs tracking-widest"
                >
                  {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </motion.span>
                {event.link && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                    Link
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </span>
                )}
              </div>
              <motion.h3 
                layoutId={`event-title-${event.id}`}
                className="text-white text-xl md:text-2xl font-bold tracking-tight"
              >
                {event.title}
              </motion.h3>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedEventId && selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 md:py-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEventId(null)}
              className="absolute inset-0 bg-black/85 cursor-pointer backdrop-blur-sm"
            />
            
            <motion.div
              layoutId={`event-${selectedEvent.id}`}
              className="relative w-full max-w-4xl max-h-[88vh] bg-neutral-950 border border-orange-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.15)] flex flex-col md:flex-row z-10"
            >
              {/* Left Side - Poster */}
              <div className="relative w-full md:w-1/2 h-56 sm:h-72 md:h-auto md:min-h-[420px] shrink-0 self-stretch">
                <Image
                  src={selectedEvent.poster_url}
                  alt={selectedEvent.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-950/20 to-neutral-950 md:block hidden pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent md:hidden block pointer-events-none" />
              </div>

              {/* Right Side - Details */}
              <div className="flex-1 p-6 md:p-10 flex flex-col justify-between overflow-y-auto custom-scrollbar">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                    <motion.span 
                      layoutId={`event-date-${selectedEvent.id}`}
                      className="inline-block text-orange-500 font-mono text-xs md:text-sm tracking-widest border border-orange-500/30 px-3 py-1 rounded-full bg-orange-500/10"
                    >
                      {new Date(selectedEvent.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </motion.span>
                  </div>
                  
                  <motion.h3 
                    layoutId={`event-title-${selectedEvent.id}`}
                    className="text-white text-2xl md:text-3xl font-bold tracking-tight mb-4"
                  >
                    {selectedEvent.title}
                  </motion.h3>

                  <div className="prose prose-invert prose-orange max-w-none">
                    <p className="text-neutral-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                      {selectedEvent.description}
                    </p>
                  </div>
                </div>

                {/* Event Link Section */}
                {selectedEvent.link && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mt-6 pt-5 border-t border-neutral-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 text-neutral-400 font-mono text-xs">
                      <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse shrink-0" />
                      <span className="text-neutral-400 shrink-0">SOURCE:</span>
                      <span className="text-orange-400/90 underline decoration-orange-500/40 truncate max-w-[180px] sm:max-w-[220px]">
                        {getDisplayHost(selectedEvent.link)}
                      </span>
                    </div>

                    <a
                      href={formatUrl(selectedEvent.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-semibold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] active:scale-95 w-full sm:w-auto"
                    >
                      <span>Open Event Link</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  </motion.div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedEventId(null)}
                aria-label="Close modal"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-orange-500 hover:bg-orange-500/20 transition-all z-20 cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 13L13 1M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

