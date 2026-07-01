import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "../../components/common/ScreenContainer";
import TransactionRow from "../../components/dashboard/TransactionRow";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import * as paymentsApi from "../../services/api/paymentsApi";
import { typography, spacing, radius } from "../../theme";

const FILTERS = ["allStatus", "verified", "pending", "failed"];

export default function TransactionsScreen() {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("allStatus");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // TODO: pass query/filter to the real backend search endpoint instead of filtering client-side.
    paymentsApi.getTransactions({ query, status: filter }).then(setTransactions);
  }, [query, filter]);

  const filtered = transactions.filter((tx) => {
    const matchesQuery = !query || tx.name.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "allStatus" || tx.status === filter;
    return matchesQuery && matchesFilter;
  });

  return (
    <ScreenContainer>
      <Text style={[typography.h2, { color: colors.ink, marginBottom: spacing.md }]}>{t("transactions")}</Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.input || colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          height: 48,
          marginBottom: spacing.md,
        }}
      >
        <Ionicons name="search" size={18} color={colors.gray} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t("searchByReference")}
          placeholderTextColor={colors.gray}
          style={{ flex: 1, marginLeft: spacing.sm, color: colors.ink, ...typography.body }}
        />
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={FILTERS}
        keyExtractor={(f) => f}
        contentContainerStyle={{ marginBottom: spacing.md }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setFilter(item)}
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              borderRadius: radius.pill,
              backgroundColor: filter === item ? colors.primaryDark : colors.surface,
              marginRight: spacing.sm,
            }}
          >
            <Text style={[typography.caption, { color: filter === item ? "#fff" : colors.ink, textTransform: "capitalize" }]}>
              {t(item)}
            </Text>
          </Pressable>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={(tx) => tx.id}
        renderItem={({ item }) => <TransactionRow transaction={item} onPress={() => {}} />}
        ListEmptyComponent={
          <Text style={[typography.body, { color: colors.gray, textAlign: "center", marginTop: spacing.xl }]}>
            {t("noTransactions")}
          </Text>
        }
      />
    </ScreenContainer>
  );
}
