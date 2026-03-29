"use client";

import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { useEffect } from "react";
import { useExplore } from "../shared/explore-context";
import { CountUpNumber } from "../shared/CountUpNumber";

const ease = [0.16, 1, 0.3, 1] as const;

const metrics = [
  { metric: "$401M", label: "Revenue and pipeline", note: "$167M revenue. $234M pipeline. Attributed to the platform." },
  { metric: "4K+", label: "People using it", note: "Across 7 solutions including TPRM, ValueQ, and Contract Intelligence." },
  { metric: "3K+", label: "Agents in production", note: "Multiple versions managed and iterated. Teams building, testing, shipping." },
  { metric: "5M+", label: "Demos and reviews run", note: "1.8B tokens processed. The platform handled the scale." },
  { metric: "40+", label: "Collaborative workspaces", note: "Multi-tenant support across TPRM. Highest adoption, still growing." },
  { metric: "2x", label: "Patterns reused", note: "Navigation and context switching adopted by Contra and TPRM." },
];

export function ImpactCascade() {
  const { setActiveNode } = useExplore();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    function handleMouse(e: MouseEvent) {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 20);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 20);
    }
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background)",
        padding: "60px clamp(16px, 4vw, 60px)",
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
          marginBottom: 40,
        }}
      >
        Impact
      </motion.p>

      <div
        className="impact-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "clamp(24px, 3vw, 48px)",
          maxWidth: 1000,
          width: "100%",
        }}
      >
        {metrics.map((item, i) => (
          <MetricCard
            key={item.label}
            item={item}
            index={i}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .impact-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .impact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}

function MetricCard({
  item,
  index,
  mouseX,
  mouseY,
}: {
  item: (typeof metrics)[number];
  index: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  // Slight parallax offset based on index
  const factor = (index % 3 - 1) * 0.5;
  const x = useTransform(mouseX, (v) => v * factor);
  const y = useTransform(mouseY, (v) => v * factor * 0.5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: 0.15 * (index + 1),
        ease,
      }}
      style={{
        x,
        y,
        paddingTop: 24,
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.5rem, 2rem + 2vw, 4rem)",
          color: "var(--foreground)",
          lineHeight: 1,
          letterSpacing: "-0.03em",
          marginBottom: 8,
        }}
      >
        <CountUpNumber value={item.metric} />
      </p>
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 15,
          color: "var(--foreground)",
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        {item.label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 14,
          color: "var(--brown-300)",
          lineHeight: 1.5,
        }}
      >
        {item.note}
      </p>
    </motion.div>
  );
}
