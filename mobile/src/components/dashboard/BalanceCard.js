/**
 * BalanceCard
 *
 * Shows today's total verified amount.
 * Uses a green tinted background with a trending-up badge to give
 * the card visual weight without being visually heavy.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { formatCurrency } from "../../utils/format";
import { typography } from "../../theme";
import { rs, rr, scale, iconSize } from "../../theme/responsive";

export default function BalanceCard({ amount, currency = "ETB" }) {
  const { colors, shadows } = useAppTheme();
  const { t }               = useI18n();

  const badgeSize = scale(30, 0.4);

  return (
    <View style={[styles.card, shadows.card, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[typography.caption, { color: colors.gray }]}>
          {t("totalVerified")}
        </Text>

        {/* Trending badge */}
        <View
          style={[
            styles.badge,
            {
              width:           badgeSize,
              height:          badgeSize,
              borderRadius:    rr.pill,
              backgroundColor: colors.successBg || colors.background,
            },
          ]}
        >
          <Ionicons name="trending-up" size={iconSize.xs} color={colors.primaryDark} />
        </View>
      </View>

      <Text style={[typography.h1, styles.amount, { color: colors.ink }]}>
        {formatCurrency(amount, currency)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: rr.lg,
    padding:      rs.lg,
    marginBottom: rs.sm,
  },
  header: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
  },
  badge: {
    alignItems:     "center",
    justifyContent: "center",
  },
  amount: {
    marginTop: rs.xs,
  },
});
