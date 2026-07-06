/**
 * TransactionsScreen
 *
 * Refactored to use:
 *   - AppInput for the search bar (replaces inline TextInput + View wrapper)
 *   - Badge for the status filter pills
 *   - EmptyState for the no-results placeholder
 *   - SectionHeader for the screen title row
 *   - All spacing/radius values from rs / rr tokens
 */
import React, { useEffect, useState } from "react";
import { View, FlatList, Pressable } from "react-native";
import ScreenContainer from "../../components/common/ScreenContainer";
import ScreenHeader from "../../components/common/ScreenHeader";
import TransactionRow from "../../components/dashboard/TransactionRow";
import AppInput from "../../components/common/AppInput";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import * as paymentsApi from "../../services/api/paymentsApi";
import { rs } from "../../theme/responsive";

const FILTERS = [
  { key: "allStatus", status: null },
  { key: "verified",  status: "verified" },
  { key: "pending",   status: "pending"  },
  { key: "failed",    status: "failed"   },
];

export default function TransactionsScreen({ navigation }) {
  const { colors } = useAppTheme();
  const { t }      = useI18n();

  const [query, setQuery]               = useState("");
  const [filter, setFilter]             = useState("allStatus");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    paymentsApi
      .getTransactions({ query, status: filter })
      .then(setTransactions)
      .catch(() => {});
  }, [query, filter]);

  const filtered = transactions.filter((tx) => {
    const matchesQuery  = !query || tx.name.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "allStatus" || tx.status === filter;
    return matchesQuery && matchesFilter;
  });

  return (
    <ScreenContainer>
      {/* Back button + title */}
      <ScreenHeader
        title={t("transactions")}
        onBack={() => navigation.goBack()}
      />

      {/* Search */}
      <AppInput
        value={query}
        onChangeText={setQuery}
        placeholder={t("searchByReference")}
        keyboardType="default"
        autoCapitalize="none"
      />

      {/* Filter pills */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={FILTERS}
        keyExtractor={(f) => f.key}
        contentContainerStyle={{ marginBottom: rs.md, gap: rs.sm }}
        renderItem={({ item }) => {
          const isActive = filter === item.key;
          return (
            <Pressable onPress={() => setFilter(item.key)} hitSlop={6}>
              <Badge
                status={isActive && item.status ? item.status : undefined}
                label={t(item.key)}
                bg={
                  isActive
                    ? item.status
                      ? undefined
                      : colors.primaryDark
                    : colors.surface
                }
                color={isActive && !item.status ? "#fff" : undefined}
                size="md"
                style={{ paddingHorizontal: rs.md, paddingVertical: rs.xs }}
              />
            </Pressable>
          );
        }}
      />

      {/* Transaction list */}
      <FlatList
        data={filtered}
        keyExtractor={(tx) => tx.id}
        renderItem={({ item }) => (
          <TransactionRow transaction={item} onPress={() => {}} />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="receipt-outline"
            title={t("noTransactions")}
            subtitle="Try adjusting your search or filter."
          />
        }
      />
    </ScreenContainer>
  );
}
