/**
 * SectionHeader
 *
 * Row with a bold section title on the left and an optional
 * "See all" / custom link on the right.
 *
 * Props:
 *   title       – Section heading text (required)
 *   actionLabel – Right-side link text  (default "See all")
 *   onAction    – Callback for the right link; hidden when not provided
 *   style       – Extra container style
 */
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useAppTheme } from "../../theme/ThemeContext";
import { typography } from "../../theme";
import { rs } from "../../theme/responsive";

export default function SectionHeader({ title, actionLabel = "See all", onAction, style }) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.row, style]}>
      <Text style={[typography.h3, { color: colors.ink, flex: 1 }]}>{title}</Text>
      {onAction ? (
        <Pressable onPress={onAction} hitSlop={10}>
          <Text style={[typography.caption, { color: colors.primaryDark }]}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: rs.sm,
  },
});
