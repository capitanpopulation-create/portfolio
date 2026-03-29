"use client";

import { motion } from "framer-motion";

const FOCUS_AREAS = [
  "Product Design",
  "AI Tooling",
  "Enterprise Systems",
  "Motion & Interaction",
];

export default function AboutPage() {
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
                I design tools for people who have better things to do than
                figure out software. Enterprise systems, AI platforms, complex
                workflows. The interface is usually the bottleneck. I fix that.
              </p>
              <p className="text-brown-300" style={{ fontSize: "var(--text-base)" }}>
                Before I touch a screen, I try to understand the system behind
                it. Data flows, edge cases, the way teams actually use a tool
                versus how it was designed to be used. The best interfaces
                I&rsquo;ve built came from that gap.
              </p>
            </div>
          </motion.section>

          {/* How I Think */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
              How I Think
            </p>
            <div
              className="text-brown-200 leading-relaxed"
              style={{
                fontSize: "var(--text-base)",
                maxWidth: "640px",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-5)",
              }}
            >
              <p>
                The best design work happens when you treat Figma like
                a cheap experiment, not a deliverable. Explore fast, decide
                fast, get to code. Two weeks in Figma costs less than
                two months iterating in production.
              </p>
              <p className="text-brown-300">
                I&rsquo;m drawn to kinetic art and architectural thinking.
                Layers, rhythm, pattern recognition. These aren&rsquo;t just
                visual preferences. They&rsquo;re how I approach information
                architecture. Every interface has a structure underneath it.
                I try to make that structure visible.
              </p>
              <p className="text-brown-300">
                I built this site with Claude Code in two weeks.
                Not as a flex. Designers who can work with
                AI and code aren&rsquo;t just faster. They think differently
                about what&rsquo;s possible.
              </p>
            </div>
          </motion.section>

          {/* Focus Areas */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
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
                  className="font-[family-name:var(--font-outfit)] text-brown-300"
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    padding: "6px 14px",
                    border: "1px solid var(--border-interactive)",
                    borderRadius: 4,
                  }}
                >
                  {area}
                </span>
              ))}
            </div>
          </motion.section>

          {/* Contact */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ padding: "var(--space-10) 0 var(--space-20)" }}
          >
            <p
              className="font-[family-name:var(--font-mono)] uppercase text-accent-orange"
              style={{
                fontSize: "var(--text-xs)",
                letterSpacing: "0.12em",
                marginBottom: "var(--space-6)",
              }}
            >
              Get in Touch
            </p>
            <div
              className="flex flex-col"
              style={{ gap: "var(--space-3)" }}
            >
              <a
                href="mailto:hello@gabobehrens.com"
                className="font-[family-name:var(--font-outfit)] text-brown-200 hover:text-accent-orange transition-colors"
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  textDecoration: "none",
                  transitionDuration: "var(--duration-normal)",
                }}
              >
                hello@gabobehrens.com
              </a>
              <a
                href="https://linkedin.com/in/gabobehrens"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-outfit)] text-brown-300 hover:text-accent-orange transition-colors"
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  textDecoration: "none",
                  transitionDuration: "var(--duration-normal)",
                }}
              >
                LinkedIn
              </a>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
