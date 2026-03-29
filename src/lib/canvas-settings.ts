// ============================================================================
// Canvas Settings — Types, defaults, and color themes
// ============================================================================

export type ThemeId = "signal" | "kinetic" | "bamboo";
export type ModeId = "light" | "dark";
export type ShapeId = "line" | "circle" | "diamond";

export interface ThemeColors {
  background: string;
  lineColors: [number, number, number][];
  accentColor: [number, number, number];
}

export interface CanvasSettings {
  lineCount: number;
  maxThickness: number;
  radiusMultiplier: number;
  velocitySmoothing: number;
  radiusLerp: number;
  lerpIn: number;
  lerpOut: number;
  scrollSensitivity: number;
  glowIntensity: number;
  maxLineHeight: number;
  shape: ShapeId;
  angle: number;
  theme: ThemeId;
  mode: ModeId;
}

// ---------------------------------------------------------------------------
// Canvas Themes (line colors for the kinetic art)
// ---------------------------------------------------------------------------

export const THEMES: Record<ThemeId, Record<ModeId, ThemeColors>> = {
  // Signal — dark navy base, warm gold accent (60-30-10)
  // 60% deep navy bg, 30% warm neutrals/slate lines, 10% gold pop
  signal: {
    dark: {
      background: "#0D1117",
      lineColors: [
        [82, 82, 100],    // #525264 — muted slate (far)
        [140, 130, 110],  // #8C826E — warm mid-tone
        [210, 195, 155],  // #D2C39B — warm light (near)
      ],
      accentColor: [239, 170, 19], // #EFAA13 — bright gold
    },
    light: {
      background: "#F5F2EC",
      lineColors: [
        [200, 165, 60],   // #C8A53C — muted warm gold (far)
        [220, 175, 40],   // #DCAF28 — mid gold (mid)
        [239, 170, 19],   // #EFAA13 — bright gold (near)
      ],
      accentColor: [239, 170, 19], // #EFAA13 — gold accent
    },
  },
  kinetic: {
    dark: {
      background: "#0C0A0A",
      lineColors: [
        [0, 114, 177],   // #0072B1  blue
        [244, 243, 84],  // #F4F354  yellow
        [239, 6, 19],    // #EF0613  red
      ],
      accentColor: [255, 32, 32], // #FF2020 — bright red, 5.15:1 on dark
    },
    light: {
      background: "#F5F2EE",
      lineColors: [
        [0, 90, 150],    // deeper blue for light bg
        [200, 195, 30],  // deeper yellow
        [200, 5, 15],    // deeper red
      ],
      accentColor: [210, 10, 10],
    },
  },
  bamboo: {
    dark: {
      background: "#001F24",
      lineColors: [
        [29, 61, 76],      // #1D3D4C — dark teal
        [72, 90, 117],     // #485A75 — slate blue
        [186, 149, 183],   // #BA95B7 — mauve
      ],
      accentColor: [245, 181, 203], // #F5B5CB — soft pink
    },
    light: {
      background: "#F5F0F3",
      lineColors: [
        [20, 45, 58],
        [50, 65, 90],
        [140, 110, 138],
      ],
      accentColor: [154, 80, 120], // #9A5078 — deeper pink for WCAG on light
    },
  },
};

// ---------------------------------------------------------------------------
// Accent hex per theme+mode (for UI elements like slider fills)
// ---------------------------------------------------------------------------

export const THEME_ACCENT_HEX: Record<ThemeId, Record<ModeId, string>> = {
  signal:  { dark: "#EFAA13", light: "#EFAA13" },
  kinetic: { dark: "#4D94F7", light: "#1D4ED8" },
  bamboo:  { dark: "#F5B5CB", light: "#9A5078" },
};

// Optional override for contrast text on accent-colored surfaces
// (null = use auto-calculated getContrastText)
export const THEME_CONTRAST_HEX: Record<ThemeId, Record<ModeId, string | null>> = {
  signal:  { dark: null, light: "#043245" },
  kinetic: { dark: null, light: null },
  bamboo:  { dark: null, light: null },
};

// ---------------------------------------------------------------------------
// Full UI color palettes (applied as CSS custom properties)
// ---------------------------------------------------------------------------

interface UITheme {
  "--background": string;
  "--foreground": string;
  "--limestone": string;
  "--brown-100": string;
  "--brown-200": string;
  "--brown-300": string;
  "--brown-400": string;
  "--brown-500": string;
  "--brown-600": string;
  "--jp-brown": string;
  "--jp-dark-brown": string;
  "--accent-orange": string;
  "--nav-surface": string;
  "--surface-elevated": string;
  "--border-subtle": string;
  "--border-muted": string;
  "--border-interactive": string;
  "--shadow-image": string;
}

export const UI_THEMES: Record<ThemeId, Record<ModeId, UITheme>> = {
  signal: {
    dark: {
      "--background": "#0D1117",
      "--foreground": "#F0EBE0",
      "--limestone": "#FAF6EE",
      "--brown-100": "#E8DFD0",
      "--brown-200": "#D2C39B",
      "--brown-300": "#B4A880",
      "--brown-400": "#8C826E",
      "--brown-500": "#626058",
      "--brown-600": "#3A3835",
      "--jp-brown": "#161820",
      "--jp-dark-brown": "#0A0C12",
      "--accent-orange": "#EFAA13",
      "--nav-surface": "rgba(13, 17, 23, 0.92)",
      "--surface-elevated": "rgba(18, 22, 30, 0.70)",
      "--border-subtle": "rgba(210, 195, 155, 0.15)",
      "--border-muted": "rgba(210, 195, 155, 0.1)",
      "--border-interactive": "rgba(210, 195, 155, 0.2)",
      "--shadow-image": "0 32px 80px -20px rgba(0,0,0,0.3)",
    },
    light: {
      "--background": "#F5F2EC",
      "--foreground": "#0D1117",
      "--limestone": "#0D1117",
      "--brown-100": "#1A1C22",
      "--brown-200": "#2E3038",
      "--brown-300": "#4A4840",
      "--brown-400": "#6E6A5E",
      "--brown-500": "#A09880",
      "--brown-600": "#C8C0B0",
      "--jp-brown": "#E8E2D8",
      "--jp-dark-brown": "#F0ECE4",
      "--accent-orange": "#EFAA13",
      "--nav-surface": "rgba(245, 242, 236, 0.92)",
      "--surface-elevated": "rgba(255, 252, 245, 0.70)",
      "--border-subtle": "rgba(30, 25, 15, 0.12)",
      "--border-muted": "rgba(30, 25, 15, 0.08)",
      "--border-interactive": "rgba(30, 25, 15, 0.18)",
      "--shadow-image": "0 24px 64px -16px rgba(0,0,0,0.1)",
    },
  },
  kinetic: {
    dark: {
      "--background": "#0C0A0A",
      "--foreground": "#F0ECEA",
      "--limestone": "#FAF8F6",
      "--brown-100": "#E8E0DA",
      "--brown-200": "#C8BCB2",
      "--brown-300": "#A89890",
      "--brown-400": "#887870",
      "--brown-500": "#685850",
      "--brown-600": "#4A3C36",
      "--jp-brown": "#1A1210",
      "--jp-dark-brown": "#0C0808",
      "--accent-orange": "#4D94F7",
      "--nav-surface": "rgba(12, 10, 10, 0.92)",
      "--surface-elevated": "rgba(18, 14, 14, 0.60)",
      "--border-subtle": "rgba(168, 152, 144, 0.15)",
      "--border-muted": "rgba(168, 152, 144, 0.1)",
      "--border-interactive": "rgba(168, 152, 144, 0.2)",
      "--shadow-image": "0 32px 80px -20px rgba(0,0,0,0.3)",
    },
    light: {
      "--background": "#F5F2EE",
      "--foreground": "#0C0A0A",
      "--limestone": "#0C0A0A",
      "--brown-100": "#1A1412",
      "--brown-200": "#302824",
      "--brown-300": "#504440",
      "--brown-400": "#786860",
      "--brown-500": "#A09488",
      "--brown-600": "#C4B8B0",
      "--jp-brown": "#E8E0D8",
      "--jp-dark-brown": "#F0EAE4",
      "--accent-orange": "#1D4ED8",
      "--nav-surface": "rgba(245, 242, 238, 0.92)",
      "--surface-elevated": "rgba(255, 252, 248, 0.70)",
      "--border-subtle": "rgba(40, 20, 10, 0.12)",
      "--border-muted": "rgba(40, 20, 10, 0.08)",
      "--border-interactive": "rgba(40, 20, 10, 0.18)",
      "--shadow-image": "0 24px 64px -16px rgba(0,0,0,0.1)",
    },
  },
  bamboo: {
    dark: {
      "--background": "#001F24",
      "--foreground": "#F0E8EC",
      "--limestone": "#F5F0F3",
      "--brown-100": "#F5B5CB",
      "--brown-200": "#BA95B7",
      "--brown-300": "#7F779A",
      "--brown-400": "#485A75",
      "--brown-500": "#1D3D4C",
      "--brown-600": "#0A2E35",
      "--jp-brown": "#001A1E",
      "--jp-dark-brown": "#001216",
      "--accent-orange": "#F5B5CB",
      "--nav-surface": "rgba(0, 31, 36, 0.92)",
      "--surface-elevated": "rgba(0, 38, 44, 0.70)",
      "--border-subtle": "rgba(186, 149, 183, 0.15)",
      "--border-muted": "rgba(186, 149, 183, 0.1)",
      "--border-interactive": "rgba(186, 149, 183, 0.2)",
      "--shadow-image": "0 32px 80px -20px rgba(0,0,0,0.3)",
    },
    light: {
      "--background": "#F5F0F3",
      "--foreground": "#001F24",
      "--limestone": "#001F24",
      "--brown-100": "#0A2E35",
      "--brown-200": "#1D3D4C",
      "--brown-300": "#485A75",
      "--brown-400": "#7F779A",
      "--brown-500": "#BA95B7",
      "--brown-600": "#D4C0D0",
      "--jp-brown": "#EAE0E6",
      "--jp-dark-brown": "#F0EAF0",
      "--accent-orange": "#9A5078",
      "--nav-surface": "rgba(245, 240, 243, 0.92)",
      "--surface-elevated": "rgba(255, 250, 252, 0.70)",
      "--border-subtle": "rgba(0, 31, 36, 0.12)",
      "--border-muted": "rgba(0, 31, 36, 0.08)",
      "--border-interactive": "rgba(0, 31, 36, 0.18)",
      "--shadow-image": "0 24px 64px -16px rgba(0,0,0,0.1)",
    },
  },
};

/** Apply theme + mode CSS variables to the document root */
export function applyThemeVariables(theme: ThemeId, mode: ModeId): void {
  const vars = UI_THEMES[theme][mode];
  const root = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }

}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

export const DEFAULT_SETTINGS: CanvasSettings = {
  lineCount: 60,
  maxThickness: 5,
  radiusMultiplier: 1.0,
  velocitySmoothing: 0.35,
  radiusLerp: 10,
  lerpIn: 8,
  lerpOut: 3,
  scrollSensitivity: 0.12,
  glowIntensity: 0.3,
  maxLineHeight: 0.8,
  shape: "line",
  angle: 0,
  theme: "signal",
  mode: "dark",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns "#000000" or "#FFFFFF" based on which has better contrast with the given hex color */
export function getContrastText(hex: string): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  const toLinear = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return luminance > 0.4 ? "#000000" : "#FFFFFF";
}

export function getThemeColors(theme: ThemeId, mode: ModeId): ThemeColors {
  return THEMES[theme][mode];
}

export function resetSettings(target: CanvasSettings): void {
  Object.assign(target, DEFAULT_SETTINGS);
}
