import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../screens/auth/SignInScreen";
import CreateAccountScreen from "../screens/auth/CreateAccountScreen";
import VerifyIdentityScreen from "../screens/auth/VerifyIdentityScreen";
import AccountCreatedScreen from "../screens/auth/AccountCreatedScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="VerifyIdentity" component={VerifyIdentityScreen} />
      <Stack.Screen name="AccountCreated" component={AccountCreatedScreen} />
    </Stack.Navigator>
  );
}
