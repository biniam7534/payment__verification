import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "../../components/common/ScreenContainer";
import ScreenHeader from "../../components/common/ScreenHeader";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import SupportedBanksList from "../../components/dashboard/SupportedBanksList";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { useAuth } from "../../store/AuthContext";
import * as paymentsApi from "../../services/api/paymentsApi";
import { navigateToAppScreen } from "../../navigation/navigateTo";
import { typography, spacing, radius } from "../../theme";
import { rs, iconSize } from "../../theme/responsive";

export default function VerifyPaymentScreen({ navigation, route }) {
  const { colors, shadows } = useAppTheme();
  const { t } = useI18n();
  const { user } = useAuth();

  const initialDetails = route?.params?.details || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedBank, setSelectedBank] = useState(initialDetails.from?.toLowerCase() || "cbe");
  const [reference, setReference] = useState(initialDetails.reference || "FT23001234ABC");
  const [amount, setAmount] = useState(initialDetails.amount ? initialDetails.amount.toString() : "500.00");
  const [senderName, setSenderName] = useState("Abebe Kebede");
  const [senderPhone, setSenderPhone] = useState("0911 223 344");
  const [receiptUrl, setReceiptUrl] = useState("https://receipt.url/abc");

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    try {
      const details = {
        id: initialDetails.id || "tx_" + Date.now(),
        from: senderName || "Abebe Kebede",
        reference: reference,
        amount: parseFloat(amount) || 500,
        currency: initialDetails.currency || "ETB",
        senderPhone: senderPhone || "0911 223 344",
        selectedBank: selectedBank || "CBE",
      };
      await paymentsApi.confirmPayment(details.id);
      navigateToAppScreen(navigation, "PaymentVerified", { details });
    } catch (e) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title={t("verifyPayment") || "Verify Payment"}
        rightAction={<Ionicons name="time-outline" size={iconSize.md} color={colors.ink} />}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: rs.xl }}>

        {/* 1. Select Provider */}
        <Text style={[typography.h3, { color: colors.ink, marginBottom: rs.md, marginTop: rs.sm }]}>
          1. Select Provider
        </Text>
        <View style={{ marginHorizontal: -spacing.md, paddingLeft: spacing.md, marginBottom: rs.lg }}>
          <SupportedBanksList
            selectedBank={selectedBank}
            onSelectBank={id => setSelectedBank(id)}
          />
        </View>

        {/* 2. Payment Details */}
        <Text style={[typography.h3, { color: colors.ink, marginBottom: rs.md }]}>
          2. Payment Details
        </Text>
        <View style={{ marginBottom: rs.md }}>
          <AppInput
            label="Receipt ID / Reference *"
            value={reference}
            onChangeText={setReference}
          />
          <AppInput
            label="Amount (ETB)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <View style={{ flexDirection: "row", gap: rs.md }}>
            <View style={{ flex: 1 }}>
              <AppInput
                label="Sender Name (Optional)"
                value={senderName}
                onChangeText={setSenderName}
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppInput
                label="Sender Phone (Optional)"
                value={senderPhone}
                onChangeText={setSenderPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>
          <AppInput
            label="Receipt URL (Optional)"
            value={receiptUrl}
            onChangeText={setReceiptUrl}
            keyboardType="url"
          />
        </View>

        {/* 3. Receiver (From Profile) */}
        <Text style={[typography.h3, { color: colors.ink, marginBottom: rs.md }]}>
          3. Receiver (From Profile)
        </Text>
        <View style={[shadows.card, { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, marginBottom: rs.xl, borderWidth: 1, borderColor: colors.border }]}>
          <Text style={[typography.caption, { color: colors.gray, marginBottom: spacing.xs }]}>
            Receiver Name
          </Text>
          <Text style={[typography.bodyMedium, { color: colors.ink, marginBottom: spacing.md }]}>
            {user?.name || "Natnael Example"}
          </Text>

          <Text style={[typography.caption, { color: colors.gray, marginBottom: spacing.xs }]}>
            Receiver Account
          </Text>
          <Text style={[typography.bodyMedium, { color: colors.ink }]}>
            {user?.account || "1000017692643"}
          </Text>
        </View>

        {error ? (
          <Text style={[typography.caption, { color: colors.danger, marginBottom: rs.md, textAlign: "center" }]}>
            {error}
          </Text>
        ) : null}

        <View style={{ flex: 1 }} />

        <AppButton
          title={t("verifyPayment") || "Verify Payment"}
          icon={<Ionicons name="shield-checkmark" size={iconSize.sm} color="#fff" />}
          onPress={handleVerify}
          loading={loading}
          style={shadows.button}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
