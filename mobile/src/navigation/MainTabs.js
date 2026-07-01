import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/dashboard/HomeScreen";
import TransactionsScreen from "../screens/dashboard/TransactionsScreen";
import ScanQRScreen from "../screens/scanner/ScanQRScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import { useAppTheme } from "../theme/ThemeContext";
import { useI18n } from "../i18n/I18nContext";
import { typography } from "../theme";

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: "home",
  Transactions: "list",
  Scan: "qr-code",
  Profile: "person",
};

export default function MainTabs() {
  const { colors, isDark } = useAppTheme();
  const { t } = useI18n();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.gray,
        tabBarLabelStyle: { ...typography.caption, fontSize: 11, marginBottom: Platform.OS === "ios" ? 0 : 4 },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : 68,
          paddingTop: 8,
          ...(isDark && Platform.OS === "android" ? { elevation: 8 } : {}),
        },
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name={`${ICONS[route.name]}${focused ? "" : "-outline"}`} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t("home") }} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} options={{ tabBarLabel: t("transactions") }} />
      <Tab.Screen
        name="Scan"
        component={ScanQRScreen}
        options={{
          tabBarLabel: t("scanQR"),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={`qr-code${focused ? "" : "-outline"}`} size={size + 2} color={color} />
          ),
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t("more") }} />
    </Tab.Navigator>
  );
}
