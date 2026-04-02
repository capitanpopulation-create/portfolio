"use client";

import { useRef, useState, useCallback } from "react";

interface AngleDialProps {
  value: number;
  step: number;
  accentColor: string;
  contrastText: string;
  onChange: (value: number) => void;
}

const SIZE = 48;
const CENTER = SIZE / 2;
const RADIUS = 20;
const DOT_R = 3;

export function AngleDial({
  value,
  step,
  accentColor,
  onChange,
}: AngleDialProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const snap = useCallback(
    (deg: number): number => {
      const snapped = Math.round(deg / step) * step;
      return ((snapped % 360) + 360) % 360;
    },
    [step]
  );

  const getAngleFromPointer = useCallback(
    (clientX: number, clientY: number): number => {
      const el = containerRef.current;
      if (!el) return value;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      // atan2 gives angle from positive x-axis, we want 0° at top
      let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      return snap(deg);
    },
    [value, snap]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      onChange(getAngleFromPointer(e.clientX, e.clientY));

      const handleMove = (ev: PointerEvent) => {
        onChange(getAngleFromPointer(ev.clientX, ev.clientY));
      };

      const handleUp = () => {
        setIsDragging(false);
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [getAngleFromPointer, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let newVal = value;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        newVal = (value + step) % 360;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        newVal = ((value - step) % 360 + 360) % 360;
      }
      if (newVal !== value) {
        e.preventDefault();
        onChange(newVal);
      }
    },
    [value, step, onChange]
  );

  // Convert angle to radians for indicator line (0° = top)
  const rad = ((value - 90) * Math.PI) / 180;
  const lineX = CENTER + Math.cos(rad) * (RADIUS - DOT_R);
  const lineY = CENTER + Math.sin(rad) * (RADIUS - DOT_R);
  const dotX = CENTER + Math.cos(rad) * RADIUS;
  const dotY = CENTER + Math.sin(rad) * RADIUS;

  return (
    <div>
      <div
        className="font-[family-name:var(--font-mono)] uppercase text-brown-200"
        style={{
          fontSize: "10px",
          letterSpacing: "0.1em",
          marginBottom: "var(--space-2)",
          userSelect: "none",
        }}
      >
        Angle
      </div>
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        role="slider"
        tabIndex={0}
        aria-label="Angle"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={value}
        style={{
          width: SIZE,
          height: SIZE,
          position: "relative",
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none",
          outline: "none",
        }}
      >
        <svg width={SIZE} height={SIZE}>
          {/* Outer ring */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="var(--jp-brown)"
            strokeWidth={1}
          />
          {/* Indicator line */}
          <line
            x1={CENTER}
            y1={CENTER}
            x2={lineX}
            y2={lineY}
            stroke={accentColor}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          {/* Dot at tip */}
          <circle
            cx={dotX}
            cy={dotY}
            r={DOT_R}
            fill={accentColor}
          />
          {/* Center value */}
          <text
            x={CENTER}
            y={CENTER + 1}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--brown-200)"
            fontSize="9"
            fontFamily="var(--font-mono)"
          >
            {Math.round(value)}°
          </text>
        </svg>
      </div>
    </div>
  );
}
