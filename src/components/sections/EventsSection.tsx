import { EventsGrid } from './../events/EventsGrid';

export function EventsSection() {
  return (
    <section id="events" className="relative w-full py-24 px-6 md:px-12 z-20 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-orange-500 tracking-widest text-xs uppercase mb-4" style={{ fontFamily: 'var(--font-geist-mono)' }}>
            — Visual Archives —
          </p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-orange-500/50">
            OUR EVENTS
          </h2>
        </div>

        {/* Dynamic Events Grid with Modals */}
        <EventsGrid />
      </div>

      {/* Decorative blurry background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
    </section>
  );
}
