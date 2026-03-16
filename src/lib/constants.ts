// === Color Palette (60-30-10) ===

export const BG_COLOR = "#1A1410";

/** Browns ordered far → near */
export const LINE_COLORS = [
  [147, 104, 70],   // #936846
  [175, 132, 98],   // #AF8462
  [215, 186, 157],  // #D7BA9D
] as const;

/** Orange accent (closest to cursor) */
export const ACCENT_COLOR: [number, number, number] = [232, 114, 42]; // #E8722A

// === Lines ===

export const LINE_COUNT = 120;
export const MAX_THICKNESS = 5;

// === Velocity → Radius mapping ===

/** Smoothing factor for velocity rolling average (0-1, higher = more responsive) */
export const VELOCITY_SMOOTHING = 0.35;

/** Velocity thresholds (px/frame at 60fps, ~px/16ms) */
export const VELOCITY_TIERS = {
  still:    1,    // below this = not moving
  gentle:   4,    // barely moving
  casual:   12,   // normal browsing
  fast:     30,   // sweeping
  erratic:  60,   // wild
} as const;

/** Radius at each velocity tier */
export const RADIUS_TIERS = {
  still:    0,
  gentle:   70,
  casual:   200,
  fast:     350,
  erratic:  500,
} as const;

/** How fast the radius responds to velocity changes */
export const RADIUS_LERP = 10; // per second

// === Line properties ===

export const MAX_LINE_HEIGHT = 0.8;  // fraction of viewport
export const MAX_OPACITY = 1.0;

// === Easing / decay ===

export const LERP_IN = 8;
export const LERP_OUT = 3;
export const HOLD_DURATION = 0.5; // seconds after cursor stops before fade

// === Scroll shape morphing ===

export const DEFAULT_ASPECT = 1.0;
export const MIN_ASPECT = 0.3;   // tall vertical diamond (scroll down hard)
export const MAX_ASPECT = 3.0;   // wide horizontal oval (scroll up hard)
export const SCROLL_SENSITIVITY = 0.12;
/** How fast aspect decays back to 1.0 (circle) */
export const ASPECT_DECAY = 1.5; // per second
export const ASPECT_LERP = 6;

// === Edge behaviors ===

/** Seconds of stillness before the "breathing" pulse */
export const STILL_PULSE_DELAY = 2.0;
export const STILL_PULSE_RADIUS = 50;
export const STILL_PULSE_DURATION = 1.5;

/** Re-entry bloom-in duration */
export const REENTRY_BLOOM_DURATION = 0.4;

// === Intro pulse ===

export const INTRO_PULSE_LINES = 5;
export const INTRO_PULSE_HEIGHT = 0.15;
export const INTRO_PULSE_DURATION = 2.5;

// === Glow ===

export const GLOW_BLUR = 10;
export const GLOW_OPACITY = 0.3;
