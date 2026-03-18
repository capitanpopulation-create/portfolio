import { LINE_COUNT, MAX_THICKNESS, LINE_COLORS, ACCENT_COLOR, MAX_LINE_HEIGHT, MAX_OPACITY, LERP_IN, LERP_OUT, GLOW_OPACITY, GLOW_BLUR, MIN_RING_RADIUS } from "@/lib/constants";
import type { ShapeId } from "@/lib/canvas-settings";

export interface LineState {
  x: number;
  height: number;
  thickness: number;
  opacity: number;
  color: [number, number, number];
  centerY: number;
}

/** Settings that can be passed to override static constants */
export interface LineDynamicSettings {
  maxThickness: number;
  lerpIn: number;
  lerpOut: number;
  maxLineHeight: number;
  glowIntensity: number;
  lineColors: [number, number, number][];
  accentColor: [number, number, number];
  shape: ShapeId;
  angle: number;
}

/** Default settings from static constants (used when no dynamic settings provided) */
const STATIC_DEFAULTS: LineDynamicSettings = {
  maxThickness: MAX_THICKNESS,
  lerpIn: LERP_IN,
  lerpOut: LERP_OUT,
  maxLineHeight: MAX_LINE_HEIGHT,
  glowIntensity: GLOW_OPACITY,
  lineColors: LINE_COLORS.map((c) => [...c] as [number, number, number]),
  accentColor: [...ACCENT_COLOR],
  shape: "line",
  angle: 0,
};

export function createLines(viewportWidth: number, viewportHeight: number, lineCount?: number): LineState[] {
  const count = lineCount ?? LINE_COUNT;
  const lines: LineState[] = [];
  const spacing = viewportWidth / (count + 1);
  for (let i = 0; i < count; i++) {
    lines.push({
      x: spacing * (i + 1),
      height: 0,
      thickness: 0,
      opacity: 0,
      color: [0, 0, 0],
      centerY: viewportHeight / 2,
    });
  }
  return lines;
}

export function repositionLines(lines: LineState[], viewportWidth: number) {
  const spacing = viewportWidth / (lines.length + 1);
  for (let i = 0; i < lines.length; i++) {
    lines[i].x = spacing * (i + 1);
  }
}

export function getColor(proximity: number, lineColors: [number, number, number][], accentColor: [number, number, number]): [number, number, number] {
  if (proximity < 0.6) {
    const t = proximity / 0.6;
    return [
      lineColors[0][0] + (lineColors[1][0] - lineColors[0][0]) * t,
      lineColors[0][1] + (lineColors[1][1] - lineColors[0][1]) * t,
      lineColors[0][2] + (lineColors[1][2] - lineColors[0][2]) * t,
    ];
  }
  const t = (proximity - 0.6) / 0.4;
  const from = lineColors[lineColors.length - 1];
  return [
    from[0] + (accentColor[0] - from[0]) * t,
    from[1] + (accentColor[1] - from[1]) * t,
    from[2] + (accentColor[2] - from[2]) * t,
  ];
}

export function updateLines(
  lines: LineState[],
  cursorX: number,
  cursorY: number,
  isMoving: boolean,
  dt: number,
  currentRadius: number,
  aspect: number,
  viewportHeight: number,
  settings?: LineDynamicSettings
) {
  const s = settings ?? STATIC_DEFAULTS;
  const xRadius = currentRadius * Math.sqrt(aspect);
  const yRadius = currentRadius / Math.sqrt(aspect);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const dx = line.x - cursorX;
    const nx = xRadius > 0 ? dx / xRadius : 999;
    const ellipDist = Math.abs(nx);

    if (isMoving && ellipDist < 1 && currentRadius > 0) {
      const maxDy = yRadius * Math.sqrt(1 - nx * nx);

      const hProximity = 1 - Math.abs(nx);
      const eased = hProximity * hProximity;

      const targetHeight = Math.min((maxDy * 2) / viewportHeight, s.maxLineHeight);
      const targetThickness = eased * s.maxThickness;
      const targetOpacity = Math.min(0.15 + eased * 0.85, MAX_OPACITY);
      const targetColor = getColor(eased, s.lineColors, s.accentColor);

      const centerRate = s.lerpIn * 0.6 * dt;
      line.centerY += (cursorY - line.centerY) * Math.min(centerRate, 1);

      const rate = s.lerpIn * dt;
      line.height += (targetHeight - line.height) * Math.min(rate, 1);
      line.thickness += (targetThickness - line.thickness) * Math.min(rate, 1);
      line.opacity += (targetOpacity - line.opacity) * Math.min(rate, 1);
      line.color[0] += (targetColor[0] - line.color[0]) * Math.min(rate, 1);
      line.color[1] += (targetColor[1] - line.color[1]) * Math.min(rate, 1);
      line.color[2] += (targetColor[2] - line.color[2]) * Math.min(rate, 1);
    } else {
      const rate = s.lerpOut * dt;
      line.height *= Math.max(1 - rate, 0);
      line.thickness *= Math.max(1 - rate, 0);
      line.opacity *= Math.max(1 - rate, 0);

      if (line.opacity < 0.005) {
        line.height = 0;
        line.thickness = 0;
        line.opacity = 0;
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Shape drawing helper
// ---------------------------------------------------------------------------

function drawShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  cy: number,
  w: number,
  h: number,
  shape: ShapeId,
  angleRad: number
) {
  switch (shape) {
    case "line":
      // Vertical ellipse with optional rotation
      ctx.ellipse(x, cy, w, h / 2, angleRad, 0, Math.PI * 2);
      break;

    case "circle": {
      // True circle — radius is the average of w and h/2
      const radius = Math.max(w, h / 2) * 0.6;
      ctx.ellipse(x, cy, radius, radius, 0, 0, Math.PI * 2);
      break;
    }

    case "diamond": {
      // Diamond = square rotated 45° + user angle
      const s = Math.max(w, h / 2) * 0.5;
      ctx.save();
      ctx.translate(x, cy);
      ctx.rotate(angleRad + Math.PI / 4);
      ctx.rect(-s, -s, s * 2, s * 2);
      ctx.restore();
      break;
    }
  }
}

export function drawLines(
  ctx: CanvasRenderingContext2D,
  lines: LineState[],
  viewportHeight: number,
  dpr: number,
  glowIntensity?: number,
  isLightMode?: boolean,
  shape?: ShapeId,
  angle?: number
) {
  const glowOpacity = glowIntensity ?? GLOW_OPACITY;
  const lightGlowFactor = isLightMode ? 0.5 : 1;
  const activeShape = shape ?? "line";
  const angleRad = ((angle ?? 0) * Math.PI) / 180;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.opacity < 0.005) continue;

    const h = line.height * viewportHeight * dpr;
    const w = Math.max(line.thickness * dpr, 0.5);
    const x = line.x * dpr;
    const cy = line.centerY * dpr;

    const r = Math.round(line.color[0]);
    const g = Math.round(line.color[1]);
    const b = Math.round(line.color[2]);

    // Glow pass
    if (glowOpacity > 0) {
      ctx.save();
      if (isLightMode) ctx.globalCompositeOperation = "multiply";
      ctx.filter = `blur(${GLOW_BLUR * dpr}px)`;
      ctx.globalAlpha = line.opacity * glowOpacity * lightGlowFactor;
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.beginPath();
      drawShape(ctx, x, cy, w * 1.5, h, activeShape, angleRad);
      ctx.fill();
      ctx.restore();
    }

    // Sharp pass with gradient
    ctx.save();
    if (isLightMode) ctx.globalCompositeOperation = "multiply";
    const gradient = ctx.createLinearGradient(x, cy - h / 2, x, cy + h / 2);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
    gradient.addColorStop(0.15, `rgba(${r}, ${g}, ${b}, ${line.opacity * 0.6})`);
    gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${line.opacity})`);
    gradient.addColorStop(0.85, `rgba(${r}, ${g}, ${b}, ${line.opacity * 0.6})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    drawShape(ctx, x, cy, w, h, activeShape, angleRad);
    ctx.fill();
    ctx.restore();
  }
}

// ---------------------------------------------------------------------------
// Concentric ripple shapes — per-ring animated state (stroke outlines)
// ---------------------------------------------------------------------------

export interface RingState {
  centerX: number;     // per-ring center that lags behind cursor
  centerY: number;
  radius: number;
  opacity: number;
  strokeWidth: number;
  color: [number, number, number];
  phase: number;       // oscillation phase offset (radians)
}

export function createRings(count: number): RingState[] {
  const rings: RingState[] = [];
  for (let i = 0; i < count; i++) {
    rings.push({
      centerX: -9999, centerY: -9999,
      radius: 0, opacity: 0, strokeWidth: 0,
      color: [0, 0, 0],
      phase: (i / count) * Math.PI * 2,  // evenly offset phases
    });
  }
  return rings;
}

/** Minimum outer spread so rings are well-spaced even during gentle movement */
const MIN_SPREAD = 300;

/** Global time accumulator for oscillation */
let _ringTime = 0;

export function updateRings(
  rings: RingState[],
  cursorX: number,
  cursorY: number,
  isActive: boolean,
  dt: number,
  effectiveRadius: number,
  settings?: LineDynamicSettings
) {
  const s = settings ?? STATIC_DEFAULTS;
  const count = rings.length;
  if (count === 0) return;

  _ringTime += dt;

  const maxRadius = Math.max(effectiveRadius, MIN_SPREAD);

  for (let i = 0; i < count; i++) {
    const ring = rings[i];
    // t: 0 = innermost, 1 = outermost
    const t = count > 1 ? i / (count - 1) : 0;

    if (isActive) {
      // === Per-ring center: inner rings track cursor tightly, outer rings lag ===
      const centerRate = s.lerpIn * (1.5 - t * 1.2) * dt;
      const clampedCenterRate = Math.min(centerRate, 1);

      if (ring.centerX < -9000) {
        // First activation — snap to cursor
        ring.centerX = cursorX;
        ring.centerY = cursorY;
      } else {
        ring.centerX += (cursorX - ring.centerX) * clampedCenterRate;
        ring.centerY += (cursorY - ring.centerY) * clampedCenterRate;
      }

      // === Oscillation: subtle breathing on radius ===
      const oscillation = 1 + Math.sin(_ringTime * 2.5 + ring.phase) * 0.08;

      // Compute targets — exponential spacing: inner rings tight, outer rings spread
      const expT = t * t;  // quadratic growth: gaps widen outward
      const baseRadius = MIN_RING_RADIUS + expT * (maxRadius - MIN_RING_RADIUS);
      const targetRadius = baseRadius * oscillation;
      const proximity = 1 - t;
      const targetOpacity = Math.pow(proximity, 1.5) * Math.min(0.15 + proximity * 0.85, MAX_OPACITY);
      // Stroke: innermost is thickest, outermost is thinnest
      const targetStrokeWidth = s.maxThickness * Math.max(1 - t * 0.85, 0.15);
      const targetColor = getColor(proximity, s.lineColors, s.accentColor);

      // Staggered lerp: inner rings respond faster, outer rings lag
      const rate = s.lerpIn * (0.5 + (1 - t) * 1.0) * dt;
      const clampedRate = Math.min(rate, 1);

      ring.radius += (targetRadius - ring.radius) * clampedRate;
      ring.opacity += (targetOpacity - ring.opacity) * clampedRate;
      ring.strokeWidth += (targetStrokeWidth - ring.strokeWidth) * clampedRate;
      ring.color[0] += (targetColor[0] - ring.color[0]) * clampedRate;
      ring.color[1] += (targetColor[1] - ring.color[1]) * clampedRate;
      ring.color[2] += (targetColor[2] - ring.color[2]) * clampedRate;
    } else {
      // Decay toward zero — outer rings fade first (reverse stagger)
      const rate = s.lerpOut * (0.5 + t * 1.0) * dt;
      const decay = Math.max(1 - rate, 0);

      ring.radius *= decay;
      ring.opacity *= decay;
      ring.strokeWidth *= decay;

      // Centers drift slowly away
      ring.centerX += (ring.centerX > 0 ? 1 : -1) * dt * 5;
      ring.centerY += (ring.centerY > 0 ? 1 : -1) * dt * 5;

      if (ring.opacity < 0.005) {
        ring.radius = 0;
        ring.opacity = 0;
        ring.strokeWidth = 0;
      }
    }
  }
}

function strokeRingShape(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  sizeX: number,
  sizeY: number,
  shape: ShapeId,
  angleRad: number
) {
  switch (shape) {
    case "circle":
      ctx.ellipse(cx, cy, sizeX, sizeY, 0, 0, Math.PI * 2);
      break;

    case "diamond": {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angleRad + Math.PI / 4);
      const s = Math.max(sizeX, sizeY) * 0.7;
      ctx.rect(-s, -s, s * 2, s * 2);
      ctx.restore();
      break;
    }

    default:
      ctx.ellipse(cx, cy, sizeX, sizeY, 0, 0, Math.PI * 2);
      break;
  }
}

export function drawConcentricShapes(
  ctx: CanvasRenderingContext2D,
  aspect: number,
  dpr: number,
  rings: RingState[],
  settings: LineDynamicSettings,
  isLightMode: boolean
) {
  const glowOpacity = settings.glowIntensity;
  const lightGlowFactor = isLightMode ? 0.5 : 1;
  const angleRad = (settings.angle * Math.PI) / 180;

  for (let i = 0; i < rings.length; i++) {
    const ring = rings[i];
    if (ring.opacity < 0.005) continue;

    // Each ring has its own lagging center
    const cx = ring.centerX * dpr;
    const cy = ring.centerY * dpr;

    const rx = ring.radius * dpr * Math.sqrt(aspect);
    const ry = ring.radius * dpr / Math.sqrt(aspect);
    if (rx < 0.5 && ry < 0.5) continue;

    const r = Math.round(ring.color[0]);
    const g = Math.round(ring.color[1]);
    const b = Math.round(ring.color[2]);
    const sw = Math.max(ring.strokeWidth * dpr, 0.5);

    // Glow pass
    if (glowOpacity > 0) {
      ctx.save();
      if (isLightMode) ctx.globalCompositeOperation = "multiply";
      ctx.filter = `blur(${GLOW_BLUR * dpr}px)`;
      ctx.globalAlpha = ring.opacity * glowOpacity * lightGlowFactor;
      ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.lineWidth = sw * 1.5;
      ctx.beginPath();
      strokeRingShape(ctx, cx, cy, rx, ry, settings.shape, angleRad);
      ctx.stroke();
      ctx.restore();
    }

    // Sharp pass
    ctx.save();
    if (isLightMode) ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = ring.opacity;
    ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.lineWidth = sw;
    ctx.beginPath();
    strokeRingShape(ctx, cx, cy, rx, ry, settings.shape, angleRad);
    ctx.stroke();
    ctx.restore();
  }
}
