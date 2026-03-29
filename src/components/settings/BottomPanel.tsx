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
  onToggle?: () => void;
}

// Animated wave icon for the collapsed strip — "the canvas in miniature"
function WaveIcon({ accent }: { accent: string }) {
  // Two sine wave path variants for subtle undulation
  const wave1 = "M0 5 C2 2, 4 2, 6 5 C8 8, 10 8, 12 5 C14 2, 16 2, 18 5 C20 8, 22 8, 24 5";
  const wave2 = "M0 5 C2 7, 4 7, 6 5 C8 3, 10 3, 12 5 C14 7, 16 7, 18 5 C20 3, 22 3, 24 5";

  return (
    <svg width="20" height="10" viewBox="0 0 24 10" fill="none">
      <motion.path
        d={wave1}
        stroke={accent}
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
        animate={{ d: [wave1, wave2, wave1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Theme Toggle (horizontal pills)
// ---------------------------------------------------------------------------

function ThemeToggle({
  active,
  accent,
  contrastText,
  onChange,
  id = "default",
}: {
  active: ThemeId;
  accent: string;
  contrastText: string;
  onChange: (t: ThemeId) => void;
  id?: string;
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
              layoutId={`theme-pill-${id}`}
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

export function BottomPanel({ settingsRef, isExpanded, onToggle }: BottomPanelProps) {
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
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderTop: "1px solid var(--border-subtle)",
              boxShadow: "0 -4px 24px rgba(0,0,0,0.12)",
            }}
          >
            {/* Collapse button — centered at top of panel */}
            {onToggle && (
              <div className="flex justify-center" style={{ padding: "var(--space-1) 0 0" }}>
                <button
                  onClick={onToggle}
                  className="flex items-center font-[family-name:var(--font-mono)] uppercase transition-colors cursor-pointer"
                  style={{
                    gap: "var(--space-2)",
                    padding: "var(--space-1) var(--space-4)",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    color: "var(--brown-400)",
                    background: "none",
                    border: "none",
                    transitionDuration: "var(--duration-normal)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--brown-400)"; }}
                  aria-label="Collapse settings panel"
                >
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Collapse</span>
                </button>
              </div>
            )}

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
                <ShapeSelector active={s.shape} accent={accent} contrastText={contrastText} onChange={(shape: ShapeId) => update("shape", shape)} id="lg" />
              </div>
              <Divider />
              <div>
                <div className="font-[family-name:var(--font-mono)] uppercase text-brown-200" style={{ fontSize: "10px", letterSpacing: "0.1em", marginBottom: "var(--space-2)", userSelect: "none" }}>Theme</div>
                <ThemeToggle active={s.theme} accent={accent} contrastText={contrastText} onChange={handleThemeChange} id="lg" />
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
                  <ShapeSelector active={s.shape} accent={accent} contrastText={contrastText} onChange={(shape: ShapeId) => update("shape", shape)} id="md" />
                  <ThemeToggle active={s.theme} accent={accent} contrastText={contrastText} onChange={handleThemeChange} id="md" />
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
                <ShapeSelector active={s.shape} accent={accent} contrastText={contrastText} onChange={(shape: ShapeId) => update("shape", shape)} id="sm" />
              </div>
              <ThemeToggle active={s.theme} accent={accent} contrastText={contrastText} onChange={handleThemeChange} id="sm" />
              <div className="flex items-end" style={{ gap: "var(--space-3)" }}>
                <PremiumSlider label="Count" value={s.lineCount} min={20} max={100} step={10} accentColor={accent} contrastText={contrastText} onChange={(v) => update("lineCount", v)} />
                <PremiumSlider label="Width" value={s.maxThickness} min={1} max={12} step={1} accentColor={accent} contrastText={contrastText} onChange={(v) => update("maxThickness", v)} />
                <PremiumSlider label="Angle" value={s.angle} min={0} max={360} step={15} unit="°" accentColor={accent} contrastText={contrastText} onChange={(v) => update("angle", v)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed preview strip — visible when panel is closed */}
      <AnimatePresence>
        {!isExpanded && onToggle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex justify-center"
            style={{ paddingBottom: 0 }}
          >
            <motion.button
              onClick={onToggle}
              className="group flex items-center font-[family-name:var(--font-mono)] uppercase transition-all cursor-pointer"
              animate={{ y: [0, -2, 0] }}
              transition={{
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              }}
              whileHover={{ y: -4 }}
              style={{
                gap: "var(--space-2)",
                padding: "var(--space-2) var(--space-5)",
                fontSize: "10px",
                letterSpacing: "0.1em",
                color: "var(--brown-300)",
                backgroundColor: "var(--nav-surface)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid var(--border-subtle)",
                borderBottom: "none",
                borderRadius: "4px 4px 0 0",
                transitionDuration: "var(--duration-normal)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = accent;
                e.currentTarget.style.color = accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.color = "var(--brown-300)";
              }}
              aria-label="Open settings panel"
            >
              <WaveIcon accent={accent} />
              <span>Tweak</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="transition-transform group-hover:-translate-y-0.5" style={{ transitionDuration: "var(--duration-normal)" }}>
                <path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
