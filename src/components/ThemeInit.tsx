"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { applyThemeVariables, type ThemeId, type ModeId } from "@/lib/canvas-settings";

const VALID_THEMES: ThemeId[] = ["earth", "arctic", "kinetic", "bamboo"];
const VALID_MODES: ModeId[] = ["light", "dark"];

function applyCurrentTheme() {
  let rawTheme = localStorage.getItem("theme");
  if (rawTheme === "ember") { rawTheme = "kinetic"; localStorage.setItem("theme", "kinetic"); }
  const theme = rawTheme as ThemeId | null;
  const rawMode = localStorage.getItem("mode") as ModeId | null;
  const mode: ModeId = rawMode && VALID_MODES.includes(rawMode) ? rawMode : "dark";

  if (theme && VALID_THEMES.includes(theme)) {
    applyThemeVariables(theme, mode);
  }
}

export function ThemeInit() {
  const pathname = usePathname();

  // Apply theme on mount
  useEffect(() => {
    applyCurrentTheme();

    const handleThemeChange = (e: CustomEvent<{ theme: ThemeId; mode: ModeId }>) => {
      const { theme: t, mode: m } = e.detail;
      if (VALID_THEMES.includes(t) && VALID_MODES.includes(m)) {
        applyThemeVariables(t, m);
      }
    };

    window.addEventListener("themechange", handleThemeChange as EventListener);
    return () => window.removeEventListener("themechange", handleThemeChange as EventListener);
  }, []);

  // Re-apply on route change so force-light elements get themed
  useEffect(() => {
    applyCurrentTheme();
  }, [pathname]);

  return null;
}
