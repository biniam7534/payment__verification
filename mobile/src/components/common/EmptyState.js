/**
 * EmptyState
 *
 * Centred placeholder shown when a list or section has no data.
 *
 * Props:
 *   icon      – Ionicons name (default "file-tray-outline")
 *   title     – Primary heading text
 *   subtitle  – Secondary description text
 *   action    – { label, onPress } — renders an AppButton below the text
 *   style     – Extra container style
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppButton from "./AppButton";
import { useAppTheme } from "../../theme/ThemeContext";
import { typography } from "../../theme";
import { rs, rr, iconSize, scale } from "../../theme/responsive";

export default function EmptyState({
  icon = "file-tray-outline",
  title = "Nothing here yet",
  subtitle,
  action,
  style,
}) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, style]}>
      {/* Icon bubble */}
      <View
        style={[
          styles.iconBubble,
          { backgroundColor: colors.successBg || colors.background },
        ]}
      >
        <Ionicons name={icon} size={iconSize.xl} color={colors.primaryDark} />
      </View>

      {/* Text */}
      <Text style={[typography.h3, styles.title, { color: colors.ink }]}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={[typography.body, styles.subtitle, { color: colors.gray }]}>
          {subtitle}
        </Text>
      ) : null}

      {/* Optional CTA */}
      {action ? (
        <AppButton
          title={action.label}
          onPress={action.onPress}
          style={styles.button}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: rs.xl,
    paddingVertical: rs.xxl,
  },
  iconBubble: {
    width:  scale(88, 0.4),
    height: scale(88, 0.4),
    borderRadius: rr.xl,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: rs.lg,
  },
  title: {
    textAlign: "center",
    marginBottom: rs.sm,
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 22,
    marginBottom: rs.lg,
  },
  button: {
    minWidth: scale(180, 0.5),
    width: "auto",
    paddingHorizontal: rs.xl,
  },
});
