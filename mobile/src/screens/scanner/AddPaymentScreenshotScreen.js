import React, { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import ScreenContainer from "../../components/common/ScreenContainer";
import ScreenHeader from "../../components/common/ScreenHeader";
import AppButton from "../../components/common/AppButton";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import * as paymentsApi from "../../services/api/paymentsApi";
import { typography, spacing, radius } from "../../theme";

export default function AddPaymentScreenshotScreen({ navigation, route }) {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const [imageUri, setImageUri] = useState(route?.params?.imageUri || null);
  const [loading, setLoading] = useState(false);

  const pickImage = async (fromCamera) => {
    const launch = fromCamera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;
    const result = await launch({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const handleContinue = async () => {
    if (!imageUri) return;
    setLoading(true);
    try {
      // TODO: connect to real backend OCR/verification endpoint via submitPaymentScreenshot().
      const details = await paymentsApi.submitPaymentScreenshot({ imageUri });
      navigation.navigate("VerifyPayment", { details });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title={t("addPaymentScreenshot")} />

      <Pressable
        onPress={() => pickImage(false)}
        style={{
          height: 220,
          borderRadius: radius.lg,
          borderWidth: 2,
          borderColor: colors.border,
          borderStyle: "dashed",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.surface,
          marginTop: spacing.md,
          overflow: "hidden",
        }}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={36} color={colors.primaryDark} />
            <Text style={[typography.bodyMedium, { color: colors.ink, marginTop: spacing.sm }]}>
              {t("uploadScreenshot")}
            </Text>
            <Text style={[typography.caption, { color: colors.gray, marginTop: 2 }]}>{t("pngJpgUpTo")}</Text>
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
          backgroundColor: colors.background,
          padding: spacing.md,
          borderRadius: radius.md,
          marginTop: spacing.lg,
        }}
      >
        <Ionicons name="information-circle-outline" size={18} color={colors.gray} />
        <Text style={[typography.caption, { color: colors.gray, marginLeft: spacing.sm, flex: 1 }]}>
          {t("makeSureVisible")}
        </Text>
      </View>

      <View style={{ flex: 1 }} />

      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1, marginRight: spacing.sm }}>
          <AppButton title={t("cancel")} variant="ghost" onPress={() => navigation.goBack()} />
        </View>
        <View style={{ flex: 1 }}>
          <AppButton title={t("verify")} onPress={handleContinue} loading={loading} disabled={!imageUri} />
        </View>
      </View>
    </ScreenContainer>
  );
}
