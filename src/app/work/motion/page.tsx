"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function MotionPage() {
  return (
    <main
      className="min-h-screen bg-background"
      style={{ paddingTop: "calc(var(--nav-height) + var(--space-16))" }}
    >
      <div className="page-container">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: "var(--space-12)" }}
        >
          <div
            className="flex items-center font-[family-name:var(--font-mono)] uppercase text-brown-400"
            style={{
              fontSize: "var(--text-xs)",
              letterSpacing: "0.16em",
              marginBottom: "var(--space-4)",
              gap: "var(--space-2)",
            }}
          >
            <Link
              href="/work"
              className="hover:text-accent-orange transition-colors"
              style={{ transitionDuration: "var(--duration-normal)" }}
            >
              Work
            </Link>
            <span className="text-brown-500">/</span>
            <span>Motion</span>
          </div>
          <h1
            className="font-[family-name:var(--font-display)] text-foreground tracking-tight"
            style={{ fontSize: "clamp(2rem, 1.5rem + 1.6vw, 3rem)" }}
          >
            Motion & animation
          </h1>
        </motion.header>

        <div className="border-t border-brown-500/15">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-brown-500/15"
            style={{ padding: "var(--space-16) 0" }}
          >
            <p
              className="text-brown-400 leading-relaxed"
              style={{ fontSize: "var(--text-lg)", maxWidth: "480px" }}
            >
              Motion graphics and animation explorations coming soon — spring physics,
              micro-interactions, and kinetic behaviors.
            </p>
          </motion.div>
        </div>

        <div style={{ paddingBottom: "var(--space-20)" }} />
      </div>
    </main>
  );
}
