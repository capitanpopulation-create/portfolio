"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useExplore } from "../shared/explore-context";

const ease = [0.16, 1, 0.3, 1] as const;

const paragraphs = [
  "We built a flexible tool that could do everything but didn\u2019t specialize in anything. The market moved. Droid took over code generation. Microsoft\u2019s agent framework got approved. Teams today would use those instead.",
  "That\u2019s fine. We solved a real problem at a specific moment: no approved tools, teams stuck. We made it easy to build agents when nothing else existed.",
];

const closingLine = "What drove adoption wasn\u2019t features. It was the UX. A clean interface that made ideas feel real. That\u2019s what unlocked $401M.";

export function LearningsTypewriter() {
  const { setActiveNode } = useExplore();
  const [displayedChars, setDisplayedChars] = useState(0);
  const [showImage, setShowImage] = useState(false);

  const fullText = paragraphs.join("\n\n") + "\n\n" + closingLine;
  const closingStart = fullText.indexOf(closingLine);

  useEffect(() => {
    if (displayedChars >= fullText.length) {
      const timer = setTimeout(() => setShowImage(true), 300);
      return () => clearTimeout(timer);
    }

    // Slow down for closing line
    const inClosing = displayedChars >= closingStart;
    const speed = inClosing ? 30 : 15;

    const timer = setTimeout(() => {
      setDisplayedChars((c) => c + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [displayedChars, fullText.length, closingStart]);

  const visibleText = fullText.slice(0, displayedChars);
  const isClosingVisible = displayedChars >= closingStart;
  const closingDone = displayedChars >= fullText.length;

  // Split into paragraphs for rendering
  const parts = visibleText.split("\n\n");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background)",
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

      <div
        style={{
          maxWidth: 600,
          padding: "80px clamp(24px, 5vw, 60px)",
        }}
      >
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
          The Learnings
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
            marginBottom: 32,
          }}
        >
          What I&rsquo;d do differently.
        </motion.h2>

        <div
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 16,
            lineHeight: 1.7,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {parts.map((p, i) => {
            const isClosing = i === parts.length - 1 && isClosingVisible && p.length > 0;
            return (
              <p
                key={i}
                style={{
                  color: isClosing
                    ? closingDone
                      ? "var(--accent-orange)"
                      : "var(--foreground)"
                    : "var(--brown-300)",
                  fontWeight: isClosing ? 600 : 400,
                  transition: "color 0.8s ease",
                }}
              >
                {p}
                {/* Blinking cursor at end of last visible paragraph */}
                {i === parts.length - 1 && displayedChars < fullText.length && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                    style={{ color: "var(--accent-orange)" }}
                  >
                    |
                  </motion.span>
                )}
              </p>
            );
          })}
        </div>

        {/* Image fade in after typing completes */}
        {showImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            style={{
              marginTop: 40,
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 24px 64px -16px rgba(0,0,0,0.3)",
            }}
          >
            <img
              src="/work/agent-builder/evaluation.png"
              alt="Evaluation results dashboard"
              style={{ width: "100%", display: "block" }}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
