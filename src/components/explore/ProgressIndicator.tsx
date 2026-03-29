"use client";

import { motion } from "framer-motion";
import { useExplore } from "./shared/explore-context";

export function ProgressIndicator() {
  const { visitedNodes } = useExplore();
  const total = 5;
  const visited = visitedNodes.size;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        zIndex: 50,
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: i < visited ? "var(--accent-orange)" : "var(--brown-300)",
            opacity: i < visited ? 1 : 0.3,
          }}
          animate={i < visited ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        />
      ))}
      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 12,
          color: "var(--brown-300)",
          marginLeft: 8,
        }}
      >
        {visited}/{total}
      </span>
    </div>
  );
}
