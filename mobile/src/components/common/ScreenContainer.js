/**
 * ScreenContainer
 *
 * Wraps every screen with:
 *   - SafeAreaView (top + sides only; bottom is handled by the tab bar or
 *     explicitly opted in via edges prop)
 *   - Correct StatusBar style for light / dark mode
 *   - Horizontal screen padding via the responsive `screenPadding` token
 *   - Tablet centering via `tabletCenterStyle()`
 *
 * Props:
 *   noPadding  – skip horizontal padding (used by full-bleed screens)
 *   edges      – SafeAreaView edges override
 *   style      – extra inner view style
 */
import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../theme/ThemeContext";
import { screenPadding, tabletCenterStyle } from "../../theme/responsive";

export default function ScreenContainer({
  children,
  style,
  noPadding = false,
  edges,
}) {
  const { colors, isDark } = useAppTheme();

  return (
    <SafeAreaView
      // Only inset top + sides by default.
      // The tab bar already handles the bottom safe area on tab screens.
      edges={edges ?? ["top", "left", "right"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
        translucent={false}
      />
      <View
        style={[
          !noPadding && styles.padded,
          tabletCenterStyle(),
          style,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  padded:    { flex: 1, paddingHorizontal: screenPadding },
});
