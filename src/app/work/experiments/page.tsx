"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getCategoryById } from "@/lib/work-data";

const category = getCategoryById("experiments")!;

export default function ExperimentsPage() {
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
            <span>Experiments</span>
          </div>
          <h1
            className="font-[family-name:var(--font-display)] text-foreground tracking-tight"
            style={{ fontSize: "clamp(2rem, 1.5rem + 1.6vw, 3rem)" }}
          >
            Explorations & experiments
          </h1>
        </motion.header>

        <div className="border-t border-brown-500/15">
          {category.items.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.15 * (i + 1),
                ease: [0.16, 1, 0.3, 1],
              }}
              className="border-b border-brown-500/15"
              style={{ padding: "var(--space-10) 0" }}
            >
              <h2
                className="font-sans font-light text-foreground tracking-tight"
                style={{
                  fontSize: "clamp(1.5rem, 1.25rem + 0.8vw, 2rem)",
                  marginBottom: "var(--space-4)",
                }}
              >
                {project.title}
              </h2>
              <p
                className="text-brown-300 leading-relaxed"
                style={{
                  fontSize: "var(--text-sm)",
                  maxWidth: "560px",
                  marginBottom: "var(--space-5)",
                }}
              >
                {project.description}
              </p>
              <div className="flex flex-wrap" style={{ gap: "var(--space-2)" }}>
                <span
                  className="font-[family-name:var(--font-mono)] uppercase text-brown-400"
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.08em",
                    padding: "var(--space-1) var(--space-3)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  {project.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ paddingBottom: "var(--space-20)" }} />
      </div>
    </main>
  );
}
