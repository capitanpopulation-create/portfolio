"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  type CanvasSettings,
  type ThemeId,
  type ModeId,
  DEFAULT_SETTINGS,
  THEME_ACCENT_HEX,
  resetSettings,
  applyThemeVariables,
} from "@/lib/canvas-settings";
import { Slider } from "./Slider";

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
// Light / Dark Mode Toggle
// ---------------------------------------------------------------------------

function ModeToggle({
  active,
  onChange,
}: {
  active: ModeId;
  onChange: (m: ModeId) => void;
}) {
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
      {(["dark", "light"] as ModeId[]).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className="relative flex-1 flex items-center justify-center font-[family-name:var(--font-mono)] uppercase text-center transition-colors"
          style={{
            fontSize: "var(--text-xs)",
            letterSpacing: "0.08em",
            padding: "var(--space-2) var(--space-3)",
            borderRadius: "calc(var(--radius-md) - 2px)",
            color: active === m ? "var(--foreground)" : "var(--brown-400)",
            position: "relative",
            zIndex: 1,
            transitionDuration: "var(--duration-normal)",
            gap: "var(--space-2)",
          }}
        >
          {active === m && (
            <motion.div
              layoutId="mode-pill"
              className="absolute inset-0"
              style={{
                backgroundColor: "var(--border-interactive)",
                borderRadius: "calc(var(--radius-md) - 2px)",
                zIndex: -1,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          {m === "light" ? (
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M8 1.5V3M8 13V14.5M1.5 8H3M13 8H14.5M3.4 3.4L4.5 4.5M11.5 11.5L12.6 12.6M3.4 12.6L4.5 11.5M11.5 4.5L12.6 3.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 9.5A5.5 5.5 0 116.5 2.5a4.5 4.5 0 007 7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {m}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Trigger Button — right-center edge of viewport
// ---------------------------------------------------------------------------

function TriggerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed z-[55] flex items-center justify-center transition-colors hover:border-brown-400/40"
      style={{
        top: "50%",
        right: 0,
        transform: "translateY(-50%)",
        width: 28,
        height: 52,
        backgroundColor: "var(--surface-elevated)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid var(--border-interactive)",
        borderRight: "none",
        borderRadius: "var(--radius-md) 0 0 var(--radius-md)",
        transitionDuration: "var(--duration-normal)",
      }}
      aria-label="Open canvas settings"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 18 18"
        fill="none"
        className="text-brown-300"
      >
        <line x1="5" y1="3" x2="5" y2="15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="9" y1="3" x2="9" y2="15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="13" y1="3" x2="13" y2="15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="5" cy="7" r="2" fill="var(--background)" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="9" cy="12" r="2" fill="var(--background)" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="13" cy="5" r="2" fill="var(--background)" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Settings Panel (main) — compact slide-out
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
      {!open && <TriggerButton onClick={() => setOpen(true)} />}

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[59]"
              style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
              onClick={() => setOpen(false)}
            />

            {/* Panel — compact, auto-height */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed z-[60] pointer-events-auto"
              style={{
                top: "50%",
                right: "var(--space-4)",
                transform: "translateY(-50%)",
                width: "min(320px, calc(100vw - 32px))",
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
                  padding: "var(--space-4) var(--space-5)",
                  borderBottom: "1px solid var(--border-muted)",
                }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-4)" }}>
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
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <ThemeToggle active={s.theme} accent={accent} onChange={handleThemeChange} />
                  <ModeToggle active={s.mode} onChange={handleModeChange} />
                </div>
              </div>

              {/* Lines control */}
              <div style={{ padding: "var(--space-4) var(--space-5)" }}>
                <Slider
                  label="Lines"
                  value={s.lineCount}
                  min={20}
                  max={100}
                  step={10}
                  unit=""
                  accentColor={accent}
                  onChange={(v) => update("lineCount", v)}
                />
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "0 var(--space-5) var(--space-4)",
                }}
              >
                <button
                  onClick={handleReset}
                  className="w-full font-[family-name:var(--font-mono)] uppercase text-brown-400 hover:text-accent-orange transition-colors"
                  style={{
                    fontSize: "var(--text-xs)",
                    letterSpacing: "0.12em",
                    padding: "var(--space-2) 0",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    transitionDuration: "var(--duration-normal)",
                  }}
                >
                  ↻ Reset
                </button>

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
                        marginTop: "var(--space-2)",
                      }}
                    >
                      {toast}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
