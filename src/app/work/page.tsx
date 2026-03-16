"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PROJECTS } from "@/lib/work-data";

export default function WorkPage() {
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
          style={{ marginBottom: "var(--space-16)" }}
        >
          <h1
            className="font-[family-name:var(--font-display)] text-foreground tracking-tight"
            style={{ fontSize: "clamp(2rem, 1.5rem + 1.6vw, 3rem)" }}
          >
            Selected work
          </h1>
        </motion.header>

        {/* Project list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-20)",
          }}
        >
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.15 * (i + 1),
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                href={project.href}
                className="group block"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className="flex flex-col md:flex-row items-start"
                  style={{ gap: "var(--space-10)" }}
                >
                  {/* Left — Text */}
                  <div
                    className="flex-1 flex flex-col justify-center"
                    style={{ minWidth: 0, paddingTop: "var(--space-4)" }}
                  >
                    <h2
                      className="font-[family-name:var(--font-display)] text-foreground tracking-tight"
                      style={{
                        fontSize: "clamp(1.5rem, 1.2rem + 1vw, 2.25rem)",
                        marginBottom: "var(--space-4)",
                        lineHeight: 1.2,
                      }}
                    >
                      {project.title}
                    </h2>

                    <p
                      className="text-brown-300 leading-relaxed"
                      style={{
                        fontSize: "var(--text-base)",
                        maxWidth: "480px",
                        marginBottom: "var(--space-6)",
                      }}
                    >
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div
                      className="flex flex-wrap"
                      style={{ gap: "var(--space-2)", marginBottom: "var(--space-6)" }}
                    >
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-[family-name:var(--font-mono)] uppercase text-brown-400"
                          style={{
                            fontSize: "10px",
                            letterSpacing: "0.08em",
                            padding: "var(--space-1) var(--space-3)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "var(--radius-full, 9999px)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <span
                      className="inline-flex items-center font-[family-name:var(--font-mono)] uppercase text-brown-400 group-hover:text-accent-orange transition-colors"
                      style={{
                        fontSize: "var(--text-xs)",
                        letterSpacing: "0.08em",
                        gap: "var(--space-2)",
                        transitionDuration: "var(--duration-normal)",
                      }}
                    >
                      View project
                      <svg
                        width="14"
                        height="10"
                        viewBox="0 0 14 10"
                        fill="none"
                        className="transition-transform group-hover:translate-x-1"
                        style={{ transitionDuration: "var(--duration-normal)" }}
                      >
                        <path
                          d="M1 5H12M9 1L13 5L9 9"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>

                  {/* Right — Thumbnail */}
                  <div
                    className="w-full md:w-[50%] shrink-0 overflow-hidden"
                    style={{
                      borderRadius: "var(--radius-lg, 12px)",
                      aspectRatio: "4 / 3",
                      backgroundColor: "var(--brown-600, #C4B0A0)",
                      position: "relative",
                    }}
                  >
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={`${project.title} preview`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-[1.03]"
                        style={{
                          transitionDuration: "0.6s",
                          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                        onError={(e) => {
                          // Hide broken image, show placeholder bg
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : null}

                    {/* Placeholder overlay when no image */}
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ pointerEvents: "none" }}
                    >
                      <span
                        className="font-[family-name:var(--font-mono)] uppercase text-brown-500"
                        style={{
                          fontSize: "var(--text-xs)",
                          letterSpacing: "0.12em",
                          opacity: 0.5,
                        }}
                      >
                        {project.title}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div style={{ paddingBottom: "var(--space-20)" }} />
      </div>
    </main>
  );
}
