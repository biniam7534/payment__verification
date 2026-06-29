import React, { useState } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "../../components/common/ScreenContainer";
import AppButton from "../../components/common/AppButton";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { useAuth } from "../../store/AuthContext";
import { typography, spacing, radius } from "../../theme";

export default function AccountCreatedScreen() {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const { signIn, registerDraft } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoToDashboard = async () => {
    setLoading(true);
    try {
      // TODO: once the backend issues a session token at sign-up, store it instead of re-signing in here.
      await signIn(registerDraft.phoneNumber, "");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer style={{ justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          width: 96,
          height: 96,
          borderRadius: radius.pill,
          backgroundColor: colors.primaryLight + "33",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.lg,
        }}
      >
        <Ionicons name="checkmark-circle" size={72} color={colors.primaryDark} />
      </View>
      <Text style={[typography.h2, { color: colors.ink, textAlign: "center" }]}>{t("accountCreated")}</Text>
      <Text
        style={[typography.body, { color: colors.gray, textAlign: "center", marginTop: spacing.sm, marginBottom: spacing.xl }]}
      >
        {t("accountReady")}
      </Text>
      <AppButton title={t("goToDashboard")} onPress={handleGoToDashboard} loading={loading} />
    </ScreenContainer>
  );
}
