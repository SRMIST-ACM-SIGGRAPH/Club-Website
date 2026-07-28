import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { EventsSection } from '@/components/sections/EventsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { RecruitmentPopup } from '@/components/ui/RecruitmentPopup';

export default function Home() {
  return (
    <main className="relative">
      <RecruitmentPopup />
      {/* Hero — transparent bg, the persistent canvas shows through */}
      <HeroSection />

      <AboutSection />
      
      <TeamSection />

      {/* Events section (Client Component with Framer Motion Modals) */}
      <EventsSection />

      {/* Projects section (Client Component with GSAP Stack & Framer Motion Modal) */}
      <ProjectsSection />

      
      <ContactSection />
    </main>
  );
}
