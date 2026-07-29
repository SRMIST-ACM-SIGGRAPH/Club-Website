'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type PetState = 'IDLE' | 'WALK' | 'RUN' | 'CLIMB_LEFT' | 'CLIMB_RIGHT';

export function VirtualPet() {
  const [position, setPosition] = useState({ x: 100, y: 0 }); // y is from bottom
  const [petState, setPetState] = useState<PetState>('IDLE');
  const [facingRight, setFacingRight] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(2); // In seconds
  
  const currentPos = useRef({ x: 100, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start at a random x position on mount
    const startX = Math.random() * (window.innerWidth - 80);
    currentPos.current = { x: startX, y: 0 };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosition({ x: startX, y: 0 });
  }, []);

  useEffect(() => {
    if (showMessage) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    const wander = () => {
      const rand = Math.random();
      let nextState: PetState = 'IDLE';
      
      if (rand < 0.2) nextState = 'IDLE';
      else if (rand < 0.6) nextState = 'WALK';
      else if (rand < 0.8) nextState = 'RUN';
      else nextState = Math.random() > 0.5 ? 'CLIMB_LEFT' : 'CLIMB_RIGHT';

      setPetState(nextState);

      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const petSize = 80;

      let targetX = currentPos.current.x;
      let targetY = currentPos.current.y;
      let durationMs = 2000;

      if (nextState === 'IDLE') {
        durationMs = 2000 + Math.random() * 3000;
      } else if (nextState === 'WALK' || nextState === 'RUN') {
        targetX = Math.max(0, Math.min(screenW - petSize, Math.random() * screenW));
        targetY = 0; // Floor
        setFacingRight(targetX > currentPos.current.x);
        
        const dist = Math.sqrt(Math.pow(targetX - currentPos.current.x, 2) + Math.pow(targetY - currentPos.current.y, 2));
        const speed = nextState === 'RUN' ? 300 : 80;
        durationMs = (dist / speed) * 1000;
      } else if (nextState === 'CLIMB_LEFT') {
        targetX = 0;
        targetY = Math.max(0, Math.min(screenH - petSize - 100, Math.random() * screenH));
        setFacingRight(false);
        
        const dist = Math.sqrt(Math.pow(targetX - currentPos.current.x, 2) + Math.pow(targetY - currentPos.current.y, 2));
        durationMs = (dist / 120) * 1000;
      } else if (nextState === 'CLIMB_RIGHT') {
        targetX = screenW - petSize;
        targetY = Math.max(0, Math.min(screenH - petSize - 100, Math.random() * screenH));
        setFacingRight(true);
        
        const dist = Math.sqrt(Math.pow(targetX - currentPos.current.x, 2) + Math.pow(targetY - currentPos.current.y, 2));
        durationMs = (dist / 120) * 1000;
      }

      // Clamp duration to prevent extremely long or short animations
      durationMs = Math.max(500, Math.min(durationMs, 5000));
      setCurrentDuration(durationMs / 1000);

      currentPos.current = { x: targetX, y: targetY };
      setPosition({ x: targetX, y: targetY });

      timeoutRef.current = setTimeout(wander, durationMs + 500);
    };

    timeoutRef.current = setTimeout(wander, 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [showMessage]);

  const handleClick = () => {
    setShowMessage(true);
    setPetState('IDLE');
    setTimeout(() => {
      setShowMessage(false);
    }, 4000); // Hide message after 4 seconds and resume wandering
  };

  // Determine animation variants based on state
  const getAnimationProps = () => {
    switch (petState) {
      case 'WALK':
        return {
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
          transition: { repeat: Infinity, duration: 0.5, ease: 'easeInOut' }
        };
      case 'RUN':
        return {
          y: [0, -20, 0],
          rotate: [0, 15, -15, 0],
          scaleX: [1, 1.1, 1],
          transition: { repeat: Infinity, duration: 0.3, ease: 'easeInOut' }
        };
      case 'CLIMB_LEFT':
      case 'CLIMB_RIGHT':
        return {
          y: [-5, 5, -5],
          rotate: petState === 'CLIMB_LEFT' ? [90, 85, 95, 90] : [-90, -85, -95, -90],
          transition: { repeat: Infinity, duration: 0.6, ease: 'easeInOut' }
        };
      case 'IDLE':
      default:
        return {
          y: [0, -5, 0],
          scaleY: [1, 0.95, 1],
          transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
        };
    }
  };

  return (
    <motion.div
      className="fixed z-50 pointer-events-auto cursor-pointer"
      initial={false}
      animate={{ x: position.x, bottom: position.y }}
      transition={{ type: 'tween', ease: 'linear', duration: currentDuration }}
      onClick={handleClick}
      style={{ width: 80, height: 100 }}
    >
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-2xl shadow-lg whitespace-nowrap text-sm font-bold flex items-center gap-2"
          >
            Hello! I&apos;m Pix
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={getAnimationProps()}
        style={{
          width: '100%',
          height: '100%',
          transformOrigin: 'bottom center',
          scaleX: facingRight ? 1 : -1
        }}
      >
        {!imageError ? (
          <Image
            src="/pix/pix-front.png"
            alt="Pix Virtual Pet"
            fill
            className="object-contain drop-shadow-2xl"
            onError={() => setImageError(true)}
            unoptimized // Just in case it's a GIF
          />
        ) : (
          <PixFallbackSVG />
        )}
      </motion.div>
    </motion.div>
  );
}

// A pure CSS/SVG fallback for Pix if the user hasn't uploaded the cropped image yet.
const PixFallbackSVG = () => (
  <svg width="80" height="100" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hoodie Body */}
    <path d="M 20 80 Q 20 120 50 120 Q 80 120 80 80 L 80 70 L 20 70 Z" fill="#1A1A1A" />
    <path d="M 10 75 Q -5 95 10 110 L 25 90 Z" fill="#FF8C00" /> {/* Left Arm */}
    <path d="M 90 75 Q 105 95 90 110 L 75 90 Z" fill="#FF8C00" /> {/* Right Arm */}
    {/* Flame Head */}
    <path d="M 50 0 C 80 40 100 60 80 90 C 60 120 40 120 20 90 C 0 60 20 40 50 0 Z" fill="url(#flameGrad)" />
    {/* Big Eye */}
    <circle cx="50" cy="65" r="18" fill="white" />
    <circle cx="50" cy="65" r="8" fill="#1A1A1A" />
    <circle cx="53" cy="62" r="3" fill="white" />
    {/* S Logo */}
    <circle cx="50" cy="100" r="10" fill="#FF8C00" />
    <path d="M 47 95 C 55 95 55 100 50 100 C 45 100 45 105 53 105" stroke="#1A1A1A" strokeWidth="2" fill="none" />
    
    <defs>
      <linearGradient id="flameGrad" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD700" />
        <stop offset="0.5" stopColor="#FF8C00" />
        <stop offset="1" stopColor="#FF4500" />
      </linearGradient>
    </defs>
  </svg>
);
