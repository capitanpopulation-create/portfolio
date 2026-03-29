"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useExplore } from "../shared/explore-context";

const ease = [0.16, 1, 0.3, 1] as const;

const cards = [
  {
    title: "No approved tools. Teams stuck.",
    body: "External tools existed. Microsoft, startups, open-source. But nothing was approved for enterprise use. Teams wanted to build agents and had no way to do it.",
  },
  {
    title: "We saw the gap.",
    body: "We built the internal platform. Good UX made it stick. It became the standard.",
  },
  {
    image: "/work/agent-builder/wizard.png",
    title: "The solution took shape.",
    body: "A three-step wizard that took agent creation from 10 minutes to 2.",
  },
];

export function OpportunityCards() {
  const { setActiveNode } = useExplore();
  const [currentCard, setCurrentCard] = useState(0);

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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          maxWidth: 500,
          padding: "0 24px",
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
          }}
        >
          The Gap
        </motion.p>

        {/* Card container with perspective */}
        <div
          style={{
            width: "100%",
            minHeight: 320,
            perspective: 1000,
            position: "relative",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              style={{
                width: "100%",
                minHeight: 280,
                borderRadius: 8,
                border: "1px solid var(--border-subtle)",
                background: "var(--surface-elevated)",
                padding: "clamp(24px, 4vw, 40px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 16,
                backfaceVisibility: "hidden",
                boxShadow: "var(--shadow-image)",
              }}
            >
              {cards[currentCard].image && (
                <div
                  style={{
                    borderRadius: 4,
                    overflow: "hidden",
                    marginBottom: 8,
                    border: "1px solid var(--border-muted)",
                  }}
                >
                  <img
                    src={cards[currentCard].image}
                    alt=""
                    style={{ width: "100%", display: "block" }}
                  />
                </div>
              )}
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.4rem, 1.2rem + 1vw, 2rem)",
                  color: "var(--foreground)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                }}
              >
                {cards[currentCard].title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 15,
                  color: "var(--brown-300)",
                  lineHeight: 1.7,
                }}
              >
                {cards[currentCard].body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Card navigation */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentCard(i)}
              style={{
                width: i === currentCard ? 24 : 8,
                height: 8,
                borderRadius: 4,
                border: "none",
                background: i === currentCard ? "var(--accent-orange)" : "var(--brown-300)",
                opacity: i === currentCard ? 1 : 0.3,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Next button */}
        {currentCard < cards.length - 1 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setCurrentCard((c) => c + 1)}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--foreground)",
              background: "transparent",
              border: "1px solid var(--brown-300)",
              borderRadius: 4,
              padding: "10px 24px",
              cursor: "pointer",
              transition: "border-color 0.2s",
            }}
          >
            Next card &rarr;
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
