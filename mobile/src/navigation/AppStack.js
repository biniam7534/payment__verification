import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabs from "./MainTabs";
import TransactionsScreen from "../screens/dashboard/TransactionsScreen";
import AddPaymentScreenshotScreen from "../screens/scanner/AddPaymentScreenshotScreen";
import VerifyPaymentScreen from "../screens/scanner/VerifyPaymentScreen";
import PaymentVerifiedScreen from "../screens/scanner/PaymentVerifiedScreen";
import BranchesScreen from "../screens/profile/BranchesScreen";
import LanguageScreen from "../screens/profile/LanguageScreen";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Transactions" component={TransactionsScreen} />
      <Stack.Screen
        name="AddPaymentScreenshot"
        component={AddPaymentScreenshotScreen}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen name="VerifyPayment" component={VerifyPaymentScreen} />
      <Stack.Screen name="PaymentVerified" component={PaymentVerifiedScreen} />
      <Stack.Screen name="Branches" component={BranchesScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
    </Stack.Navigator>
  );
}
