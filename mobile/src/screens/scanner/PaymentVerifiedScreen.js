import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "../../components/common/ScreenContainer";
import AppButton from "../../components/common/AppButton";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { useAuth } from "../../store/AuthContext";
import { formatCurrency } from "../../utils/format";
import { typography, spacing, radius } from "../../theme";

export default function PaymentVerifiedScreen({ navigation, route }) {
  const { colors, shadows } = useAppTheme();
  const { t } = useI18n();
  const { user } = useAuth();
  const details = route?.params?.details || {};

  return (
    <ScreenContainer style={{ justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          width: 110,
          height: 110,
          borderRadius: radius.pill,
          backgroundColor: colors.primaryLight + "33",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.lg,
        }}
      >
        <Ionicons name="checkmark-circle" size={84} color={colors.primaryDark} />
      </View>

      <Text style={[typography.h2, { color: colors.ink }]}>{t("paymentVerified")}</Text>
      <Text style={[typography.body, { color: colors.gray, marginTop: spacing.xs }]}>{t("paymentSuccessful")}</Text>

      <Text style={[typography.h1, { color: colors.ink, marginTop: spacing.lg }]}>
        {formatCurrency(details.amount, details.currency || "ETB")}
      </Text>

      <View
        style={[
          shadows.card,
          {
            width: "100%",
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            padding: spacing.md,
            marginTop: spacing.xl,
          },
        ]}
      >
        <Row label={t("reference")} value={details.reference || "—"} colors={colors} />
        <Row label={t("date")} value={new Date().toLocaleString()} colors={colors} />
        <Row label={t("status")} value={t("verified")} colors={colors} valueColor={colors.success} />
        <Row label={t("receiver")} value={user?.name || "Abel Tesfaye"} colors={colors} last />
      </View>

      <View style={{ width: "100%", marginTop: spacing.xl }}>
        <AppButton
          title={t("done")}
          onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}
          style={shadows.button}
        />
      </View>
    </ScreenContainer>
  );
}

function Row({ label, value, colors, valueColor, last }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: spacing.sm,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      <Text style={[typography.body, { color: colors.gray }]}>{label}</Text>
      <Text style={[typography.bodyMedium, { color: valueColor || colors.ink }]}>{value}</Text>
    </View>
  );
}
