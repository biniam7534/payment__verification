/**
 * Card
 *
 * Themed surface card with configurable shadow and padding.
 *
 * Props:
 *   children  – content
 *   padding   – "none" | "sm" | "md" (default) | "lg"
 *   shadow    – "xs" | "sm" | "card" (default) | "lg"
 *   radius    – "sm" | "md" | "lg" (default) | "xl"
 *   style     – extra style override
 *   onPress   – if provided, wraps in a Pressable
 */
import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useAppTheme } from "../../theme/ThemeContext";
import { rs, rr } from "../../theme/responsive";

const PADDING_MAP = { none: 0, sm: rs.sm, md: rs.md, lg: rs.lg };
const RADIUS_MAP  = { sm: rr.sm, md: rr.md, lg: rr.lg, xl: rr.xl };

export default function Card({
  children,
  padding = "md",
  shadow = "card",
  radius = "lg",
  style,
  onPress,
}) {
  const { colors, shadows } = useAppTheme();

  const containerStyle = [
    styles.base,
    shadows[shadow] || shadows.card,
    {
      backgroundColor: colors.surface,
      borderRadius: RADIUS_MAP[radius] ?? rr.lg,
      padding: PADDING_MAP[padding] ?? rs.md,
    },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [...containerStyle, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: { overflow: "hidden" },
  pressed: { opacity: 0.85 },
});
