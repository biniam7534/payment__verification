/**
 * BankCard
 *
 * Displays the user's connected bank with a branded icon bubble.
 * Tapping opens the bank selection modal.
 *
 * Responsive: icon size, padding, and radius all use design tokens.
 */
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { typography } from "../../theme";
import { rs, rr, scale, iconSize } from "../../theme/responsive";

const BANK_ICON = "bank";

const PROVIDER_LABELS = {
  cbe:    "Commercial Bank of Ethiopia",
  dashen: "Dashen Bank",
  zemen:  "Zemen Bank",
  awash:  "Awash International Bank",
};

export default function BankCard({ provider = "cbe", onChangeBankPress, bankName }) {
  const { colors, shadows } = useAppTheme();
  const { t }               = useI18n();

  const label = PROVIDER_LABELS[provider?.toLowerCase()] ?? bankName ?? "Bank Account";

  return (
    <Pressable
      onPress={onChangeBankPress}
      style={({ pressed }) => [
        styles.card,
        shadows.card,
        {
          backgroundColor: colors.surface,
          opacity:         pressed ? 0.82 : 1,
        },
      ]}
    >
      {/* Left: icon + text */}
      <View style={styles.left}>
        <View
          style={[
            styles.iconBubble,
            { backgroundColor: colors.successBg || colors.background },
          ]}
        >
          <MaterialCommunityIcons
            name={BANK_ICON}
            size={iconSize.sm}
            color={colors.primaryDark}
          />
        </View>

        <View style={styles.textBlock}>
          <Text style={[typography.caption, { color: colors.gray }]}>
            {t("bank") || "Bank Account"}
          </Text>
          <Text
            style={[typography.bodyMedium, { color: colors.ink }]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </View>
      </View>

      {/* Right: chevron */}
      <Ionicons name="chevron-forward" size={iconSize.sm} color={colors.gray} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
    borderRadius:   rr.lg,
    paddingVertical:   rs.sm,
    paddingHorizontal: rs.md,
    marginBottom:   rs.sm,
  },
  left: {
    flexDirection: "row",
    alignItems:    "center",
    flex:          1,
  },
  iconBubble: {
    width:          scale(40, 0.4),
    height:         scale(40, 0.4),
    borderRadius:   rr.md,
    alignItems:     "center",
    justifyContent: "center",
    marginRight:    rs.sm,
  },
  textBlock: {
    flex: 1,
  },
});
