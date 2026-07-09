import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "../../components/common/ScreenContainer";
import ScreenHeader from "../../components/common/ScreenHeader";
import AppButton from "../../components/common/AppButton";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { formatCurrency } from "../../utils/format";
import { typography, spacing, radius } from "../../theme";
import { rs } from "../../theme/responsive";
import { navigateToAppScreen } from "../../navigation/navigateTo";

export default function PaymentVerifiedScreen({ navigation, route }) {
  const { colors, shadows } = useAppTheme();
  const { t } = useI18n();
  const details = route?.params?.details || {};

  const handleScanAnother = () => {
    navigation.navigate("MainTabs", { screen: "Scan" });
  };

  const handleViewDetails = () => {
    navigation.navigate("MainTabs", { screen: "Home" });
  };

  // Extract values, default to mock values if not provided
  const amountStr = details.amount
    ? `${formatCurrency(details.amount, "").trim()} ${details.currency || "ETB"}`
    : "500.00 ETB";
  const provider = details.selectedBank?.toUpperCase() || "CBE";
  const senderName = details.from || "Abebe Kebede";
  const senderPhone = details.senderPhone || "0911 223 344";
  const reference = details.reference || "FT23001234ABC";

  // Format current date matching the design (e.g. "Jun 24, 2026 • 10:42 AM")
  const verifiedAt = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) + " • " + new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <ScreenContainer>
      <ScreenHeader title={t("verificationResult") || "Verification Result"} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: rs.xl }}>

        {/* Verification Success Box */}
        <View
          style={{
            backgroundColor: "#E6F6ED", // Light green background matching design
            borderRadius: radius.lg,
            padding: spacing.xl,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: spacing.lg,
            marginTop: spacing.sm,
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: radius.pill,
              backgroundColor: colors.success, // Dark green
              alignItems: "center",
              justifyContent: "center",
              marginBottom: spacing.md,
            }}
          >
            <Ionicons name="checkmark" size={40} color="#FFFFFF" />
          </View>
          <Text style={[typography.h2, { color: colors.success, marginBottom: spacing.xs }]}>
            VERIFIED
          </Text>
          <Text style={[typography.body, { color: colors.success }]}>
            Payment verified successfully
          </Text>
        </View>

        {/* Details Card */}
        <View
          style={[
            shadows.card,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              padding: spacing.md,
              marginBottom: rs.xl,
              borderWidth: 1,
              borderColor: colors.border,
            },
          ]}
        >
          <Row label="Amount" value={amountStr} colors={colors} valueBold />
          <Row label="Provider / Bank" value={provider} colors={colors} valueBold />
          <Row label="Sender Name" value={senderName} colors={colors} valueBold />
          <Row label="Sender Phone" value={senderPhone} colors={colors} valueBold />
          <Row label="Receipt / Reference" value={reference} colors={colors} valueBold />
          <Row label="Verified At" value={verifiedAt} colors={colors} valueBold />

          {/* Message Row */}
          <View style={{ paddingTop: spacing.md }}>
            <Text style={[typography.body, { color: colors.gray }]}>Message</Text>
            <Text style={[typography.bodyMedium, { color: colors.ink, marginTop: spacing.xs, fontWeight: "600" }]}>
              Payment verified successfully
            </Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        {/* Action Buttons */}
        <View style={{ flexDirection: "row", gap: rs.md, marginBottom: rs.md }}>
          <View style={{ flex: 1 }}>
            <AppButton
              title="Scan Another"
              variant="outline"
              onPress={handleScanAnother}
            />
          </View>
          <View style={{ flex: 1 }}>
            <AppButton
              title="View Details"
              variant="primary"
              onPress={handleViewDetails}
              style={shadows.button}
            />
          </View>
        </View>

      </ScrollView>
    </ScreenContainer>
  );
}

function Row({ label, value, colors, valueBold, last }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: spacing.md,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.border,
        alignItems: "center"
      }}
    >
      <Text style={[typography.body, { color: colors.gray, flex: 0.45 }]}>{label}</Text>
      <Text
        style={[
          typography.bodyMedium,
          {
            color: colors.ink,
            textAlign: "right",
            flex: 0.55,
            fontWeight: valueBold ? "600" : "normal"
          }
        ]}
      >
        {value}
      </Text>
    </View>
  );
}
