"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PremiumSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  accentColor: string;
  onChange: (value: number) => void;
}

export function PremiumSlider({
  label,
  value,
  min,
  max,
  step,
  unit = "",
  accentColor,
  onChange,
}: PremiumSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const pct = ((value - min) / (max - min)) * 100;
  const displayValue =
    step >= 1 ? Math.round(value) : Number(value.toFixed(1));

  const snapToStep = useCallback(
    (raw: number): number => {
      const snapped = Math.round((raw - min) / step) * step + min;
      return Math.max(min, Math.min(max, Number(snapped.toFixed(10))));
    },
    [min, max, step]
  );

  const getValueFromX = useCallback(
    (clientX: number): number => {
      const track = trackRef.current;
      if (!track) return value;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return snapToStep(min + ratio * (max - min));
    },
    [min, max, value, snapToStep]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      const newVal = getValueFromX(e.clientX);
      onChange(newVal);

      const handleMove = (ev: PointerEvent) => {
        const v = getValueFromX(ev.clientX);
        onChange(v);
      };

      const handleUp = () => {
        setIsDragging(false);
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [getValueFromX, onChange]
  );

  // Keyboard support
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let newVal = value;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        newVal = Math.min(max, value + step);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        newVal = Math.max(min, value - step);
      }
      if (newVal !== value) {
        e.preventDefault();
        onChange(snapToStep(newVal));
      }
    },
    [value, min, max, step, onChange, snapToStep]
  );

  const showTooltip = isDragging || isHovered;

  return (
    <div style={{ width: 120 }}>
      {/* Label */}
      <div
        className="font-[family-name:var(--font-mono)] uppercase text-brown-300"
        style={{
          fontSize: "10px",
          letterSpacing: "0.1em",
          marginBottom: "var(--space-2)",
          userSelect: "none",
        }}
      >
        {label}
      </div>

      {/* Track container */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "relative",
          height: 32,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          touchAction: "none",
        }}
      >
        {/* Track background */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 4,
            borderRadius: 9999,
            backgroundColor: "var(--jp-brown)",
          }}
        />

        {/* Track fill */}
        <div
          style={{
            position: "absolute",
            left: 0,
            width: `${pct}%`,
            height: 4,
            borderRadius: 9999,
            backgroundColor: accentColor,
            transition: isDragging ? "none" : "width 0.15s ease",
          }}
        />

        {/* Thumb */}
        <motion.div
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          onKeyDown={handleKeyDown}
          animate={{
            scale: isDragging ? 1.2 : isHovered ? 1.1 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{
            position: "absolute",
            left: `calc(${pct}% - 10px)`,
            width: 20,
            height: 20,
            borderRadius: 9999,
            backgroundColor: accentColor,
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            cursor: "grab",
            outline: "none",
            transition: isDragging ? "none" : "left 0.15s ease",
            zIndex: 2,
          }}
        />

        {/* Value tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute",
                left: `${pct}%`,
                bottom: "calc(100% + 4px)",
                transform: "translateX(-50%)",
                backgroundColor: accentColor,
                color: "#fff",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                fontWeight: 500,
                padding: "3px 8px",
                borderRadius: 6,
                whiteSpace: "nowrap",
                pointerEvents: "none",
                zIndex: 3,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              {displayValue}{unit}
              {/* Tooltip arrow */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "100%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderTop: `5px solid ${accentColor}`,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
