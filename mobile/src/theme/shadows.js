/**
 * Blue-X Shadow System
 *
 * Provides six named elevation levels:
 *   xs      – barely-there lift (chip, small badge)
 *   sm      – subtle card lift (inner cards, list items)
 *   card    – standard card / surface (default)
 *   lg      – modal sheets, bottom panels
 *   hero    – splash / prominent CTA blocks
 *   button  – primary action button
 *   pressed – depressed state on tap
 *
 * Dark mode: iOS shadows are replaced by a 1 px border so they remain
 *            visible without glowing weirdly on dark surfaces.
 */
import { Platform } from "react-native";
import { palette } from "./colors";

// ─── iOS shadow factory ─────────────────────────────────────────────────────
function ios(color, offset, opacity, radius) {
  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
  };
}

// ─── Light mode shadows ─────────────────────────────────────────────────────
const lightShadows = {
  xs: Platform.select({
    ios:     ios(palette.slate900, { width: 0, height: 1 }, 0.04, 2),
    android: { elevation: 1 },
    default: {},
  }),
  sm: Platform.select({
    ios:     ios(palette.slate900, { width: 0, height: 1 }, 0.05, 4),
    android: { elevation: 2 },
    default: {},
  }),
  card: Platform.select({
    ios:     ios(palette.slate900, { width: 0, height: 2 }, 0.07, 8),
    android: { elevation: 3 },
    default: {},
  }),
  lg: Platform.select({
    ios:     ios(palette.slate900, { width: 0, height: 4 }, 0.10, 16),
    android: { elevation: 6 },
    default: {},
  }),
  hero: Platform.select({
    ios:     ios(palette.green700,  { width: 0, height: 6 }, 0.25, 20),
    android: { elevation: 8 },
    default: {},
  }),
  button: Platform.select({
    ios:     ios(palette.green600,  { width: 0, height: 4 }, 0.30, 10),
    android: { elevation: 5 },
    default: {},
  }),
  pressed: Platform.select({
    ios:     ios(palette.slate900, { width: 0, height: 1 }, 0.04, 2),
    android: { elevation: 1 },
    default: {},
  }),
};

// ─── Dark mode shadows ──────────────────────────────────────────────────────
// In dark mode, hard shadows look wrong; use a subtle border instead.
const border = (color = "#27324A") => ({ borderWidth: 1, borderColor: color });

const darkShadows = {
  xs:      border("#1E2A3A"),
  sm:      border("#27324A"),
  card:    border("#27324A"),
  lg:      border("#2E3D54"),
  hero:    border("#2E3D54"),
  button:  Platform.select({
    ios:     ios(palette.green600, { width: 0, height: 4 }, 0.40, 12),
    android: { elevation: 6 },
    default: {},
  }),
  pressed: border("#1E2A3A"),
};

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Returns the full shadow map for the given theme mode.
 * Used by ThemeContext so components access shadows via `useAppTheme().shadows`.
 */
export function getShadows(isDark = false) {
  return isDark ? darkShadows : lightShadows;
}

/** Static light-mode shadows for files that don't use the theme hook. */
export const shadows = getShadows(false);

export default shadows;
