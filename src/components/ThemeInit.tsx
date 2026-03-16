"use client";

import { useEffect } from "react";
import { applyThemeVariables, type ThemeId, type ModeId } from "@/lib/canvas-settings";

const VALID_THEMES: ThemeId[] = ["earth", "arctic", "kinetic"];
const VALID_MODES: ModeId[] = ["light", "dark"];

export function ThemeInit() {
  useEffect(() => {
    // Read raw string first so "ember" migration works before type narrowing
    let rawTheme = localStorage.getItem("theme");
    if (rawTheme === "ember") { rawTheme = "kinetic"; localStorage.setItem("theme", "kinetic"); }
    const theme = rawTheme as ThemeId | null;
    const rawMode = localStorage.getItem("mode") as ModeId | null;
    const mode: ModeId = rawMode && VALID_MODES.includes(rawMode) ? rawMode : "dark";

    if (theme && VALID_THEMES.includes(theme)) {
      applyThemeVariables(theme, mode);
    }

    const handleThemeChange = (e: CustomEvent<{ theme: ThemeId; mode: ModeId }>) => {
      const { theme: t, mode: m } = e.detail;
      if (VALID_THEMES.includes(t) && VALID_MODES.includes(m)) {
        applyThemeVariables(t, m);
      }
    };

    window.addEventListener("themechange", handleThemeChange as EventListener);
    return () => window.removeEventListener("themechange", handleThemeChange as EventListener);
  }, []);

  return null;
}
