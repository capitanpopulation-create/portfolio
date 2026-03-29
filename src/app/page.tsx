"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { HeroCanvas } from "@/components/hero/HeroCanvas";
import { LandingOverlay } from "@/components/landing/LandingOverlay";
import { BottomPanel } from "@/components/settings/BottomPanel";
import {
  type CanvasSettings,
  type ThemeId,
  type ModeId,
  DEFAULT_SETTINGS,
  THEME_ACCENT_HEX,
  THEME_CONTRAST_HEX,
  getContrastText,
} from "@/lib/canvas-settings";

function getInitialSettings(): CanvasSettings {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };
  const validThemes: ThemeId[] = ["signal", "kinetic", "bamboo"];
  const validModes: ModeId[] = ["light", "dark"];
  const theme = localStorage.getItem("theme") as ThemeId | null;
  const mode = localStorage.getItem("mode") as ModeId | null;
  return {
    ...DEFAULT_SETTINGS,
    theme: theme && validThemes.includes(theme) ? theme : DEFAULT_SETTINGS.theme,
    mode: mode && validModes.includes(mode) ? mode : DEFAULT_SETTINGS.mode,
  };
}

function computeColors(theme: ThemeId, mode: ModeId) {
  const accent = THEME_ACCENT_HEX[theme][mode];
  const contrastText = THEME_CONTRAST_HEX[theme]?.[mode] ?? getContrastText(accent);
  return { accent, contrastText };
}

export default function Home() {
  const settingsRef = useRef<CanvasSettings>(getInitialSettings());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Force re-render after mount so client-side localStorage values take effect
  useEffect(() => {
    setMounted(true);
    const handleThemeChange = () => setMounted((m) => !m || true);
    window.addEventListener("themechange", handleThemeChange);
    return () => window.removeEventListener("themechange", handleThemeChange);
  }, []);

  // Use a key to force LandingOverlay to remount after hydration
  const [colorVersion, setColorVersion] = useState(0);
  useEffect(() => {
    setColorVersion(1);
    const handleThemeChange = () => setColorVersion((n) => n + 1);
    window.addEventListener("themechange", handleThemeChange);
    return () => window.removeEventListener("themechange", handleThemeChange);
  }, []);

  const toggleSettings = useCallback(() => {
    setSettingsOpen((prev) => !prev);
  }, []);

  const s = settingsRef.current;
  const { accent, contrastText } = computeColors(s.theme, s.mode);

  return (
    <main className="h-screen overflow-hidden">
      <HeroCanvas settingsRef={settingsRef} />
      <LandingOverlay
        key={colorVersion}
        accent={accent}
        contrastText={contrastText}
      />
      <BottomPanel
        settingsRef={settingsRef}
        isExpanded={settingsOpen}
        onToggle={toggleSettings}
      />
    </main>
  );
}
