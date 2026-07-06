/**
 * Badge
 *
 * Compact pill label for transaction statuses, filters, and tags.
 *
 * Props:
 *   status   – "verified" | "pending" | "failed" | "info"
 *              Colors and label are inferred when status is provided.
 *   label    – Text override (required when status is null/undefined)
 *   color    – Foreground color override
 *   bg       – Background color override
 *   size     – "sm" | "md" (default)
 *   dot      – Show a leading colored dot  (default false)
 *   style    – Extra container style
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "../../theme/ThemeContext";
import { typography } from "../../theme";
import { rs, rr, scale } from "../../theme/responsive";

const STATUS_MAP = {
  verified: { colorKey: "success",  bgKey: "successBg" },
  pending:  { colorKey: "warning",  bgKey: "warningBg" },
  failed:   { colorKey: "danger",   bgKey: "dangerBg"  },
  info:     { colorKey: "info",     bgKey: "infoBg"    },
};

export default function Badge({
  status,
  label,
  color: colorOverride,
  bg: bgOverride,
  size = "md",
  dot = false,
  style,
}) {
  const { colors } = useAppTheme();

  const preset = status ? STATUS_MAP[status] : null;
  const fg     = colorOverride || (preset ? colors[preset.colorKey] : colors.gray);
  const bg     = bgOverride    || (preset ? colors[preset.bgKey]    : colors.surfaceAlt || colors.surface);
  const text   = label || (status ? status : "");
  const isSmall = size === "sm";

  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor:  bg,
          paddingHorizontal: isSmall ? rs.xs : rs.sm,
          paddingVertical:   isSmall ? 2     : rs.xs,
        },
        style,
      ]}
    >
      {dot && (
        <View
          style={[
            styles.dot,
            {
              backgroundColor: fg,
              width:  isSmall ? scale(5, 0.3) : scale(6, 0.3),
              height: isSmall ? scale(5, 0.3) : scale(6, 0.3),
            },
          ]}
        />
      )}
      <Text
        style={[
          isSmall ? typography.tiny : typography.caption,
          { color: fg, textTransform: "capitalize" },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: rr.pill,
    alignSelf: "flex-start",
  },
  dot: {
    borderRadius: rr.pill,
    marginRight: rs.xs,
  },
});
