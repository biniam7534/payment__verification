/**
 * MainTabs — Bottom tab navigator
 *
 * Three tabs: Home · Scan · Profile
 *
 * Scan sits in the centre and gets a raised floating button treatment
 * to give it visual prominence as the primary action.
 */
import React from "react";
import { View, Text, Platform, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeScreen    from "../screens/dashboard/HomeScreen";
import ScanQRScreen  from "../screens/scanner/ScanQRScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import { useAppTheme } from "../theme/ThemeContext";
import { useI18n }     from "../i18n/I18nContext";
import { scale, moderateScale, iconSize } from "../theme/responsive";

const Tab = createBottomTabNavigator();

const ICONS = {
  Home:    { active: "home",    inactive: "home-outline"    },
  Scan:    { active: "qr-code", inactive: "qr-code-outline" },
  Profile: { active: "person",  inactive: "person-outline"  },
};

// ─── Regular tab icon (Home & Profile) ──────────────────────────────────────
function TabIcon({ name, focused, color, label, primaryColor }) {
  const iconName = ICONS[name]
    ? (focused ? ICONS[name].active : ICONS[name].inactive)
    : "ellipse-outline";

  return (
    <View style={styles.iconWrapper}>
      {focused && (
        <View style={[styles.activePill, { backgroundColor: primaryColor }]} />
      )}
      <Ionicons name={iconName} size={iconSize.md} color={color} />
      <Text
        style={[
          styles.label,
          {
            color,
            fontWeight: focused ? "600" : "400",
            fontSize:   moderateScale(10),
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

// ─── Centre Scan button (raised floating circle) ─────────────────────────────
function ScanTabIcon({ focused, primaryColor, surface }) {
  return (
    <View style={styles.scanWrapper}>
      {/* Raised circle — sits above the tab bar line */}
      <View
        style={[
          styles.scanCircle,
          {
            backgroundColor: primaryColor,
            // Stronger shadow on iOS; elevation on Android
            shadowColor:     primaryColor,
          },
        ]}
      >
        <Ionicons
          name={focused ? "qr-code" : "qr-code-outline"}
          size={iconSize.md + scale(2, 0.3)}
          color="#FFFFFF"
        />
      </View>
      <Text
        style={[
          styles.scanLabel,
          { color: focused ? primaryColor : "#94A3B8" },
        ]}
        numberOfLines={1}
      >
        Scan
      </Text>
    </View>
  );
}

// ─── Navigator ───────────────────────────────────────────────────────────────
export default function MainTabs() {
  const { colors, isDark } = useAppTheme();
  const { t }              = useI18n();
  const insets             = useSafeAreaInsets();

  const INNER_HEIGHT = scale(56, 0.3);
  const bottomInset  = Math.max(insets.bottom, Platform.OS === "android" ? 8 : 0);
  const TAB_HEIGHT   = INNER_HEIGHT + bottomInset;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown:           false,
        tabBarShowLabel:       false,
        tabBarActiveTintColor:   colors.primaryDark,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor:  colors.border,
          borderTopWidth:  StyleSheet.hairlineWidth,
          height:          TAB_HEIGHT,
          paddingBottom:   bottomInset,
          paddingTop:      scale(4, 0.3),
          ...Platform.select({
            ios: {
              shadowColor:   "#000",
              shadowOffset:  { width: 0, height: -2 },
              shadowOpacity: isDark ? 0.30 : 0.06,
              shadowRadius:  8,
            },
            android: { elevation: isDark ? 8 : 4 },
          }),
        },
        tabBarIcon: ({ color, focused }) => {
          if (route.name === "Scan") {
            return (
              <ScanTabIcon
                focused={focused}
                primaryColor={colors.primaryDark}
                surface={colors.surface}
              />
            );
          }
          return (
            <TabIcon
              name={route.name}
              focused={focused}
              color={color}
              label={route.name === "Home" ? t("home") : t("more")}
              primaryColor={colors.primaryDark}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home"    component={HomeScreen}    />
      <Tab.Screen name="Scan"    component={ScanQRScreen}  />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Regular tab (Home / Profile)
  iconWrapper: {
    alignItems:     "center",
    justifyContent: "center",
    gap:            scale(3, 0.3),
    paddingTop:     scale(2, 0.3),
  },
  activePill: {
    position:     "absolute",
    top:          -scale(8, 0.3),
    width:        scale(20, 0.4),
    height:       scale(3,  0.3),
    borderRadius: 999,
  },
  label: {
    lineHeight:    scale(13, 0.3),
    textAlign:     "center",
    letterSpacing: 0.1,
  },

  // Centre Scan button
  scanWrapper: {
    alignItems:     "center",
    justifyContent: "center",
    // Negative top margin lifts the circle above the bar line
    marginTop:      -scale(18, 0.3),
  },
  scanCircle: {
    width:          scale(54, 0.4),
    height:         scale(54, 0.4),
    borderRadius:   scale(27, 0.4),
    alignItems:     "center",
    justifyContent: "center",
    // iOS shadow
    shadowOffset:   { width: 0, height: 4 },
    shadowOpacity:  0.40,
    shadowRadius:   10,
    // Android elevation
    elevation:      8,
    marginBottom:   scale(3, 0.3),
  },
  scanLabel: {
    fontSize:      moderateScale(10),
    fontWeight:    "500",
    letterSpacing: 0.1,
    lineHeight:    scale(13, 0.3),
  },
});
