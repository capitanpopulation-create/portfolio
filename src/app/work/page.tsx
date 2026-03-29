"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PROJECTS } from "@/lib/work-data";

const ease = [0.16, 1, 0.3, 1] as const;

/* ---- Page ---- */
export default function WorkPage() {
  const visible = PROJECTS;

  return (
    <main className="min-h-screen bg-background" style={{ paddingTop: "var(--nav-height)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 var(--page-margin)" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          style={{ paddingTop: "clamp(48px, 8vw, 96px)", paddingBottom: "clamp(32px, 5vw, 64px)" }}
        >
          <h1
            className="font-[family-name:var(--font-display)] text-foreground tracking-tight"
            style={{ fontSize: "clamp(2rem,1.5rem+2vw,3.5rem)", lineHeight: 1.05 }}
          >
            Selected work
          </h1>
        </motion.div>

        {/* Side-by-side project cards */}
        <div
          className="work-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(24px, 4vw, 48px)",
            paddingBottom: "clamp(64px, 8vw, 120px)",
          }}
        >
          {visible.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 * (i + 1), ease }}
            >
              <Link
                href={project.href}
                className="group block"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    borderRadius: 4,
                    overflow: "hidden",
                    aspectRatio: "4/3",
                    backgroundColor: "var(--brown-600)",
                    boxShadow: "0 32px 80px -20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    marginBottom: 24,
                  }}
                >
                  {project.thumbnail && (
                    <img
                      src={project.thumbnail}
                      alt={`${project.title} preview`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-[1.02]"
                      style={{
                        transitionDuration: "0.6s",
                        transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                      }}
                    />
                  )}
                </div>

                {/* Title */}
                <h2
                  className="font-[family-name:var(--font-display)] text-foreground tracking-tight"
                  style={{
                    fontSize: "clamp(1.5rem, 1.2rem + 1vw, 2.25rem)",
                    lineHeight: 1.15,
                    marginBottom: 12,
                  }}
                >
                  {project.title}
                </h2>

                {/* Description */}
                <p
                  className="text-brown-300 leading-relaxed"
                  style={{
                    fontSize: "var(--text-sm)",
                    lineHeight: 1.6,
                    marginBottom: 16,
                    maxWidth: 480,
                  }}
                >
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap" style={{ gap: 6, marginBottom: 20 }}>
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-[family-name:var(--font-outfit)] text-brown-400"
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        padding: "3px 10px",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: 4,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <span
                  className="inline-flex items-center font-[family-name:var(--font-outfit)] text-brown-300 group-hover:text-accent-orange transition-colors"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    gap: 8,
                    transitionDuration: "var(--duration-normal)",
                  }}
                >
                  View project
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="transition-transform group-hover:translate-x-1" style={{ transitionDuration: "var(--duration-normal)" }}>
                    <path d="M1 5H12M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          style={{
            paddingTop: "var(--space-12)",
            paddingBottom: "var(--space-20)",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <p
            className="font-[family-name:var(--font-display)] text-foreground tracking-tight"
            style={{ fontSize: "clamp(1.25rem,1rem+0.8vw,1.75rem)", marginBottom: "var(--space-3)" }}
          >
            Interested in working together?
          </p>
          <a
            href="mailto:hello@gabobehrens.com"
            className="inline-flex items-center font-[family-name:var(--font-outfit)] text-brown-400 hover:text-accent-orange transition-colors"
            style={{ fontSize: 13, fontWeight: 600, gap: 8, textDecoration: "none", transitionDuration: "var(--duration-normal)" }}
          >
            Get in touch
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M1 5H12M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .work-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
