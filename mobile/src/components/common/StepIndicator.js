import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "../../theme/ThemeContext";
import { typography, spacing, radius } from "../../theme";

export default function StepIndicator({ currentStep, totalSteps }) {
  const { colors } = useAppTheme();
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <View style={styles.row}>
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <View
            style={[
              styles.circle,
              {
                backgroundColor: step <= currentStep ? colors.primaryDark : colors.surface,
                borderColor: step <= currentStep ? colors.primaryDark : colors.border,
              },
            ]}
          >
            <Text
              style={[
                typography.caption,
                { color: step <= currentStep ? "#fff" : colors.gray, fontWeight: "600" },
              ]}
            >
              {step}
            </Text>
          </View>
          {idx < steps.length - 1 && (
            <View
              style={[
                styles.line,
                { backgroundColor: step < currentStep ? colors.primaryDark : colors.border },
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  circle: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  line: { flex: 1, height: 2, marginHorizontal: spacing.xs },
});
