/**
 * StatusFilterCard
 *
 * A tappable card showing a transaction status category with its count.
 * Four variants: all | verified | pending | failed
 *
 * Props:
 *   status    – "all" | "verified" | "pending" | "failed"
 *   label     – display text
 *   count     – number to show (e.g. 42)
 *   active    – whether this card is currently selected
 *   onPress   – tap handler
 */
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../theme/ThemeContext";
import { typography } from "../../theme";
import { rs, rr, scale, moderateScale, iconSize } from "../../theme/responsive";

// ─── Config per status ────────────────────────────────────────────────────────
const CONFIG = {
  all: {
    icon:        "list-outline",
    activeIcon:  "list",
    activeBg:    "#1A6B38",
    activeText:  "#FFFFFF",
    activeBadge: "rgba(255,255,255,0.25)",
    dotColor:    "#64748B",
  },
  verified: {
    icon:        "checkmark-circle-outline",
    activeIcon:  "checkmark-circle",
    activeBg:    "#16A34A",
    activeText:  "#FFFFFF",
    activeBadge: "rgba(255,255,255,0.25)",
    dotColor:    "#16A34A",
  },
  pending: {
    icon:        "time-outline",
    activeIcon:  "time",
    activeBg:    "#D97706",
    activeText:  "#FFFFFF",
    activeBadge: "rgba(255,255,255,0.25)",
    dotColor:    "#D97706",
  },
  failed: {
    icon:        "close-circle-outline",
    activeIcon:  "close-circle",
    activeBg:    "#DC2626",
    activeText:  "#FFFFFF",
    activeBadge: "rgba(255,255,255,0.25)",
    dotColor:    "#DC2626",
  },
};

export default function StatusFilterCard({ status = "all", label, count = 0, active = false, onPress }) {
  const { colors, shadows } = useAppTheme();
  const cfg = CONFIG[status] || CONFIG.all;

  const bgColor   = active ? cfg.activeBg   : colors.surface;
  const textColor = active ? cfg.activeText : colors.ink;
  const subColor  = active ? "rgba(255,255,255,0.75)" : colors.gray;
  const iconColor = active ? cfg.activeText : cfg.dotColor;
  const iconName  = active ? cfg.activeIcon : cfg.icon;
  const badgeBg   = active ? cfg.activeBadge : (colors.successBg || colors.background);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        shadows.sm,
        {
          backgroundColor: bgColor,
          opacity:         pressed ? 0.82 : 1,
          // Active card gets a stronger shadow using the status color
          ...(active && {
            shadowColor:   cfg.activeBg,
            shadowOpacity: 0.35,
            shadowRadius:  10,
            elevation:     6,
          }),
        },
      ]}
    >
      {/* Icon bubble */}
      <View style={[styles.iconBubble, { backgroundColor: badgeBg }]}>
        <Ionicons name={iconName} size={iconSize.sm} color={iconColor} />
      </View>

      {/* Count */}
      <Text
        style={[
          styles.count,
          { color: textColor, fontSize: moderateScale(20) },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {count}
      </Text>

      {/* Label */}
      <Text
        style={[typography.tiny, { color: subColor, marginTop: 2 }]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex:           1,
    borderRadius:   rr.lg,
    padding:        rs.md,
    marginHorizontal: scale(4, 0.3),
    alignItems:     "flex-start",
    minHeight:      scale(100, 0.4),
    justifyContent: "space-between",
  },
  iconBubble: {
    width:          scale(34, 0.4),
    height:         scale(34, 0.4),
    borderRadius:   rr.pill,
    alignItems:     "center",
    justifyContent: "center",
    marginBottom:   rs.xs,
  },
  count: {
    fontWeight:    "700",
    letterSpacing: -0.5,
  },
});
