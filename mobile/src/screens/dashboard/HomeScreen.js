import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "../../components/common/ScreenContainer";
import BalanceCard from "../../components/dashboard/BalanceCard";
import StatCard from "../../components/dashboard/StatCard";
import TransactionRow from "../../components/dashboard/TransactionRow";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { useAuth } from "../../store/AuthContext";
import * as paymentsApi from "../../services/api/paymentsApi";
import { typography, spacing, radius } from "../../theme";

function greetingKey() {
  const hour = new Date().getHours();
  return hour < 17 ? "goodMorning" : "goodEvening";
}

export default function HomeScreen({ navigation }) {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const { user } = useAuth();
  const [summary, setSummary] = useState({ totalVerifiedToday: 0, currency: "ETB", stats: {} });
  const [transactions, setTransactions] = useState([]);

  const load = useCallback(async () => {
    // TODO: replace mocked calls with real backend data fetching + error handling/loading states.
    const [s, tx] = await Promise.all([paymentsApi.getDashboardSummary(), paymentsApi.getTransactions()]);
    setSummary(s);
    setTransactions(tx.slice(0, 3));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const actions = [
    { key: "send", label: t("sendMoney"), icon: "arrow-up-circle-outline", onPress: () => {} },
    { key: "receive", label: t("receive"), icon: "arrow-down-circle-outline", onPress: () => {} },
    { key: "scan", label: t("scanQR"), icon: "qr-code-outline", onPress: () => navigation.navigate("Scan") },
    { key: "more", label: t("more"), icon: "ellipsis-horizontal-circle-outline", onPress: () => navigation.navigate("Profile") },
  ];

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md }}>
          <View>
            <Text style={[typography.body, { color: colors.gray }]}>{t(greetingKey())},</Text>
            <Text style={[typography.h3, { color: colors.ink }]}>{user?.name || "Abel"} 👋</Text>
          </View>
          <Pressable
            style={{ width: 40, height: 40, borderRadius: radius.pill, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }}
          >
            <Ionicons name="notifications-outline" size={20} color={colors.ink} />
          </Pressable>
        </View>

        <BalanceCard amount={summary.totalVerifiedToday} currency={summary.currency} />

        <View style={{ flexDirection: "row", marginBottom: spacing.lg }}>
          <StatCard label={t("today")} value={summary.stats?.totalToday ?? "-"} />
          <StatCard
            label={t("totalVerified")}
            value={summary.stats?.totalVerifiedAmount?.toLocaleString() ?? "-"}
          />
          <StatCard
            label="Success"
            value={summary.stats ? `${Math.round((summary.stats.successRate || 0) * 100)}%` : "-"}
          />
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.lg }}>
          {actions.map((a) => (
            <Pressable key={a.key} onPress={a.onPress} style={{ alignItems: "center", flex: 1 }}>
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: radius.lg,
                  backgroundColor: colors.surface,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: spacing.xs,
                }}
              >
                <Ionicons name={a.icon} size={24} color={colors.primaryDark} />
              </View>
              <Text style={[typography.caption, { color: colors.ink, textAlign: "center" }]}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm }}>
          <Text style={[typography.h3, { color: colors.ink }]}>{t("recentTransactions")}</Text>
          <Pressable onPress={() => navigation.navigate("Transactions")}>
            <Text style={[typography.caption, { color: colors.primaryDark }]}>{t("more")}</Text>
          </Pressable>
        </View>

        <View style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: spacing.md }}>
          {transactions.map((tx) => (
            <TransactionRow key={tx.id} transaction={tx} onPress={() => {}} />
          ))}
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </ScreenContainer>
  );
}
