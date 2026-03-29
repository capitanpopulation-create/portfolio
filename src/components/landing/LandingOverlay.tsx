"use client";

import { motion } from "framer-motion";
import { INTRO_PULSE_DURATION } from "@/lib/constants";
const ENTRANCE_DELAY = INTRO_PULSE_DURATION + 0.3;

interface LandingOverlayProps {
  isSettingsOpen: boolean;
  onToggleSettings: () => void;
  accent: string;
  contrastText: string;
}

export function LandingOverlay({
  isSettingsOpen,
  onToggleSettings,
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
          {/* Let's play — ghost/outline button */}
          <button
            onClick={onToggleSettings}
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
            aria-label={isSettingsOpen ? "Close settings" : "Open settings"}
            aria-expanded={isSettingsOpen}
          >
            {isSettingsOpen ? (
              <>
                <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                  <path d="M2 2L10 10M10 2L2 10" />
                </svg>
                Collapse
              </>
            ) : (
              <>
                <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="6" cy="6" r="1.5" />
                  <path d="M6 1v1.5M6 9.5V11M1 6h1.5M9.5 6H11M2.46 2.46l1.06 1.06M8.48 8.48l1.06 1.06M2.46 9.54l1.06-1.06M8.48 3.52l1.06-1.06" />
                </svg>
                Let&rsquo;s play
              </>
            )}
          </button>

          {/* Let's connect — primary filled button */}
          <a
            href="mailto:hello@gabobehrens.com"
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
        </motion.div>
      </div>
    </div>
  );
}
