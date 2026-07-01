import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "../../theme/ThemeContext";
import { typography, spacing, radius } from "../../theme";

export default function StatCard({ label, value, style }) {
  const { colors, shadows } = useAppTheme();

  return (
    <View style={[styles.card, shadows.card, { backgroundColor: colors.surface }, style]}>
      <Text style={[typography.caption, { color: colors.gray }]} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[typography.h3, { color: colors.ink, marginTop: spacing.xs }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginHorizontal: spacing.xs / 2,
  },
});
