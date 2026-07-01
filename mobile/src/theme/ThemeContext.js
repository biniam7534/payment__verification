import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getThemeColors } from "./colors";
import { getShadows } from "./shadows";

const DARK_MODE_STORAGE_KEY = "bunnapay.darkMode";

const ThemeContext = createContext({
  isDark: false,
  isReady: false,
  toggleDark: () => {},
  setDarkMode: () => {},
  colors: getThemeColors(false),
  shadows: getShadows(false),
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(DARK_MODE_STORAGE_KEY)
      .then((stored) => {
        if (stored === "true") setIsDark(true);
      })
      .finally(() => setIsReady(true));
  }, []);

  const setDarkMode = useCallback((value) => {
    setIsDark(value);
    AsyncStorage.setItem(DARK_MODE_STORAGE_KEY, value ? "true" : "false").catch(() => {});
  }, []);

  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem(DARK_MODE_STORAGE_KEY, next ? "true" : "false").catch(() => {});
      return next;
    });
  }, []);

  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const shadows = useMemo(() => getShadows(isDark), [isDark]);

  const value = useMemo(
    () => ({ isDark, isReady, toggleDark, setDarkMode, colors, shadows }),
    [isDark, isReady, toggleDark, setDarkMode, colors, shadows]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useAppTheme = () => useContext(ThemeContext);
