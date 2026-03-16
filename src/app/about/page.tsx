"use client";

import { motion } from "framer-motion";

const FOCUS_AREAS = [
  "Product Design",
  "UX Strategy",
  "Design Systems",
  "Interaction Design",
  "Prototyping",
  "User Research",
];

export default function AboutPage() {
  return (
    <main
      data-force-light
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
          <p
            className="font-[family-name:var(--font-mono)] uppercase text-brown-400"
            style={{
              fontSize: "var(--text-xs)",
              letterSpacing: "0.16em",
              marginBottom: "var(--space-4)",
            }}
          >
            About
          </p>
          <h1
            className="font-[family-name:var(--font-display)] text-foreground tracking-tight"
            style={{ fontSize: "clamp(2rem, 1.5rem + 1.6vw, 3rem)" }}
          >
            Gabriel Behrens
          </h1>
        </motion.header>

        <div className="border-t border-brown-500/15">
          {/* Bio */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{ padding: "var(--space-10) 0" }}
            className="border-b border-brown-500/15"
          >
            <p
              className="font-[family-name:var(--font-mono)] uppercase text-accent-orange"
              style={{
                fontSize: "var(--text-xs)",
                letterSpacing: "0.12em",
                marginBottom: "var(--space-6)",
              }}
            >
              Bio
            </p>
            <div
              className="text-brown-200 leading-relaxed"
              style={{
                fontSize: "var(--text-lg)",
                maxWidth: "640px",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-5)",
              }}
            >
              <p>
                Product designer focused on turning complex systems into clear,
                usable experiences. I work at the intersection of design and
                engineering — building interfaces that feel considered and
                deliberate.
              </p>
              <p className="text-brown-300" style={{ fontSize: "var(--text-base)" }}>
                Inspired by kinetic art, architectural layers, and pattern
                recognition. Currently interested in AI tooling, developer
                experience, and enterprise design.
              </p>
            </div>
          </motion.section>

          {/* Focus Areas */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ padding: "var(--space-10) 0" }}
            className="border-b border-brown-500/15"
          >
            <p
              className="font-[family-name:var(--font-mono)] uppercase text-accent-orange"
              style={{
                fontSize: "var(--text-xs)",
                letterSpacing: "0.12em",
                marginBottom: "var(--space-6)",
              }}
            >
              Focus Areas
            </p>
            <div
              className="flex flex-wrap"
              style={{ gap: "var(--space-3)" }}
            >
              {FOCUS_AREAS.map((area) => (
                <span
                  key={area}
                  className="font-[family-name:var(--font-mono)] text-brown-300"
                  style={{
                    fontSize: "var(--text-sm)",
                    letterSpacing: "0.02em",
                    padding: "var(--space-2) var(--space-4)",
                    border: "1px solid var(--border-interactive)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  {area}
                </span>
              ))}
            </div>
          </motion.section>
        </div>

        <div style={{ paddingBottom: "var(--space-20)" }} />
      </div>
    </main>
  );
}
