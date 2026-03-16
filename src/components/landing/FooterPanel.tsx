"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface FooterPanelProps {
  visible: boolean;
  onDismiss: () => void;
}

export function FooterPanel({ visible, onDismiss }: FooterPanelProps) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-0 left-0 right-0 z-[45] pointer-events-auto"
      style={{
        backgroundColor: "var(--surface-elevated)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      {/* Scroll-up indicator */}
      <button
        onClick={onDismiss}
        className="w-full flex justify-center transition-colors text-brown-400 hover:text-accent-orange"
        style={{
          padding: "var(--space-3) 0 0",
          transitionDuration: "var(--duration-normal)",
        }}
        aria-label="Scroll back up"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M5 12L10 7L15 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        className="page-container"
        style={{
          padding: "var(--space-6) var(--page-margin) var(--space-8)",
          textAlign: "center",
        }}
      >
        {/* Credits */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
            marginBottom: "var(--space-6)",
          }}
        >
          <p
            className="font-[family-name:var(--font-mono)] text-brown-300"
            style={{ fontSize: "var(--text-sm)", letterSpacing: "0.02em" }}
          >
            This website has been made entirely using Claude Code.
          </p>
          <p
            className="font-[family-name:var(--font-mono)] text-brown-400"
            style={{ fontSize: "var(--text-xs)", letterSpacing: "0.04em" }}
          >
            Done in a span of two weeks.
          </p>
          <p
            className="font-[family-name:var(--font-mono)] text-brown-500 italic"
            style={{ fontSize: "var(--text-xs)", letterSpacing: "0.04em" }}
          >
            No agents were harmed in the creation of this website.
          </p>
        </div>

        {/* Navigation links */}
        <div
          className="flex items-center justify-center"
          style={{ gap: "var(--space-8)" }}
        >
          <Link
            href="/work"
            className="font-[family-name:var(--font-mono)] uppercase text-brown-300 hover:text-accent-orange transition-colors font-medium"
            style={{
              fontSize: "var(--text-xs)",
              letterSpacing: "0.16em",
              transitionDuration: "var(--duration-normal)",
            }}
          >
            Work
          </Link>
          <Link
            href="/about"
            className="font-[family-name:var(--font-mono)] uppercase text-brown-300 hover:text-accent-orange transition-colors font-medium"
            style={{
              fontSize: "var(--text-xs)",
              letterSpacing: "0.16em",
              transitionDuration: "var(--duration-normal)",
            }}
          >
            About
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
