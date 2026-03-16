"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type CanvasSettings, type ThemeId, type ModeId, DEFAULT_SETTINGS, THEME_ACCENT_HEX, resetSettings, applyThemeVariables } from "@/lib/canvas-settings";
import { Slider } from "./Slider";
import { MiniCanvas } from "./MiniCanvas";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SectionId = "lines" | "brush" | "motion" | "glow";

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
          {/* Sun / Moon icons */}
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
// Accordion Section
// ---------------------------------------------------------------------------

function AccordionSection({
  id,
  label,
  summary,
  isOpen,
  onToggle,
  children,
}: {
  id: SectionId;
  label: string;
  summary: string;
  isOpen: boolean;
  onToggle: (id: SectionId) => void;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: "1px solid var(--border-muted)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center text-left transition-colors hover:bg-brown-500/5"
        style={{
          padding: "var(--space-3) var(--space-4)",
          transitionDuration: "var(--duration-fast)",
        }}
      >
        <motion.svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.15 }}
          style={{ flexShrink: 0 }}
        >
          <path
            d="M3 1L7 5L3 9"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brown-400"
          />
        </motion.svg>

        <span
          className="font-[family-name:var(--font-mono)] uppercase text-brown-300"
          style={{
            fontSize: "var(--text-xs)",
            letterSpacing: "0.12em",
            marginLeft: "var(--space-3)",
          }}
        >
          {label}
        </span>

        {!isOpen && (
          <span
            className="font-[family-name:var(--font-mono)] text-brown-500 ml-auto truncate"
            style={{
              fontSize: "10px",
              letterSpacing: "0.04em",
              maxWidth: "55%",
              paddingLeft: "var(--space-3)",
            }}
          >
            {summary}
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 var(--space-4) var(--space-4)" }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
// Settings Panel (main) — full-viewport overlay
// ---------------------------------------------------------------------------

export function SettingsPanel({ settingsRef }: SettingsPanelProps) {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("lines");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null);

  // Force re-render when settings change (for slider values)
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

  // Dispatch theme+mode change event and persist
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

  const toggleSection = useCallback((id: SectionId) => {
    setActiveSection((prev) => (prev === id ? prev : id));
  }, []);

  // Escape key to close + body scroll lock
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Cleanup toast timer
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

            {/* Panel — full viewport height */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 z-[60] flex flex-col pointer-events-auto w-full md:w-[420px]"
              style={{
                backgroundColor: "var(--surface-elevated)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderLeft: "1px solid var(--border-subtle)",
              }}
            >
              {/* ── Fixed Header ── */}
              <div
                style={{
                  padding: "var(--space-6) var(--space-5) var(--space-4)",
                  borderBottom: "1px solid var(--border-muted)",
                  flexShrink: 0,
                }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-5)" }}>
                  <span
                    className="font-[family-name:var(--font-mono)] uppercase text-brown-300"
                    style={{ fontSize: "var(--text-xs)", letterSpacing: "0.12em" }}
                  >
                    Canvas Settings
                  </span>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-brown-400 hover:text-accent-orange transition-colors"
                    style={{ transitionDuration: "var(--duration-normal)" }}
                    aria-label="Close settings"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <ThemeToggle active={s.theme} accent={accent} onChange={handleThemeChange} />
                  <ModeToggle active={s.mode} onChange={handleModeChange} />
                </div>
              </div>

              {/* ── Scrollable Middle — Accordion ── */}
              <div
                className="flex-1 overflow-y-auto"
                style={{
                  padding: "var(--space-4) var(--space-5)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-3)",
                }}
              >
                {/* LINES */}
                <AccordionSection
                  id="lines"
                  label="Lines"
                  summary={`${s.lineCount} lines · ${s.maxThickness}px`}
                  isOpen={activeSection === "lines"}
                  onToggle={toggleSection}
                >
                  <div className="flex" style={{ gap: "var(--space-4)" }}>
                    <MiniCanvas settingsRef={settingsRef} isActive={activeSection === "lines"} />
                    <div className="flex-1" style={{ minWidth: 0 }}>
                      <Slider
                        label="Count"
                        value={s.lineCount}
                        min={20}
                        max={120}
                        step={10}
                        unit=""
                        accentColor={accent}
                        onChange={(v) => update("lineCount", v)}
                      />
                      <Slider
                        label="Thickness"
                        value={s.maxThickness}
                        min={1}
                        max={12}
                        step={0.5}
                        unit=" px"
                        accentColor={accent}
                        onChange={(v) => update("maxThickness", v)}
                      />
                    </div>
                  </div>
                </AccordionSection>

                {/* BRUSH */}
                <AccordionSection
                  id="brush"
                  label="Brush"
                  summary={`${Math.round(s.radiusMultiplier * 100)}% · ${Math.round(s.velocitySmoothing * 100)}%`}
                  isOpen={activeSection === "brush"}
                  onToggle={toggleSection}
                >
                  <div className="flex" style={{ gap: "var(--space-4)" }}>
                    <MiniCanvas settingsRef={settingsRef} isActive={activeSection === "brush"} />
                    <div className="flex-1" style={{ minWidth: 0 }}>
                      <Slider
                        label="Radius"
                        value={Math.round(s.radiusMultiplier * 100)}
                        min={30}
                        max={250}
                        step={5}
                        unit="%"
                        accentColor={accent}
                        onChange={(v) => update("radiusMultiplier", v / 100)}
                      />
                      <Slider
                        label="Smoothing"
                        value={Math.round(s.velocitySmoothing * 100)}
                        min={10}
                        max={80}
                        step={5}
                        unit="%"
                        accentColor={accent}
                        onChange={(v) => update("velocitySmoothing", v / 100)}
                      />
                    </div>
                  </div>
                </AccordionSection>

                {/* MOTION */}
                <AccordionSection
                  id="motion"
                  label="Motion"
                  summary={`In ${s.lerpIn} · Out ${s.lerpOut} · Scroll ${Math.round(s.scrollSensitivity * 100)}%`}
                  isOpen={activeSection === "motion"}
                  onToggle={toggleSection}
                >
                  <div className="flex" style={{ gap: "var(--space-4)" }}>
                    <MiniCanvas settingsRef={settingsRef} isActive={activeSection === "motion"} />
                    <div className="flex-1" style={{ minWidth: 0 }}>
                      <Slider
                        label="Activation"
                        value={s.lerpIn}
                        min={2}
                        max={16}
                        step={1}
                        accentColor={accent}
                        onChange={(v) => update("lerpIn", v)}
                      />
                      <Slider
                        label="Trail"
                        value={s.lerpOut}
                        min={0.5}
                        max={8}
                        step={0.5}
                        accentColor={accent}
                        onChange={(v) => update("lerpOut", v)}
                      />
                      <Slider
                        label="Scroll"
                        value={Math.round(s.scrollSensitivity * 100)}
                        min={2}
                        max={40}
                        step={2}
                        unit="%"
                        accentColor={accent}
                        onChange={(v) => update("scrollSensitivity", v / 100)}
                      />
                    </div>
                  </div>
                </AccordionSection>

                {/* GLOW */}
                <AccordionSection
                  id="glow"
                  label="Glow"
                  summary={`${Math.round(s.glowIntensity * 100)}% · Height ${Math.round(s.maxLineHeight * 100)}%`}
                  isOpen={activeSection === "glow"}
                  onToggle={toggleSection}
                >
                  <div className="flex" style={{ gap: "var(--space-4)" }}>
                    <MiniCanvas settingsRef={settingsRef} isActive={activeSection === "glow"} />
                    <div className="flex-1" style={{ minWidth: 0 }}>
                      <Slider
                        label="Intensity"
                        value={Math.round(s.glowIntensity * 100)}
                        min={0}
                        max={100}
                        step={5}
                        unit="%"
                        accentColor={accent}
                        onChange={(v) => update("glowIntensity", v / 100)}
                      />
                      <Slider
                        label="Line Height"
                        value={Math.round(s.maxLineHeight * 100)}
                        min={20}
                        max={100}
                        step={5}
                        unit="%"
                        accentColor={accent}
                        onChange={(v) => update("maxLineHeight", v / 100)}
                      />
                    </div>
                  </div>
                </AccordionSection>
              </div>

              {/* ── Sticky Footer ── */}
              <div
                style={{
                  padding: "var(--space-4) var(--space-5)",
                  borderTop: "1px solid var(--border-muted)",
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={handleReset}
                  className="w-full font-[family-name:var(--font-mono)] uppercase text-brown-400 hover:text-accent-orange transition-colors"
                  style={{
                    fontSize: "var(--text-xs)",
                    letterSpacing: "0.12em",
                    padding: "var(--space-3) 0",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    transitionDuration: "var(--duration-normal)",
                  }}
                >
                  ↻ Reset to Defaults
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
                        marginTop: "var(--space-3)",
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
