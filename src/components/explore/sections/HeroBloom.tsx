"use client";

import { motion } from "framer-motion";
import { useExplore } from "../shared/explore-context";

const ease = [0.16, 1, 0.3, 1] as const;

export function HeroBloom() {
  const { setActiveNode } = useExplore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5, ease } }}
      exit={{ opacity: 0, transition: { duration: 0.35, ease } }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background)",
        overflow: "auto",
      }}
    >
      {/* Close button */}
      <button
        onClick={() => setActiveNode(null)}
        style={{
          position: "fixed",
          top: 24,
          right: 24,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid var(--brown-300)",
          background: "transparent",
          color: "var(--foreground)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          zIndex: 110,
        }}
      >
        &times;
      </button>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease }}
        style={{
          maxWidth: 900,
          padding: "80px clamp(24px, 5vw, 60px)",
          textAlign: "center",
        }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--accent-orange)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          The Origin
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 2rem + 3vw, 5rem)",
            color: "var(--foreground)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: 24,
          }}
        >
          The platform we built, that got us acquired by EY
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.25rem)",
            color: "var(--brown-300)",
            lineHeight: 1.6,
            maxWidth: 520,
            margin: "0 auto 40px",
          }}
        >
          No approved tools to build AI agents. We designed one that became the standard at EY.
        </motion.p>

        {/* Metadata */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease }}
          style={{
            display: "flex",
            gap: 40,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 48,
          }}
        >
          {[
            ["Role", "Lead Product Designer"],
            ["Company", "EY"],
            ["Timeline", "2 years"],
            ["Focus", "AI / Enterprise"],
          ].map(([label, value]) => (
            <div key={label}>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--brown-300)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 15,
                  color: "var(--foreground)",
                  fontWeight: 500,
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.8, ease }}
          style={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "var(--shadow-image)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <img
            src="/work/agent-builder/hero.png"
            alt="EY Agent Builder welcome screen"
            style={{ width: "100%", display: "block" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
