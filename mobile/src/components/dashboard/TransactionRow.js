import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../theme/ThemeContext";
import { typography, spacing, radius } from "../../theme";

const statusColorKey = { verified: "success", pending: "warning", failed: "danger" };
const statusIcon = { verified: "checkmark-circle", pending: "time", failed: "close-circle" };

export default function TransactionRow({ transaction, onPress }) {
  const { colors } = useAppTheme();
  const color = colors[statusColorKey[transaction.status]] || colors.gray;

  return (
    <Pressable onPress={onPress} style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={[styles.avatar, { backgroundColor: colors.input || colors.surface, borderWidth: 1, borderColor: colors.border }]}>
        <Ionicons name="person" size={18} color={colors.primaryDark} />
      </View>
      <View style={{ flex: 1, marginLeft: spacing.sm }}>
        <Text style={[typography.bodyMedium, { color: colors.ink }]}>{transaction.name}</Text>
        <Text style={[typography.caption, { color: colors.gray }]}>{transaction.date}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={[typography.bodyMedium, { color: colors.ink }]}>
          ETB {transaction.amount.toFixed(2)}
        </Text>
        <View style={styles.statusRow}>
          <Ionicons name={statusIcon[transaction.status]} size={12} color={color} />
          <Text style={[typography.caption, { color, marginLeft: 4, textTransform: "capitalize" }]}>
            {transaction.status}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
});
