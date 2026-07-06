import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { typography, spacing, radius } from "../../theme";
import { AVAILABLE_BANKS } from "../../services/api/businessApi";

export default function BankSelectionModal({
  visible,
  currentBank,
  onSelectBank,
  onClose,
}) {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);

  const handleBankSelect = async (bankId) => {
    setLoading(true);
    try {
      await onSelectBank(bankId);
      onClose();
    } catch (error) {
      console.error("Error selecting bank:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderBankItem = ({ item }) => (
    <Pressable
      onPress={() => handleBankSelect(item.id)}
      disabled={loading}
      style={({ pressed }) => [
        styles.bankItem,
        {
          backgroundColor:
            currentBank === item.id ? colors.primaryLight : colors.surface,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={styles.bankItemContent}>
        <View
          style={[
            styles.bankItemIcon,
            {
              backgroundColor:
                currentBank === item.id
                  ? colors.primary
                  : colors.primaryLight,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="bank"
            size={24}
            color={currentBank === item.id ? "#fff" : colors.primary}
          />
        </View>
        <View style={styles.bankItemText}>
          <Text
            style={[
              typography.bodySemibold,
              { color: colors.ink },
            ]}
          >
            {item.name}
          </Text>
          <Text
            style={[
              typography.caption,
              { color: colors.gray },
            ]}
          >
            {item.code}
          </Text>
        </View>
        {currentBank === item.id && (
          <MaterialCommunityIcons
            name="check-circle"
            size={24}
            color={colors.primary}
          />
        )}
      </View>
    </Pressable>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.overlay }]}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: colors.surface },
          ]}
        >
          <View style={styles.header}>
            <Text style={[typography.h3, { color: colors.ink }]}>
              {t("selectBank") || "Select Bank"}
            </Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={colors.ink}
              />
            </Pressable>
          </View>

          <FlatList
            data={AVAILABLE_BANKS}
            renderItem={renderBankItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            style={styles.list}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  list: {
    marginBottom: spacing.md,
  },
  bankItem: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  bankItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  bankItemIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  bankItemText: {
    flex: 1,
  },
});
