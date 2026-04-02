"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Easing presets
// ---------------------------------------------------------------------------

const PRESETS: Record<string, [number, number, number, number]> = {
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
  ease: [0.25, 0.1, 0.25, 1],
  linear: [0, 0, 1, 1],
  "current (site)": [0.32, 0.72, 0, 1],
};

// ---------------------------------------------------------------------------
// Cubic bezier curve SVG preview
// ---------------------------------------------------------------------------

function CurvePreview({ points }: { points: [number, number, number, number] }) {
  const [x1, y1, x2, y2] = points;
  const w = 120;
  const h = 120;
  const pad = 12;

  const sx = (v: number) => pad + v * (w - 2 * pad);
  const sy = (v: number) => h - pad - v * (h - 2 * pad);

  const p0 = { x: sx(0), y: sy(0) };
  const cp1 = { x: sx(x1), y: sy(y1) };
  const cp2 = { x: sx(x2), y: sy(y2) };
  const p1 = { x: sx(1), y: sy(1) };

  return (
    <svg width={w} height={h} style={{ border: "1px solid #444", borderRadius: 6, background: "#1a1a1a" }}>
      {/* grid */}
      <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="#333" strokeWidth={1} />
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#333" strokeWidth={1} />
      {/* diagonal guide */}
      <line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="#333" strokeDasharray="3 3" strokeWidth={1} />
      {/* control handles */}
      <line x1={p0.x} y1={p0.y} x2={cp1.x} y2={cp1.y} stroke="#666" strokeWidth={1} />
      <line x1={p1.x} y1={p1.y} x2={cp2.x} y2={cp2.y} stroke="#666" strokeWidth={1} />
      {/* curve */}
      <path
        d={`M ${p0.x} ${p0.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p1.x} ${p1.y}`}
        fill="none"
        stroke="#f97316"
        strokeWidth={2}
      />
      {/* control points */}
      <circle cx={cp1.x} cy={cp1.y} r={4} fill="#f97316" />
      <circle cx={cp2.x} cy={cp2.y} r={4} fill="#f97316" />
      {/* endpoints */}
      <circle cx={p0.x} cy={p0.y} r={3} fill="#888" />
      <circle cx={p1.x} cy={p1.y} r={3} fill="#888" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Slider row
// ---------------------------------------------------------------------------

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "monospace", fontSize: 13, color: "#ccc" }}>
      <span style={{ width: 28, textAlign: "right", flexShrink: 0, color: "#999" }}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ flex: 1, accentColor: "#f97316", cursor: "pointer" }}
      />
      <span style={{ width: 52, textAlign: "left", flexShrink: 0, color: "#f97316" }}>
        {value.toFixed(step < 1 ? 2 : step < 0.1 ? 2 : 1)}
        {unit}
      </span>
    </label>
  );
}

// ---------------------------------------------------------------------------
// Main playground page
// ---------------------------------------------------------------------------

export default function PlaygroundPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDuration, setOpenDuration] = useState(0.3);
  const [closeDuration, setCloseDuration] = useState(0.2);
  const [activePreset, setActivePreset] = useState<string | null>("current (site)");
  const [curve, setCurve] = useState<[number, number, number, number]>([0.32, 0.72, 0, 1]);
  const [copied, setCopied] = useState(false);

  const updateCurvePoint = useCallback(
    (index: number, value: number) => {
      setCurve((prev) => {
        const next = [...prev] as [number, number, number, number];
        next[index] = value;
        return next;
      });
      setActivePreset(null);
    },
    []
  );

  const selectPreset = useCallback((name: string) => {
    setActivePreset(name);
    setCurve([...PRESETS[name]] as [number, number, number, number]);
  }, []);

  const codeSnippet = `animate={{ y: 0, transition: { duration: ${openDuration}, ease: [${curve.join(", ")}] } }}
exit={{ y: "100%", transition: { duration: ${closeDuration}, ease: [${curve.join(", ")}] } }}`;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [codeSnippet]);

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#eee", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "32px 32px 16px", maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Panel Animation Playground</h1>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>
          Tweak the sliders, pick a preset, then hit the toggle to preview. Copy the values when happy.
        </p>

        {/* Preset buttons */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          {Object.keys(PRESETS).map((name) => (
            <button
              key={name}
              onClick={() => selectPreset(name)}
              style={{
                padding: "6px 12px",
                fontSize: 12,
                fontFamily: "monospace",
                borderRadius: 4,
                border: activePreset === name ? "1px solid #f97316" : "1px solid #444",
                background: activePreset === name ? "#f9731620" : "#222",
                color: activePreset === name ? "#f97316" : "#aaa",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Controls grid */}
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Curve preview */}
          <CurvePreview points={curve} />

          {/* Sliders */}
          <div style={{ flex: 1, minWidth: 240, display: "flex", flexDirection: "column", gap: 10 }}>
            <Slider label="x1" value={curve[0]} min={0} max={1} step={0.01} onChange={(v) => updateCurvePoint(0, v)} />
            <Slider label="y1" value={curve[1]} min={-0.5} max={1.5} step={0.01} onChange={(v) => updateCurvePoint(1, v)} />
            <Slider label="x2" value={curve[2]} min={0} max={1} step={0.01} onChange={(v) => updateCurvePoint(2, v)} />
            <Slider label="y2" value={curve[3]} min={-0.5} max={1.5} step={0.01} onChange={(v) => updateCurvePoint(3, v)} />
            <div style={{ borderTop: "1px solid #333", marginTop: 4, paddingTop: 10 }} />
            <Slider label="Open" value={openDuration} min={0.1} max={1.0} step={0.05} unit="s" onChange={setOpenDuration} />
            <Slider label="Close" value={closeDuration} min={0.1} max={1.0} step={0.05} unit="s" onChange={setCloseDuration} />
          </div>
        </div>

        {/* Toggle button */}
        <div style={{ marginTop: 24, display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => setIsOpen((v) => !v)}
            style={{
              padding: "10px 28px",
              fontSize: 14,
              fontWeight: 600,
              borderRadius: 6,
              border: "none",
              background: "#f97316",
              color: "#111",
              cursor: "pointer",
              transition: "transform 0.1s",
            }}
          >
            {isOpen ? "Close Panel" : "Open Panel"}
          </button>
          <span style={{ fontSize: 12, color: "#666" }}>
            {isOpen ? "Panel is open" : "Panel is closed"}
          </span>
        </div>

        {/* Code snippet */}
        <div style={{ marginTop: 24, position: "relative" }}>
          <pre
            style={{
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: 6,
              padding: "12px 16px",
              fontSize: 12,
              fontFamily: "monospace",
              color: "#ccc",
              overflowX: "auto",
              lineHeight: 1.6,
            }}
          >
            {codeSnippet}
          </pre>
          <button
            onClick={handleCopy}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              padding: "4px 10px",
              fontSize: 11,
              fontFamily: "monospace",
              borderRadius: 4,
              border: "1px solid #444",
              background: copied ? "#f9731630" : "#222",
              color: copied ? "#f97316" : "#888",
              cursor: "pointer",
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Mock bottom panel */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, pointerEvents: "none", zIndex: 50 }}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mock-panel"
              initial={{ y: "100%" }}
              animate={{ y: 0, transition: { duration: openDuration, ease: curve } }}
              exit={{ y: "100%", transition: { duration: closeDuration, ease: curve } }}
              style={{
                pointerEvents: "auto",
                background: "rgba(30, 28, 25, 0.85)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 -4px 24px rgba(0,0,0,0.12)",
                padding: "16px 32px",
              }}
            >
              {/* Mock panel content */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Signal", "Kinetic", "Bamboo"].map((t) => (
                    <div
                      key={t}
                      style={{
                        padding: "6px 16px",
                        fontSize: 10,
                        fontFamily: "monospace",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        borderRadius: 4,
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: t === "Signal" ? "#111" : "#888",
                        background: t === "Signal" ? "#f97316" : "transparent",
                      }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
                <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.08)" }} />
                <div style={{ display: "flex", gap: 16 }}>
                  {["Count", "Width", "Angle"].map((label) => (
                    <div key={label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 10, fontFamily: "monospace", color: "#666", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
                      <div style={{ width: 80, height: 4, borderRadius: 2, background: "#333" }}>
                        <div style={{ width: "50%", height: "100%", borderRadius: 2, background: "#f97316" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
