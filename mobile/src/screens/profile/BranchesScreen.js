import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "../../components/common/ScreenContainer";
import ScreenHeader from "../../components/common/ScreenHeader";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import * as businessApi from "../../services/api/businessApi";
import { typography, spacing, radius } from "../../theme";

export default function BranchesScreen() {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    // TODO: connect getBranches() to the real backend.
    businessApi.getBranches().then(setBranches);
  }, []);

  return (
    <ScreenContainer>
      <ScreenHeader
        title={t("branches")}
        rightAction={<Ionicons name="add-circle-outline" size={24} color={colors.primaryDark} />}
      />

      <FlatList
        data={branches}
        keyExtractor={(b) => b.id}
        renderItem={({ item }) => (
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.surface,
              borderRadius: radius.md,
              padding: spacing.md,
              marginBottom: spacing.sm,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: radius.md,
                backgroundColor: colors.background,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="git-branch-outline" size={20} color={colors.primaryDark} />
            </View>
            <View style={{ marginLeft: spacing.md, flex: 1 }}>
              <Text style={[typography.bodyMedium, { color: colors.ink }]}>{item.name}</Text>
              <Text style={[typography.caption, { color: colors.gray }]}>{item.address}</Text>
            </View>
            <Text style={[typography.caption, { color: colors.gray }]}>{item.staffCount} staff</Text>
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}
