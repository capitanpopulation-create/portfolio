"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  HOLD_DURATION,
  INTRO_PULSE_LINES,
  INTRO_PULSE_HEIGHT,
  INTRO_PULSE_DURATION,
  DEFAULT_ASPECT,
  MIN_ASPECT,
  MAX_ASPECT,
  ASPECT_LERP,
  ASPECT_DECAY,
  VELOCITY_TIERS,
  RADIUS_TIERS,
  STILL_PULSE_DELAY,
  STILL_PULSE_RADIUS,
  STILL_PULSE_DURATION,
  REENTRY_BLOOM_DURATION,
} from "@/lib/constants";
import {
  createLines,
  repositionLines,
  updateLines,
  drawLines,
  drawConcentricShapes,
  updateRings,
  createRings,
  type LineState,
  type LineDynamicSettings,
  type RingState,
} from "./hero-lines";
import { type CanvasSettings, getThemeColors, DEFAULT_SETTINGS } from "@/lib/canvas-settings";

// ---------------------------------------------------------------------------
// Velocity → target radius interpolation (reads from settings)
// ---------------------------------------------------------------------------

const BASE_TIERS = [
  { v: VELOCITY_TIERS.still, r: RADIUS_TIERS.still },
  { v: VELOCITY_TIERS.gentle, r: RADIUS_TIERS.gentle },
  { v: VELOCITY_TIERS.casual, r: RADIUS_TIERS.casual },
  { v: VELOCITY_TIERS.fast, r: RADIUS_TIERS.fast },
  { v: VELOCITY_TIERS.erratic, r: RADIUS_TIERS.erratic },
];

function velocityToRadius(velocity: number, radiusMultiplier: number): number {
  if (velocity <= BASE_TIERS[0].v) return BASE_TIERS[0].r * radiusMultiplier;
  for (let i = 1; i < BASE_TIERS.length; i++) {
    if (velocity <= BASE_TIERS[i].v) {
      const t =
        (velocity - BASE_TIERS[i - 1].v) /
        (BASE_TIERS[i].v - BASE_TIERS[i - 1].v);
      const baseRadius = BASE_TIERS[i - 1].r + t * (BASE_TIERS[i].r - BASE_TIERS[i - 1].r);
      return baseRadius * radiusMultiplier;
    }
  }
  return BASE_TIERS[BASE_TIERS.length - 1].r * radiusMultiplier;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface HeroCanvasProps {
  settingsRef?: React.RefObject<CanvasSettings>;
}

export function HeroCanvas({ settingsRef }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const linesRef = useRef<LineState[]>([]);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Cursor state
  const cursorRef = useRef({ x: -9999, y: -9999 });
  const lastCursorRef = useRef({ x: -9999, y: -9999 });
  const lastMoveTimeRef = useRef(0);
  const isMovingRef = useRef(false);
  const cursorActiveRef = useRef(false);

  // Velocity tracking
  const smoothVelocityRef = useRef(0);
  const currentRadiusRef = useRef(0);
  const targetRadiusRef = useRef(0);

  // Scroll shape morphing
  const targetAspectRef = useRef(DEFAULT_ASPECT);
  const currentAspectRef = useRef(DEFAULT_ASPECT);

  // Still-pulse edge behavior
  const stillTimeRef = useRef(0);
  const stillPulsePhaseRef = useRef<"waiting" | "pulsing">("waiting");
  const stillPulseTimeRef = useRef(0);

  // Re-entry bloom
  const reentryTimeRef = useRef(0);
  const wasActiveRef = useRef(false);

  // Intro pulse state
  const introPhaseRef = useRef<"pulse" | "fade" | "done">("pulse");
  const introTimeRef = useRef(0);

  // Concentric ripple state (per-ring)
  const ringsRef = useRef<RingState[]>([]);
  const lastRingCountRef = useRef(0);

  // Track line count for recreation
  const lastLineCountRef = useRef(DEFAULT_SETTINGS.lineCount);

  // Helper to read current settings
  const getSettings = useCallback((): CanvasSettings => {
    return settingsRef?.current ?? DEFAULT_SETTINGS;
  }, [settingsRef]);

  // ---------------------------------------------------------------------------
  // Canvas setup
  // ---------------------------------------------------------------------------

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const s = getSettings();
    if (linesRef.current.length === 0) {
      linesRef.current = createLines(w, h, s.lineCount);
      lastLineCountRef.current = s.lineCount;
    } else {
      repositionLines(linesRef.current, w);
    }
  }, [getSettings]);

  // ---------------------------------------------------------------------------
  // Animation loop
  // ---------------------------------------------------------------------------

  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
    lastTimeRef.current = timestamp;

    const dpr = window.devicePixelRatio || 1;
    const h = window.innerHeight;
    const w = window.innerWidth;

    // Read current settings from ref (no re-render)
    const s = getSettings();
    const theme = getThemeColors(s.theme, s.mode);

    // Check if line count changed
    if (s.lineCount !== lastLineCountRef.current) {
      linesRef.current = createLines(w, h, s.lineCount);
      lastLineCountRef.current = s.lineCount;
    }

    const lines = linesRef.current;

    // Build dynamic settings for hero-lines functions
    const lineSettings: LineDynamicSettings = {
      maxThickness: s.maxThickness,
      lerpIn: s.lerpIn,
      lerpOut: s.lerpOut,
      maxLineHeight: s.maxLineHeight,
      glowIntensity: s.glowIntensity,
      lineColors: theme.lineColors,
      accentColor: theme.accentColor,
      shape: s.shape,
      angle: s.angle,
    };

    // === Scroll aspect decay toward circle ===
    const scrollSens = s.scrollSensitivity;
    const aspectDecayRate = ASPECT_DECAY * dt;
    targetAspectRef.current +=
      (DEFAULT_ASPECT - targetAspectRef.current) * Math.min(aspectDecayRate, 1);

    // Smooth current aspect toward target
    const aspectRate = ASPECT_LERP * dt;
    currentAspectRef.current +=
      (targetAspectRef.current - currentAspectRef.current) *
      Math.min(aspectRate, 1);

    // === Velocity tracking ===
    const dx = cursorRef.current.x - lastCursorRef.current.x;
    const dy = cursorRef.current.y - lastCursorRef.current.y;
    const displacement = Math.sqrt(dx * dx + dy * dy);

    const isSentinel =
      lastCursorRef.current.x < -9000 || lastCursorRef.current.y < -9000;

    const instantVelocity =
      isSentinel || dt <= 0 ? 0 : displacement / (60 * dt);

    const alpha = 1 - Math.pow(1 - s.velocitySmoothing, dt * 60);
    smoothVelocityRef.current +=
      (instantVelocity - smoothVelocityRef.current) * alpha;

    // === Movement detection ===
    if (displacement > 0.5 && !isSentinel) {
      lastMoveTimeRef.current = timestamp;
      isMovingRef.current = true;
      stillTimeRef.current = 0;
      stillPulsePhaseRef.current = "waiting";
      stillPulseTimeRef.current = 0;
    }

    if (timestamp - lastMoveTimeRef.current > HOLD_DURATION * 1000) {
      isMovingRef.current = false;
      if (cursorActiveRef.current) {
        stillTimeRef.current += dt;
      }
    }

    lastCursorRef.current = { ...cursorRef.current };

    // === Velocity → target radius ===
    if (isMovingRef.current) {
      targetRadiusRef.current = velocityToRadius(smoothVelocityRef.current, s.radiusMultiplier);
    } else {
      targetRadiusRef.current = 0;
    }

    // === Re-entry bloom ===
    if (cursorActiveRef.current && !wasActiveRef.current) {
      reentryTimeRef.current = REENTRY_BLOOM_DURATION;
    }
    wasActiveRef.current = cursorActiveRef.current;

    if (reentryTimeRef.current > 0) {
      reentryTimeRef.current -= dt;
    }

    // === Smooth radius interpolation ===
    const radiusRate = s.radiusLerp * dt;
    currentRadiusRef.current +=
      (targetRadiusRef.current - currentRadiusRef.current) *
      Math.min(radiusRate, 1);

    // === Still-pulse ("breathing") ===
    let stillPulseRadius = 0;

    if (
      cursorActiveRef.current &&
      !isMovingRef.current &&
      stillTimeRef.current > STILL_PULSE_DELAY
    ) {
      if (stillPulsePhaseRef.current === "waiting") {
        stillPulsePhaseRef.current = "pulsing";
        stillPulseTimeRef.current = 0;
      }
    }

    if (stillPulsePhaseRef.current === "pulsing") {
      stillPulseTimeRef.current += dt;
      const t = stillPulseTimeRef.current / STILL_PULSE_DURATION;
      if (t < 1) {
        stillPulseRadius = STILL_PULSE_RADIUS * Math.sin(t * Math.PI);
      } else {
        stillPulsePhaseRef.current = "waiting";
        stillTimeRef.current = STILL_PULSE_DELAY * 0.8;
      }
    }

    const effectiveRadius = Math.max(currentRadiusRef.current, stillPulseRadius);
    const effectiveMoving = isMovingRef.current || stillPulseRadius > 0;

    // === Intro pulse ===
    const totalLines = lines.length;

    if (introPhaseRef.current !== "done") {
      introTimeRef.current += dt;
      const t = introTimeRef.current;

      if (introPhaseRef.current === "pulse" && t < 0.6) {
        const centerIdx = Math.floor(totalLines / 2);
        const half = Math.floor(INTRO_PULSE_LINES / 2);
        for (let i = centerIdx - half; i <= centerIdx + half; i++) {
          if (i >= 0 && i < lines.length) {
            const dist = Math.abs(i - centerIdx) / half;
            const targetH = INTRO_PULSE_HEIGHT * (1 - dist * 0.5);
            const rate = 4 * dt;
            lines[i].height +=
              (targetH - lines[i].height) * Math.min(rate, 1);
            lines[i].opacity +=
              (0.4 * (1 - dist * 0.3) - lines[i].opacity) * Math.min(rate, 1);
            lines[i].thickness +=
              (2 - lines[i].thickness) * Math.min(rate, 1);
            lines[i].color = [...theme.lineColors[2]];
            lines[i].centerY = h / 2;
          }
        }
      } else if (introPhaseRef.current === "pulse") {
        introPhaseRef.current = "fade";
      }

      if (introPhaseRef.current === "fade") {
        let allFaded = true;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].opacity > 0.005) {
            const rate = s.lerpOut * dt;
            lines[i].height *= Math.max(1 - rate, 0);
            lines[i].opacity *= Math.max(1 - rate, 0);
            lines[i].thickness *= Math.max(1 - rate, 0);
            if (lines[i].opacity > 0.005) allFaded = false;
          }
        }
        if (allFaded || t > INTRO_PULSE_DURATION) {
          introPhaseRef.current = "done";
          for (let i = 0; i < lines.length; i++) {
            lines[i].height = 0;
            lines[i].opacity = 0;
            lines[i].thickness = 0;
          }
        }
      }
    } else if (cursorActiveRef.current || effectiveMoving) {
      updateLines(
        lines,
        cursorRef.current.x,
        cursorRef.current.y,
        effectiveMoving,
        dt,
        effectiveRadius,
        currentAspectRef.current,
        h,
        lineSettings
      );
    } else {
      updateLines(lines, -9999, -9999, false, dt, 0, currentAspectRef.current, h, lineSettings);
    }

    // === Update concentric rings (for non-line shapes) ===
    const isConcentricShape = s.shape !== "line";
    if (isConcentricShape) {
      // Recreate rings if count changed
      if (ringsRef.current.length !== s.lineCount || lastRingCountRef.current !== s.lineCount) {
        ringsRef.current = createRings(s.lineCount);
        lastRingCountRef.current = s.lineCount;
      }
      updateRings(
        ringsRef.current,
        cursorRef.current.x,
        cursorRef.current.y,
        (cursorActiveRef.current && effectiveMoving) || stillPulseRadius > 0,
        dt,
        effectiveRadius,
        lineSettings
      );
    }

    // === Draw ===
    // Fill with theme background (required for light mode)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isConcentricShape) {
      drawConcentricShapes(
        ctx,
        currentAspectRef.current,
        dpr,
        ringsRef.current,
        lineSettings,
        s.mode === "light"
      );
    } else {
      drawLines(ctx, lines, h, dpr, s.glowIntensity, s.mode === "light", s.shape, s.angle);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [getSettings]);

  // ---------------------------------------------------------------------------
  // Effects & event listeners
  // ---------------------------------------------------------------------------

  useEffect(() => {
    setupCanvas();

    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      cursorActiveRef.current = true;
    };

    const handleMouseLeave = () => {
      cursorActiveRef.current = false;
      isMovingRef.current = false;
    };

    const handleResize = () => setupCanvas();

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const s = getSettings();
      const delta = e.deltaY > 0 ? s.scrollSensitivity : -s.scrollSensitivity;
      targetAspectRef.current = Math.max(
        MIN_ASPECT,
        Math.min(MAX_ASPECT, targetAspectRef.current + delta)
      );
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        cursorRef.current = { x: touch.clientX, y: touch.clientY };
        cursorActiveRef.current = true;
        isMovingRef.current = true;
        lastMoveTimeRef.current = performance.now();
      }
    };

    const handleTouchEnd = () => {
      cursorActiveRef.current = false;
      isMovingRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(rafRef.current);
    };
  }, [setupCanvas, animate, getSettings]);

  return (
    <section
      ref={sectionRef}
      className="fixed inset-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </section>
  );
}
