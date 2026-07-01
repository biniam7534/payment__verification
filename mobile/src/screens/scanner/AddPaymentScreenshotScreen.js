import React, { useState } from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import ScreenContainer from "../../components/common/ScreenContainer";
import ScreenHeader from "../../components/common/ScreenHeader";
import AppButton from "../../components/common/AppButton";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import * as paymentsApi from "../../services/api/paymentsApi";
import { navigateToAppScreen } from "../../navigation/navigateTo";
import { typography, spacing, radius } from "../../theme";

export default function AddPaymentScreenshotScreen({ navigation, route }) {
  const { colors, shadows } = useAppTheme();
  const { t } = useI18n();
  const [imageUri, setImageUri] = useState(route?.params?.imageUri || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pickImage = async (fromCamera) => {
    setError("");
    const launch = fromCamera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;
    const result = await launch({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const handleContinue = async () => {
    if (!imageUri) return;
    setLoading(true);
    setError("");
    try {
      const details = await paymentsApi.submitPaymentScreenshot({
        imageUri,
        qrPayload: route?.params?.qrPayload,
      });
      navigateToAppScreen(navigation, "VerifyPayment", { details });
    } catch (e) {
      setError(t("uploadFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title={t("addPaymentScreenshot")} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={[typography.body, { color: colors.gray, marginBottom: spacing.md }]}>
          {t("uploadPaymentHint")}
        </Text>

        <Pressable
          onPress={() => pickImage(false)}
          style={[
            shadows.card,
            {
              height: 240,
              borderRadius: radius.lg,
              borderWidth: 2,
              borderColor: imageUri ? colors.primaryDark : colors.border,
              borderStyle: imageUri ? "solid" : "dashed",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.surface,
              overflow: "hidden",
            },
          ]}
        >
          {imageUri ? (
            <>
              <Image source={{ uri: imageUri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
              <View
                style={{
                  position: "absolute",
                  bottom: spacing.sm,
                  right: spacing.sm,
                  backgroundColor: "rgba(0,0,0,0.55)",
                  borderRadius: radius.pill,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons name="create-outline" size={14} color="#fff" />
                <Text style={[typography.caption, { color: "#fff", marginLeft: spacing.xs }]}>{t("changeImage")}</Text>
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: radius.pill,
                  backgroundColor: colors.primaryDark + "18",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="cloud-upload-outline" size={32} color={colors.primaryDark} />
              </View>
              <Text style={[typography.bodyMedium, { color: colors.ink, marginTop: spacing.md }]}>
                {t("uploadScreenshot")}
              </Text>
              <Text style={[typography.caption, { color: colors.gray, marginTop: spacing.xs }]}>{t("pngJpgUpTo")}</Text>
            </>
          )}
        </Pressable>

        <View style={{ marginTop: spacing.lg }}>
          <AppButton
            title={t("takePhoto")}
            variant="outline"
            onPress={() => pickImage(true)}
            icon={<Ionicons name="camera-outline" size={18} color={colors.primaryDark} />}
            style={{ marginBottom: spacing.md }}
          />
          <AppButton
            title={t("chooseFromGallery")}
            variant="outline"
            onPress={() => pickImage(false)}
            icon={<Ionicons name="images-outline" size={18} color={colors.primaryDark} />}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            backgroundColor: colors.primaryDark + "10",
            padding: spacing.md,
            borderRadius: radius.md,
            marginTop: spacing.lg,
            alignItems: "flex-start",
          }}
        >
          <Ionicons name="information-circle-outline" size={20} color={colors.primaryDark} />
          <Text style={[typography.caption, { color: colors.ink, marginLeft: spacing.sm, flex: 1 }]}>
            {t("makeSureVisible")}
          </Text>
        </View>

        {error ? (
          <Text style={[typography.caption, { color: colors.danger, marginTop: spacing.md }]}>{error}</Text>
        ) : null}

        <View style={{ flex: 1, minHeight: spacing.xl }} />

        <View style={{ flexDirection: "row", marginBottom: spacing.md }}>
          <View style={{ flex: 1, marginRight: spacing.sm }}>
            <AppButton title={t("cancel")} variant="ghost" onPress={() => navigation.goBack()} />
          </View>
          <View style={{ flex: 1 }}>
            <AppButton
              title={t("continueToVerify")}
              onPress={handleContinue}
              loading={loading}
              disabled={!imageUri}
              style={shadows.button}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
