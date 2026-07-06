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
import { scale, moderateScale } from "../../theme/responsive";

// Width of the logo image per size (height is 1:1 — square crop)
const WIDTHS = {
  sm: scale(64,  0.5),
  md: scale(96,  0.5),
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

  if (logoSource) {
    return (
      <View style={[styles.wrap, style]}>
        <Image
          source={logoSource}
          style={{ width: w, height: w }}
          resizeMode="contain"
          accessibilityLabel="BunaPay logo"
        />
      </View>
    );
  }

  // Fallback: draw the bean shape with Views when the PNG is missing
  const armW = w * 0.13;
  const fs   = size === "lg" ? moderateScale(28) : size === "sm" ? moderateScale(15) : moderateScale(20);

  return (
    <View style={[styles.wrap, style]}>
      {/* Bean icon fallback */}
      <View style={{ width: w, height: w, alignItems: "center", justifyContent: "center" }}>
        <View style={{ position:"absolute", width: w, height: w * 0.9, borderRadius: w*0.5, backgroundColor:"#22C55E", transform:[{rotate:"-12deg"},{scaleX:0.82}] }} />
        <View style={{ position:"absolute", width: w*0.80, height: w*0.72, borderRadius: w*0.5, backgroundColor:"#16A34A", transform:[{rotate:"12deg"},{scaleX:0.88},{translateX:w*0.05}] }} />
        <View style={{ position:"absolute", width: armW, height: w*0.48, borderRadius: armW/2, backgroundColor:"#fff", transform:[{translateX:-w*0.12},{translateY:w*0.06},{rotate:"30deg"}] }} />
        <View style={{ position:"absolute", width: armW, height: w*0.65, borderRadius: armW/2, backgroundColor:"#fff", transform:[{translateX:w*0.16},{translateY:-w*0.02},{rotate:"-28deg"}] }} />
      </View>

      {/* Wordmark */}
      <View style={styles.nameRow}>
        <Text style={[styles.buna, { fontSize: fs }]}>Buna</Text>
        <Text style={[styles.pay,  { fontSize: fs }]}>Pay</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:    { alignItems: "center", justifyContent: "center" },
  nameRow: { flexDirection: "row", alignItems: "baseline", marginTop: scale(8, 0.4) },
  buna:    { fontWeight: "800", color: "#22C55E", letterSpacing: 0.4 },
  pay:     { fontWeight: "800", color: "#FFFFFF",  letterSpacing: 0.4 },
});
