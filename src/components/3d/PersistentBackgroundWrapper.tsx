'use client';

import dynamic from 'next/dynamic';

// Load the persistent 3D background client-side only (cannot use ssr: false in layout.tsx directly)
export const PersistentBackgroundWrapper = dynamic(
  () => import('./PersistentBackground').then((m) => m.PersistentBackground),
  { ssr: false }
);
