"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  type CanvasSettings,
  type ThemeId,
  type ModeId,
  type ShapeId,
  DEFAULT_SETTINGS,
  THEME_ACCENT_HEX,
  resetSettings,
  applyThemeVariables,
} from "@/lib/canvas-settings";
import { INTRO_PULSE_DURATION } from "@/lib/constants";
import { PremiumSlider } from "./PremiumSlider";
import { ShapeSelector } from "./ShapeSelector";
import { MiniCanvas } from "./MiniCanvas";

const ENTRANCE_DELAY = INTRO_PULSE_DURATION + 0.3 + 0.8;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BottomPanelProps {
  settingsRef: React.RefObject<CanvasSettings>;
}

// ---------------------------------------------------------------------------
// Theme Toggle (horizontal pills)
// ---------------------------------------------------------------------------

function ThemeToggle({
  active,
  accent,
  onChange,
}: {
  active: ThemeId;
  accent: string;
  onChange: (t: ThemeId) => void;
}) {
  const themes: ThemeId[] = ["earth", "arctic", "kinetic", "bamboo"];

  return (
    <div
      className="relative flex"
      style={{
        border: "1px solid var(--border-interactive)",
        borderRadius: "var(--radius-md)",
        padding: 2,
        gap: 2,
      }}
    >
      {themes.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className="relative flex-1 font-[family-name:var(--font-mono)] uppercase text-center transition-colors"
          style={{
            fontSize: "10px",
            letterSpacing: "0.08em",
            padding: "var(--space-1) var(--space-3)",
            borderRadius: "calc(var(--radius-md) - 2px)",
            color: active === t ? "#fff" : "var(--brown-400)",
            position: "relative",
            zIndex: 1,
            transitionDuration: "var(--duration-normal)",
          }}
        >
          {active === t && (
            <motion.div
              layoutId="theme-pill"
              className="absolute inset-0"
              style={{
                backgroundColor: accent,
                borderRadius: "calc(var(--radius-md) - 2px)",
                zIndex: -1,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          {t}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mode Switch (Light / Dark toggle)
// ---------------------------------------------------------------------------

function ModeSwitch({
  mode,
  accent,
  onChange,
}: {
  mode: ModeId;
  accent: string;
  onChange: (m: ModeId) => void;
}) {
  const isDark = mode === "dark";

  return (
    <button
      onClick={() => onChange(isDark ? "light" : "dark")}
      className="flex items-center"
      style={{ gap: "var(--space-2)", userSelect: "none" }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Light label */}
      <span
        className="font-[family-name:var(--font-mono)] uppercase transition-colors"
        style={{
          fontSize: "10px",
          letterSpacing: "0.08em",
          color: !isDark ? "var(--foreground)" : "var(--brown-500)",
          fontWeight: !isDark ? 500 : 400,
          transitionDuration: "var(--duration-normal)",
        }}
      >
        Light
      </span>

      {/* Toggle track */}
      <div
        style={{
          position: "relative",
          width: 44,
          height: 24,
          borderRadius: 9999,
          backgroundColor: "var(--border-interactive)",
          flexShrink: 0,
        }}
      >
        <motion.div
          animate={{ x: isDark ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{
            position: "absolute",
            top: 2,
            width: 20,
            height: 20,
            borderRadius: 9999,
            backgroundColor: accent,
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          }}
        />
      </div>

      {/* Dark label */}
      <span
        className="font-[family-name:var(--font-mono)] uppercase transition-colors"
        style={{
          fontSize: "10px",
          letterSpacing: "0.08em",
          color: isDark ? "var(--foreground)" : "var(--brown-500)",
          fontWeight: isDark ? 500 : 400,
          transitionDuration: "var(--duration-normal)",
        }}
      >
        Dark
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Vertical Divider
// ---------------------------------------------------------------------------

function Divider() {
  return (
    <div
      style={{
        width: 1,
        height: 48,
        backgroundColor: "var(--border-subtle)",
        flexShrink: 0,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Bottom Panel
// ---------------------------------------------------------------------------

export function BottomPanel({ settingsRef }: BottomPanelProps) {
  const [, forceUpdate] = useState(0);
  const rerender = useCallback(() => forceUpdate((n) => n + 1), []);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasEntered(true), ENTRANCE_DELAY * 1000);
    return () => clearTimeout(timer);
  }, []);

  const s = settingsRef.current ?? DEFAULT_SETTINGS;
  const accent = THEME_ACCENT_HEX[s.theme][s.mode];

  const update = useCallback(
    <K extends keyof CanvasSettings>(key: K, value: CanvasSettings[K]) => {
      if (settingsRef.current) {
        settingsRef.current[key] = value;
        rerender();
      }
    },
    [settingsRef, rerender]
  );

  const dispatchTheme = useCallback((theme: ThemeId, mode: ModeId) => {
    applyThemeVariables(theme, mode);
    localStorage.setItem("theme", theme);
    localStorage.setItem("mode", mode);
    window.dispatchEvent(
      new CustomEvent("themechange", { detail: { theme, mode } })
    );
  }, []);

  const handleThemeChange = useCallback(
    (theme: ThemeId) => {
      update("theme", theme);
      dispatchTheme(theme, s.mode);
    },
    [update, dispatchTheme, s.mode]
  );

  const handleModeChange = useCallback(
    (mode: ModeId) => {
      update("mode", mode);
      dispatchTheme(s.theme, mode);
    },
    [update, dispatchTheme, s.theme]
  );

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: isExpanded ? 0 : "100%" }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto"
      style={{
        visibility: hasEntered ? "visible" : "hidden",
        backgroundColor: "var(--surface-elevated)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid var(--border-subtle)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.12)",
      }}
    >
      {/* Floating toggle button */}
      {hasEntered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "absolute",
            top: -52,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1,
          }}
        >
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="transition-colors"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "1px solid var(--border-interactive)",
              backgroundColor: "var(--surface-elevated)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
              transitionDuration: "var(--duration-normal)",
            }}
            aria-label={isExpanded ? "Collapse settings" : "Expand settings"}
            aria-expanded={isExpanded}
          >
            <motion.svg
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              width={18}
              height={18}
              viewBox="0 0 18 18"
              fill="none"
              stroke="var(--brown-300)"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4.5 11.25 L9 6.75 L13.5 11.25" />
            </motion.svg>
          </button>
        </motion.div>
      )}
      {/* Large desktop layout (≥1024px) — single row */}
      <div
        className="hidden lg:flex items-center justify-center"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "var(--space-4) var(--page-margin)",
          gap: "var(--space-5)",
        }}
      >
        <MiniCanvas settingsRef={settingsRef} isActive={true} />
        <Divider />
        <ModeSwitch mode={s.mode} accent={accent} onChange={handleModeChange} />
        <Divider />
        <div className="flex items-end flex-1" style={{ gap: "var(--space-4)" }}>
          <PremiumSlider label="Count" value={s.lineCount} min={20} max={100} step={10} accentColor={accent} onChange={(v) => update("lineCount", v)} />
          <PremiumSlider label="Width" value={s.maxThickness} min={1} max={12} step={1} accentColor={accent} onChange={(v) => update("maxThickness", v)} />
          <PremiumSlider label="Angle" value={s.angle} min={0} max={360} step={15} unit="°" accentColor={accent} onChange={(v) => update("angle", v)} />
        </div>
        <Divider />
        <div>
          <div className="font-[family-name:var(--font-mono)] uppercase text-brown-300" style={{ fontSize: "10px", letterSpacing: "0.1em", marginBottom: "var(--space-2)", userSelect: "none" }}>Shape</div>
          <ShapeSelector active={s.shape} accent={accent} onChange={(shape: ShapeId) => update("shape", shape)} />
        </div>
        <Divider />
        <div>
          <div className="font-[family-name:var(--font-mono)] uppercase text-brown-300" style={{ fontSize: "10px", letterSpacing: "0.1em", marginBottom: "var(--space-2)", userSelect: "none" }}>Theme</div>
          <ThemeToggle active={s.theme} accent={accent} onChange={handleThemeChange} />
        </div>
      </div>

      {/* Tablet layout (768px–1023px) — two rows */}
      <div
        className="hidden md:flex lg:hidden flex-col"
        style={{
          padding: "var(--space-3) var(--page-margin)",
          gap: "var(--space-3)",
        }}
      >
        {/* Row 1: Preview + Mode + Shape + Theme */}
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
            <MiniCanvas settingsRef={settingsRef} isActive={true} />
            <ModeSwitch mode={s.mode} accent={accent} onChange={handleModeChange} />
          </div>
          <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
            <ShapeSelector active={s.shape} accent={accent} onChange={(shape: ShapeId) => update("shape", shape)} />
            <ThemeToggle active={s.theme} accent={accent} onChange={handleThemeChange} />
          </div>
        </div>
        {/* Row 2: All sliders, full width */}
        <div className="flex items-end" style={{ gap: "var(--space-3)" }}>
          <PremiumSlider label="Count" value={s.lineCount} min={20} max={100} step={10} accentColor={accent} onChange={(v) => update("lineCount", v)} />
          <PremiumSlider label="Width" value={s.maxThickness} min={1} max={12} step={1} accentColor={accent} onChange={(v) => update("maxThickness", v)} />
          <PremiumSlider label="Angle" value={s.angle} min={0} max={360} step={15} unit="°" accentColor={accent} onChange={(v) => update("angle", v)} />
        </div>
      </div>

      {/* Mobile layout (<768px) — three rows, everything clear */}
      <div
        className="flex md:hidden flex-col"
        style={{
          padding: "var(--space-3) var(--page-margin)",
          gap: "var(--space-3)",
        }}
      >
        {/* Row 1: Mode + Shape */}
        <div className="flex items-center justify-between">
          <ModeSwitch mode={s.mode} accent={accent} onChange={handleModeChange} />
          <ShapeSelector active={s.shape} accent={accent} onChange={(shape: ShapeId) => update("shape", shape)} />
        </div>
        {/* Row 2: Theme (full width) */}
        <ThemeToggle active={s.theme} accent={accent} onChange={handleThemeChange} />
        {/* Row 3: Sliders */}
        <div className="flex items-end" style={{ gap: "var(--space-3)" }}>
          <PremiumSlider label="Count" value={s.lineCount} min={20} max={100} step={10} accentColor={accent} onChange={(v) => update("lineCount", v)} />
          <PremiumSlider label="Width" value={s.maxThickness} min={1} max={12} step={1} accentColor={accent} onChange={(v) => update("maxThickness", v)} />
          <PremiumSlider label="Angle" value={s.angle} min={0} max={360} step={15} unit="°" accentColor={accent} onChange={(v) => update("angle", v)} />
        </div>
      </div>
    </motion.div>
  );
}
