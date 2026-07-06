/**
 * Blue-X Responsive Design System
 *
 * Provides fluid scaling for typography, spacing, sizing, and layout
 * that automatically adjusts across:
 *   - Small Androids  : Samsung A14, Tecno, Infinix  (~360-390px wide)
 *   - Mid-range      : Samsung S24, Xiaomi, Oppo, Huawei (~390-430px)
 *   - iPhones        : SE (375px), 13 (390px), 15 Pro Max (430px)
 *   - Tablets        : 600px+ width
 *
 * Strategy: Scale relative to a 390px baseline (iPhone 13 / S24).
 * All values are capped so they never go uncomfortably large on tablets.
 */

import { Dimensions, PixelRatio, Platform } from "react-native";

// ─── Screen Metrics ────────────────────────────────────────────────────────
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

/** Design baseline (iPhone 13 / Samsung S24 width) */
const BASE_WIDTH = 390;

/** True when running on a tablet (width >= 600dp) */
export const isTablet = SCREEN_W >= 600;

/**
 * Scale a value proportionally to screen width.
 * `factor` (0-1) controls how aggressively it scales:
 *   1.0 = full linear scale  (use for large layout values)
 *   0.5 = softer scale       (use for font sizes / spacing)
 */
export function scale(size, factor = 1) {
    const ratio = SCREEN_W / BASE_WIDTH;
    const scaled = size * (1 + (ratio - 1) * factor);
    return Math.round(PixelRatio.roundToNearestPixel(scaled));
}

/** Shorthand: scale with factor 0.5 (good for font sizes & tight spacing) */
export const moderateScale = (size) => scale(size, 0.5);

/** Scale relative to screen HEIGHT (for vertical rhythm, hero sections) */
export function vScale(size, factor = 0.5) {
    const BASE_HEIGHT = 844; // iPhone 13 height
    const ratio = SCREEN_H / BASE_HEIGHT;
    const scaled = size * (1 + (ratio - 1) * factor);
    return Math.round(PixelRatio.roundToNearestPixel(scaled));
}

// ─── Tablet clamp ──────────────────────────────────────────────────────────
/**
 * Clamp a value so it doesn't grow beyond `maxMultiplier × baseValue`
 * on tablets. Prevents comically large text on large screens.
 */
export function clamp(value, maxMultiplier = 1.35) {
    const base = value / (SCREEN_W / BASE_WIDTH);
    const max = base * maxMultiplier;
    return Math.min(value, Math.round(PixelRatio.roundToNearestPixel(max)));
}

// ─── Responsive Spacing ────────────────────────────────────────────────────
/**
 * Fluid spacing scale.
 * Values auto-scale with screen width (factor 0.7 = moderate growth).
 */
export const rs = {
    xs: scale(4, 0.5),
    sm: scale(8, 0.6),
    md: scale(16, 0.7),
    lg: scale(24, 0.7),
    xl: scale(32, 0.6),
    xxl: scale(48, 0.5),
};

// ─── Responsive Typography ─────────────────────────────────────────────────
/**
 * Fluid font sizes.
 * Factor 0.4 keeps font growth gentle across device sizes.
 */
export const rf = {
    tiny: moderateScale(11),
    caption: moderateScale(12),
    body: moderateScale(14),
    body2: moderateScale(15),
    h4: moderateScale(16),
    h3: moderateScale(18),
    h2: moderateScale(22),
    h1: moderateScale(26),
    display: moderateScale(32),
};

// ─── Responsive Radius ─────────────────────────────────────────────────────
export const rr = {
    xs: scale(6, 0.3),
    sm: scale(8, 0.3),
    md: scale(12, 0.3),
    lg: scale(16, 0.3),
    xl: scale(24, 0.3),
    xxl: scale(32, 0.3),
    pill: 999,
};

// ─── Device-aware Icon Sizes ───────────────────────────────────────────────
export const iconSize = {
    xs: scale(16, 0.4),
    sm: scale(20, 0.4),
    md: scale(24, 0.4),
    lg: scale(32, 0.4),
    xl: scale(48, 0.4),
    xxl: scale(64, 0.4),
};

// ─── Touch Target Helpers ─────────────────────────────────────────────────
/** Minimum accessible touch target (44pt on iOS, 48dp on Android) */
export const MIN_TAP = Platform.OS === "ios" ? scale(44, 0.3) : scale(48, 0.3);

/** Standard button height */
export const BUTTON_HEIGHT = scale(52, 0.4);

/** Standard input height */
export const INPUT_HEIGHT = scale(52, 0.4);

// ─── Layout Helpers ────────────────────────────────────────────────────────
/** Usable screen width (after horizontal safe-area / padding) */
export const contentWidth = isTablet
    ? Math.min(SCREEN_W * 0.78, 600) // center-column on tablets
    : SCREEN_W;

/** Horizontal screen padding (scales gently) */
export const screenPadding = scale(20, 0.5);

/** Hero section height — taller screens get slightly taller heroes */
export const heroHeight = vScale(260, 0.4);

// ─── Tablet Layout ─────────────────────────────────────────────────────────
/**
 * Returns a style object that centers content on tablets and
 * applies normal full-width layout on phones.
 */
export function tabletCenterStyle() {
    if (!isTablet) return {};
    return {
        alignSelf: "center",
        width: contentWidth,
    };
}

export default {
    scale,
    moderateScale,
    vScale,
    clamp,
    rs,
    rf,
    rr,
    iconSize,
    MIN_TAP,
    BUTTON_HEIGHT,
    INPUT_HEIGHT,
    contentWidth,
    screenPadding,
    heroHeight,
    isTablet,
    tabletCenterStyle,
    SCREEN_W,
    SCREEN_H,
};
