import { LINE_COUNT, MAX_THICKNESS, LINE_COLORS, ACCENT_COLOR, MAX_LINE_HEIGHT, MAX_OPACITY, LERP_IN, LERP_OUT, GLOW_OPACITY, GLOW_BLUR } from "@/lib/constants";

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

function getColor(proximity: number, lineColors: [number, number, number][], accentColor: [number, number, number]): [number, number, number] {
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

export function drawLines(
  ctx: CanvasRenderingContext2D,
  lines: LineState[],
  viewportHeight: number,
  dpr: number,
  glowIntensity?: number,
  isLightMode?: boolean
) {
  const glowOpacity = glowIntensity ?? GLOW_OPACITY;
  // On light backgrounds, use multiply blend and reduce glow so colors stay rich
  const lightGlowFactor = isLightMode ? 0.5 : 1;

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
      ctx.ellipse(x, cy, w * 1.5, h / 2, 0, 0, Math.PI * 2);
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
    ctx.ellipse(x, cy, w, h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
