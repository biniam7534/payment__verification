/**
 * TransactionRow
 *
 * A single row in the recent-transactions list.
 * Responsive: all sizes come from design tokens.
 * The last row in the list should not render a bottom border —
 * pass `showBorder={false}` for that case.
 */
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../theme/ThemeContext";
import { typography } from "../../theme";
import { rs, rr, scale, iconSize } from "../../theme/responsive";

const STATUS_COLOR_KEY = { verified: "success", pending: "warning", failed: "danger" };
const STATUS_ICON      = { verified: "checkmark-circle", pending: "time", failed: "close-circle" };

export default function TransactionRow({ transaction, onPress, showBorder = true }) {
  const { colors }  = useAppTheme();
  const statusColor = colors[STATUS_COLOR_KEY[transaction.status]] || colors.gray;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          borderBottomWidth: showBorder ? StyleSheet.hairlineWidth : 0,
          borderBottomColor: colors.border,
          opacity:           pressed ? 0.75 : 1,
        },
      ]}
    >
      {/* Avatar bubble */}
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: colors.successBg || colors.background,
            borderWidth:     1,
            borderColor:     colors.border,
          },
        ]}
      >
        <Ionicons name="person" size={iconSize.xs} color={colors.primaryDark} />
      </View>

      {/* Name + date */}
      <View style={styles.info}>
        <Text style={[typography.bodyMedium, { color: colors.ink }]} numberOfLines={1}>
          {transaction.name}
        </Text>
        <Text style={[typography.caption, { color: colors.gray }]}>
          {transaction.date}
        </Text>
      </View>

      {/* Amount + status */}
      <View style={styles.right}>
        <Text style={[typography.bodyMedium, { color: colors.ink }]}>
          ETB {transaction.amount.toFixed(2)}
        </Text>
        <View style={styles.statusRow}>
          <Ionicons
            name={STATUS_ICON[transaction.status] || "ellipse"}
            size={scale(12, 0.4)}
            color={statusColor}
          />
          <Text
            style={[
              typography.caption,
              {
                color:           statusColor,
                marginLeft:      rs.xs,
                textTransform:   "capitalize",
              },
            ]}
          >
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
    alignItems:    "center",
    paddingVertical: rs.sm + 2,    // slightly taller rows for easier tapping
  },
  avatar: {
    width:          scale(38, 0.4),
    height:         scale(38, 0.4),
    borderRadius:   rr.pill,
    alignItems:     "center",
    justifyContent: "center",
  },
  info: {
    flex:       1,
    marginLeft: rs.sm,
    marginRight: rs.xs,
  },
  right: {
    alignItems: "flex-end",
    minWidth:   scale(90, 0.5),  // prevents amount text from wrapping
  },
  statusRow: {
    flexDirection: "row",
    alignItems:    "center",
    marginTop:     2,
  },
});
