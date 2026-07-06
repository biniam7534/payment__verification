import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../../theme/ThemeContext";
import { typography } from "../../theme";
import { rs, iconSize, scale } from "../../theme/responsive";

export default function ScreenHeader({ title, onBack, rightAction }) {
  const navigation = useNavigation();
  const { colors } = useAppTheme();

  return (
    <View style={styles.row}>
      <Pressable onPress={onBack || navigation.goBack} hitSlop={10} style={styles.iconBtn}>
        <Ionicons name="chevron-back" size={iconSize.md} color={colors.ink} />
      </Pressable>
      <Text style={[typography.h3, { color: colors.ink, flex: 1, textAlign: "center" }]}>
        {title}
      </Text>
      <View style={styles.iconBtn}>{rightAction || null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: rs.md,
  },
  iconBtn: { width: scale(32, 0.4), alignItems: "center" },
});
