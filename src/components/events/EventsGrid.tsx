'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, EventRecord } from '@/lib/supabase';
import Image from 'next/image';

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
              <motion.span 
                layoutId={`event-date-${event.id}`}
                className="text-orange-500 font-mono text-xs mb-2 tracking-widest"
              >
                {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </motion.span>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-12 md:py-24">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEventId(null)}
              className="absolute inset-0 bg-black/85 cursor-pointer"
            />
            
            <motion.div
              layoutId={`event-${selectedEvent.id}`}
              className="relative w-full max-w-4xl max-h-[85vh] bg-neutral-950 border border-orange-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.15)] flex flex-col md:flex-row"
            >
              {/* Left Side - Poster */}
              <div className="relative w-full md:w-1/2 aspect-video md:aspect-auto h-64 md:h-full shrink-0">
                <Image
                  src={selectedEvent.poster_url}
                  alt={selectedEvent.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-950 md:block hidden pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent md:hidden block pointer-events-none" />
              </div>

              {/* Right Side - Details */}
              <div className="flex-1 p-6 md:p-12 overflow-y-auto custom-scrollbar">
                <motion.span 
                  layoutId={`event-date-${selectedEvent.id}`}
                  className="inline-block text-orange-500 font-mono text-sm tracking-widest mb-4 border border-orange-500/30 px-3 py-1 rounded-full bg-orange-500/10"
                >
                  {new Date(selectedEvent.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </motion.span>
                
                <motion.h3 
                  layoutId={`event-title-${selectedEvent.id}`}
                  className="text-white text-3xl md:text-4xl font-bold tracking-tight mb-6"
                >
                  {selectedEvent.title}
                </motion.h3>

                <div className="prose prose-invert prose-orange max-w-none">
                  <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
                    {selectedEvent.description}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedEventId(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-orange-500 hover:bg-orange-500/20 transition-all z-10"
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
