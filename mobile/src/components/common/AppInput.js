import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../theme/ThemeContext";
import { typography } from "../../theme";
import { INPUT_HEIGHT, rr, rs, iconSize } from "../../theme/responsive";

export default function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  error,
}) {
  const { colors } = useAppTheme();
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View style={{ marginBottom: rs.md }}>
      {label ? (
        <Text style={[typography.bodyMedium, { color: colors.ink, marginBottom: rs.xs }]}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.input || colors.surface,
            borderColor: error ? colors.danger : colors.border,
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.gray}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={[typography.body, { flex: 1, color: colors.ink }]}
        />
        {secureTextEntry ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
            <Ionicons name={hidden ? "eye-off-outline" : "eye-outline"} size={iconSize.sm} color={colors.gray} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text style={[typography.caption, { color: colors.danger, marginTop: rs.xs }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: rr.md,
    paddingHorizontal: rs.md,
    height: INPUT_HEIGHT,
  },
});
