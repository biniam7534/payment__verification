import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import ScreenContainer from "../../components/common/ScreenContainer";
import AppButton from "../../components/common/AppButton";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { typography, spacing, radius } from "../../theme";

export default function ScanQRScreen({ navigation }) {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const handleBarcodeScanned = ({ data }) => {
    // TODO: send scanned QR payload to backend for merchant/payment lookup.
    navigation.navigate("AddPaymentScreenshot", { qrPayload: data });
  };

  const handleUploadFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      navigation.navigate("AddPaymentScreenshot", { imageUri: result.assets[0].uri });
    }
  };

  return (
    <ScreenContainer noPadding edges={["top", "bottom", "left", "right"]} style={{ backgroundColor: colors.darkBg }}>
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        {permission?.granted ? (
          <CameraView style={{ flex: 1 }} facing="back" onBarcodeScanned={handleBarcodeScanned} />
        ) : (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#fff" }}>Camera permission required</Text>
          </View>
        )}

        <View style={{ position: "absolute", top: spacing.lg, left: spacing.lg, right: spacing.lg, flexDirection: "row", alignItems: "center" }}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Ionicons name="close" size={28} color="#fff" />
          </Pressable>
          <Text style={[typography.h3, { color: "#fff", flex: 1, textAlign: "center" }]}>{t("scanQR")}</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={{ position: "absolute", alignSelf: "center", top: "30%" }}>
          <View
            style={{
              width: 240,
              height: 240,
              borderRadius: radius.lg,
              borderWidth: 3,
              borderColor: colors.primaryLight,
            }}
          />
          <Text style={[typography.body, { color: "#fff", textAlign: "center", marginTop: spacing.md }]}>
            {t("pointCameraAtQR")}
          </Text>
        </View>

        <View style={{ position: "absolute", bottom: spacing.xl, left: spacing.lg, right: spacing.lg }}>
          <AppButton
            title={t("uploadFromGallery")}
            variant="outline"
            onPress={handleUploadFromGallery}
            style={{ borderColor: "#fff" }}
            icon={<Ionicons name="image-outline" size={18} color={colors.primaryLight} />}
          />
          <Text style={[typography.caption, { color: "rgba(255,255,255,0.7)", textAlign: "center", marginTop: spacing.sm }]}>
            {t("ensureQRClear")}
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
