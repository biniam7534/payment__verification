import React, { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import ScreenContainer from "../../components/common/ScreenContainer";
import ScreenHeader from "../../components/common/ScreenHeader";
import AppButton from "../../components/common/AppButton";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import * as paymentsApi from "../../services/api/paymentsApi";
import { typography, spacing, radius } from "../../theme";

function DetailRow({ label, value, colors }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <Text style={[typography.body, { color: colors.gray }]}>{label}</Text>
      <Text style={[typography.bodyMedium, { color: colors.ink }]}>{value}</Text>
    </View>
  );
}

export default function VerifyPaymentScreen({ navigation, route }) {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const details = route?.params?.details || {};
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      // TODO: connect confirmPayment() to the real backend confirmation endpoint.
      await paymentsApi.confirmPayment(details.id);
      navigation.navigate("PaymentVerified", { details });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title={t("verifyPayment")} />

      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          padding: spacing.md,
          marginTop: spacing.md,
        }}
      >
        <DetailRow label={t("from")} value={details.from || "—"} colors={colors} />
        <DetailRow label={t("reference")} value={details.reference || "—"} colors={colors} />
        <DetailRow
          label={t("amount")}
          value={`${details.currency || "ETB"} ${(details.amount ?? 0).toFixed(2)}`}
          colors={colors}
        />
      </View>

      {details.screenshotUri ? (
        <View style={{ marginTop: spacing.md }}>
          <Text style={[typography.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>
            {t("screenshot")}
          </Text>
          <Image
            source={{ uri: details.screenshotUri }}
            style={{ width: "100%", height: 200, borderRadius: radius.lg }}
            resizeMode="cover"
          />
        </View>
      ) : null}

      <View style={{ flex: 1 }} />

      <AppButton title={t("verifyPayment")} onPress={handleVerify} loading={loading} />

      <Pressable style={{ alignSelf: "center", marginTop: spacing.md }}>
        <Text style={[typography.caption, { color: colors.danger }]}>{t("somethingWrong")}</Text>
      </Pressable>
    </ScreenContainer>
  );
}
