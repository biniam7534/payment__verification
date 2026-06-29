import React, { createContext, useContext, useState, useMemo } from "react";
import { colors as baseColors } from "../theme/colors";

const darkOverrides = {
  background: baseColors.darkBg,
  surface: baseColors.darkSurface,
  ink: "#F1F5F9",
  border: "#27324A",
  gray: "#8A93A6",
};

const ThemeContext = createContext({
  isDark: false,
  toggleDark: () => {},
  colors: baseColors,
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  const colors = useMemo(
    () => (isDark ? { ...baseColors, ...darkOverrides } : baseColors),
    [isDark]
  );

  const toggleDark = () => setIsDark((d) => !d);

  return (
    <ThemeContext.Provider value={{ isDark, toggleDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useAppTheme = () => useContext(ThemeContext);
