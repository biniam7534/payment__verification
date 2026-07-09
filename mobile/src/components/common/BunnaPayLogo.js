/**
 * BunnaPayLogo
 *
 * Renders the BunaPay logo icon (bean + checkmark PNG with transparent bg).
 *
 * File expected at:  mobile/src/assets/images/bunapay-logo.png
 *
 * Props:
 *   size   – "sm" | "md" | "lg"  (default "md")
 *   style  – extra container style
 */
import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, moderateScale } from "../../theme/responsive";

// Width of the logo image per size (height is 1:1 — square crop)
const WIDTHS = {
  sm: scale(64, 0.5),
  md: scale(96, 0.5),
  lg: scale(140, 0.5),
};

let logoSource = null;
try {
  logoSource = require("../../assets/images/bunapay-logo.png");
} catch (_) {
  logoSource = null;
}

export default function BunnaPayLogo({ size = "md", style }) {
  const w = WIDTHS[size] ?? WIDTHS.md;

  const outerSize = w * 1.4;
  const innerSize = w * 1.05;
  const shieldSize = w * 0.55;

  return (
    <View style={[styles.wrap, style]}>
      {/* Outer concentric ring */}
      <View
        style={{
          width: outerSize,
          height: outerSize,
          borderRadius: outerSize / 2,
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Inner concentric ring */}
        <View
          style={{
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* White Shield Container with green checkmark inside */}
          <View style={{ position: "relative", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="shield" size={shieldSize} color="#FFFFFF" />
            <View style={{ position: "absolute", zIndex: 1, top: shieldSize * 0.18 }}>
              <Ionicons name="checkmark-sharp" size={shieldSize * 0.55} color="#1A6B38" style={{ fontWeight: "bold" }} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
});
