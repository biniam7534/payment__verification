import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { formatCurrency } from "../../utils/format";
import { typography, spacing, radius } from "../../theme";

export default function BalanceCard({ amount, currency = "ETB" }) {
  const { colors, shadows } = useAppTheme();
  const { t } = useI18n();

  return (
    <View style={[styles.card, shadows.card, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[typography.caption, { color: colors.gray }]}>{t("totalVerified")}</Text>
        <View style={[styles.badge, { backgroundColor: colors.background }]}>
          <Ionicons name="trending-up" size={14} color={colors.primaryDark} />
        </View>
      </View>
      <Text style={[typography.h1, { color: colors.ink, marginTop: spacing.xs }]}>
        {formatCurrency(amount, currency)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
