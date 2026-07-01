import React, { useState } from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "../../components/common/ScreenContainer";
import ScreenHeader from "../../components/common/ScreenHeader";
import AppButton from "../../components/common/AppButton";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import * as paymentsApi from "../../services/api/paymentsApi";
import { navigateToAppScreen } from "../../navigation/navigateTo";
import { formatCurrency } from "../../utils/format";
import { typography, spacing, radius } from "../../theme";

function DetailRow({ label, value, colors, last, highlight }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: spacing.md,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      <Text style={[typography.body, { color: colors.gray }]}>{label}</Text>
      <Text
        style={[
          highlight ? typography.h3 : typography.bodyMedium,
          { color: highlight ? colors.primaryDark : colors.ink },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

export default function VerifyPaymentScreen({ navigation, route }) {
  const { colors, shadows } = useAppTheme();
  const { t } = useI18n();
  const details = route?.params?.details || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    try {
      await paymentsApi.confirmPayment(details.id);
      navigateToAppScreen(navigation, "PaymentVerified", { details });
    } catch (e) {
      setError(t("verifyFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async () => {
    try {
      await paymentsApi.reportPaymentIssue(details.id, "user_reported");
      navigation.goBack();
    } catch (e) {
      setError(t("verifyFailed"));
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title={t("verifyPayment")} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={[typography.body, { color: colors.gray, marginBottom: spacing.md }]}>
          {t("reviewPaymentDetails")}
        </Text>

        <View style={[shadows.card, { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: spacing.md }]}>
          <DetailRow label={t("from")} value={details.from || "—"} colors={colors} />
          <DetailRow label={t("reference")} value={details.reference || "—"} colors={colors} />
          <DetailRow
            label={t("amount")}
            value={formatCurrency(details.amount, details.currency || "ETB")}
            colors={colors}
            highlight
            last
          />
        </View>

        {details.screenshotUri ? (
          <View style={{ marginTop: spacing.lg }}>
            <Text style={[typography.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>
              {t("screenshot")}
            </Text>
            <View style={[shadows.card, { borderRadius: radius.lg, overflow: "hidden" }]}>
              <Image
                source={{ uri: details.screenshotUri }}
                style={{ width: "100%", height: 220 }}
                resizeMode="cover"
              />
            </View>
          </View>
        ) : null}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.success + "15",
            borderRadius: radius.md,
            padding: spacing.md,
            marginTop: spacing.lg,
          }}
        >
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.success} />
          <Text style={[typography.caption, { color: colors.ink, marginLeft: spacing.sm, flex: 1 }]}>
            {t("verifyPaymentHint")}
          </Text>
        </View>

        {error ? (
          <Text style={[typography.caption, { color: colors.danger, marginTop: spacing.md }]}>{error}</Text>
        ) : null}

        <View style={{ flex: 1, minHeight: spacing.xl }} />

        <AppButton title={t("verifyPayment")} onPress={handleVerify} loading={loading} style={shadows.button} />

        <Pressable onPress={handleReport} style={{ alignSelf: "center", marginTop: spacing.md, marginBottom: spacing.md }}>
          <Text style={[typography.caption, { color: colors.danger }]}>{t("somethingWrong")}</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
