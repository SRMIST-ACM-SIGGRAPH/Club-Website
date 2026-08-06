# Technical Documentation

This document provides a deep dive into the architecture, features, and configuration of the SRMIST ACM SIGGRAPH website.

## 1. Architecture Overview

The website leverages Next.js with the App Router to provide a fast, SEO-friendly experience. A key architectural decision is the use of a **Persistent 3D Background**.
- **`PersistentBackgroundWrapper`**: Mounted at the root `layout.tsx` level, ensuring that navigating between routes (like from `/` to `/join`) does not cause the heavy Three.js canvas to re-mount. It stays alive and performs continuously.
- **Lenis Smooth Scrolling**: Wrapped globally to provide buttery smooth scrolling mechanics across all pages, essential for the GSAP scroll-triggered animations.

## 2. Dynamic Content (Supabase Integration)

The website is designed to be highly dynamic, pulling content from Supabase so the frontend code does not need constant updating.
- **Projects (`ProjectsStack.tsx`)**: Fetches from a `projects` table. Renders an interactive, fan-out GSAP animation for project cards. Clicking a card expands a Framer Motion layout with an image carousel and tech stack details.
- **Events (`EventsGrid.tsx`)**: Fetches from an `events` table to populate the club's event history.

## 3. Recruitment Portal (`/join`)

The recruitment system is fully customized and configurable without deploying new code for basic changes.

### 3.1. Form Architecture
- Built with React state and `framer-motion` for smooth multi-step transitions.
- **Data Persistence**: Automatically saves draft applications to `localStorage` so users do not lose their progress if they refresh.
- **Validation**: Enforces strict validation, including ensuring all users register with an `@srmist.edu.in` email address.

### 3.2. Configuration Files
The recruitment logic is driven by local JSON configurations located in `/src/components/recruit/`:
- **`recruit.json`**: Controls global and domain-specific deadlines. You can easily toggle `"is_open": true/false` to open or close recruitment for specific domains or the whole site.
- **`domain_questions.json`**: Defines the specific questions asked for each domain (e.g., Tech, Design, Corporate). To add a new question, simply add a new JSON object with `id`, `label`, `type` (text/textarea/url), and `required`.

### 3.3. Database Submission
- Submissions are securely inserted into the `applications` table in Supabase.
- The system prevents duplicate applications for the same domain by utilizing a unique constraint on the database and gracefully alerting the user.

## 4. UI / UX Details

### Loading Overlay (`LoadingOverlay.tsx`)
A custom HTML5 Canvas-based loading overlay featuring a 3D gyroscope and a particle burst effect.
- **Flow**: It runs until reaching 100%, explodes, and triggers a custom `loaderComplete` event.
- **Event Listener**: The persistent 3D background listens for `loaderComplete` to know when it is safe to begin its rendering sequence, ensuring a smooth entrance.

### GSAP Animations
We utilize `ScrollTrigger` heavily in the landing page sections (`AboutSection`, `ProjectsStack`). To prevent hydration and mounting issues with Next.js, all GSAP logic is wrapped inside `useEffect` and properly scoped and cleaned up using `gsap.matchMedia()` and `gsap.context()`.

## 5. Maintenance Notes

- When running the Next.js dev server, you might notice occasional flickering or strict-mode double invocations of GSAP animations. This is expected in development (`React.StrictMode`) and will not occur in the production build.
- To update the background or 3D elements, refer to the files in `src/components/3d/`. Be mindful of performance—Three.js can be heavy, so limit polygon counts and complex shaders where possible.
