import React from "react";
import { View, Text, Pressable, Image, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "../../components/common/ScreenContainer";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { useAuth } from "../../store/AuthContext";
import { typography, spacing, radius } from "../../theme";
import { navigateToAppScreen } from "../../navigation/navigateTo";

function MenuRow({ icon, label, value, onPress, colors, danger }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <Ionicons name={icon} size={20} color={danger ? colors.danger : colors.primaryDark} />
      <Text style={[typography.body, { color: danger ? colors.danger : colors.ink, flex: 1, marginLeft: spacing.md }]}>
        {label}
      </Text>
      {value ? <Text style={[typography.caption, { color: colors.gray, marginRight: spacing.sm }]}>{value}</Text> : null}
      {!danger && <Ionicons name="chevron-forward" size={18} color={colors.gray} />}
    </Pressable>
  );
}

export default function ProfileScreen({ navigation }) {
  const { colors, shadows, isDark, setDarkMode } = useAppTheme();
  const { t, language } = useI18n();
  const { user, signOut } = useAuth();

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.hero || colors.primary,
            borderRadius: radius.lg,
            padding: spacing.md,
            marginBottom: spacing.lg,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: radius.pill,
              backgroundColor: "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="person" size={24} color="#fff" />
          </View>
          <View style={{ marginLeft: spacing.md }}>
            <Text style={[typography.bodyMedium, { color: "#fff" }]}>{user?.name || "Abel Tesfaye"}</Text>
            <Text style={[typography.caption, { color: "rgba(255,255,255,0.8)" }]}>{t("verifiedAccount")}</Text>
          </View>
        </View>

        <MenuRow icon="person-outline" label={t("myProfile")} onPress={() => {}} colors={colors} />
        <MenuRow icon="business-outline" label={t("myAccounts")} onPress={() => {}} colors={colors} />
        <MenuRow
          icon="receipt-outline"
          label={t("verifyPayment")}
          onPress={() => navigateToAppScreen(navigation, "AddPaymentScreenshot")}
          colors={colors}
        />
        <MenuRow icon="git-branch-outline" label={t("branches")} onPress={() => navigation.navigate("Branches")} colors={colors} />
        <MenuRow icon="people-outline" label={t("staffManagement")} onPress={() => {}} colors={colors} />
        <MenuRow
          icon="globe-outline"
          label={t("language")}
          value={language.toUpperCase()}
          onPress={() => navigation.navigate("Language")}
          colors={colors}
        />
        <MenuRow icon="card-outline" label={t("subscription")} onPress={() => {}} colors={colors} />
        <MenuRow icon="help-circle-outline" label={t("helpSupport")} onPress={() => {}} colors={colors} />
        <MenuRow icon="settings-outline" label={t("settings")} onPress={() => {}} colors={colors} />

        <View
          style={[
            shadows.card,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              padding: spacing.md,
              marginTop: spacing.sm,
              marginBottom: spacing.md,
            },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: radius.pill,
                backgroundColor: isDark ? colors.primaryDark + "30" : colors.primaryDark + "15",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name={isDark ? "moon" : "moon-outline"} size={20} color={colors.primaryDark} />
            </View>
            <View style={{ marginLeft: spacing.md, flex: 1 }}>
              <Text style={[typography.bodyMedium, { color: colors.ink }]}>{t("darkMode")}</Text>
              <Text style={[typography.caption, { color: colors.gray, marginTop: 2 }]}>{t("darkModeDescription")}</Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={setDarkMode}
            trackColor={{ false: colors.border, true: colors.primaryDark }}
            thumbColor={colors.white}
          />
        </View>

        <Pressable
          onPress={signOut}
          style={{ flexDirection: "row", alignItems: "center", paddingVertical: spacing.md }}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={[typography.body, { color: colors.danger, marginLeft: spacing.md }]}>{t("logOut")}</Text>
        </Pressable>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </ScreenContainer>
  );
}
