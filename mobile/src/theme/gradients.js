/**
 * Blue-X Gradient Configs
 *
 * Usage with expo-linear-gradient:
 *   import { gradients } from "../../theme";
 *   <LinearGradient colors={gradients.hero.colors} start={gradients.hero.start} end={gradients.hero.end} />
 *
 * NOTE: expo-linear-gradient must be installed. If it is not yet in your
 *       project, install it with: npx expo install expo-linear-gradient
 *       All gradient configs are pure data objects so they remain importable
 *       without the package being present; only actual <LinearGradient>
 *       usage requires the package.
 */
import { palette } from "./colors";

// ─── Named gradient definitions ─────────────────────────────────────────────

/**
 * Each gradient has:
 *   colors  – array of color stops
 *   start   – gradient origin  { x, y }  (0-1 coordinate space)
 *   end     – gradient terminus { x, y }
 *   locations – optional array of stop positions (same length as colors)
 */
export const gradients = {
  /** Full-width hero banners and screen headers */
  hero: {
    colors: [palette.green700, palette.green900],
    start: { x: 0, y: 0 },
    end:   { x: 1, y: 1 },
  },

  /** Softer hero — slightly lighter top */
  heroSoft: {
    colors: [palette.green600, palette.green800],
    start: { x: 0, y: 0 },
    end:   { x: 1, y: 1 },
  },

  /** Diagonal hero with lime accent */
  heroAccent: {
    colors: [palette.green700, palette.green800, "#0D4E28"],
    start: { x: 0, y: 0 },
    end:   { x: 1, y: 1 },
    locations: [0, 0.6, 1],
  },

  /** Subtle card tint (light mode) */
  cardLight: {
    colors: [palette.white, palette.green50],
    start: { x: 0, y: 0 },
    end:   { x: 0, y: 1 },
  },

  /** Subtle card tint (dark mode) */
  cardDark: {
    colors: ["#16213A", "#1A2945"],
    start: { x: 0, y: 0 },
    end:   { x: 0, y: 1 },
  },

  /** Success confirmation screen */
  success: {
    colors: [palette.green500, palette.green700],
    start: { x: 0, y: 0 },
    end:   { x: 1, y: 1 },
  },

  /** Danger / error highlight */
  danger: {
    colors: ["#EF4444", palette.red600],
    start: { x: 0, y: 0 },
    end:   { x: 1, y: 1 },
  },

  /** Faint brand wash for screen backgrounds */
  faint: {
    colors: [palette.green50, palette.white],
    start: { x: 0, y: 0 },
    end:   { x: 0, y: 0.4 },
  },

  /** Bottom-tab / action-bar backdrop */
  tabBar: {
    colors: ["rgba(255,255,255,0)", palette.white],
    start: { x: 0, y: 0 },
    end:   { x: 0, y: 1 },
  },

  /** QR scanner overlay vignette */
  scannerTop: {
    colors: ["rgba(0,0,0,0.65)", "transparent"],
    start: { x: 0, y: 0 },
    end:   { x: 0, y: 1 },
  },
  scannerBottom: {
    colors: ["transparent", "rgba(0,0,0,0.75)"],
    start: { x: 0, y: 0 },
    end:   { x: 0, y: 1 },
  },
};

/**
 * Returns theme-aware card gradient (light vs dark mode).
 */
export function getCardGradient(isDark) {
  return isDark ? gradients.cardDark : gradients.cardLight;
}

export default gradients;
