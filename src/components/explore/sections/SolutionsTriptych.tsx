"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ImageLightbox } from "@/components/work/ImageLightbox";
import { useExplore } from "../shared/explore-context";

const ease = [0.16, 1, 0.3, 1] as const;

const solutions = [
  {
    id: "simplification",
    label: "Simplification",
    title: "Agent creation went from 10 minutes to 2.",
    body: "Creating an agent meant clicking through a wall of settings. We replaced it with a three-step wizard: name it, pick a pattern, add your knowledge source. Advanced options are one click away if you need them.",
    image: "/work/agent-builder/wizard.png",
    imageAlt: "Agent creation wizard showing step progression",
  },
  {
    id: "navigation",
    label: "Navigation",
    title: "People kept getting lost. We fixed navigation.",
    body: "Users with multiple tenants and workspaces couldn\u2019t tell where they were. We added breadcrumbs and a context switcher. People stopped getting lost. The pattern worked so well that Contra and TPRM reused it.",
    image: "/work/agent-builder/navigation.png",
    imageAlt: "Breadcrumb tenant switcher showing hierarchy",
  },
  {
    id: "evaluation",
    label: "Evaluation Portal",
    title: "A way to test agents before they go live.",
    body: "Anyone could build an agent, but developers had no way to check if it actually worked. We built a testing portal: bulk Q&A, version comparison, expected vs. actual responses. Testing became standard before anything went to production.",
    image: "/work/agent-builder/evaluation.png",
    imageAlt: "Evaluation results dashboard with confidence metrics",
  },
];

export function SolutionsTriptych() {
  const { setActiveNode } = useExplore();
  const [expandedPanel, setExpandedPanel] = useState<number | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background)",
        padding: "80px clamp(16px, 3vw, 40px)",
        overflow: "auto",
      }}
    >
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

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--accent-orange)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        Solutions
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease }}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.8rem, 1.5rem + 1.5vw, 3rem)",
          color: "var(--foreground)",
          letterSpacing: "-0.02em",
          marginBottom: 40,
          textAlign: "center",
        }}
      >
        What we shipped.
      </motion.h2>

      {/* Triptych panels */}
      <div
        className="triptych-panels"
        style={{
          display: "flex",
          gap: 12,
          width: "100%",
          maxWidth: 1100,
          minHeight: 400,
        }}
      >
        {solutions.map((sol, i) => {
          const isExpanded = expandedPanel === i;
          return (
            <motion.div
              key={sol.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: 1,
                y: 0,
                flex: isExpanded ? "3 1 0%" : expandedPanel !== null ? "0.5 1 0%" : "1 1 0%",
              }}
              transition={{ duration: 0.5, ease, delay: isExpanded ? 0 : 0.1 * i }}
              onClick={() => setExpandedPanel(isExpanded ? null : i)}
              style={{
                borderRadius: 8,
                border: "1px solid var(--border-subtle)",
                background: "var(--surface-elevated)",
                padding: "clamp(16px, 2vw, 32px)",
                cursor: "pointer",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                minWidth: 0,
              }}
            >
              {/* Label — always visible */}
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--accent-orange)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {sol.label}
              </p>

              {/* Expanded content */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.2rem, 1rem + 0.8vw, 1.8rem)",
                      color: "var(--foreground)",
                      lineHeight: 1.2,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {sol.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 15,
                      color: "var(--brown-300)",
                      lineHeight: 1.7,
                      maxWidth: 480,
                    }}
                  >
                    {sol.body}
                  </p>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxSrc(sol.image);
                    }}
                    style={{
                      borderRadius: 4,
                      overflow: "hidden",
                      border: "1px solid var(--border-muted)",
                      cursor: "zoom-in",
                      maxWidth: 500,
                    }}
                  >
                    <img
                      src={sol.image}
                      alt={sol.imageAlt}
                      style={{ width: "100%", display: "block" }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Collapsed — just show title */}
              {!isExpanded && (
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.3rem)",
                    color: "var(--foreground)",
                    lineHeight: 1.3,
                    opacity: expandedPanel !== null ? 0.4 : 1,
                    transition: "opacity 0.3s",
                  }}
                >
                  {sol.title}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      <ImageLightbox
        src={lightboxSrc ?? ""}
        alt="Enlarged view"
        isOpen={!!lightboxSrc}
        onClose={() => setLightboxSrc(null)}
      />

      <style>{`
        @media (max-width: 768px) {
          .triptych-panels { flex-direction: column !important; }
        }
      `}</style>
    </motion.div>
  );
}
