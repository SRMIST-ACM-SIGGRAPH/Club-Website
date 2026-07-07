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

      {/* Events section */}
      <section
        id="events"
        className="relative min-h-[50vh] flex items-center justify-center"
        style={{ background: 'transparent' }}
      >
        <div className="text-center">
          <p className="text-neutral-600 tracking-widest text-xs uppercase" style={{ fontFamily: 'var(--font-geist-mono)' }}>— Events —</p>
        </div>
      </section>

      {/* Projects section */}
      <section
        id="projects"
        className="relative min-h-[50vh] flex items-center justify-center"
        style={{ background: 'transparent' }}
      >
        <div className="text-center">
          <p className="text-neutral-600 tracking-widest text-xs uppercase" style={{ fontFamily: 'var(--font-geist-mono)' }}>— Projects —</p>
        </div>
      </section>
    </main>
  );
}
