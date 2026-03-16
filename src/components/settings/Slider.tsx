"use client";

import { useCallback } from "react";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  accentColor: string;
  onChange: (value: number) => void;
}

export function Slider({ label, value, min, max, step, unit, accentColor, onChange }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  const displayValue = step >= 1 ? Math.round(value) : Number(value.toFixed(1));
  const displayUnit = unit ?? "";

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseFloat(e.target.value));
    },
    [onChange]
  );

  return (
    <div style={{ marginBottom: "var(--space-5)" }}>
      {/* Label row */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: "var(--space-2)" }}
      >
        <span
          className="font-[family-name:var(--font-mono)] uppercase text-brown-300"
          style={{ fontSize: "var(--text-xs)", letterSpacing: "0.08em" }}
        >
          {label}
        </span>
        <span
          className="font-sans text-limestone"
          style={{ fontSize: "var(--text-sm)" }}
        >
          {displayValue}{displayUnit}
        </span>
      </div>

      {/* Range input */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleInput}
        className="settings-slider"
        style={{
          width: "100%",
          ["--slider-pct" as string]: `${pct}%`,
          ["--slider-accent" as string]: accentColor,
        }}
      />

      {/* Min / max labels */}
      <div
        className="flex items-center justify-between"
        style={{ marginTop: "var(--space-1)" }}
      >
        <span
          className="font-[family-name:var(--font-mono)] text-brown-500"
          style={{ fontSize: "10px" }}
        >
          {min}{displayUnit}
        </span>
        <span
          className="font-[family-name:var(--font-mono)] text-brown-500"
          style={{ fontSize: "10px" }}
        >
          {max}{displayUnit}
        </span>
      </div>
    </div>
  );
}
