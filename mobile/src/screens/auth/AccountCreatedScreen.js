import React, { useState } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "../../components/common/ScreenContainer";
import AppButton from "../../components/common/AppButton";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { useAuth } from "../../store/AuthContext";
import { typography } from "../../theme";
import { rs, rr, scale, iconSize } from "../../theme/responsive";

export default function AccountCreatedScreen({ navigation }) {
  const { colors, shadows } = useAppTheme();
  const { t } = useI18n();
  const { signIn, registerDraft } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoToDashboard = async () => {
    setLoading(true);
    try {
      // Sign in with the credentials from registration so the user object
      // carries the correct name (fullName) and phone number.
      await signIn(registerDraft.phoneNumber, registerDraft.password ?? "");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer style={{ justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          width: scale(110, 0.4),
          height: scale(110, 0.4),
          borderRadius: rr.pill,
          backgroundColor: colors.primaryLight + "33",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: rs.lg,
        }}
      >
        <Ionicons name="checkmark-circle" size={iconSize.xxl * 1.3} color={colors.primaryDark} />
      </View>
      <Text style={[typography.h2, { color: colors.ink, textAlign: "center" }]}>{t("accountCreated")}</Text>
      <Text
        style={[typography.body, { color: colors.gray, textAlign: "center", marginTop: rs.sm, marginBottom: rs.xl }]}
      >
        {t("accountReady")}
      </Text>
      <AppButton title={t("goToDashboard")} onPress={handleGoToDashboard} loading={loading} style={shadows.button} />
    </ScreenContainer>
  );
}
