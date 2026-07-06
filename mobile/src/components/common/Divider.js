/**
 * Divider
 *
 * A thin horizontal rule that separates content sections.
 * Optionally renders a centred text label.
 *
 * Props:
 *   label      – string displayed in the middle of the line
 *   spacing    – vertical margin above and below  (default: rs.md)
 *   color      – line color override
 *   style      – extra container style
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "../../theme/ThemeContext";
import { typography } from "../../theme";
import { rs } from "../../theme/responsive";

export default function Divider({ label, spacing: vSpacing, color, style }) {
  const { colors } = useAppTheme();
  const lineColor  = color || colors.border;
  const mv         = vSpacing !== undefined ? vSpacing : rs.md;

  if (!label) {
    return (
      <View
        style={[
          styles.line,
          { borderBottomColor: lineColor, marginVertical: mv },
          style,
        ]}
      />
    );
  }

  return (
    <View style={[styles.row, { marginVertical: mv }, style]}>
      <View style={[styles.flex, { borderBottomColor: lineColor }]} />
      <Text style={[typography.caption, styles.label, { color: colors.gray }]}>
        {label}
      </Text>
      <View style={[styles.flex, { borderBottomColor: lineColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  flex: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    marginHorizontal: rs.sm,
  },
});
