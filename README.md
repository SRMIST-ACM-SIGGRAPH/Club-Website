# SRMIST ACM SIGGRAPH Website

Welcome to the official repository for the SRMIST ACM SIGGRAPH website. This is a modern, interactive web application built to showcase our club's projects, events, members, and to facilitate our recruitment process.

## 🚀 Quick Start

To get the project running locally on your machine, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Club-Website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **View the site:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion & GSAP (ScrollTrigger)
- **3D Rendering:** Three.js / React Three Fiber
- **Backend & Database:** Supabase
- **Smooth Scrolling:** Lenis

## 📁 Repository Structure

- `/src/app`: Next.js App Router layout and pages (e.g., `/` for landing, `/join` for recruitments).
- `/src/components/ui`: Reusable UI components (Navbar, Footer, Loading overlay).
- `/src/components/sections`: Landing page sections (Hero, About, Projects, Events, Team, Contact).
- `/src/components/3d`: Components handling the persistent 3D backgrounds and WebGL effects.
- `/src/components/recruit`: Recruitment form components and configuration JSON files.

## 📖 Further Reading

For an in-depth look at the architecture, dynamic features, and recruitment portal management, please refer to the [DOCUMENTATION.md](./DOCUMENTATION.md) file.
