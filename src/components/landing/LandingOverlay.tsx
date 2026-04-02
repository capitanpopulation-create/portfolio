"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { INTRO_PULSE_DURATION } from "@/lib/constants";
const ENTRANCE_DELAY = INTRO_PULSE_DURATION + 0.3;

interface LandingOverlayProps {
  accent: string;
  contrastText: string;
}

export function LandingOverlay({
  accent,
  contrastText,
}: LandingOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center"
    >
      <div className="text-center" style={{ padding: "0 var(--page-margin)" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: ENTRANCE_DELAY,
            ease: "easeOut",
          }}
        >
          <h1
            className="font-[family-name:var(--font-display)] text-limestone leading-[1.1] tracking-tight"
            style={{ fontSize: "var(--text-display)" }}
          >
            Hi! I&rsquo;m Gabo Behrens
          </h1>

          <p
            className="font-[family-name:var(--font-outfit)] text-brown-300 leading-relaxed"
            style={{
              fontSize: "var(--text-sm)",
              marginTop: "var(--space-4)",
            }}
          >
            Product designer. I think hard so you don&rsquo;t have to.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: ENTRANCE_DELAY + 0.4,
            ease: "easeOut",
          }}
          className="pointer-events-auto flex items-center justify-center"
          style={{
            marginTop: "var(--space-8)",
            gap: "var(--space-3)",
          }}
        >
          {/* Let's connect — secondary ghost button (left) */}
          <a
            href="https://linkedin.com/in/gabriel-behrens-a8884955"
            target="_blank"
            rel="noopener noreferrer"
            className="group font-[family-name:var(--font-outfit)] transition-all"
            style={{
              fontSize: "13px",
              letterSpacing: "0.01em",
              padding: "8px 20px",
              borderRadius: 4,
              border: "1px solid var(--brown-400)",
              backgroundColor: "transparent",
              color: "var(--brown-200)",
              cursor: "pointer",
              textDecoration: "none",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              fontWeight: 600,
              transitionDuration: "var(--duration-normal)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = accent;
              e.currentTarget.style.color = accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--brown-400)";
              e.currentTarget.style.color = "var(--brown-200)";
            }}
          >
            Let&rsquo;s connect
            <svg
              width={12}
              height={8}
              viewBox="0 0 12 8"
              fill="none"
              className="transition-transform group-hover:translate-x-1"
              style={{ transitionDuration: "var(--duration-normal)" }}
            >
              <path
                d="M1 4H10M7.5 1L11 4L7.5 7"
                stroke="currentColor"
                strokeWidth={1.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          {/* See my work — primary filled button (right) */}
          <Link
            href="/work"
            className="group font-[family-name:var(--font-outfit)] transition-all"
            style={{
              fontSize: "13px",
              letterSpacing: "0.01em",
              padding: "8px 20px",
              borderRadius: 4,
              border: "1px solid transparent",
              backgroundColor: accent,
              color: contrastText,
              cursor: "pointer",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              fontWeight: 600,
              transitionDuration: "var(--duration-normal)",
              boxShadow: `0 2px 12px ${accent}33`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 4px 20px ${accent}55`;
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0 2px 12px ${accent}33`;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            See my work
            <svg
              width={12}
              height={8}
              viewBox="0 0 12 8"
              fill="none"
              className="transition-transform group-hover:translate-x-1"
              style={{ transitionDuration: "var(--duration-normal)" }}
            >
              <path
                d="M1 4H10M7.5 1L11 4L7.5 7"
                stroke="currentColor"
                strokeWidth={1.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
