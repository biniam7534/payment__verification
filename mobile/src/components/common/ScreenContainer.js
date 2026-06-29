import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../theme/ThemeContext";
import { spacing } from "../../theme";

export default function ScreenContainer({ children, style, noPadding = false, edges }) {
  const { colors, isDark } = useAppTheme();
  return (
    <SafeAreaView
      edges={edges || ["top", "left", "right"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={[!noPadding && styles.padded, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  padded: { flex: 1, paddingHorizontal: spacing.lg },
});
