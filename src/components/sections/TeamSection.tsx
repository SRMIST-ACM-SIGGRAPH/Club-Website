'use client';

import { motion } from 'framer-motion';

// --- Icons ---
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

// --- Dummy Data ---
// In a real project, replace these placeholder images with the actual team photos.
const P_PHOTO = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";
const M_PHOTO = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop";

const teamData = {
  facultyCoordinator: { name: "Dr. Jane Doe", photo: P_PHOTO, role: "Faculty Coordinator", socials: { instagram: "#", linkedin: "#", github: "#" } },
  hod: { name: "Dr. John Smith", photo: M_PHOTO, role: "HOD", socials: { instagram: "#", linkedin: "#", github: "#" } },
  boardMembers: [
    { name: "Alice Adams", photo: P_PHOTO, role: "President", socials: { instagram: "#", linkedin: "#", github: "#" } },
    { name: "Bob Brown", photo: M_PHOTO, role: "Vice President", socials: { instagram: "#", linkedin: "#", github: "#" } },
    { name: "Charlie Clark", photo: M_PHOTO, role: "Secretary", socials: { instagram: "#", linkedin: "#", github: "#" } },
    { name: "Diana Davis", photo: P_PHOTO, role: "Treasurer", socials: { instagram: "#", linkedin: "#", github: "#" } },
    { name: "Eve Evans", photo: P_PHOTO, role: "Director", socials: { instagram: "#", linkedin: "#", github: "#" } },
    { name: "Frank Ford", photo: M_PHOTO, role: "Director", socials: { instagram: "#", linkedin: "#", github: "#" } },
  ],
  domains: [
    {
      domainName: "Technical",
      head: { name: "Grace Green", photo: P_PHOTO, role: "Technical Head", socials: { instagram: "#", linkedin: "#", github: "#" } },
      leads: [
        { name: "Harry Hill", photo: M_PHOTO, role: "Tech Lead", socials: { instagram: "#", linkedin: "#", github: "#" } },
        { name: "Ivy Irwin", photo: P_PHOTO, role: "Tech Lead", socials: { instagram: "#", linkedin: "#", github: "#" } }
      ]
    },
    {
      domainName: "Events",
      head: { name: "Jack Jones", photo: M_PHOTO, role: "Events Head", socials: { instagram: "#", linkedin: "#", github: "#" } },
      leads: [
        { name: "Karen King", photo: P_PHOTO, role: "Events Lead", socials: { instagram: "#", linkedin: "#", github: "#" } },
        { name: "Leo Lewis", photo: M_PHOTO, role: "Events Lead", socials: { instagram: "#", linkedin: "#", github: "#" } }
      ]
    },
    {
      domainName: "Creatives",
      head: { name: "Mia Moore", photo: P_PHOTO, role: "Creatives Head", socials: { instagram: "#", linkedin: "#", github: "#" } },
      leads: [
        { name: "Noah Nelson", photo: M_PHOTO, role: "Design Lead", socials: { instagram: "#", linkedin: "#", github: "#" } },
        { name: "Olivia Owen", photo: P_PHOTO, role: "Video Lead", socials: { instagram: "#", linkedin: "#", github: "#" } }
      ]
    },
    {
      domainName: "Management",
      head: { name: "Pete Perez", photo: M_PHOTO, role: "Management Head", socials: { instagram: "#", linkedin: "#", github: "#" } },
      leads: [
        { name: "Quinn Quinn", photo: P_PHOTO, role: "PR Lead", socials: { instagram: "#", linkedin: "#", github: "#" } },
        { name: "Ryan Reed", photo: M_PHOTO, role: "Logistics Lead", socials: { instagram: "#", linkedin: "#", github: "#" } }
      ]
    }
  ]
};

// --- Components ---

function Divider({ text }: { text: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="relative flex items-center justify-center mt-24 mb-16"
    >
      <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF6B1A] to-transparent opacity-50 shadow-[0_0_10px_#FF6B1A]" />
      <h2 className="relative px-6 bg-[#050505]/80 backdrop-blur-md font-mono text-2xl tracking-widest text-[#FF6B1A] uppercase" style={{ textShadow: '0 0 15px rgba(255,107,26,0.6)' }}>
        {text}
      </h2>
    </motion.div>
  );
}

function PersonCard({ person, size = 'medium', delay = 0 }: { person: any, size?: 'large' | 'medium' | 'small', delay?: number }) {
  const sizeClasses = {
    large: 'w-48 h-48 md:w-56 md:h-56',
    medium: 'w-36 h-36 md:w-40 md:h-40',
    small: 'w-24 h-24 md:w-28 md:h-28',
  };

  const animDuration = size === 'large' ? 0.9 : 0.6;
  const initialY = size === 'large' ? 40 : 30;

  return (
    <motion.div 
      className="group flex flex-col items-center text-center"
      initial={{ opacity: 0, y: initialY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: animDuration, ease: "easeOut", delay }}
    >
      <div className={`relative rounded-full overflow-hidden mb-4 border border-[#FF6B1A]/30 shadow-[0_0_15px_rgba(255,107,26,0.15)] transition-all duration-500 group-hover:scale-105 group-hover:border-[#FF6B1A] group-hover:shadow-[0_0_30px_rgba(255,107,26,0.6)] ${sizeClasses[size]}`}>
        <img src={person.photo} alt={person.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      </div>
      <h3 className={`font-bold text-white tracking-wide ${size === 'small' ? 'text-base' : 'text-lg'}`}>{person.name}</h3>
      <p className="text-[#FF6B1A] font-mono text-xs md:text-sm tracking-wider mt-1 mb-3" style={{ textShadow: '0 0 10px rgba(255,107,26,0.5)' }}>{person.role}</p>
      
      <div className="flex space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {person.socials.instagram && (
          <a href={person.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#FF6B1A] hover:drop-shadow-[0_0_8px_rgba(255,107,26,0.8)] transition-all">
            <InstagramIcon className="w-4 h-4 md:w-5 md:h-5" />
          </a>
        )}
        {person.socials.linkedin && (
          <a href={person.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#FF6B1A] hover:drop-shadow-[0_0_8px_rgba(255,107,26,0.8)] transition-all">
            <LinkedinIcon className="w-4 h-4 md:w-5 md:h-5" />
          </a>
        )}
        {person.socials.github && (
          <a href={person.socials.github} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#FF6B1A] hover:drop-shadow-[0_0_8px_rgba(255,107,26,0.8)] transition-all">
            <GithubIcon className="w-4 h-4 md:w-5 md:h-5" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

export function TeamSection() {
  return (
    <section id="team" className="relative w-full min-h-screen pb-32 overflow-hidden" style={{ background: 'transparent' }}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Tier 1: Leadership */}
        <Divider text="The Leadership" />
        <div className="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-32">
          <PersonCard person={teamData.facultyCoordinator} size="large" delay={0.1} />
          <PersonCard person={teamData.hod} size="large" delay={0.3} />
        </div>

        {/* Tier 2: Board */}
        <Divider text="The Board" />
        <div className="flex flex-nowrap justify-start lg:justify-center overflow-x-auto pb-8 gap-x-8 md:gap-x-12 scrollbar-hide snap-x">
          {teamData.boardMembers.map((member, i) => (
            <div key={i} className="snap-center shrink-0">
              <PersonCard person={member} size="medium" delay={i * 0.1} />
            </div>
          ))}
        </div>

        {/* Tier 3: Domains */}
        <Divider text="The Domains" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {teamData.domains.map((domain, i) => (
            <div key={i} className="flex flex-col items-center">
              <motion.h4 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="font-mono text-lg text-white/50 uppercase tracking-widest mb-10 border-b border-[#FF6B1A]/20 pb-3 w-full text-center"
              >
                {domain.domainName}
              </motion.h4>
              
              <div className="mb-10">
                <PersonCard person={domain.head} size="medium" delay={i * 0.1 + 0.2} />
              </div>
              
              <div className="flex justify-center gap-6 w-full">
                {domain.leads.map((lead, j) => (
                  <PersonCard key={j} person={lead} size="small" delay={i * 0.1 + 0.4 + (j * 0.1)} />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
