import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { PersistentBackgroundWrapper } from "@/components/3d/PersistentBackgroundWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tech Club | ACM SIGGRAPH SRM",
  description: "Official website for the ACM SIGGRAPH SRM Tech Club",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#050505]">
        <LenisProvider>
          {/* Fixed background — always mounted, never unmounts between sections */}
          <PersistentBackgroundWrapper />

          {/* All page content sits on top of the background */}
          <div className="relative z-10">
            {children}
          </div>
        </LenisProvider>
      </body>
    </html>
  );
}
