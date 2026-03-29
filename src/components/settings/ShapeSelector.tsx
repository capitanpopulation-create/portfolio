"use client";

import { motion } from "framer-motion";
import { type ShapeId } from "@/lib/canvas-settings";

interface ShapeSelectorProps {
  active: ShapeId;
  accent: string;
  contrastText: string;
  onChange: (shape: ShapeId) => void;
}

const SHAPES: { id: ShapeId; label: string; icon: React.ReactNode }[] = [
  {
    id: "line",
    label: "Line",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "circle",
    label: "Circle",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    id: "diamond",
    label: "Diamond",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="3" width="10" height="10" stroke="currentColor" strokeWidth="1.3" transform="rotate(45 8 8)" />
      </svg>
    ),
  },
];

export function ShapeSelector({ active, accent, contrastText, onChange }: ShapeSelectorProps) {
  return (
    <div
      className="relative flex"
      style={{
        border: "1px solid var(--border-interactive)",
        borderRadius: 4,
        padding: 2,
        gap: 2,
      }}
    >
      {SHAPES.map((shape) => (
        <button
          key={shape.id}
          onClick={() => onChange(shape.id)}
          className="relative flex-1 flex items-center justify-center transition-colors"
          style={{
            padding: "var(--space-2)",
            borderRadius: 4,
            color: active === shape.id ? contrastText : "var(--brown-200)",
            position: "relative",
            zIndex: 1,
            transitionDuration: "var(--duration-normal)",
          }}
          aria-label={shape.label}
          title={shape.label}
        >
          {active === shape.id && (
            <motion.div
              layoutId="shape-pill"
              className="absolute inset-0"
              style={{
                backgroundColor: accent,
                borderRadius: 4,
                zIndex: -1,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          {shape.icon}
        </button>
      ))}
    </div>
  );
}
