// ============================================================================
// Canvas Settings — Types, defaults, and color themes
// ============================================================================

export type ThemeId = "earth" | "arctic" | "kinetic";
export type ModeId = "light" | "dark";

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
  theme: ThemeId;
  mode: ModeId;
}

// ---------------------------------------------------------------------------
// Canvas Themes (line colors for the kinetic art)
// ---------------------------------------------------------------------------

export const THEMES: Record<ThemeId, Record<ModeId, ThemeColors>> = {
  earth: {
    dark: {
      background: "#1A1410",
      lineColors: [
        [147, 104, 70],  // #936846
        [175, 132, 98],  // #AF8462
        [215, 186, 157], // #D7BA9D
      ],
      accentColor: [232, 114, 42], // #E8722A
    },
    light: {
      background: "#F5F0EB",
      lineColors: [
        [120, 80, 50],   // darker brown for light bg
        [150, 105, 70],
        [180, 140, 100],
      ],
      accentColor: [210, 95, 30], // #D25F1E — darker for WCAG on light
    },
  },
  arctic: {
    dark: {
      background: "#0B1420",
      lineColors: [
        [74, 107, 138],  // #4A6B8A
        [107, 157, 194], // #6B9DC2
        [168, 212, 240], // #A8D4F0
      ],
      accentColor: [59, 130, 246], // #3B82F6
    },
    light: {
      background: "#EDF3FA",
      lineColors: [
        [40, 70, 110],
        [60, 100, 150],
        [90, 140, 190],
      ],
      accentColor: [37, 99, 210], // #2563D2 — darker blue for WCAG
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
      accentColor: [255, 20, 20], // bright red center
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
};

// ---------------------------------------------------------------------------
// Accent hex per theme+mode (for UI elements like slider fills)
// ---------------------------------------------------------------------------

export const THEME_ACCENT_HEX: Record<ThemeId, Record<ModeId, string>> = {
  earth:   { dark: "#E8722A", light: "#D25F1E" },
  arctic:  { dark: "#3B82F6", light: "#2563D2" },
  kinetic: { dark: "#EF0613", light: "#C80510" },
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
}

export const UI_THEMES: Record<ThemeId, Record<ModeId, UITheme>> = {
  earth: {
    dark: {
      "--background": "#1A1410",
      "--foreground": "#ECE5DA",
      "--limestone": "#FAF8F2",
      "--brown-100": "#ECE5DA",
      "--brown-200": "#DED2C2",
      "--brown-300": "#D7BA9D",
      "--brown-400": "#AF8462",
      "--brown-500": "#936846",
      "--brown-600": "#7A5638",
      "--jp-brown": "#3A2206",
      "--jp-dark-brown": "#221812",
      "--accent-orange": "#E8722A",
      "--nav-surface": "rgba(26, 20, 16, 0.92)",
      "--surface-elevated": "rgba(34, 24, 18, 0.95)",
      "--border-subtle": "rgba(147, 104, 70, 0.15)",
      "--border-muted": "rgba(147, 104, 70, 0.1)",
      "--border-interactive": "rgba(147, 104, 70, 0.2)",
    },
    light: {
      "--background": "#F5F0EB",
      "--foreground": "#1A1410",
      "--limestone": "#1A1410",
      "--brown-100": "#2A2018",
      "--brown-200": "#3E3028",
      "--brown-300": "#5C4A3A",
      "--brown-400": "#7A6450",
      "--brown-500": "#A08A78",
      "--brown-600": "#C4B0A0",
      "--jp-brown": "#EAE2DA",
      "--jp-dark-brown": "#F0EAE4",
      "--accent-orange": "#D25F1E",
      "--nav-surface": "rgba(245, 240, 235, 0.92)",
      "--surface-elevated": "rgba(255, 252, 248, 0.95)",
      "--border-subtle": "rgba(60, 40, 20, 0.12)",
      "--border-muted": "rgba(60, 40, 20, 0.08)",
      "--border-interactive": "rgba(60, 40, 20, 0.18)",
    },
  },
  arctic: {
    dark: {
      "--background": "#0B1420",
      "--foreground": "#E0EAF4",
      "--limestone": "#F0F5FA",
      "--brown-100": "#D6E4F0",
      "--brown-200": "#B8CFDF",
      "--brown-300": "#8BAFC8",
      "--brown-400": "#6B8EA8",
      "--brown-500": "#4A6B8A",
      "--brown-600": "#385270",
      "--jp-brown": "#0E1E30",
      "--jp-dark-brown": "#080F18",
      "--accent-orange": "#3B82F6",
      "--nav-surface": "rgba(11, 20, 32, 0.92)",
      "--surface-elevated": "rgba(8, 18, 32, 0.95)",
      "--border-subtle": "rgba(74, 107, 138, 0.15)",
      "--border-muted": "rgba(74, 107, 138, 0.1)",
      "--border-interactive": "rgba(74, 107, 138, 0.2)",
    },
    light: {
      "--background": "#EDF3FA",
      "--foreground": "#0B1420",
      "--limestone": "#0B1420",
      "--brown-100": "#162840",
      "--brown-200": "#243A58",
      "--brown-300": "#3A5570",
      "--brown-400": "#587590",
      "--brown-500": "#8AA4B8",
      "--brown-600": "#B8CCD8",
      "--jp-brown": "#DCE8F0",
      "--jp-dark-brown": "#E8F0F8",
      "--accent-orange": "#2563D2",
      "--nav-surface": "rgba(237, 243, 250, 0.92)",
      "--surface-elevated": "rgba(248, 251, 255, 0.95)",
      "--border-subtle": "rgba(20, 40, 70, 0.12)",
      "--border-muted": "rgba(20, 40, 70, 0.08)",
      "--border-interactive": "rgba(20, 40, 70, 0.18)",
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
      "--accent-orange": "#EF0613",
      "--nav-surface": "rgba(12, 10, 10, 0.92)",
      "--surface-elevated": "rgba(18, 14, 14, 0.95)",
      "--border-subtle": "rgba(168, 152, 144, 0.15)",
      "--border-muted": "rgba(168, 152, 144, 0.1)",
      "--border-interactive": "rgba(168, 152, 144, 0.2)",
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
      "--accent-orange": "#C80510",
      "--nav-surface": "rgba(245, 242, 238, 0.92)",
      "--surface-elevated": "rgba(255, 252, 248, 0.95)",
      "--border-subtle": "rgba(40, 20, 10, 0.12)",
      "--border-muted": "rgba(40, 20, 10, 0.08)",
      "--border-interactive": "rgba(40, 20, 10, 0.18)",
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
  lineCount: 120,
  maxThickness: 5,
  radiusMultiplier: 1.0,
  velocitySmoothing: 0.35,
  radiusLerp: 10,
  lerpIn: 8,
  lerpOut: 3,
  scrollSensitivity: 0.12,
  glowIntensity: 0.3,
  maxLineHeight: 0.8,
  theme: "earth",
  mode: "dark",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getThemeColors(theme: ThemeId, mode: ModeId): ThemeColors {
  return THEMES[theme][mode];
}

export function resetSettings(target: CanvasSettings): void {
  Object.assign(target, DEFAULT_SETTINGS);
}
