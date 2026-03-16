import type { Metadata } from "next";
import { Instrument_Serif, Outfit, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/nav/Navbar";
import { ThemeInit } from "@/components/ThemeInit";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-jb",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Gabriel Behrens — Product Designer",
  description:
    "Portfolio of Gabriel Behrens, product designer. Inspired by kinetic art, architectural layers, and pattern recognition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeInit />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
