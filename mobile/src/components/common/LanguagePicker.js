import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { typography, spacing, radius } from "../../theme";

export default function LanguagePicker({ onPress, compact = false }) {
  const { colors } = useAppTheme();
  const { t, language, setLanguage, languages } = useI18n();
  const current = languages.find((l) => l.code === language);

  const select = (code) => {
    setLanguage(code);
    onPress?.(code);
  };

  if (compact) {
    return (
      <Pressable onPress={onPress} style={[styles.compact, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <Ionicons name="globe-outline" size={16} color={colors.primaryDark} />
        <Text style={[typography.caption, { color: colors.ink, marginLeft: spacing.xs }]}>
          {current?.nativeLabel || language.toUpperCase()}
        </Text>
        <Ionicons name="chevron-down" size={14} color={colors.gray} style={{ marginLeft: spacing.xs }} />
      </Pressable>
    );
  }

  return (
    <View style={styles.row}>
      <Text style={[typography.caption, { color: colors.gray, marginBottom: spacing.sm, width: "100%", textAlign: "center" }]}>
        {t("chooseYourLanguage")}
      </Text>
      <View style={styles.chips}>
        {languages.map((lang) => (
          <Pressable
            key={lang.code}
            onPress={() => select(lang.code)}
            style={[
              styles.chip,
              {
                backgroundColor: language === lang.code ? colors.primaryDark : colors.surface,
                borderColor: language === lang.code ? colors.primaryDark : colors.border,
              },
            ]}
          >
            <Text
              style={[
                typography.caption,
                { color: language === lang.code ? "#fff" : colors.ink, fontWeight: "600" },
              ]}
            >
              {lang.code.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    width: "100%",
  },
  chips: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginHorizontal: spacing.xs / 2,
    marginVertical: spacing.xs / 2,
  },
  compact: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
