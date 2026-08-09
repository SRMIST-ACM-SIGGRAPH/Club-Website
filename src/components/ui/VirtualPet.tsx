'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type PetState = 'IDLE' | 'WALK' | 'RUN' | 'CLIMB_LEFT' | 'CLIMB_RIGHT';

export function VirtualPet() {
  const [position, setPosition] = useState({ x: 100, y: 0 }); // y is from bottom
  const [petState, setPetState] = useState<PetState>('IDLE');
  const [facingRight, setFacingRight] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
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
  const getAnimationProps = (): any => {
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
        <PixSVG />
      </motion.div>
    </motion.div>
  );
}

// Highly detailed 3D-like CSS/SVG representation of Pix
const PixSVG = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
    <defs>
      {/* Flame 3D Gradient */}
      <radialGradient id="flameGrad" cx="40" cy="40" r="80" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD34E" />
        <stop offset="0.4" stopColor="#FF8B00" />
        <stop offset="0.8" stopColor="#E65C00" />
        <stop offset="1" stopColor="#B32400" />
      </radialGradient>
      
      {/* Hoodie Gradient */}
      <linearGradient id="hoodieGrad" x1="50" y1="70" x2="50" y2="120" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2A2A2A" />
        <stop offset="1" stopColor="#111111" />
      </linearGradient>

      {/* Eye Shadow Gradient */}
      <radialGradient id="eyeShadow" cx="50" cy="60" r="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="0.8" stopColor="#E0E0E0" />
        <stop offset="1" stopColor="#A0A0A0" />
      </radialGradient>
      
      {/* S Logo Gradient */}
      <linearGradient id="sGrad" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#FF9900" />
        <stop offset="1" stopColor="#FF5500" />
      </linearGradient>
    </defs>

    {/* Floating Cubes (Left) */}
    <rect x="15" y="25" width="4" height="4" fill="#FF8B00" transform="rotate(15 17 27)" opacity="0.8" />
    <rect x="10" y="45" width="6" height="6" fill="#FF9900" transform="rotate(45 13 48)" opacity="0.6" />
    <rect x="22" y="10" width="3" height="3" fill="#FF5500" transform="rotate(30 23 11)" opacity="0.9" />
    
    {/* Floating Cubes (Right) */}
    <rect x="80" y="30" width="5" height="5" fill="#FF8B00" transform="rotate(25 82 32)" opacity="0.8" />
    <rect x="85" y="55" width="4" height="4" fill="#FF9900" transform="rotate(60 87 57)" opacity="0.7" />

    {/* Feet/Shoes */}
    <rect x="35" y="112" width="12" height="6" rx="3" fill="#111111" />
    <rect x="35" y="116" width="12" height="2" fill="#FF8B00" />
    <rect x="53" y="112" width="12" height="6" rx="3" fill="#111111" />
    <rect x="53" y="116" width="12" height="2" fill="#FF8B00" />

    {/* Back of Hood */}
    <path d="M 25 75 Q 50 65 75 75 Q 85 85 75 100 Q 50 110 25 100 Q 15 85 25 75 Z" fill="#0A0A0A" />

    {/* Left Arm */}
    <path d="M 28 85 Q 10 95 12 110" stroke="url(#hoodieGrad)" strokeWidth="12" strokeLinecap="round" />
    {/* Right Arm */}
    <path d="M 72 85 Q 90 95 88 110" stroke="url(#hoodieGrad)" strokeWidth="12" strokeLinecap="round" />

    {/* Hands (Small flame colored blobs) */}
    <circle cx="12" cy="110" r="5" fill="#FF8B00" />
    <circle cx="88" cy="110" r="5" fill="#FF8B00" />

    {/* Main Hoodie Body */}
    <path d="M 30 75 L 70 75 Q 80 120 70 115 L 30 115 Q 20 120 30 75 Z" fill="url(#hoodieGrad)" />

    {/* Drawstrings */}
    <path d="M 40 78 Q 38 90 42 95" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="42" cy="95" r="1.5" fill="#555" />
    <path d="M 60 78 Q 62 90 58 95" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="58" cy="95" r="1.5" fill="#555" />

    {/* Flame Head (Main 3D Body) */}
    <path d="M 50 5 C 85 35 95 65 75 90 C 60 105 40 105 25 90 C 5 65 15 35 50 5 Z" fill="url(#flameGrad)" />
    
    {/* Head Highlight (Glassy sheen on the top left) */}
    <path d="M 50 12 C 30 35 22 55 27 75 C 22 55 35 30 50 12 Z" fill="#FFFFFF" opacity="0.3" />

    {/* Big Eye Sclera */}
    <circle cx="50" cy="62" r="22" fill="url(#eyeShadow)" />
    
    {/* Iris */}
    <circle cx="50" cy="62" r="12" fill="#1A1A1A" />
    <circle cx="50" cy="62" r="10" fill="#0A0A0A" />

    {/* Specular Highlights on Eye */}
    <ellipse cx="45" cy="57" rx="4" ry="6" fill="#FFFFFF" transform="rotate(-30 45 57)" opacity="0.9" />
    <circle cx="54" cy="66" r="2" fill="#FFFFFF" opacity="0.6" />

    {/* Mouth (Small smile) */}
    <path d="M 44 92 Q 50 96 56 92" stroke="#B32400" strokeWidth="2" fill="none" strokeLinecap="round" />

    {/* S Logo on Chest */}
    <g transform="translate(40, 95) scale(0.2)">
      <path d="M 60 20 C 20 20 20 50 50 50 C 80 50 80 80 40 80 C 30 80 20 75 15 70" stroke="url(#sGrad)" strokeWidth="15" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="50" r="45" stroke="url(#sGrad)" strokeWidth="8" fill="none" />
    </g>
  </svg>
);
