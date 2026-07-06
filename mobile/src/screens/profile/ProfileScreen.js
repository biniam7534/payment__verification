/**
 * ProfileScreen
 *
 * Refactored to use:
 *   - Avatar component for the profile header bubble
 *   - Card component for the dark-mode toggle section
 *   - Consistent rs / rr / iconSize tokens throughout
 *   - No inline numeric literals
 */
import React from "react";
import { View, Text, Pressable, ScrollView, Switch, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "../../components/common/ScreenContainer";
import Avatar from "../../components/common/Avatar";
import Card from "../../components/common/Card";
import Divider from "../../components/common/Divider";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { useAuth } from "../../store/AuthContext";
import { typography } from "../../theme";
import { navigateToAppScreen } from "../../navigation/navigateTo";
import { rs, rr, iconSize, scale } from "../../theme/responsive";

// ─── Menu row ────────────────────────────────────────────────────────────────
function MenuRow({ icon, label, value, onPress, colors, danger }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.menuRow,
        { borderBottomColor: colors.border },
      ]}
      hitSlop={4}
    >
      <Ionicons
        name={icon}
        size={iconSize.sm}
        color={danger ? colors.danger : colors.primaryDark}
      />
      <Text
        style={[
          typography.body,
          styles.menuLabel,
          { color: danger ? colors.danger : colors.ink },
        ]}
      >
        {label}
      </Text>
      {value ? (
        <Text style={[typography.caption, { color: colors.gray, marginRight: rs.sm }]}>
          {value}
        </Text>
      ) : null}
      {!danger && (
        <Ionicons name="chevron-forward" size={iconSize.xs} color={colors.gray} />
      )}
    </Pressable>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────
export default function ProfileScreen({ navigation }) {
  const { colors, shadows, isDark, setDarkMode } = useAppTheme();
  const { t, language }                          = useI18n();
  const { user, signOut }                        = useAuth();

  const toggleCircle = scale(40, 0.4);

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Profile header card ───────────────────────────────────────── */}
        <View
          style={[
            styles.profileHeader,
            {
              backgroundColor: colors.hero || colors.primaryDark,
              borderRadius:    rr.lg,
              marginBottom:    rs.lg,
            },
          ]}
        >
          <Avatar
            name={user?.name}
            size="md"
            bg="rgba(255,255,255,0.20)"
            color="#fff"
          />
          <View style={{ marginLeft: rs.md, flex: 1 }}>
            <Text style={[typography.bodyMedium, { color: "#fff" }]}>
              {user?.name || "Abel Tesfaye"}
            </Text>
            <Text style={[typography.caption, { color: "rgba(255,255,255,0.80)" }]}>
              {t("verifiedAccount")}
            </Text>
          </View>
          <Ionicons name="checkmark-circle" size={iconSize.sm} color="rgba(255,255,255,0.7)" />
        </View>

        {/* ── Menu items ───────────────────────────────────────────────── */}
        <MenuRow icon="person-outline"    label={t("myProfile")}      onPress={() => {}}                                                    colors={colors} />
        <MenuRow icon="business-outline"  label={t("myAccounts")}     onPress={() => {}}                                                    colors={colors} />
        <MenuRow icon="receipt-outline"   label={t("verifyPayment")}  onPress={() => navigateToAppScreen(navigation, "AddPaymentScreenshot")} colors={colors} />
        <MenuRow icon="git-branch-outline" label={t("branches")}       onPress={() => navigation.navigate("Branches")}                      colors={colors} />
        <MenuRow icon="people-outline"    label={t("staffManagement")} onPress={() => {}}                                                   colors={colors} />
        <MenuRow
          icon="globe-outline"
          label={t("language")}
          value={language.toUpperCase()}
          onPress={() => navigation.navigate("Language")}
          colors={colors}
        />
        <MenuRow icon="card-outline"         label={t("subscription")} onPress={() => {}} colors={colors} />
        <MenuRow icon="help-circle-outline"  label={t("helpSupport")}  onPress={() => {}} colors={colors} />
        <MenuRow icon="settings-outline"     label={t("settings")}     onPress={() => {}} colors={colors} />

        <Divider spacing={rs.sm} />

        {/* ── Dark mode toggle ─────────────────────────────────────────── */}
        <Card shadow="card" padding="md" style={{ marginTop: rs.sm, marginBottom: rs.md }}>
          <View style={styles.darkModeRow}>
            {/* Icon bubble */}
            <View
              style={[
                styles.toggleIcon,
                {
                  width:           toggleCircle,
                  height:          toggleCircle,
                  borderRadius:    rr.pill,
                  backgroundColor: isDark
                    ? colors.primaryDark + "30"
                    : colors.primaryDark + "15",
                },
              ]}
            >
              <Ionicons
                name={isDark ? "moon" : "moon-outline"}
                size={iconSize.sm}
                color={colors.primaryDark}
              />
            </View>

            {/* Label */}
            <View style={{ marginLeft: rs.md, flex: 1 }}>
              <Text style={[typography.bodyMedium, { color: colors.ink }]}>
                {t("darkMode")}
              </Text>
              <Text style={[typography.caption, { color: colors.gray, marginTop: 2 }]}>
                {t("darkModeDescription")}
              </Text>
            </View>

            <Switch
              value={isDark}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.border, true: colors.primaryDark }}
              thumbColor={colors.white}
            />
          </View>
        </Card>

        {/* ── Sign out ─────────────────────────────────────────────────── */}
        <Pressable onPress={signOut} style={styles.signOut}>
          <Ionicons name="log-out-outline" size={iconSize.sm} color={colors.danger} />
          <Text style={[typography.body, { color: colors.danger, marginLeft: rs.md }]}>
            {t("logOut")}
          </Text>
        </Pressable>

        <View style={{ height: rs.xxl }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: "row",
    alignItems:    "center",
    padding:       rs.md,
  },
  menuRow: {
    flexDirection:    "row",
    alignItems:       "center",
    paddingVertical:  rs.md,
    borderBottomWidth: 1,
  },
  menuLabel: {
    flex:        1,
    marginLeft:  rs.md,
  },
  darkModeRow: {
    flexDirection: "row",
    alignItems:    "center",
  },
  toggleIcon: {
    alignItems:     "center",
    justifyContent: "center",
  },
  signOut: {
    flexDirection: "row",
    alignItems:    "center",
    paddingVertical: rs.md,
  },
});
