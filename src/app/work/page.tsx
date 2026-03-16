"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WORK_CATEGORIES } from "@/lib/work-data";

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
            Work
          </p>
          <h1
            className="font-[family-name:var(--font-display)] text-foreground tracking-tight"
            style={{ fontSize: "clamp(2rem, 1.5rem + 1.6vw, 3rem)" }}
          >
            Case studies & projects
          </h1>
        </motion.header>

        <div className="border-t border-brown-500/15">
          {WORK_CATEGORIES.map((category, i) => (
            <motion.div
              key={category.id}
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
              <div
                className="flex flex-col md:flex-row md:items-start md:justify-between"
                style={{ gap: "var(--space-6)" }}
              >
                <div style={{ flex: 1 }}>
                  <p
                    className="font-[family-name:var(--font-mono)] uppercase text-accent-orange"
                    style={{
                      fontSize: "var(--text-xs)",
                      letterSpacing: "0.12em",
                      marginBottom: "var(--space-3)",
                    }}
                  >
                    {category.label}
                  </p>
                  <p
                    className="text-brown-300 leading-relaxed"
                    style={{
                      fontSize: "var(--text-sm)",
                      maxWidth: "560px",
                      marginBottom: "var(--space-4)",
                    }}
                  >
                    {category.description}
                  </p>
                  {category.items.length > 0 && (
                    <div
                      className="flex flex-wrap"
                      style={{ gap: "var(--space-2)" }}
                    >
                      {category.items.map((item) =>
                        item.href ? (
                          <Link
                            key={item.id}
                            href={item.href}
                            className="font-[family-name:var(--font-mono)] uppercase text-brown-400 hover:text-accent-orange transition-colors"
                            style={{
                              fontSize: "10px",
                              letterSpacing: "0.08em",
                              padding: "var(--space-1) var(--space-3)",
                              border: "1px solid var(--border-subtle)",
                              borderRadius: "var(--radius-sm)",
                              textDecoration: "none",
                              transitionDuration: "var(--duration-normal)",
                            }}
                          >
                            {item.title}
                          </Link>
                        ) : (
                          <span
                            key={item.id}
                            className="font-[family-name:var(--font-mono)] uppercase text-brown-400"
                            style={{
                              fontSize: "10px",
                              letterSpacing: "0.08em",
                              padding: "var(--space-1) var(--space-3)",
                              border: "1px solid var(--border-subtle)",
                              borderRadius: "var(--radius-sm)",
                            }}
                          >
                            {item.title}
                          </span>
                        )
                      )}
                    </div>
                  )}
                  {category.placeholder && (
                    <span
                      className="font-[family-name:var(--font-mono)] uppercase text-brown-500"
                      style={{
                        fontSize: "var(--text-xs)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Coming soon
                    </span>
                  )}
                </div>

                <Link
                  href={category.href}
                  className="inline-flex items-center font-[family-name:var(--font-mono)] uppercase text-brown-400 hover:text-accent-orange transition-colors shrink-0"
                  style={{
                    fontSize: "var(--text-xs)",
                    letterSpacing: "0.08em",
                    gap: "var(--space-2)",
                    transitionDuration: "var(--duration-normal)",
                  }}
                >
                  View all
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path
                      d="M1 4H10M7 1L10.5 4L7 7"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ paddingBottom: "var(--space-20)" }} />
      </div>
    </main>
  );
}
