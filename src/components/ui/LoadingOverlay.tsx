'use client';

import { useRef, useEffect, useState } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  z: number;         // depth: positive = coming toward viewer
  vx: number;
  vy: number;
  vz: number;        // z velocity (positive = flying at viewer)
  baseRadius: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
}

interface Shockwave {
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

interface Ring {
  radius: number;
  color: string;
  lineWidth: number;
  dashed: boolean;
  rotX: number; // current rotation angles
  rotY: number;
  rotZ: number;
  speedX: number;
  speedY: number;
  speedZ: number;
}

// ─── 3D Projection ─────────────────────────────────────────────────────────────

function project3D(
  x: number, y: number, z: number,
  rotX: number, rotY: number, rotZ: number,
  perspective: number
): [number, number, number] {
  // Rotate around X axis
  let y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
  let z1 = y * Math.sin(rotX) + z * Math.cos(rotX);
  // Rotate around Y axis
  let x2 = x * Math.cos(rotY) + z1 * Math.sin(rotY);
  let z2 = -x * Math.sin(rotY) + z1 * Math.cos(rotY);
  // Rotate around Z axis
  let x3 = x2 * Math.cos(rotZ) - y1 * Math.sin(rotZ);
  let y3 = x2 * Math.sin(rotZ) + y1 * Math.cos(rotZ);

  const scale = perspective / (perspective + z2);
  return [x3 * scale, y3 * scale, scale];
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function LoadingOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── Resize ──────────────────────────────────────────────────────────────
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Lock scroll ─────────────────────────────────────────────────────────
    document.body.style.overflow = 'hidden';

    // ── State ───────────────────────────────────────────────────────────────
    let progress = 0;
    let phase: 'loading' | 'exploding' | 'fading' = 'loading';
    let overlayAlpha = 1;
    let particles: Particle[] = [];
    let lastTime = performance.now();

    // Three gyroscope rings — faster rotation
    const rings: Ring[] = [
      { radius: 55, color: 'rgba(255,255,255,0.85)', lineWidth: 1, dashed: false, rotX: 0, rotY: 0, rotZ: 0, speedX: 0.032, speedY: 0.022, speedZ: 0.016 },
      { radius: 80, color: '#FF6B1A', lineWidth: 1.5, dashed: true, rotX: 0.5, rotY: 0.3, rotZ: 0.8, speedX: -0.026, speedY: 0.038, speedZ: -0.020 },
      { radius: 105, color: '#00ffcc', lineWidth: 1, dashed: false, rotX: 1.0, rotY: 0.8, rotZ: 0.2, speedX: 0.020, speedY: -0.030, speedZ: 0.036 },
    ];

    // Shockwave rings
    let shockwaves: Shockwave[] = [];
    let flashAlpha = 0;

    // ── Progress ticker ─────────────────────────────────────────────────────
    let progressInterval = setInterval(() => {
      if (phase !== 'loading') return;
      const inc = Math.random() * 6 + 2;
      progress = Math.min(100, progress + inc);
      if (progress >= 100) {
        clearInterval(progressInterval);
        phase = 'exploding';
        spawnParticles();
        // notify background logo to start animating
        (window as any).__loaderComplete = true;
        window.dispatchEvent(new Event('loaderComplete'));
      }
    }, 55);

    // ── Spawn full-screen perspective star-burst ────────────────────────────
    function spawnParticles() {
      const cx = canvas!.width / 2;
      const cy = canvas!.height / 2;
      particles = [];

      // Main burst — 300 particles, moderate speed so they spread nicely without vanishing instantly
      for (let i = 0; i < 300; i++) {
        const angle = Math.random() * Math.PI * 2;
        // Speed range: 5–22px per frame — reaches edges but visibly
        const speed = Math.random() * 17 + 5;
        const r = Math.random();
        const color = r < 0.42 ? '#FF6B1A' : r < 0.75 ? '#ffffff' : '#00ffcc';
        const size = Math.random() * 2.5 + 0.5;
        const vz = (Math.random() * 30) - 10; // z-depth

        particles.push({
          x: cx, y: cy, z: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          vz,
          baseRadius: size,
          color,
          alpha: 1,
          // Faster decay so particles die cleanly and transition begins quickly
          decay: Math.random() * 0.018 + 0.012,
          gravity: Math.random() * 0.02,
        });
      }

      // 50 comet-speed streakers that hit the screen edges
      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 35 + 25; // fast but not invisible
        const color = Math.random() < 0.5 ? '#FF6B1A' : '#ffffff';

        particles.push({
          x: cx, y: cy, z: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          vz: (Math.random() - 0.3) * 6,
          baseRadius: Math.random() * 1.2 + 0.4,
          color,
          alpha: 1,
          decay: Math.random() * 0.022 + 0.015,
          gravity: 0,
        });
      }

      // Initial white flash
      flashAlpha = 1;

      // Two shockwave rings expanding from center
      const maxR = Math.sqrt((canvas!.width / 2) ** 2 + (canvas!.height / 2) ** 2) * 1.15;
      shockwaves = [
        { radius: 0, maxRadius: maxR, alpha: 0.95, speed: 55 },
        { radius: 0, maxRadius: maxR * 0.75, alpha: 0.6, speed: 35 },
      ];
    }

    // ── Draw a 3D ring ──────────────────────────────────────────────────────
    function drawRing(ring: Ring, cx: number, cy: number, alpha: number, scale: number) {
      const segments = 72;
      const perspective = 400 * scale;
      const scaledRadius = ring.radius * scale;

      if (ring.dashed) {
        ctx!.setLineDash([6 * scale, 5 * scale]);
      } else {
        ctx!.setLineDash([]);
      }

      ctx!.beginPath();
      let firstPoint = true;

      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const px = Math.cos(angle) * scaledRadius;
        const py = Math.sin(angle) * scaledRadius;
        const pz = 0;

        const [sx, sy] = project3D(px, py, pz, ring.rotX, ring.rotY, ring.rotZ, perspective);

        if (firstPoint) {
          ctx!.moveTo(cx + sx, cy + sy);
          firstPoint = false;
        } else {
          ctx!.lineTo(cx + sx, cy + sy);
        }
      }

      ctx!.strokeStyle = ring.color.startsWith('rgba') || ring.color.startsWith('#')
        ? applyAlpha(ring.color, alpha)
        : ring.color;
      ctx!.lineWidth = ring.lineWidth * scale;
      ctx!.globalAlpha = alpha;
      ctx!.stroke();
      ctx!.globalAlpha = 1;
      ctx!.setLineDash([]);
    }

    // ── Color alpha utility ─────────────────────────────────────────────────
    function applyAlpha(hex: string, alpha: number): string {
      if (hex.startsWith('rgba')) return hex;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }

    // ── Main render loop ────────────────────────────────────────────────────
    function render(now: number) {
      const dt = Math.min((now - lastTime) / 16.67, 3); // normalized to 60fps
      lastTime = now;

      const W = canvas!.width;
      const H = canvas!.height;
      const cx = W / 2;
      const cy = H / 2;

      // Responsive Sizing scale (Outer ring diameter is ~210px)
      const baseDiameter = 270;
      const maxLoaderSize = Math.min(W * 0.8, H * 0.5);
      const scale = Math.min(1.0, maxLoaderSize / baseDiameter);

      // Clear
      ctx!.clearRect(0, 0, W, H);

      // Background
      ctx!.fillStyle = `rgba(5,5,5,${overlayAlpha})`;
      ctx!.fillRect(0, 0, W, H);

      if (phase === 'loading') {
        // Rotate rings
        for (const ring of rings) {
          ring.rotX += ring.speedX * dt;
          ring.rotY += ring.speedY * dt;
          ring.rotZ += ring.speedZ * dt;
        }

        // Draw rings
        for (const ring of rings) {
          drawRing(ring, cx, cy, 1, scale);
        }

        // Glowing core
        ctx!.save();
        const coreR = Math.max(4, 10 * scale);
        const grd = ctx!.createRadialGradient(cx, cy, 0, cx, cy, coreR);
        grd.addColorStop(0, 'rgba(255,255,255,1)');
        grd.addColorStop(0.4, 'rgba(0,255,204,0.6)');
        grd.addColorStop(1, 'rgba(0,255,204,0)');
        ctx!.fillStyle = grd;
        ctx!.beginPath();
        ctx!.arc(cx, cy, coreR, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }

      // Progress text and bar (only during loading)
      if (phase === 'loading') {
        const pct = Math.floor(progress);
        ctx!.save();
        ctx!.globalAlpha = 1;
        ctx!.fillStyle = 'rgba(160,160,160,0.8)';
        ctx!.font = '600 ' + Math.max(9, Math.floor(11 * scale)) + 'px "Geist Mono", monospace';
        ctx!.letterSpacing = '0.35em';
        ctx!.textAlign = 'center';
        ctx!.fillText(`LOADING  ${pct}%`, cx, cy + Math.floor(135 * scale));

        // Bar background
        const barW = Math.floor(140 * scale);
        const barX = cx - barW / 2;
        const barY = cy + Math.floor(148 * scale);
        ctx!.fillStyle = 'rgba(255,255,255,0.08)';
        ctx!.beginPath();
        ctx!.roundRect(barX, barY, barW, 1.5, 1);
        ctx!.fill();

        // Bar fill gradient
        const filled = (progress / 100) * barW;
        if (filled > 0) {
          const grad = ctx!.createLinearGradient(barX, 0, barX + barW, 0);
          grad.addColorStop(0, '#FF6B1A');
          grad.addColorStop(1, '#00ffcc');
          ctx!.fillStyle = grad;
          ctx!.shadowColor = '#00ffcc';
          ctx!.shadowBlur = 6 * scale;
          ctx!.beginPath();
          ctx!.roundRect(barX, barY, filled, 1.5, 1);
          ctx!.fill();
          ctx!.shadowBlur = 0;
        }
        ctx!.restore();
      }

      // Draw particles with perspective z-depth
      if (phase === 'exploding') {
        // White flash at start of explosion
        if (flashAlpha > 0) {
          ctx!.save();
          ctx!.globalAlpha = flashAlpha;
          ctx!.fillStyle = '#ffffff';
          ctx!.fillRect(0, 0, W, H);
          ctx!.restore();
          flashAlpha -= 0.08 * dt;
        }

        // Shockwave rings
        for (const sw of shockwaves) {
          if (sw.alpha <= 0) continue;
          sw.radius += sw.speed * dt;
          sw.alpha -= 0.022 * dt;
          ctx!.save();
          ctx!.globalAlpha = Math.max(0, sw.alpha);
          ctx!.strokeStyle = '#ffffff';
          ctx!.lineWidth = 2;
          ctx!.shadowColor = '#00ffcc';
          ctx!.shadowBlur = 20;
          ctx!.beginPath();
          ctx!.arc(cx, cy, sw.radius, 0, Math.PI * 2);
          ctx!.stroke();
          ctx!.restore();
        }

        // Perspective-projected particles
        let allDead = true;
        // Sort back-to-front so near particles draw on top
        particles.sort((a, b) => a.z - b.z);

        for (const p of particles) {
          if (p.alpha <= 0) continue;
          allDead = false;

          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.z += p.vz * dt;
          p.vy += p.gravity * dt;
          p.vx *= 0.992;
          p.vy *= 0.992;
          p.alpha -= p.decay * dt;

          // Perspective scale: z approaches viewer -> grows dramatically
          // At z=120 (close to viewer), scale = ~2.5x. Cap to avoid absurd sizes.
          const perspScale = Math.min(4, Math.max(0.05, 1 + p.z / 100));
          const r = p.baseRadius * perspScale;
          const a = Math.max(0, p.alpha);

          ctx!.save();
          ctx!.globalAlpha = a;
          ctx!.fillStyle = p.color;
          ctx!.shadowColor = p.color;
          ctx!.shadowBlur = r * 2.5;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.restore();
        }

        if (allDead && shockwaves.every(sw => sw.alpha <= 0)) {
          phase = 'fading';
        }
      }

      // Fade out overlay quickly
      if (phase === 'fading') {
        overlayAlpha -= 0.1 * dt;
        if (overlayAlpha <= 0) {
          cancelAnimationFrame(rafRef.current);
          document.body.style.overflow = '';
          setIsVisible(false);
          return;
        }
      }

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(progressInterval);
      window.removeEventListener('resize', resize);
      document.body.style.overflow = '';
    };
  }, []);

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'block',
      }}
    />
  );
}
