"use client";

import { motion } from "framer-motion";
import type { NodeId } from "./shared/explore-context";

const ease = [0.16, 1, 0.3, 1] as const;

interface ConstellationNodeProps {
  id: NodeId;
  label: string;
  left: string;
  top: string;
  visited: boolean;
  active: boolean;
  dimmed: boolean;
  index: number;
  onClick: () => void;
}

export function ConstellationNode({
  id,
  label,
  left,
  top,
  visited,
  active,
  dimmed,
  index,
  onClick,
}: ConstellationNodeProps) {
  return (
    <motion.button
      layoutId={`node-${id}`}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: dimmed ? 0.15 : 1,
        scale: 1,
      }}
      transition={{
        duration: 0.7,
        delay: 0.15 * index,
        ease,
      }}
      onClick={dimmed ? undefined : onClick}
      style={{
        position: "absolute",
        left,
        top,
        transform: "translate(-50%, -50%)",
        border: "none",
        background: "none",
        cursor: dimmed ? "default" : "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        zIndex: active ? 10 : 1,
        pointerEvents: dimmed ? "none" : "auto",
      }}
      whileHover={dimmed ? {} : { scale: 1.1 }}
      whileTap={dimmed ? {} : { scale: 0.95 }}
    >
      {/* Ring */}
      <motion.div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: `2px ${visited ? "solid" : "dashed"} var(--accent-orange)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Pulse ring — only when not visited */}
        {!visited && (
          <motion.div
            style={{
              position: "absolute",
              inset: -4,
              borderRadius: "50%",
              border: "1px solid var(--accent-orange)",
            }}
            animate={{ opacity: [0.5, 0], scale: [1, 1.25] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
          />
        )}

        {/* Check mark for visited */}
        {visited && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="var(--accent-orange)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </motion.div>

      {/* Label */}
      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 13,
          fontWeight: 500,
          color: visited ? "var(--foreground)" : "var(--brown-300)",
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </motion.button>
  );
}
