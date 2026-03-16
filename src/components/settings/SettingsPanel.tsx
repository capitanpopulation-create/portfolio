"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Slider } from "./Slider";
import { ShapeSelector } from "./ShapeSelector";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SettingsPanelProps {
  settingsRef: React.RefObject<CanvasSettings>;
}

// ---------------------------------------------------------------------------
// Segmented Theme Toggle
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
            fontSize: "var(--text-xs)",
            letterSpacing: "0.08em",
            padding: "var(--space-2) var(--space-3)",
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
// Lightbulb Toggle (dark/light mode)
// ---------------------------------------------------------------------------

function LightbulbToggle({
  mode,
  onChange,
}: {
  mode: ModeId;
  onChange: (m: ModeId) => void;
}) {
  const isLight = mode === "light";

  return (
    <motion.button
      onClick={() => onChange(isLight ? "dark" : "light")}
      className="flex items-center justify-center transition-colors"
      style={{
        width: 36,
        height: 36,
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-interactive)",
        color: isLight ? "var(--accent-orange)" : "var(--brown-400)",
        backgroundColor: isLight ? "rgba(232, 114, 42, 0.1)" : "transparent",
        transitionDuration: "var(--duration-normal)",
        position: "relative",
      }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      title={`Switch to ${isLight ? "dark" : "light"} mode`}
    >
      {/* Glow ring in light mode */}
      {isLight && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0"
          style={{
            borderRadius: "var(--radius-md)",
            boxShadow: "0 0 12px rgba(232, 114, 42, 0.3)",
          }}
        />
      )}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        {/* Bulb body */}
        <path
          d="M9 21h6M12 3a6 6 0 0 0-4 10.5V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3.5A6 6 0 0 0 12 3z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={isLight ? "currentColor" : "none"}
          fillOpacity={isLight ? 0.2 : 0}
        />
        {/* Rays — only in light mode */}
        {isLight && (
          <motion.g
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <line x1="12" y1="0" x2="12" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="4.2" y1="4.2" x2="4.9" y2="4.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="0" y1="12" x2="1" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="19.8" y1="4.2" x2="19.1" y2="4.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="24" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </motion.g>
        )}
      </svg>
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Abstract Creature Trigger — bottom-right corner
// ---------------------------------------------------------------------------

function CreatureTrigger({
  onClick,
  accent,
  isOpen,
}: {
  onClick: () => void;
  accent: string;
  isOpen: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed z-[55] flex items-center justify-center"
      style={{
        bottom: "var(--space-6)",
        right: "var(--space-6)",
        width: 48,
        height: 48,
        backgroundColor: "var(--surface-elevated)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid var(--border-interactive)",
        borderRadius: "var(--radius-full, 9999px)",
        transitionDuration: "var(--duration-normal)",
        cursor: "pointer",
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      aria-label="Open canvas settings"
    >
      {/* Abstract creature: overlapping geometric shapes */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        {/* Body — center circle */}
        <motion.circle
          cx="12"
          cy="12"
          r="4"
          stroke={accent}
          strokeWidth="1.3"
          fill="none"
          animate={{ r: isOpen ? 5 : 4 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
        {/* Left eye */}
        <motion.circle
          cx="10"
          cy="11"
          r="1"
          fill={accent}
          animate={{ r: isOpen ? 0.5 : 1, cy: isOpen ? 10 : 11 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
        {/* Right eye */}
        <motion.circle
          cx="14"
          cy="11"
          r="1"
          fill={accent}
          animate={{ r: isOpen ? 0.5 : 1, cy: isOpen ? 10 : 11 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
        {/* Top antenna — line */}
        <motion.line
          x1="12"
          y1="8"
          x2="12"
          y2="4"
          stroke={accent}
          strokeWidth="1.2"
          strokeLinecap="round"
          animate={{ y2: isOpen ? 3 : 4 }}
        />
        {/* Antenna tip */}
        <motion.circle
          cx="12"
          cy="4"
          r="1.2"
          fill="none"
          stroke={accent}
          strokeWidth="1"
          animate={{ cy: isOpen ? 3 : 4 }}
        />
        {/* Left arm — small diamond */}
        <motion.rect
          x="4"
          y="11"
          width="3"
          height="3"
          stroke={accent}
          strokeWidth="1"
          fill="none"
          transform="rotate(45 5.5 12.5)"
          animate={{ opacity: isOpen ? 1 : 0.6 }}
        />
        {/* Right arm — small triangle */}
        <motion.path
          d="M19 10.5L21 13L17 13Z"
          stroke={accent}
          strokeWidth="1"
          fill="none"
          strokeLinejoin="round"
          animate={{ opacity: isOpen ? 1 : 0.6 }}
        />
        {/* Feet — two small lines */}
        <motion.line
          x1="10"
          y1="16"
          x2="10"
          y2="19"
          stroke={accent}
          strokeWidth="1.2"
          strokeLinecap="round"
          animate={{ y2: isOpen ? 20 : 19 }}
        />
        <motion.line
          x1="14"
          y1="16"
          x2="14"
          y2="19"
          stroke={accent}
          strokeWidth="1.2"
          strokeLinecap="round"
          animate={{ y2: isOpen ? 20 : 19 }}
        />
      </svg>
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Settings Panel (main) — bottom-right popover
// ---------------------------------------------------------------------------

export function SettingsPanel({ settingsRef }: SettingsPanelProps) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const [, forceUpdate] = useState(0);
  const rerender = useCallback(() => forceUpdate((n) => n + 1), []);

  const s = settingsRef.current ?? DEFAULT_SETTINGS;
  const accent = THEME_ACCENT_HEX[s.theme][s.mode];

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  }, []);

  const update = useCallback(
    <K extends keyof CanvasSettings>(key: K, value: CanvasSettings[K]) => {
      if (settingsRef.current) {
        settingsRef.current[key] = value;
        rerender();
        showToast("✓ Changes saved");
      }
    },
    [settingsRef, rerender, showToast]
  );

  const dispatchTheme = useCallback((theme: ThemeId, mode: ModeId) => {
    applyThemeVariables(theme, mode);
    localStorage.setItem("theme", theme);
    localStorage.setItem("mode", mode);
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme, mode } }));
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

  const handleReset = useCallback(() => {
    if (settingsRef.current) {
      resetSettings(settingsRef.current);
      dispatchTheme("earth", "dark");
      rerender();
      showToast("✓ Defaults restored");
    }
  }, [settingsRef, rerender, showToast, dispatchTheme]);

  // Escape key to close
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  return (
    <>
      <CreatureTrigger
        onClick={() => setOpen(!open)}
        accent={accent}
        isOpen={open}
      />

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[59]"
              style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
              onClick={() => setOpen(false)}
            />

            {/* Panel — compact popover above creature */}
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed z-[60] pointer-events-auto"
              style={{
                bottom: "calc(var(--space-6) + 60px)",
                right: "var(--space-6)",
                width: "min(300px, calc(100vw - 48px))",
                backgroundColor: "var(--surface-elevated)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg, 12px)",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  borderBottom: "1px solid var(--border-muted)",
                }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-3)" }}>
                  <span
                    className="font-[family-name:var(--font-mono)] uppercase text-brown-300"
                    style={{ fontSize: "var(--text-xs)", letterSpacing: "0.12em" }}
                  >
                    Canvas
                  </span>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-brown-400 hover:text-accent-orange transition-colors"
                    style={{ transitionDuration: "var(--duration-normal)" }}
                    aria-label="Close settings"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                {/* Theme selector */}
                <ThemeToggle active={s.theme} accent={accent} onChange={handleThemeChange} />
              </div>

              {/* Controls */}
              <div
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-3)",
                }}
              >
                {/* Shape label + selector */}
                <div>
                  <span
                    className="font-[family-name:var(--font-mono)] uppercase text-brown-400"
                    style={{ fontSize: "10px", letterSpacing: "0.1em", marginBottom: "var(--space-2)", display: "block" }}
                  >
                    Shape
                  </span>
                  <ShapeSelector
                    active={s.shape}
                    accent={accent}
                    onChange={(shape: ShapeId) => update("shape", shape)}
                  />
                </div>

                {/* Angle slider */}
                <Slider
                  label="Angle"
                  value={s.angle}
                  min={0}
                  max={360}
                  step={15}
                  unit="°"
                  accentColor={accent}
                  onChange={(v) => update("angle", v)}
                />

                {/* Line count slider */}
                <Slider
                  label="Count"
                  value={s.lineCount}
                  min={20}
                  max={100}
                  step={10}
                  unit=""
                  accentColor={accent}
                  onChange={(v) => update("lineCount", v)}
                />
              </div>

              {/* Footer — lightbulb + reset */}
              <div
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  borderTop: "1px solid var(--border-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                }}
              >
                <LightbulbToggle mode={s.mode} onChange={handleModeChange} />

                <button
                  onClick={handleReset}
                  className="flex-1 font-[family-name:var(--font-mono)] uppercase text-brown-400 hover:text-accent-orange transition-colors"
                  style={{
                    fontSize: "var(--text-xs)",
                    letterSpacing: "0.12em",
                    padding: "var(--space-2) 0",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    transitionDuration: "var(--duration-normal)",
                  }}
                >
                  Reset
                </button>
              </div>

              {/* Toast */}
              <AnimatePresence>
                {toast && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="font-[family-name:var(--font-mono)] text-brown-300 text-center"
                    style={{
                      fontSize: "var(--text-xs)",
                      padding: "0 var(--space-4) var(--space-3)",
                    }}
                  >
                    {toast}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
