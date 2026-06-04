import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

//  The Font Configuration
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIthlete",
  description: "AIthlete is your ultimate fitness trainer.",
};

// The Layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-zinc-950 text-zinc-100`}>
        {children}
      </body>
    </html>
  );
}