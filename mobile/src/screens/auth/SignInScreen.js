import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "../../components/common/ScreenContainer";
import AppInput from "../../components/common/AppInput";
import AppButton from "../../components/common/AppButton";
import BunnaPayLogo from "../../components/common/BunnaPayLogo";
import LanguagePicker from "../../components/common/LanguagePicker";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { useAuth } from "../../store/AuthContext";
import { typography, spacing, radius } from "../../theme";

export default function SignInScreen({ navigation }) {
  const { colors, shadows } = useAppTheme();
  const { t } = useI18n();
  const { signIn, isLoading } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    setError("");
    if (!phoneNumber || !password) {
      setError(t("fieldsRequired"));
      return;
    }
    try {
      await signIn(phoneNumber, password);
    } catch (e) {
      setError(t("signInFailed"));
    }
  };

  return (
    <ScreenContainer noPadding edges={["top", "bottom", "left", "right"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={[styles(colors).hero, { backgroundColor: colors.hero || colors.primary }]}>
            <View style={styles(colors).heroTop}>
              <BunnaPayLogo size="sm" color="#fff" showText />
            </View>

            <View style={styles(colors).heroIcon}>
              <View style={styles(colors).shieldWrap}>
                <Ionicons name="shield-checkmark" size={56} color="#fff" />
              </View>
            </View>

            <Text style={[typography.h2, { color: "#fff", marginTop: spacing.lg, textAlign: "center" }]}>
              {t("welcomeBack")}
            </Text>
            <Text style={[typography.body, { color: "rgba(255,255,255,0.85)", marginTop: spacing.xs, textAlign: "center" }]}>
              {t("signInToContinue")}
            </Text>
          </View>

          <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg, flex: 1 }}>
            <AppInput
              label={t("phoneNumber")}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="091 000 0000"
              keyboardType="phone-pad"
            />
            <AppInput
              label={t("password")}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              error={error}
            />

            <View style={styles(colors).row}>
              <Pressable style={styles(colors).rememberRow} onPress={() => setRemember((r) => !r)}>
                <View
                  style={[
                    styles(colors).checkbox,
                    remember && { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark },
                  ]}
                >
                  {remember && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <Text style={[typography.caption, { color: colors.ink, marginLeft: spacing.xs }]}>
                  {t("rememberMe")}
                </Text>
              </Pressable>
              <Pressable>
                <Text style={[typography.caption, { color: colors.primaryDark }]}>{t("forgotPassword")}</Text>
              </Pressable>
            </View>

            <View style={{ marginTop: spacing.lg }}>
              <AppButton title={t("signIn")} onPress={handleSignIn} loading={isLoading} style={shadows.button} />
            </View>

            <View style={[styles(colors).row, { justifyContent: "center", marginTop: spacing.lg }]}>
              <Text style={[typography.body, { color: colors.gray }]}>{t("noAccount")} </Text>
              <Pressable onPress={() => navigation.navigate("CreateAccount")}>
                <Text style={[typography.bodyMedium, { color: colors.primaryDark }]}>{t("signUp")}</Text>
              </Pressable>
            </View>

            <View style={{ marginTop: spacing.xl, marginBottom: spacing.lg }}>
              <LanguagePicker />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = (colors) => ({
  hero: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: "center",
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  heroTop: {
    position: "absolute",
    top: spacing.lg,
    left: spacing.lg,
  },
  heroIcon: {
    marginTop: spacing.xxl,
    alignItems: "center",
  },
  shieldWrap: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rememberRow: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
});
