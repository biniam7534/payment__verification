import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography, spacing, radius } from "../../theme";

export default function BunnaPayLogo({ size = "md", color = "#fff", showText = true, textColor }) {
  const iconSize = size === "lg" ? 56 : size === "sm" ? 28 : 40;
  const labelColor = textColor || color;

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.iconCircle,
          {
            width: iconSize,
            height: iconSize,
            borderRadius: iconSize / 2,
            backgroundColor: color === "#fff" ? "rgba(255,255,255,0.15)" : "#16A34A18",
          },
        ]}
      >
        <Ionicons
          name="cafe"
          size={iconSize * 0.5}
          color={color === "#fff" ? "#84CC16" : "#16A34A"}
        />
      </View>
      {showText ? (
        <View style={styles.textWrap}>
          <Text style={[typography.h3, { color: labelColor, fontSize: size === "lg" ? 24 : 18 }]}>
            BunnaPay
          </Text>
          {size === "lg" ? (
            <Text style={[typography.caption, { color: labelColor, opacity: 0.85, marginTop: 2 }]}>
              Simple. Secure. Everywhere.
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    marginLeft: spacing.sm,
  },
});
