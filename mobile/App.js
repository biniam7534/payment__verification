import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./src/theme/ThemeContext";
import { I18nProvider } from "./src/i18n/I18nContext";
import { AuthProvider } from "./src/store/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";

// TODO: load Poppins font via @expo-google-fonts/poppins before rendering,
// e.g. using expo-font's useFonts() hook, then gate rendering on fontsLoaded.
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <I18nProvider>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
