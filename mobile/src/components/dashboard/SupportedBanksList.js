/**
 * SupportedBanksList
 *
 * Horizontally scrollable row of supported bank chips.
 * Each chip shows a coloured initial-bubble + bank short name.
 *
 * Props:
 *   banks          – array of { id, name, shortName, color }
 *   selectedBank   – id of the currently active bank (optional)
 *   onSelectBank   – (bankId) => void
 */
import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "../../theme/ThemeContext";
import { typography } from "../../theme";
import { rs, rr, scale, moderateScale, iconSize } from "../../theme/responsive";

// ─── Default bank list (can be overridden via props) ─────────────────────────
export const DEFAULT_BANKS = [
  { id: "cbe", name: "Commercial Bank of Ethiopia", shortName: "CBE", color: "#F2A900", icon: "bank" },
  { id: "telebirr", name: "Telebirr", shortName: "Telebirr", color: "#1863DC", icon: "cellphone" },
  { id: "oromia", name: "Oromia Bank", shortName: "Oromia", color: "#F7941D", icon: "bank" },
  { id: "abyssinia", name: "Bank of Abyssinia", shortName: "Abyssinia", color: "#004B93", icon: "bank" },
  { id: "coop", name: "Cooperative Bank of Oromia", shortName: "CoopBank", color: "#1B7B3A", icon: "bank" },
  { id: "zemen", name: "Zemen Bank", shortName: "Zemen", color: "#003865", icon: "bank" },
  { id: "dashen", name: "Dashen Bank", shortName: "Dashen", color: "#003876", icon: "bank" },
  { id: "awash", name: "Awash International Bank", shortName: "Awash", color: "#006838", icon: "bank" },
];

// ─── Single bank chip ────────────────────────────────────────────────────────
function BankChip({ bank, selected, onPress, colors, shadows }) {
  const isActive = selected === bank.id;

  return (
    <Pressable
      onPress={() => onPress?.(bank.id)}
      style={({ pressed }) => [
        styles.chip,
        shadows.sm,
        {
          backgroundColor: isActive ? bank.color : colors.surface,
          borderWidth: isActive ? 0 : 1,
          borderColor: colors.border,
          opacity: pressed ? 0.78 : 1,
        },
      ]}
    >
      {/* Icon bubble */}
      <View
        style={[
          styles.iconBubble,
          {
            backgroundColor: isActive
              ? "rgba(255,255,255,0.22)"
              : bank.color + "20",   // 12% opacity tint of bank color
          },
        ]}
      >
        <MaterialCommunityIcons
          name={bank.icon || "bank"}
          size={iconSize.sm}
          color={isActive ? "#FFFFFF" : bank.color}
        />
      </View>

      {/* Bank name */}
      <Text
        style={[
          styles.chipLabel,
          {
            color: isActive ? "#FFFFFF" : colors.ink,
            fontWeight: isActive ? "600" : "400",
          },
        ]}
        numberOfLines={1}
      >
        {bank.shortName}
      </Text>

      {/* Active indicator dot */}
      {isActive && (
        <View style={[styles.activeDot, { backgroundColor: "rgba(255,255,255,0.55)" }]} />
      )}
    </Pressable>
  );
}

// ─── Exported list component ──────────────────────────────────────────────────
export default function SupportedBanksList({ banks, selectedBank, onSelectBank }) {
  const { colors, shadows } = useAppTheme();
  const list = banks ?? DEFAULT_BANKS;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      decelerationRate="fast"
      snapToInterval={scale(90, 0.5) + rs.sm}   // gentle snap to each chip
      snapToAlignment="start"
    >
      {list.map((bank) => (
        <BankChip
          key={bank.id}
          bank={bank}
          selected={selectedBank}
          onPress={onSelectBank}
          colors={colors}
          shadows={shadows}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: rs.xs,
    paddingVertical: rs.xs,
    gap: rs.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: rr.pill,
    paddingVertical: rs.sm - 2,
    paddingHorizontal: rs.md,
    gap: rs.xs,
    // Fixed width so all chips are the same size — looks clean in a row
    minWidth: scale(88, 0.5),
  },
  iconBubble: {
    width: scale(28, 0.4),
    height: scale(28, 0.4),
    borderRadius: rr.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  chipLabel: {
    fontSize: moderateScale(12),
    letterSpacing: 0.1,
    flex: 1,
  },
  activeDot: {
    width: scale(6, 0.3),
    height: scale(6, 0.3),
    borderRadius: rr.pill,
  },
});
