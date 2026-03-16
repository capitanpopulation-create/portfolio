"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { HeroCanvas } from "@/components/hero/HeroCanvas";
import { LandingOverlay } from "@/components/landing/LandingOverlay";
import { FooterPanel } from "@/components/landing/FooterPanel";
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

const FOOTER_SCROLL_THRESHOLD = 300;

export default function Home() {
  const settingsRef = useRef<CanvasSettings>(getInitialSettings());
  const [showFooter, setShowFooter] = useState(false);
  const scrollDeltaRef = useRef(0);
  const showFooterRef = useRef(false);

  // Keep ref in sync with state to avoid stale closure
  useEffect(() => {
    showFooterRef.current = showFooter;
  }, [showFooter]);

  useEffect(() => {
    const handleScrollDelta = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        scrollDeltaRef.current += e.deltaY;
        if (scrollDeltaRef.current > FOOTER_SCROLL_THRESHOLD && !showFooterRef.current) {
          setShowFooter(true);
        }
      } else {
        scrollDeltaRef.current = Math.max(0, scrollDeltaRef.current + e.deltaY);
        if (scrollDeltaRef.current < FOOTER_SCROLL_THRESHOLD * 0.3 && showFooterRef.current) {
          setShowFooter(false);
        }
      }
    };

    window.addEventListener("wheel", handleScrollDelta, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleScrollDelta);
    };
  }, []);

  const dismissFooter = useCallback(() => {
    setShowFooter(false);
    scrollDeltaRef.current = 0;
  }, []);

  return (
    <main className="h-screen overflow-hidden">
      <HeroCanvas settingsRef={settingsRef} />
      <LandingOverlay />
      <SettingsPanel settingsRef={settingsRef} />
      <AnimatePresence>
        {showFooter && (
          <FooterPanel visible={showFooter} onDismiss={dismissFooter} />
        )}
      </AnimatePresence>
    </main>
  );
}
