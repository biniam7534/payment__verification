/**
 * HomeScreen
 *
 * Layout (top → bottom):
 *   1. Header row        — avatar + greeting + notification bell
 *   2. Balance card      — total verified today
 *   3. Status filter row — All · Verified · Pending · Failed  (tappable cards)
 *   4. Supported banks   — horizontal scroll strip
 *   5. Transactions      — full filtered list with SectionHeader + "View all"
 *   6. Verify CTA banner — quick-launch card at the bottom
 */
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "../../components/common/ScreenContainer";
import BalanceCard from "../../components/dashboard/BalanceCard";
import StatusFilterCard from "../../components/dashboard/StatusFilterCard";
import SupportedBanksList from "../../components/dashboard/SupportedBanksList";
import TransactionRow from "../../components/dashboard/TransactionRow";
import BankSelectionModal from "../../components/common/BankSelectionModal";
import Avatar from "../../components/common/Avatar";
import Card from "../../components/common/Card";
import SectionHeader from "../../components/common/SectionHeader";
import EmptyState from "../../components/common/EmptyState";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { useAuth } from "../../store/AuthContext";
import * as paymentsApi from "../../services/api/paymentsApi";
import * as businessApi from "../../services/api/businessApi";
import { navigateToAppScreen } from "../../navigation/navigateTo";
import { typography } from "../../theme";
import {
  rs, rr, scale, iconSize, screenPadding, moderateScale,
} from "../../theme/responsive";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function greetingKey() {
  return new Date().getHours() < 17 ? "goodMorning" : "goodEvening";
}

/** Count transactions per status bucket */
function buildCounts(transactions) {
  const counts = { all: 0, verified: 0, pending: 0, failed: 0 };
  transactions.forEach(tx => {
    counts.all++;
    if (counts[tx.status] !== undefined) counts[tx.status]++;
  });
  return counts;
}

// ─── Status filter config ─────────────────────────────────────────────────────
const STATUS_FILTERS = [
  { key: "all", labelKey: "allStatus" },
  { key: "verified", labelKey: "verified" },
  { key: "pending", labelKey: "pending" },
  { key: "failed", labelKey: "failed" },
];

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const { colors, shadows } = useAppTheme();
  const { t } = useI18n();
  const { user } = useAuth();

  const [summary, setSummary] = useState({ totalVerifiedToday: 0, currency: "ETB", stats: {} });
  const [allTransactions, setAllTransactions] = useState([]);
  const [bankInfo, setBankInfo] = useState({ provider: "cbe", bankName: "Commercial Bank of Ethiopia" });
  const [showBankModal, setShowBankModal] = useState(false);
  const [activeStatus, setActiveStatus] = useState("all");
  const [selectedBank, setSelectedBank] = useState(null);

  // ── Load data ──────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    try {
      const [s, tx, bank] = await Promise.all([
        paymentsApi.getDashboardSummary(),
        paymentsApi.getTransactions(),
        businessApi.getUserBankInfo(),
      ]);
      setSummary(s);
      setAllTransactions(tx);
      setBankInfo(bank);
    } catch (err) {
      console.error("HomeScreen load:", err);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Bank change ────────────────────────────────────────────────────────────
  const handleBankChange = useCallback(async (newProvider) => {
    try {
      await businessApi.updateUserBank(newProvider);
      setBankInfo({
        provider: newProvider,
        bankName: businessApi.getBankNameFromProvider(newProvider),
      });
    } catch (err) {
      console.error("Bank update:", err);
    }
  }, []);

  // ── Derived data ───────────────────────────────────────────────────────────
  const counts = useMemo(() => buildCounts(allTransactions), [allTransactions]);

  const filteredTransactions = useMemo(() =>
    activeStatus === "all"
      ? allTransactions
      : allTransactions.filter(tx => tx.status === activeStatus),
    [allTransactions, activeStatus]
  );

  const displayName = user?.name?.split(" ")[0] || "Abel";
  const notifSize = scale(40, 0.4);

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        contentInsetAdjustmentBehavior="automatic"
      >

        {/* ── 1. Header ──────────────────────────────────────────────────── */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Avatar name={user?.name} size="md" />
            <View style={{ marginLeft: rs.sm }}>
              <Text style={[typography.caption, { color: colors.gray }]}>
                {t(greetingKey())},
              </Text>
              <Text style={[typography.h3, { color: colors.ink }]}>
                {displayName} 👋
              </Text>
            </View>
          </View>

          <Pressable
            style={[
              shadows.sm,
              styles.notifBtn,
              {
                width: notifSize,
                height: notifSize,
                borderRadius: rr.pill,
                backgroundColor: colors.surface,
              },
            ]}
          >
            <Ionicons name="notifications-outline" size={iconSize.sm} color={colors.ink} />
          </Pressable>
        </View>

        {/* ── 2. Balance card ────────────────────────────────────────────── */}
        <BalanceCard amount={summary.totalVerifiedToday} currency={summary.currency} />

        {/* ── 3. Status filter cards ─────────────────────────────────────── */}
        <SectionHeader
          title="Transaction Status"
          style={styles.sectionGap}
        />
        <View style={styles.statusRow}>
          {STATUS_FILTERS.map(f => (
            <StatusFilterCard
              key={f.key}
              status={f.key}
              label={t(f.labelKey)}
              count={counts[f.key]}
              active={activeStatus === f.key}
              onPress={() => setActiveStatus(f.key)}
            />
          ))}
        </View>

        {/* ── 4. Supported banks ─────────────────────────────────────────── */}
        <SectionHeader
          title="Supported Banks"
          style={styles.sectionGap}
        />
        {/* Negative horizontal margin + matching padding lets the
            scroll strip bleed edge-to-edge while content inside is padded */}
        <View style={styles.banksStrip}>
          <SupportedBanksList
            selectedBank={selectedBank}
            onSelectBank={id => {
              setSelectedBank(id);
              navigateToAppScreen(navigation, "VerifyPayment", {
                details: {
                  id: "tx_mock_" + id,
                  from: id,
                  reference: "FT26149OJYLM",
                  amount: 10.0,
                  currency: summary.currency || "ETB",
                }
              });
            }}
          />
        </View>

        {/* ── 5. Transactions ────────────────────────────────────────────── */}
        <SectionHeader
          title={t("recentTransactions")}
          onAction={() => navigation.navigate("Transactions")}
          actionLabel={t("viewAll")}
          style={styles.sectionGap}
        />

        {/* Active filter pill — shown when a status is selected */}
        {activeStatus !== "all" && (
          <View style={styles.activePillRow}>
            <View
              style={[
                styles.activePill,
                { backgroundColor: colors.successBg || colors.background },
              ]}
            >
              <Text style={[typography.caption, { color: colors.primaryDark }]}>
                Showing: {activeStatus}
              </Text>
              <Pressable onPress={() => setActiveStatus("all")} hitSlop={8} style={{ marginLeft: rs.xs }}>
                <Ionicons name="close-circle" size={scale(14, 0.3)} color={colors.primaryDark} />
              </Pressable>
            </View>
          </View>
        )}

        <Card shadow="card" padding="none" style={styles.txCard}>
          {filteredTransactions.length === 0 ? (
            <EmptyState
              icon="receipt-outline"
              title={activeStatus === "all" ? "No transactions yet" : `No ${activeStatus} transactions`}
              subtitle={
                activeStatus === "all"
                  ? "Verified payments will appear here."
                  : `You have no ${activeStatus} payments.`
              }
              style={{ paddingVertical: rs.xl }}
            />
          ) : (
            filteredTransactions.map((tx, i) => (
              <TransactionRow
                key={tx.id}
                transaction={tx}
                onPress={() => navigateToAppScreen(navigation, "AddPaymentScreenshot")}
                showBorder={i < filteredTransactions.length - 1}
              />
            ))
          )}
        </Card>

        {/* ── 6. Verify CTA banner ───────────────────────────────────────── */}
        <Pressable
          onPress={() => navigateToAppScreen(navigation, "AddPaymentScreenshot")}
          style={({ pressed }) => [
            shadows.hero,
            styles.ctaBanner,
            {
              backgroundColor: colors.primaryDark,
              borderRadius: rr.lg,
              opacity: pressed ? 0.88 : 1,
            },
          ]}
        >
          <View
            style={[
              styles.ctaIcon,
              {
                width: notifSize,
                height: notifSize,
                borderRadius: rr.pill,
              },
            ]}
          >
            <Ionicons name="receipt-outline" size={iconSize.md} color="#fff" />
          </View>
          <View style={{ flex: 1, marginLeft: rs.md }}>
            <Text style={[typography.bodyMedium, { color: "#fff" }]}>
              {t("verifyPayment")}
            </Text>
            <Text style={[typography.caption, { color: "rgba(255,255,255,0.75)" }]}>
              Upload a screenshot to verify
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={iconSize.sm} color="rgba(255,255,255,0.70)" />
        </Pressable>

        <View style={{ height: rs.xxl }} />
      </ScrollView>

      {/* ── Bank selection modal ─────────────────────────────────────────── */}
      <BankSelectionModal
        visible={showBankModal}
        currentProvider={bankInfo.provider}
        onSelect={p => { handleBankChange(p); setShowBankModal(false); }}
        onClose={() => setShowBankModal(false)}
      />
    </ScreenContainer>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  scroll: {
    paddingTop: rs.md,
  },

  // Header
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: rs.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  notifBtn: {
    alignItems: "center",
    justifyContent: "center",
  },

  // Shared section spacing
  sectionGap: {
    marginTop: rs.lg,
    marginBottom: rs.sm,
  },

  // Status cards row — 4 equal cards side by side
  statusRow: {
    flexDirection: "row",
    marginHorizontal: -scale(4, 0.3),   // cancel out card's own marginHorizontal
    marginBottom: rs.xs,
  },

  // Banks horizontal strip — bleeds past screen padding
  banksStrip: {
    marginHorizontal: -screenPadding,
    paddingLeft: screenPadding,
  },

  // Active filter pill
  activePillRow: {
    flexDirection: "row",
    marginBottom: rs.sm,
  },
  activePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rs.md,
    paddingVertical: rs.xs,
    borderRadius: rr.pill,
  },

  // Transactions card
  txCard: {
    paddingHorizontal: rs.md,
    marginBottom: rs.md,
  },

  // CTA banner
  ctaBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: rs.md,
    marginBottom: rs.sm,
  },
  ctaIcon: {
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
});
