import Link from 'next/link';

export function Footer() {
  return (
    <footer id="contact" className="relative w-full py-16 px-6 sm:px-12 z-20 mt-20">
      {/* Glowing orange boundary */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ff8c00] to-transparent opacity-50" />
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#ff8c00]/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Contact heading */}
        <div className="text-center mb-12">
          <p className="text-[#ff8c00]/60 tracking-[0.3em] text-xs uppercase mb-2" style={{ fontFamily: 'var(--font-geist-mono)' }}>Get In Touch</p>
          <h2 className="text-3xl font-bold tracking-widest uppercase text-white">
            Contact <span className="text-[#ff8c00]">Us</span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
          {/* Left: Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-lg font-bold tracking-widest uppercase text-white">
              ACM SIGGRAPH <span className="font-light text-[#ff8c00]">SRM</span>
            </h3>
            <p className="mt-2 text-sm text-white/40 max-w-sm leading-relaxed">
              Exploring the boundaries of computer graphics, interactive techniques, and digital art.
            </p>
          </div>

          {/* Right: Social Links */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-sm tracking-[0.2em] uppercase text-[#ff8c00]/70 mb-4" style={{ fontFamily: 'var(--font-geist-mono)' }}>
              Connect
            </h4>
            <ul className="flex items-center gap-6">
              <li>
                <a
                  href="https://instagram.com/srm_acm_siggraph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-[#ff8c00] transition-colors uppercase tracking-widest text-xs"
                >
                  Instagram
                </a>
              </li>
              <li>
                <span className="text-white/20 uppercase tracking-widest text-xs cursor-not-allowed" title="Coming soon">LinkedIn</span>
              </li>
              <li>
                <span className="text-white/20 uppercase tracking-widest text-xs cursor-not-allowed" title="Coming soon">GitHub</span>
              </li>
              <li>
                <span className="text-white/20 uppercase tracking-widest text-xs cursor-not-allowed" title="Coming soon">Email</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-white/5 text-center text-xs text-white/20" style={{ fontFamily: 'var(--font-geist-mono)' }}>
          © {new Date().getFullYear()} ACM SIGGRAPH SRM. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
