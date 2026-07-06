/**
 * StatCard
 *
 * One of three equal-width summary tiles on the Home screen.
 * Uses `minHeight` so all three cards stay the same height even
 * when one label wraps to two lines on a narrow device.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "../../theme/ThemeContext";
import { typography } from "../../theme";
import { rs, rr, vScale } from "../../theme/responsive";

export default function StatCard({ label, value, style }) {
  const { colors, shadows } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        shadows.card,
        { backgroundColor: colors.surface },
        style,
      ]}
    >
      <Text
        style={[typography.caption, { color: colors.gray }]}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {label}
      </Text>
      <Text
        style={[typography.h3, { color: colors.ink, marginTop: rs.xs }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.75}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex:             1,
    borderRadius:     rr.md,
    padding:          rs.md,
    marginHorizontal: rs.xs / 2,
    minHeight:        vScale(64, 0.3),   // all three cards stay the same height
    justifyContent:   "center",
  },
});
