"use client";

import { useState, useCallback } from "react";
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
  const themes: ThemeId[] = ["earth", "arctic", "kinetic"];

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
      animate={{ y: 0 }}
      transition={{
        duration: 0.6,
        delay: ENTRANCE_DELAY,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto"
      style={{
        backgroundColor: "var(--surface-elevated)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border-subtle)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
      }}
    >
      {/* Desktop layout */}
      <div
        className="hidden md:flex items-center justify-center"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "var(--space-4) var(--page-margin)",
          gap: "var(--space-5)",
        }}
      >
        {/* Mini preview */}
        <MiniCanvas settingsRef={settingsRef} isActive={true} />

        <Divider />

        {/* Mode switch */}
        <ModeSwitch mode={s.mode} accent={accent} onChange={handleModeChange} />

        <Divider />

        {/* Sliders */}
        <div className="flex items-end" style={{ gap: "var(--space-4)" }}>
          <PremiumSlider
            label="Count"
            value={s.lineCount}
            min={20}
            max={100}
            step={10}
            accentColor={accent}
            onChange={(v) => update("lineCount", v)}
          />
          <PremiumSlider
            label="Height"
            value={s.maxLineHeight}
            min={0.1}
            max={1.0}
            step={0.1}
            accentColor={accent}
            onChange={(v) => update("maxLineHeight", v)}
          />
          <PremiumSlider
            label="Glow"
            value={s.glowIntensity}
            min={0}
            max={1.0}
            step={0.1}
            accentColor={accent}
            onChange={(v) => update("glowIntensity", v)}
          />
          <PremiumSlider
            label="Width"
            value={s.maxThickness}
            min={1}
            max={12}
            step={1}
            accentColor={accent}
            onChange={(v) => update("maxThickness", v)}
          />
          <PremiumSlider
            label="Angle"
            value={s.angle}
            min={0}
            max={360}
            step={15}
            unit="°"
            accentColor={accent}
            onChange={(v) => update("angle", v)}
          />
        </div>

        <Divider />

        {/* Shape selector */}
        <div>
          <div
            className="font-[family-name:var(--font-mono)] uppercase text-brown-300"
            style={{
              fontSize: "10px",
              letterSpacing: "0.1em",
              marginBottom: "var(--space-2)",
              userSelect: "none",
            }}
          >
            Shape
          </div>
          <ShapeSelector
            active={s.shape}
            accent={accent}
            onChange={(shape: ShapeId) => update("shape", shape)}
          />
        </div>

        <Divider />

        {/* Theme selector */}
        <div>
          <div
            className="font-[family-name:var(--font-mono)] uppercase text-brown-300"
            style={{
              fontSize: "10px",
              letterSpacing: "0.1em",
              marginBottom: "var(--space-2)",
              userSelect: "none",
            }}
          >
            Theme
          </div>
          <ThemeToggle
            active={s.theme}
            accent={accent}
            onChange={handleThemeChange}
          />
        </div>
      </div>

      {/* Mobile layout */}
      <div
        className="flex md:hidden flex-col"
        style={{
          padding: "var(--space-3) var(--page-margin)",
          gap: "var(--space-3)",
        }}
      >
        {/* Row 1: Preview + Mode + Theme */}
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
            <MiniCanvas settingsRef={settingsRef} isActive={true} />
            <ModeSwitch mode={s.mode} accent={accent} onChange={handleModeChange} />
          </div>
          <ThemeToggle
            active={s.theme}
            accent={accent}
            onChange={handleThemeChange}
          />
        </div>

        {/* Row 2: Sliders + Shape */}
        <div className="flex items-end" style={{ gap: "var(--space-3)" }}>
          <div className="flex items-end flex-1" style={{ gap: "var(--space-2)" }}>
            <PremiumSlider
              label="Count"
              value={s.lineCount}
              min={20}
              max={100}
              step={10}
              accentColor={accent}
              onChange={(v) => update("lineCount", v)}
            />
            <PremiumSlider
              label="Height"
              value={s.maxLineHeight}
              min={0.1}
              max={1.0}
              step={0.1}
              accentColor={accent}
              onChange={(v) => update("maxLineHeight", v)}
            />
            <PremiumSlider
              label="Glow"
              value={s.glowIntensity}
              min={0}
              max={1.0}
              step={0.1}
              accentColor={accent}
              onChange={(v) => update("glowIntensity", v)}
            />
            <PremiumSlider
              label="Width"
              value={s.maxThickness}
              min={1}
              max={12}
              step={1}
              accentColor={accent}
              onChange={(v) => update("maxThickness", v)}
            />
            <PremiumSlider
              label="Angle"
              value={s.angle}
              min={0}
              max={360}
              step={15}
              unit="°"
              accentColor={accent}
              onChange={(v) => update("angle", v)}
            />
          </div>
          <ShapeSelector
            active={s.shape}
            accent={accent}
            onChange={(shape: ShapeId) => update("shape", shape)}
          />
        </div>
      </div>
    </motion.div>
  );
}
