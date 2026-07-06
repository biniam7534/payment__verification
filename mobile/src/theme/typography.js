/**
 * Blue-X Typography System — Responsive
 *
 * All font sizes use `rf` (responsive font) from the responsive utility,
 * so they scale fluidly across Samsung A14 → iPhone 15 Pro Max → Tablets
 * without any manual per-device overrides.
 */
import { rf, rs } from "./responsive";

export const fontFamily = {
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semiBold: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
};

export const typography = {
  /** Page-level display (splash / hero numbers) */
  display: {
    fontFamily: fontFamily.bold,
    fontSize: rf.display,
    lineHeight: rf.display * 1.2,
  },
  /** Screen titles */
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: rf.h1,
    lineHeight: rf.h1 * 1.3,
  },
  /** Section headings */
  h2: {
    fontFamily: fontFamily.semiBold,
    fontSize: rf.h2,
    lineHeight: rf.h2 * 1.35,
  },
  /** Card / sub-section headings */
  h3: {
    fontFamily: fontFamily.semiBold,
    fontSize: rf.h3,
    lineHeight: rf.h3 * 1.4,
  },
  /** List item titles */
  h4: {
    fontFamily: fontFamily.medium,
    fontSize: rf.h4,
    lineHeight: rf.h4 * 1.4,
  },
  /** Body / paragraph text */
  body: {
    fontFamily: fontFamily.regular,
    fontSize: rf.body2,
    lineHeight: rf.body2 * 1.55,
  },
  /** Emphasised body */
  bodyMedium: {
    fontFamily: fontFamily.medium,
    fontSize: rf.body2,
    lineHeight: rf.body2 * 1.55,
  },
  /** Secondary info */
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: rf.caption,
    lineHeight: rf.caption * 1.5,
  },
  /** Small labels */
  tiny: {
    fontFamily: fontFamily.regular,
    fontSize: rf.tiny,
    lineHeight: rf.tiny * 1.4,
  },
  /** CTA buttons */
  button: {
    fontFamily: fontFamily.semiBold,
    fontSize: rf.h4,
    lineHeight: rf.h4 * 1.3,
  },
};

// ─── Spacing (re-exported for backward compat) ─────────────────────────────
export const spacing = {
  xs: rs.xs,
  sm: rs.sm,
  md: rs.md,
  lg: rs.lg,
  xl: rs.xl,
  xxl: rs.xxl,
};

// ─── Radius (re-exported for backward compat) ──────────────────────────────
export { rr as radius } from "./responsive";

export default typography;
