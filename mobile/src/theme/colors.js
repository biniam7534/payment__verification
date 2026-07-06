/**
 * Blue-X Color System
 *
 * Single source of truth for every color token used in the app.
 * Organised into:
 *   - Brand palette (theme-agnostic)
 *   - Semantic status colors
 *   - Light & Dark surface tokens
 *   - Helper utilities
 */

// ─── Brand Palette ─────────────────────────────────────────────────────────
export const palette = {
  // Primary greens
  green900: "#14532D",
  green800: "#166534",
  green700: "#15803D",  // hero / buttons
  green600: "#16A34A",  // primary interactive
  green500: "#22C55E",
  green400: "#4ADE80",
  green300: "#86EFAC",
  green100: "#DCFCE7",
  green50:  "#F0FDF4",

  // Accent (lime for highlights, badges, icons)
  lime400: "#A3E635",
  lime300: "#BEF264",
  lime100: "#ECFCCB",

  // Neutral ink / slate
  slate950: "#020617",
  slate900: "#0F172A",
  slate800: "#1E293B",
  slate700: "#334155",
  slate600: "#475569",
  slate500: "#64748B",
  slate400: "#94A3B8",
  slate300: "#CBD5E1",
  slate200: "#E2E8F0",
  slate100: "#F1F5F9",
  slate50:  "#F8FAFC",
  white:    "#FFFFFF",

  // Semantic
  red600:    "#DC2626",
  red100:    "#FEE2E2",
  red50:     "#FEF2F2",
  amber600:  "#D97706",
  amber100:  "#FEF3C7",
  amber50:   "#FFFBEB",
  blue600:   "#2563EB",
  blue100:   "#DBEAFE",
  blue50:    "#EFF6FF",
};

// ─── Semantic / Status ──────────────────────────────────────────────────────
export const status = {
  success:    palette.green600,
  successBg:  palette.green100,
  successTxt: palette.green700,

  warning:    palette.amber600,
  warningBg:  palette.amber100,
  warningTxt: "#92400E",

  danger:     palette.red600,
  dangerBg:   palette.red100,
  dangerTxt:  "#991B1B",

  info:       palette.blue600,
  infoBg:     palette.blue100,
  infoTxt:    "#1D4ED8",
};

// ─── Brand Tokens (always theme-agnostic) ──────────────────────────────────
export const brand = {
  primaryDark:  palette.green700,   // hero backgrounds, filled buttons
  primary:      palette.green700,
  primaryLight: palette.lime400,    // icon tints, accents
  primaryFaint: palette.green50,    // very light tinted backgrounds
};

// ─── Gradient Stop Configs ──────────────────────────────────────────────────
export const gradientStops = {
  hero:    [palette.green700, palette.green800],
  heroAlt: [palette.green600, palette.green900],
  card:    [palette.white,    palette.green50],
  success: [palette.green400, palette.green600],
  faint:   [palette.green50,  palette.white],
};

// ─── Surface Tokens per theme ───────────────────────────────────────────────
export const lightTheme = {
  background: palette.green50,      // screen background
  backgroundAlt: palette.slate50,   // alternate screen bg
  surface:    palette.white,        // cards / inputs
  surfaceAlt: palette.slate100,     // secondary card
  input:      palette.white,
  hero:       palette.green700,
  ink:        palette.slate900,     // primary text
  inkSecondary: palette.slate600,   // secondary text
  gray:       palette.slate500,
  border:     palette.slate200,
  overlay:    "rgba(15, 23, 42, 0.55)",
  tabBar:     palette.white,
  tabBarBorder: palette.slate200,
};

export const darkTheme = {
  background: palette.slate900,
  backgroundAlt: palette.slate950,
  surface:    "#16213A",
  surfaceAlt: "#1A2945",
  input:      palette.slate800,
  hero:       palette.green700,
  ink:        palette.slate100,
  inkSecondary: palette.slate400,
  gray:       palette.slate400,
  border:     "#27324A",
  overlay:    "rgba(0, 0, 0, 0.65)",
  tabBar:     "#16213A",
  tabBarBorder: "#27324A",
};

// ─── Combined color object (for static imports) ─────────────────────────────
export const colors = {
  ...brand,
  ...status,
  white: palette.white,
  light: lightTheme,
  dark:  darkTheme,
  palette,
  gradientStops,
};

// ─── Theme resolver ─────────────────────────────────────────────────────────
/**
 * Returns a flat color map for the given theme mode.
 * All components use this via `useAppTheme().colors`.
 */
export function getThemeColors(isDark) {
  const surface = isDark ? darkTheme : lightTheme;
  return {
    // Spread brand + status tokens first so surface tokens can override if needed
    ...brand,
    ...status,
    white: palette.white,
    palette,
    gradientStops,
    // Surface tokens (bg, card, text, border…)
    ...surface,
    isDark,
  };
}

/**
 * Returns `color` at the given opacity (0-1) as a hex+alpha or rgba string.
 * Works with any 6-digit hex color.
 *
 * Example: withOpacity(palette.green600, 0.15) → "rgba(22, 163, 74, 0.15)"
 */
export function withOpacity(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default colors;
