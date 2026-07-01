import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { typography, spacing, radius } from "../../theme";

const STEP_LABELS = ["stepAccount", "stepVerification"];

export default function StepIndicator({ currentStep, totalSteps }) {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <View>
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
      <View style={styles.labels}>
        {steps.map((step) => (
          <Text
            key={step}
            style={[
              typography.caption,
              {
                color: step === currentStep ? colors.primaryDark : colors.gray,
                flex: 1,
                textAlign: "center",
                marginTop: spacing.xs,
                fontWeight: step === currentStep ? "600" : "400",
              },
            ]}
          >
            {t(STEP_LABELS[step - 1] || "stepAccount")}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  labels: { flexDirection: "row", marginTop: spacing.xs },
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
