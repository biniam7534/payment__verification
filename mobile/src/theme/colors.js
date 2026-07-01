// Color palette extracted from the BunnaPay design reference.
export const colors = {
  // Greens (shared across themes)
  primaryDark: "#16A34A",
  primary: "#15803D",
  primaryLight: "#84CC16",
  // Status (shared)
  success: "#16A34A",
  danger: "#DC2626",
  warning: "#D97706",
  white: "#FFFFFF",
  // Light theme
  light: {
    background: "#F0FDF4",
    surface: "#FFFFFF",
    ink: "#0F172A",
    gray: "#64748B",
    border: "#E2E8F0",
    input: "#FFFFFF",
    hero: "#15803D",
    overlay: "rgba(15, 23, 42, 0.55)",
  },
  // Dark theme
  dark: {
    background: "#0F172A",
    surface: "#16213A",
    ink: "#F1F5F9",
    gray: "#94A3B8",
    border: "#27324A",
    input: "#1E293B",
    hero: "#15803D",
    overlay: "rgba(0, 0, 0, 0.65)",
  },
};

export function getThemeColors(isDark) {
  const palette = isDark ? colors.dark : colors.light;
  return {
    ...colors,
    ...palette,
    isDark,
  };
}

export default colors;
