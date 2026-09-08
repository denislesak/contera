import type { Metadata } from "next";
import { Inter, Inter_Tight, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/**
 * Typefaces per context/design-system.md §2: Inter Tight (Display /
 * Section label), Inter (Body / Eyebrow), IBM Plex Mono with tabular
 * numerals (Systematic — every data value). These are DEFINED design
 * decisions, not framework defaults.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Contera",
  description: "Contera application shell",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-threshold-canvas">{children}</body>
    </html>
  );
}
