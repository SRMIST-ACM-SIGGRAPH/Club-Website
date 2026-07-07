import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TeamSection } from '@/components/sections/TeamSection';

export default function Home() {
  return (
    <main className="relative">
      {/* Hero — transparent bg, the persistent canvas shows through */}
      <HeroSection />

      <AboutSection />
      
      <TeamSection />

      {/* Third section — still transparent */}
      <section
        id="events"
        className="relative min-h-screen flex items-center justify-center"
        style={{ background: 'transparent' }}
      >
        <div className="text-center">
          <p
            className="text-neutral-600 tracking-widest text-xs uppercase"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            — Events —
          </p>
        </div>
      </section>
    </main>
  );
}
