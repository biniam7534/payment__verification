/**
 * Blue-X Theme — barrel export
 *
 * Import anything from here:
 *   import { colors, typography, shadows, gradients, rs, rr, rf } from "../../theme";
 */

export { default as colors, getThemeColors, withOpacity, palette, brand, status, gradientStops } from "./colors";
export { typography, spacing, fontFamily, radius } from "./typography";
export { getShadows, shadows } from "./shadows";
export { default as gradients, gradients as namedGradients, getCardGradient } from "./gradients";
export {
  default as responsive,
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
} from "./responsive";

// Convenience re-export so existing `import { theme } from "../../theme"` still works
import colors from "./colors";
import { typography, spacing, fontFamily } from "./typography";
import { rr as radius } from "./responsive";
import responsive from "./responsive";
import { shadows } from "./shadows";
import gradients from "./gradients";

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  fontFamily,
  shadows,
  responsive,
  gradients,
};

export default theme;
