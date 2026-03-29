"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  type CanvasSettings,
  type ThemeId,
  type ModeId,
  type ShapeId,
  DEFAULT_SETTINGS,
  THEME_ACCENT_HEX,
  THEME_CONTRAST_HEX,
  applyThemeVariables,
  getContrastText,
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
  isExpanded: boolean;
}

// ---------------------------------------------------------------------------
// Theme Toggle (horizontal pills)
// ---------------------------------------------------------------------------

function ThemeToggle({
  active,
  accent,
  contrastText,
  onChange,
}: {
  active: ThemeId;
  accent: string;
  contrastText: string;
  onChange: (t: ThemeId) => void;
}) {
  const themes: ThemeId[] = ["signal", "kinetic", "bamboo"];

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
      {themes.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className="relative flex-1 font-[family-name:var(--font-mono)] uppercase text-center transition-colors"
          style={{
            fontSize: "10px",
            letterSpacing: "0.08em",
            padding: "var(--space-1) var(--space-3)",
            borderRadius: 4,
            color: active === t ? contrastText : "var(--brown-200)",
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
                borderRadius: 4,
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
      <span
        className="font-[family-name:var(--font-mono)] uppercase transition-colors"
        style={{
          fontSize: "10px",
          letterSpacing: "0.08em",
          color: !isDark ? "var(--foreground)" : "var(--brown-200)",
          fontWeight: !isDark ? 500 : 400,
          transitionDuration: "var(--duration-normal)",
        }}
      >
        Light
      </span>

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

      <span
        className="font-[family-name:var(--font-mono)] uppercase transition-colors"
        style={{
          fontSize: "10px",
          letterSpacing: "0.08em",
          color: isDark ? "var(--foreground)" : "var(--brown-200)",
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
// Bottom Panel — expandable settings only (CTAs live in LandingOverlay)
// ---------------------------------------------------------------------------

export function BottomPanel({ settingsRef, isExpanded }: BottomPanelProps) {
  const [, forceUpdate] = useState(0);
  const rerender = useCallback(() => forceUpdate((n) => n + 1), []);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasEntered(true), ENTRANCE_DELAY * 1000);
    return () => clearTimeout(timer);
  }, []);

  const s = settingsRef.current ?? DEFAULT_SETTINGS;
  const accent = THEME_ACCENT_HEX[s.theme][s.mode];
  const contrastText = THEME_CONTRAST_HEX[s.theme]?.[s.mode] ?? getContrastText(accent);

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

  if (!hasEntered) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto overflow-hidden"
            style={{
              backgroundColor: "var(--surface-elevated)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderTop: "1px solid var(--border-subtle)",
              boxShadow: "0 -4px 24px rgba(0,0,0,0.12)",
            }}
          >
            {/* Desktop layout (>=1024px) */}
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
                <PremiumSlider label="Count" value={s.lineCount} min={20} max={100} step={10} accentColor={accent} contrastText={contrastText} onChange={(v) => update("lineCount", v)} />
                <PremiumSlider label="Width" value={s.maxThickness} min={1} max={12} step={1} accentColor={accent} contrastText={contrastText} onChange={(v) => update("maxThickness", v)} />
                <PremiumSlider label="Angle" value={s.angle} min={0} max={360} step={15} unit="°" accentColor={accent} contrastText={contrastText} onChange={(v) => update("angle", v)} />
              </div>
              <Divider />
              <div>
                <div className="font-[family-name:var(--font-mono)] uppercase text-brown-200" style={{ fontSize: "10px", letterSpacing: "0.1em", marginBottom: "var(--space-2)", userSelect: "none" }}>Shape</div>
                <ShapeSelector active={s.shape} accent={accent} contrastText={contrastText} onChange={(shape: ShapeId) => update("shape", shape)} />
              </div>
              <Divider />
              <div>
                <div className="font-[family-name:var(--font-mono)] uppercase text-brown-200" style={{ fontSize: "10px", letterSpacing: "0.1em", marginBottom: "var(--space-2)", userSelect: "none" }}>Theme</div>
                <ThemeToggle active={s.theme} accent={accent} contrastText={contrastText} onChange={handleThemeChange} />
              </div>
            </div>

            {/* Tablet layout (768px–1023px) */}
            <div
              className="hidden md:flex lg:hidden flex-col"
              style={{
                padding: "var(--space-3) var(--page-margin)",
                gap: "var(--space-3)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
                  <MiniCanvas settingsRef={settingsRef} isActive={true} />
                  <ModeSwitch mode={s.mode} accent={accent} onChange={handleModeChange} />
                </div>
                <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
                  <ShapeSelector active={s.shape} accent={accent} contrastText={contrastText} onChange={(shape: ShapeId) => update("shape", shape)} />
                  <ThemeToggle active={s.theme} accent={accent} contrastText={contrastText} onChange={handleThemeChange} />
                </div>
              </div>
              <div className="flex items-end" style={{ gap: "var(--space-3)" }}>
                <PremiumSlider label="Count" value={s.lineCount} min={20} max={100} step={10} accentColor={accent} contrastText={contrastText} onChange={(v) => update("lineCount", v)} />
                <PremiumSlider label="Width" value={s.maxThickness} min={1} max={12} step={1} accentColor={accent} contrastText={contrastText} onChange={(v) => update("maxThickness", v)} />
                <PremiumSlider label="Angle" value={s.angle} min={0} max={360} step={15} unit="°" accentColor={accent} contrastText={contrastText} onChange={(v) => update("angle", v)} />
              </div>
            </div>

            {/* Mobile layout (<768px) */}
            <div
              className="flex md:hidden flex-col"
              style={{
                padding: "var(--space-3) var(--page-margin)",
                gap: "var(--space-3)",
              }}
            >
              <div className="flex items-center justify-between">
                <ModeSwitch mode={s.mode} accent={accent} onChange={handleModeChange} />
                <ShapeSelector active={s.shape} accent={accent} contrastText={contrastText} onChange={(shape: ShapeId) => update("shape", shape)} />
              </div>
              <ThemeToggle active={s.theme} accent={accent} contrastText={contrastText} onChange={handleThemeChange} />
              <div className="flex items-end" style={{ gap: "var(--space-3)" }}>
                <PremiumSlider label="Count" value={s.lineCount} min={20} max={100} step={10} accentColor={accent} contrastText={contrastText} onChange={(v) => update("lineCount", v)} />
                <PremiumSlider label="Width" value={s.maxThickness} min={1} max={12} step={1} accentColor={accent} contrastText={contrastText} onChange={(v) => update("maxThickness", v)} />
                <PremiumSlider label="Angle" value={s.angle} min={0} max={360} step={15} unit="°" accentColor={accent} contrastText={contrastText} onChange={(v) => update("angle", v)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
