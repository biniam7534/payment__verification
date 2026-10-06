import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { typography, spacing, radius } from "../../theme";

export default function BalanceCard({ amount = 0, currency = "ETB" }) {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const [hidden, setHidden] = useState(false);

  return (
    <View style={[styles.card, { backgroundColor: colors.primary }]}>
      <View style={styles.row}>
        <Text style={[typography.caption, { color: "rgba(255,255,255,0.85)" }]}>
          {t("totalVerified")}
        </Text>
        <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
          <Ionicons name={hidden ? "eye-off-outline" : "eye-outline"} size={18} color="#fff" />
        </Pressable>
      </View>
      <Text style={[typography.h1, { color: "#fff", marginTop: spacing.xs }]}>
        {hidden ? "••••••" : `${currency} ${amount.toFixed(2)}`}
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
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
