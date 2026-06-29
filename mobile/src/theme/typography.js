// Typography scale. The design reference uses "Poppins".
// Add Poppins via expo-font + @expo-google-fonts/poppins for production;
// falls back to system font if not loaded (see App.js loadFonts()).
export const fontFamily = {
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semiBold: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
};

export const typography = {
  h1: { fontFamily: fontFamily.bold, fontSize: 28, lineHeight: 36 },
  h2: { fontFamily: fontFamily.semiBold, fontSize: 22, lineHeight: 30 },
  h3: { fontFamily: fontFamily.semiBold, fontSize: 18, lineHeight: 26 },
  body: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 22 },
  bodyMedium: { fontFamily: fontFamily.medium, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18 },
  button: { fontFamily: fontFamily.semiBold, fontSize: 16, lineHeight: 22 },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export default typography;
