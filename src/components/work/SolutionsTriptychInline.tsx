"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

interface SolutionPanel {
  id: string;
  label: string;
  title: string;
  body: string;
  images: { src: string; alt: string }[];
}

const solutions: SolutionPanel[] = [
  {
    id: "simplification",
    label: "Simplification",
    title: "Agent creation went from 10 minutes to 2.",
    body: "Creating an agent meant clicking through a wall of settings. We replaced it with a three-step wizard: name it, pick a pattern, add your knowledge source. Advanced options are one click away if you need them.",
    images: [
      { src: "/work/agent-builder/wizard.png", alt: "Wizard step 1 — name and pattern" },
      { src: "/work/agent-builder/wizard-step2.png", alt: "Wizard step 2 — knowledge source" },
    ],
  },
  {
    id: "edit-test",
    label: "Edit & Test",
    title: "Edit and test agents as you build them.",
    body: "Teams needed to tweak agent behavior and see results immediately. We built an edit view with a live preview panel — adjust settings, test a response, iterate. No deploy-and-pray.",
    images: [
      { src: "/work/agent-builder/edit-agent.png", alt: "Edit agent configuration" },
      { src: "/work/agent-builder/preview-response.png", alt: "Preview agent response" },
    ],
  },
  {
    id: "navigation",
    label: "Navigation",
    title: "People kept getting lost. We fixed navigation.",
    body: "Users with multiple tenants and workspaces couldn\u2019t tell where they were. We added breadcrumbs and a context switcher. People stopped getting lost. The pattern worked so well that Contra and TPRM reused it.",
    images: [
      { src: "/work/agent-builder/navigation.png", alt: "Breadcrumb tenant switcher showing hierarchy" },
    ],
  },
  {
    id: "evaluation",
    label: "Evaluation Portal",
    title: "A way to test agents before they go live.",
    body: "Anyone could build an agent, but developers had no way to check if it actually worked. We built a testing portal: bulk Q&A, version comparison, expected vs. actual responses. Testing became standard before anything went to production.",
    images: [
      { src: "/work/agent-builder/evaluation.png", alt: "Evaluation results dashboard with confidence metrics" },
    ],
  },
];

interface Props {
  onImageClick: (src: string) => void;
}

export function SolutionsTriptychInline({ onImageClick }: Props) {
  const [expandedPanel, setExpandedPanel] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <>
      <div
        ref={ref}
        className="triptych-inline"
        style={{
          display: "flex",
          gap: 8,
          width: "100%",
          minHeight: 480,
        }}
      >
        {solutions.map((sol, i) => {
          const isExpanded = expandedPanel === i;
          const hasExpanded = expandedPanel !== null;

          return (
            <motion.div
              key={sol.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: inView ? 1 : 0,
                y: inView ? 0 : 30,
                flex: isExpanded
                  ? "4 1 0%"
                  : hasExpanded
                    ? "0.4 1 0%"
                    : "1 1 0%",
              }}
              transition={{ duration: 0.5, ease, delay: isExpanded ? 0 : 0.08 * i }}
              onClick={() => setExpandedPanel(isExpanded ? null : i)}
              style={{
                borderRadius: 6,
                border: "1px solid var(--border-subtle)",
                background: "var(--surface-elevated)",
                padding: isExpanded ? "clamp(20px, 2vw, 32px)" : "clamp(16px, 2vw, 24px)",
                cursor: "pointer",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                position: "relative",
              }}
            >
              {/* Collapsed state */}
              {!isExpanded && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    height: "100%",
                  }}
                >
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
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: hasExpanded
                        ? "clamp(0.85rem, 0.75rem + 0.4vw, 1rem)"
                        : "clamp(1rem, 0.9rem + 0.5vw, 1.3rem)",
                      color: "var(--foreground)",
                      lineHeight: 1.3,
                      opacity: hasExpanded ? 0.4 : 1,
                      transition: "opacity 0.3s",
                    }}
                  >
                    {sol.title}
                  </p>

                  {/* Collapsed preview image */}
                  {!hasExpanded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      transition={{ delay: 0.3 + 0.08 * i, duration: 0.5 }}
                      style={{
                        marginTop: "auto",
                        borderRadius: 4,
                        overflow: "hidden",
                        border: "1px solid var(--border-subtle)",
                        opacity: 0.6,
                      }}
                    >
                      <img
                        src={sol.images[0].src}
                        alt=""
                        style={{
                          width: "100%",
                          display: "block",
                          aspectRatio: "16/10",
                          objectFit: "cover",
                          objectPosition: "top",
                        }}
                      />
                    </motion.div>
                  )}

                  {/* Expand hint */}
                  {!hasExpanded && (
                    <div
                      style={{
                        marginTop: 12,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M5 2V8M2 5H8" stroke="var(--brown-300)" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                      <span
                        style={{
                          fontFamily: "var(--font-outfit)",
                          fontSize: 11,
                          color: "var(--brown-300)",
                          fontWeight: 500,
                        }}
                      >
                        Expand
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Expanded state — text left, images right */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="triptych-expanded-content"
                  style={{
                    display: "flex",
                    gap: "clamp(20px, 3vw, 40px)",
                    height: "100%",
                  }}
                >
                  {/* Text — left */}
                  <div
                    style={{
                      flex: "1 1 38%",
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
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
                      }}
                    >
                      {sol.body}
                    </p>

                    {/* Collapse hint */}
                    <div
                      style={{
                        marginTop: "auto",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5H8" stroke="var(--brown-300)" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                      <span
                        style={{
                          fontFamily: "var(--font-outfit)",
                          fontSize: 11,
                          color: "var(--brown-300)",
                          fontWeight: 500,
                        }}
                      >
                        Collapse
                      </span>
                    </div>
                  </div>

                  {/* Images — right */}
                  <div
                    style={{
                      flex: "1 1 58%",
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {sol.images.map((img) => (
                      <div
                        key={img.src}
                        onClick={(e) => {
                          e.stopPropagation();
                          onImageClick(img.src);
                        }}
                        style={{
                          borderRadius: 4,
                          overflow: "hidden",
                          border: "1px solid var(--border-subtle)",
                          cursor: "zoom-in",
                          flex: sol.images.length === 1 ? "1 1 auto" : undefined,
                        }}
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          style={{
                            width: "100%",
                            display: "block",
                            aspectRatio: sol.images.length > 1 ? "16/10" : "16/10",
                            objectFit: "cover",
                            objectPosition: "top",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .triptych-inline {
            flex-direction: column !important;
          }
          .triptych-expanded-content {
            flex-direction: column !important;
          }
        }
      `}</style>
    </>
  );
}
