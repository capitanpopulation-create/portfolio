"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getCategoryById } from "@/lib/work-data";
import { PrototypeLightbox } from "@/components/work/PrototypeLightbox";

const category = getCategoryById("design")!;

export default function DesignPage() {
  const [activePrototype, setActivePrototype] = useState<{
    url: string;
    title: string;
    passwordProtected: boolean;
  } | null>(null);

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
            <span>Design</span>
          </div>
          <h1
            className="font-[family-name:var(--font-display)] text-foreground tracking-tight"
            style={{ fontSize: "clamp(2rem, 1.5rem + 1.6vw, 3rem)" }}
          >
            Product & UX design
          </h1>
        </motion.header>

        <div className="border-t border-brown-500/15">
          {category.items.map((project, i) => {
            const hasPrototype = !!project.prototypeUrl;
            const hasPage = !!project.href;
            const isInteractive = hasPrototype || hasPage;

            const content = (
              <>
                <div className="flex items-center" style={{ gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
                  <p
                    className="font-[family-name:var(--font-mono)] uppercase text-accent-orange"
                    style={{
                      fontSize: "var(--text-xs)",
                      letterSpacing: "0.12em",
                    }}
                  >
                    {project.tag}
                  </p>
                  {hasPrototype && (
                    <span
                      className="font-[family-name:var(--font-mono)] uppercase text-brown-500 group-hover:text-brown-300 transition-colors"
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.1em",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                        border: "1px solid var(--border-subtle)",
                        transitionDuration: "var(--duration-normal)",
                      }}
                    >
                      {project.passwordProtected ? "Protected" : "Interactive"}
                    </span>
                  )}
                  {hasPage && (
                    <span
                      className="font-[family-name:var(--font-mono)] uppercase text-brown-500 group-hover:text-brown-300 transition-colors"
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.1em",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                        border: "1px solid var(--border-subtle)",
                        transitionDuration: "var(--duration-normal)",
                      }}
                    >
                      Case Study
                    </span>
                  )}
                </div>
                <h2
                  className={`font-sans font-light text-foreground tracking-tight ${isInteractive ? "group-hover:text-accent-orange transition-colors" : ""}`}
                  style={{
                    fontSize: "clamp(1.5rem, 1.25rem + 0.8vw, 2rem)",
                    marginBottom: "var(--space-4)",
                    transitionDuration: "var(--duration-normal)",
                  }}
                >
                  {project.title}
                </h2>
                <p
                  className="text-brown-300 leading-relaxed"
                  style={{
                    fontSize: "var(--text-sm)",
                    maxWidth: "560px",
                  }}
                >
                  {project.description}
                </p>
              </>
            );

            if (hasPage) {
              return (
                <motion.div
                  key={project.id}
                  id={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15 * (i + 1),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="border-b border-brown-500/15 group"
                  style={{ padding: "var(--space-10) 0" }}
                >
                  <Link href={project.href!} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                    {content}
                  </Link>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={project.id}
                id={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.15 * (i + 1),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`border-b border-brown-500/15 group ${hasPrototype ? "cursor-pointer" : ""}`}
                style={{ padding: "var(--space-10) 0" }}
                onClick={
                  hasPrototype
                    ? () =>
                        setActivePrototype({
                          url: project.prototypeUrl!,
                          title: project.title,
                          passwordProtected: project.passwordProtected ?? false,
                        })
                    : undefined
                }
              >
                {content}
              </motion.div>
            );
          })}
        </div>

        <div style={{ paddingBottom: "var(--space-20)" }} />
      </div>

      {activePrototype && (
        <PrototypeLightbox
          isOpen={!!activePrototype}
          onClose={() => setActivePrototype(null)}
          prototypeUrl={activePrototype.url}
          title={activePrototype.title}
          passwordProtected={activePrototype.passwordProtected}
        />
      )}
    </main>
  );
}
