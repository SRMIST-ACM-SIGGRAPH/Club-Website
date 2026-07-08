import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative w-full py-12 px-6 sm:px-12 z-20 mt-10">
      {/* Glowing orange boundary */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ff8c00] to-transparent opacity-50" />
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#ff8c00]/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center text-center gap-6">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold tracking-widest uppercase text-white">
              ACM SIGGRAPH <span className="font-light text-[#ff8c00]">SRM</span>
            </h3>
            <p className="mt-2 text-sm text-white/40 max-w-sm mx-auto leading-relaxed">
              Exploring the boundaries of computer graphics, interactive techniques, and digital art.
            </p>
          </div>

          {/* Copyright */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-white/20 w-full max-w-md mx-auto" style={{ fontFamily: 'var(--font-geist-mono)' }}>
            © {new Date().getFullYear()} ACM SIGGRAPH SRM. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
