/**
 * Avatar
 *
 * Circular avatar that shows either the first letter of a name
 * or a fallback Ionicons icon.
 *
 * Props:
 *   name      – string used to derive the initial (e.g. "Abel Tesfaye")
 *   icon      – Ionicons name used when no name is provided (default "person")
 *   size      – "xs" | "sm" | "md" (default) | "lg" | "xl"
 *   bg        – background color override
 *   color     – foreground (text/icon) color override
 *   style     – extra container style
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../theme/ThemeContext";
import { typography } from "../../theme";
import { scale, rr, iconSize } from "../../theme/responsive";

const SIZE_MAP = {
  xs: { container: scale(28, 0.4), font: "tiny",       icon: iconSize.xs },
  sm: { container: scale(36, 0.4), font: "caption",    icon: iconSize.xs },
  md: { container: scale(44, 0.4), font: "bodyMedium", icon: iconSize.sm },
  lg: { container: scale(56, 0.4), font: "h3",         icon: iconSize.md },
  xl: { container: scale(72, 0.4), font: "h2",         icon: iconSize.lg },
};

export default function Avatar({ name, icon = "person", size = "md", bg, color, style }) {
  const { colors } = useAppTheme();
  const sz        = SIZE_MAP[size] || SIZE_MAP.md;
  const bgColor   = bg    || colors.primaryDark;
  const fgColor   = color || "#FFFFFF";
  const initial   = name ? name.trim().charAt(0).toUpperCase() : null;

  return (
    <View
      style={[
        styles.circle,
        {
          width:           sz.container,
          height:          sz.container,
          borderRadius:    rr.pill,
          backgroundColor: bgColor,
        },
        style,
      ]}
    >
      {initial ? (
        <Text style={[typography[sz.font] || typography.bodyMedium, { color: fgColor }]}>
          {initial}
        </Text>
      ) : (
        <Ionicons name={icon} size={sz.icon} color={fgColor} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: "center", justifyContent: "center" },
});
