import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import ScreenContainer from "../../components/common/ScreenContainer";
import ScreenHeader from "../../components/common/ScreenHeader";
import AppButton from "../../components/common/AppButton";
import StepIndicator from "../../components/common/StepIndicator";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import * as authApi from "../../services/api/authApi";
import { typography, spacing, radius } from "../../theme";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 45;

export default function VerifyIdentityScreen({ navigation, route }) {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const phoneNumber = route?.params?.phoneNumber || "091 000 0000";

  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const handleChange = (text, index) => {
    const next = [...code];
    next[index] = text.slice(-1);
    setCode(next);
    if (text && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      // TODO: connect to real OTP verification endpoint.
      await authApi.verifyOtp({ phoneNumber, code: code.join("") });
      navigation.navigate("AccountCreated");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setSecondsLeft(RESEND_SECONDS);
    await authApi.resendOtp({ phoneNumber });
  };

  const formattedTime = `00:${String(secondsLeft).padStart(2, "0")}`;

  return (
    <ScreenContainer>
      <ScreenHeader title="" />
      <Text style={[typography.h2, { color: colors.ink }]}>{t("verifyYourIdentity")}</Text>
      <Text style={[typography.body, { color: colors.gray, marginTop: spacing.xs, marginBottom: spacing.lg }]}>
        {t("letsVerifyIts")}
      </Text>

      <StepIndicator currentStep={2} totalSteps={2} />

      <Text style={[typography.body, { color: colors.ink, marginTop: spacing.lg }]}>
        {t("enterCode")} {phoneNumber}
      </Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: spacing.lg }}>
        {code.map((digit, i) => (
          <TextInput
            key={i}
            ref={(r) => (inputs.current[i] = r)}
            value={digit}
            onChangeText={(text) => handleChange(text, i)}
            keyboardType="number-pad"
            maxLength={1}
            style={{
              width: 44,
              height: 52,
              borderRadius: radius.md,
              borderWidth: 1.5,
              borderColor: digit ? colors.primaryDark : colors.border,
              backgroundColor: colors.surface,
              textAlign: "center",
              fontSize: 20,
              color: colors.ink,
            }}
          />
        ))}
      </View>

      <Pressable
        onPress={secondsLeft === 0 ? handleResend : undefined}
        style={{ alignSelf: "center", marginTop: spacing.lg }}
      >
        <Text style={[typography.caption, { color: colors.gray }]}>
          {t("resendCode")} {secondsLeft > 0 ? formattedTime : ""}
        </Text>
      </Pressable>

      <View style={{ marginTop: spacing.xl }}>
        <AppButton title={t("verify")} onPress={handleVerify} loading={loading} />
      </View>

      <Pressable onPress={() => navigation.goBack()} style={{ alignSelf: "center", marginTop: spacing.md }}>
        <Text style={[typography.caption, { color: colors.primaryDark }]}>{t("changePhoneNumber")}</Text>
      </Pressable>
    </ScreenContainer>
  );
}
