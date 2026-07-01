import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import ScreenContainer from "../../components/common/ScreenContainer";
import ScreenHeader from "../../components/common/ScreenHeader";
import AppInput from "../../components/common/AppInput";
import AppButton from "../../components/common/AppButton";
import StepIndicator from "../../components/common/StepIndicator";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { useAuth } from "../../store/AuthContext";
import * as authApi from "../../services/api/authApi";
import { typography, spacing } from "../../theme";

export default function CreateAccountScreen({ navigation }) {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const { setRegisterDraft } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setError("");
    if (!fullName || !phoneNumber || !password) {
      setError(t("fillAllFields"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("passwordsMismatch"));
      return;
    }
    setLoading(true);
    try {
      // TODO: real backend call happens at final submit; this just registers the draft + sends OTP.
      await authApi.signUp({ fullName, phoneNumber, password });
      setRegisterDraft({ fullName, phoneNumber });
      navigation.navigate("VerifyIdentity", { phoneNumber });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="" />
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={[typography.h2, { color: colors.ink }]}>{t("createAccount")}</Text>
        <Text style={[typography.body, { color: colors.gray, marginTop: spacing.xs, marginBottom: spacing.lg }]}>
          {t("letsGetStartedAccount")}
        </Text>

        <StepIndicator currentStep={1} totalSteps={2} />

        <View style={{ marginTop: spacing.lg }}>
          <AppInput label={t("fullName")} value={fullName} onChangeText={setFullName} placeholder="Your full name" />
          <AppInput
            label={t("phoneNumber")}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="091 000 0000"
            keyboardType="phone-pad"
          />
          <AppInput label={t("password")} value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
          <AppInput
            label={t("confirmPassword")}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
            secureTextEntry
            error={error}
          />
        </View>

        <View style={{ marginTop: spacing.md }}>
          <AppButton title={t("next")} onPress={handleNext} loading={loading} />
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: spacing.lg }}>
          <Text style={[typography.body, { color: colors.gray }]}>{t("alreadyHaveAccount")} </Text>
          <Text
            style={[typography.bodyMedium, { color: colors.primaryDark }]}
            onPress={() => navigation.navigate("SignIn")}
          >
            {t("signIn")}
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
