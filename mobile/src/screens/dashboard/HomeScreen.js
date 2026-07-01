import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "../../components/common/ScreenContainer";
import BalanceCard from "../../components/dashboard/BalanceCard";
import StatCard from "../../components/dashboard/StatCard";
import TransactionRow from "../../components/dashboard/TransactionRow";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { useAuth } from "../../store/AuthContext";
import * as paymentsApi from "../../services/api/paymentsApi";
import { navigateToAppScreen } from "../../navigation/navigateTo";
import { typography, spacing, radius } from "../../theme";

function greetingKey() {
  const hour = new Date().getHours();
  return hour < 17 ? "goodMorning" : "goodEvening";
}

function UserAvatar({ name, colors }) {
  const initial = (name || "A").charAt(0).toUpperCase();
  return (
    <View
      style={{
        width: 44,
        height: 44,
        borderRadius: radius.pill,
        backgroundColor: colors.primaryDark,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={[typography.bodyMedium, { color: "#fff" }]}>{initial}</Text>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { colors, shadows } = useAppTheme();
  const { t } = useI18n();
  const { user } = useAuth();
  const [summary, setSummary] = useState({ totalVerifiedToday: 0, currency: "ETB", stats: {} });
  const [transactions, setTransactions] = useState([]);

  const load = useCallback(async () => {
    const [s, tx] = await Promise.all([paymentsApi.getDashboardSummary(), paymentsApi.getTransactions()]);
    setSummary(s);
    setTransactions(tx.slice(0, 3));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const actions = [
    { key: "send", label: t("sendMoney"), icon: "arrow-up-circle-outline", onPress: () => {} },
    {
      key: "receive",
      label: t("receive"),
      icon: "arrow-down-circle-outline",
      onPress: () => navigateToAppScreen(navigation, "AddPaymentScreenshot"),
    },
    { key: "scan", label: t("scanQR"), icon: "qr-code-outline", onPress: () => navigation.navigate("Scan") },
    { key: "more", label: t("more"), icon: "ellipsis-horizontal-circle-outline", onPress: () => navigation.navigate("Profile") },
  ];

  const displayName = user?.name?.split(" ")[0] || "Abel";

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.lg }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <UserAvatar name={user?.name} colors={colors} />
            <View style={{ marginLeft: spacing.md }}>
              <Text style={[typography.caption, { color: colors.gray }]}>{t(greetingKey())},</Text>
              <Text style={[typography.h3, { color: colors.ink }]}>{displayName} 👋</Text>
            </View>
          </View>
          <Pressable
            style={[
              shadows.card,
              {
                width: 44,
                height: 44,
                borderRadius: radius.pill,
                backgroundColor: colors.surface,
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.ink} />
          </Pressable>
        </View>

        <BalanceCard amount={summary.totalVerifiedToday} currency={summary.currency} />

        <View style={{ flexDirection: "row", marginBottom: spacing.lg, marginHorizontal: -spacing.xs / 2 }}>
          <StatCard label={t("today")} value={summary.stats?.totalToday ?? "-"} />
          <StatCard
            label={t("totalVerified")}
            value={summary.stats?.totalVerifiedAmount?.toLocaleString() ?? "-"}
          />
          <StatCard
            label={t("success")}
            value={summary.stats ? `${Math.round((summary.stats.successRate || 0) * 100)}%` : "-"}
          />
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.lg }}>
          {actions.map((a) => (
            <Pressable key={a.key} onPress={a.onPress} style={{ alignItems: "center", flex: 1 }}>
              <View
                style={[
                  shadows.card,
                  {
                    width: 56,
                    height: 56,
                    borderRadius: radius.pill,
                    backgroundColor: colors.surface,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: spacing.xs,
                  },
                ]}
              >
                <Ionicons name={a.icon} size={26} color={colors.primaryDark} />
              </View>
              <Text style={[typography.caption, { color: colors.ink, textAlign: "center", fontSize: 11 }]}>
                {a.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm }}>
          <Text style={[typography.h3, { color: colors.ink }]}>{t("recentTransactions")}</Text>
          <Pressable onPress={() => navigation.navigate("Transactions")}>
            <Text style={[typography.caption, { color: colors.primaryDark }]}>{t("viewAll")}</Text>
          </Pressable>
        </View>

        <View style={[shadows.card, { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: spacing.md }]}>
          {transactions.map((tx, i) => (
            <TransactionRow
              key={tx.id}
              transaction={tx}
              onPress={() => navigateToAppScreen(navigation, "AddPaymentScreenshot")}
              showBorder={i < transactions.length - 1}
            />
          ))}
        </View>

        <Pressable
          onPress={() => navigateToAppScreen(navigation, "AddPaymentScreenshot")}
          style={[
            shadows.card,
            {
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.primaryDark,
              borderRadius: radius.lg,
              padding: spacing.md,
              marginTop: spacing.lg,
            },
          ]}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: radius.pill,
              backgroundColor: "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="receipt-outline" size={22} color="#fff" />
          </View>
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={[typography.bodyMedium, { color: "#fff" }]}>{t("verifyAPayment")}</Text>
            <Text style={[typography.caption, { color: "rgba(255,255,255,0.85)", marginTop: 2 }]}>
              {t("uploadPaymentHint")}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </Pressable>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </ScreenContainer>
  );
}
