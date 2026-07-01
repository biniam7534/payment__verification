import React, { useMemo } from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import { useAuth } from "../store/AuthContext";
import { useAppTheme } from "../theme/ThemeContext";

const RootStack = createNativeStackNavigator();

function buildNavTheme(isDark, colors) {
  const base = isDark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    dark: isDark,
    colors: {
      ...base.colors,
      primary: colors.primaryDark,
      background: colors.background,
      card: colors.surface,
      text: colors.ink,
      border: colors.border,
      notification: colors.primaryDark,
    },
  };
}

export default function RootNavigator() {
  const { user } = useAuth();
  const { isDark, colors, isReady } = useAppTheme();

  const navTheme = useMemo(() => buildNavTheme(isDark, colors), [isDark, colors]);

  if (!isReady) return null;

  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <RootStack.Screen name="App" component={AppStack} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthStack} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
