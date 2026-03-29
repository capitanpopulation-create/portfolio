"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ExploreProvider, useExplore, type NodeId } from "./shared/explore-context";
import { NODE_POSITIONS, COMPLETION_POSITIONS } from "./shared/node-positions";
import { ConstellationNode } from "./ConstellationNode";
import { ProgressIndicator } from "./ProgressIndicator";
import { HeroBloom } from "./sections/HeroBloom";
import { OpportunityCards } from "./sections/OpportunityCards";
import { SolutionsTriptych } from "./sections/SolutionsTriptych";
import { ImpactCascade } from "./sections/ImpactCascade";
import { LearningsTypewriter } from "./sections/LearningsTypewriter";

const ease = [0.16, 1, 0.3, 1] as const;

const sectionMap: Record<NodeId, React.FC> = {
  hero: HeroBloom,
  opportunity: OpportunityCards,
  solutions: SolutionsTriptych,
  impact: ImpactCascade,
  learnings: LearningsTypewriter,
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function Canvas() {
  const { activeNode, setActiveNode, visitedNodes, allVisited } = useExplore();
  const [showPrompt, setShowPrompt] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => setShowPrompt(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (allVisited && activeNode === null) {
      const timer = setTimeout(() => setShowCompletion(true), 400);
      return () => clearTimeout(timer);
    }
  }, [allVisited, activeNode]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && activeNode) setActiveNode(null);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeNode, setActiveNode]);

  const ActiveSection = activeNode ? sectionMap[activeNode] : null;
  const sortedNodes = [...NODE_POSITIONS].sort((a, b) => a.mobileOrder - b.mobileOrder);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        minHeight: "100vh",
        overflow: isMobile ? "auto" : "hidden",
        background: "var(--background)",
      }}
    >
      {isMobile ? (
        /* ---- MOBILE: vertical card stack ---- */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: "100px 24px 120px",
            maxWidth: 400,
            margin: "0 auto",
          }}
        >
          {sortedNodes.map((node, i) => (
            <motion.button
              key={node.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i, ease }}
              onClick={() => setActiveNode(node.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "20px 24px",
                borderRadius: 8,
                border: "1px solid var(--border-subtle)",
                background: "var(--surface-elevated)",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
              }}
            >
              {/* Mini ring */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: `2px ${visitedNodes.has(node.id) ? "solid" : "dashed"} var(--accent-orange)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {visitedNodes.has(node.id) && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="var(--accent-orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 15,
                  fontWeight: 500,
                  color: visitedNodes.has(node.id) ? "var(--foreground)" : "var(--brown-300)",
                }}
              >
                {node.label}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                style={{ marginLeft: "auto", opacity: 0.4 }}
              >
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          ))}

          {/* Mobile prompt */}
          <AnimatePresence>
            {showPrompt && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  color: "var(--brown-300)",
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                Tap a card to explore
              </motion.p>
            )}
          </AnimatePresence>

          {/* Mobile completion */}
          {showCompletion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              style={{ textAlign: "center", marginTop: 24 }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.3rem, 1rem + 1.5vw, 2rem)",
                  color: "var(--foreground)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  marginBottom: 20,
                }}
              >
                What drove adoption wasn&rsquo;t features.{" "}
                <span style={{ color: "var(--accent-orange)" }}>It was the UX.</span>
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link
                  href="/work"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--brown-300)",
                    textDecoration: "none",
                    padding: "10px 16px",
                    borderRadius: 4,
                    border: "1px solid var(--brown-300)",
                  }}
                >
                  &larr; Back to work
                </Link>
                <Link
                  href="/work/agent-builder"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--foreground)",
                    textDecoration: "none",
                    padding: "10px 16px",
                    borderRadius: 4,
                    border: "1px solid var(--foreground)",
                  }}
                >
                  Linear version
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        /* ---- DESKTOP: constellation scatter ---- */
        <>
          {NODE_POSITIONS.map((node, i) => {
            const completionPos = showCompletion ? COMPLETION_POSITIONS[node.id] : null;
            return (
              <ConstellationNode
                key={node.id}
                id={node.id}
                label={node.label}
                left={completionPos?.left ?? node.left}
                top={completionPos?.top ?? node.top}
                visited={visitedNodes.has(node.id)}
                active={activeNode === node.id}
                dimmed={activeNode !== null && activeNode !== node.id}
                index={i}
                onClick={() => setActiveNode(node.id)}
              />
            );
          })}

          {/* "Click to explore" prompt */}
          <AnimatePresence>
            {showPrompt && !activeNode && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  position: "absolute",
                  bottom: 80,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  color: "var(--brown-300)",
                  pointerEvents: "none",
                }}
              >
                Click a node to explore
              </motion.p>
            )}
          </AnimatePresence>

          {/* Completion message */}
          <AnimatePresence>
            {showCompletion && !activeNode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease }}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "60%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  maxWidth: 500,
                  padding: "0 24px",
                  zIndex: 5,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem)",
                    color: "var(--foreground)",
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em",
                    marginBottom: 24,
                  }}
                >
                  What drove adoption wasn&rsquo;t features.{" "}
                  <span style={{ color: "var(--accent-orange)" }}>It was the UX.</span>
                </p>
                <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                  <Link
                    href="/work"
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--brown-300)",
                      textDecoration: "none",
                      padding: "10px 20px",
                      borderRadius: 4,
                      border: "1px solid var(--brown-300)",
                      transition: "all 0.2s",
                    }}
                  >
                    &larr; Back to work
                  </Link>
                  <Link
                    href="/work/agent-builder"
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--foreground)",
                      textDecoration: "none",
                      padding: "10px 20px",
                      borderRadius: 4,
                      border: "1px solid var(--foreground)",
                      transition: "all 0.2s",
                    }}
                  >
                    Read linear version
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Progress indicator — both modes */}
      {!activeNode && <ProgressIndicator />}

      {/* Active section overlay — both modes */}
      <AnimatePresence>
        {ActiveSection && <ActiveSection key={activeNode} />}
      </AnimatePresence>
    </div>
  );
}

export function ExploreCanvas() {
  return (
    <ExploreProvider>
      <Canvas />
    </ExploreProvider>
  );
}
