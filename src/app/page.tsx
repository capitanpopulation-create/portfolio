"use client";

import { useRef } from "react";
import { HeroCanvas } from "@/components/hero/HeroCanvas";
import { LandingOverlay } from "@/components/landing/LandingOverlay";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import {
  type CanvasSettings,
  type ThemeId,
  type ModeId,
  DEFAULT_SETTINGS,
} from "@/lib/canvas-settings";

function getInitialSettings(): CanvasSettings {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };
  const validThemes: ThemeId[] = ["earth", "arctic", "kinetic"];
  const validModes: ModeId[] = ["light", "dark"];
  const theme = localStorage.getItem("theme") as ThemeId | null;
  const mode = localStorage.getItem("mode") as ModeId | null;
  return {
    ...DEFAULT_SETTINGS,
    theme: theme && validThemes.includes(theme) ? theme : DEFAULT_SETTINGS.theme,
    mode: mode && validModes.includes(mode) ? mode : DEFAULT_SETTINGS.mode,
  };
}

export default function Home() {
  const settingsRef = useRef<CanvasSettings>(getInitialSettings());

  return (
    <main className="h-screen overflow-hidden">
      <HeroCanvas settingsRef={settingsRef} />
      <LandingOverlay />
      <SettingsPanel settingsRef={settingsRef} />
    </main>
  );
}
