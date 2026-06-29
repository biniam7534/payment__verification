import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "../../components/common/ScreenContainer";
import ScreenHeader from "../../components/common/ScreenHeader";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { typography, spacing, radius } from "../../theme";

export default function LanguageScreen() {
  const { colors } = useAppTheme();
  const { t, language, setLanguage, languages } = useI18n();

  return (
    <ScreenContainer>
      <ScreenHeader title={t("chooseYourLanguage")} />
      <Text style={[typography.body, { color: colors.gray, marginBottom: spacing.lg }]}>
        {t("canChangeAnytime")}
      </Text>

      {languages.map((lang) => (
        <Pressable
          key={lang.code}
          onPress={() => setLanguage(lang.code)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            padding: spacing.md,
            marginBottom: spacing.sm,
            borderWidth: language === lang.code ? 1.5 : 0,
            borderColor: colors.primaryDark,
          }}
        >
          <View>
            <Text style={[typography.bodyMedium, { color: colors.ink }]}>{lang.label}</Text>
            <Text style={[typography.caption, { color: colors.gray }]}>{lang.nativeLabel}</Text>
          </View>
          {language === lang.code && <Ionicons name="checkmark-circle" size={22} color={colors.primaryDark} />}
        </Pressable>
      ))}
    </ScreenContainer>
  );
}
