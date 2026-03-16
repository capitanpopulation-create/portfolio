"use client";

import { useRef, useEffect, useCallback } from "react";
import { createLines, updateLines, drawLines, type LineState } from "@/components/hero/hero-lines";
import { type CanvasSettings, getThemeColors, DEFAULT_SETTINGS } from "@/lib/canvas-settings";

interface MiniCanvasProps {
  settingsRef: React.RefObject<CanvasSettings>;
  isActive: boolean;
}

const MINI_SIZE = 100;
const MINI_LINE_COUNT = 30;
const CURSOR_SPEED = 0.8; // revolutions per second

export function MiniCanvas({ settingsRef, isActive }: MiniCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<LineState[]>([]);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const phaseRef = useRef(0);

  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
    lastTimeRef.current = timestamp;

    const s = settingsRef.current ?? DEFAULT_SETTINGS;
    const theme = getThemeColors(s.theme, s.mode);
    const dpr = window.devicePixelRatio || 1;

    // Recreate lines if count changed
    if (linesRef.current.length !== MINI_LINE_COUNT) {
      linesRef.current = createLines(MINI_SIZE, MINI_SIZE, MINI_LINE_COUNT);
    }

    // Auto-animate cursor in a figure-8 path
    phaseRef.current += dt * CURSOR_SPEED * Math.PI * 2;
    const t = phaseRef.current;
    const cx = MINI_SIZE / 2 + Math.sin(t) * (MINI_SIZE * 0.3);
    const cy = MINI_SIZE / 2 + Math.sin(t * 2) * (MINI_SIZE * 0.15);

    // Scale radius for mini canvas
    const miniRadius = 40 * s.radiusMultiplier;

    updateLines(
      linesRef.current,
      cx, cy,
      true,
      dt,
      miniRadius,
      1.0,
      MINI_SIZE,
      {
        maxThickness: s.maxThickness,
        lerpIn: s.lerpIn,
        lerpOut: s.lerpOut,
        maxLineHeight: s.maxLineHeight,
        glowIntensity: s.glowIntensity,
        lineColors: theme.lineColors,
        accentColor: theme.accentColor,
      }
    );

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawLines(ctx, linesRef.current, MINI_SIZE, dpr, s.glowIntensity, s.mode === "light");

    rafRef.current = requestAnimationFrame(animate);
  }, [settingsRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = MINI_SIZE * dpr;
    canvas.height = MINI_SIZE * dpr;
    canvas.style.width = `${MINI_SIZE}px`;
    canvas.style.height = `${MINI_SIZE}px`;

    linesRef.current = createLines(MINI_SIZE, MINI_SIZE, MINI_LINE_COUNT);
  }, []);

  useEffect(() => {
    if (isActive) {
      lastTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isActive, animate]);

  const s0 = settingsRef.current ?? DEFAULT_SETTINGS;
  const bgColor = getThemeColors(s0.theme, s0.mode).background;

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: MINI_SIZE,
        height: MINI_SIZE,
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-subtle)",
        backgroundColor: bgColor,
        flexShrink: 0,
      }}
    />
  );
}
