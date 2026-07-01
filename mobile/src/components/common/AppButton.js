import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useAppTheme } from "../../theme/ThemeContext";
import { typography, spacing, radius } from "../../theme";

// variant: "primary" | "outline" | "ghost"
export default function AppButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  icon = null,
  style,
}) {
  const { colors } = useAppTheme();
  const isOutline = variant === "outline";
  const isGhost = variant === "ghost";

  const backgroundColor = isOutline || isGhost ? "transparent" : colors.primaryDark;
  const borderColor = isOutline ? colors.primaryDark : "transparent";
  const textColor = isOutline || isGhost ? colors.primaryDark : colors.white;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor,
          borderColor,
          borderWidth: isOutline ? 1.5 : 0,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon}
          <Text style={[typography.button, { color: textColor, marginLeft: icon ? spacing.sm : 0 }]}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
  },
});
