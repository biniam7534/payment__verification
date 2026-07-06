/**
 * ScanQRScreen
 *
 * Refactored to replace every raw numeric literal and imported
 * `spacing` / `radius` tokens with the canonical rs / rr / iconSize
 * responsive tokens. No logic or UX changes.
 */
import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import ScreenContainer from "../../components/common/ScreenContainer";
import AppButton from "../../components/common/AppButton";
import { useAppTheme } from "../../theme/ThemeContext";
import { useI18n } from "../../i18n/I18nContext";
import { navigateToAppScreen } from "../../navigation/navigateTo";
import { typography } from "../../theme";
import { rs, rr, iconSize, scale, screenPadding } from "../../theme/responsive";

// QR viewfinder box size — proportional to screen width
const FINDER_SIZE = scale(240, 0.6);

export default function ScanQRScreen({ navigation }) {
  const { colors, shadows } = useAppTheme();
  const { t }               = useI18n();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned]           = useState(false);

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const goToUpload = (params = {}) => {
    navigateToAppScreen(navigation, "AddPaymentScreenshot", params);
  };

  const handleBarcodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);
    goToUpload({ qrPayload: data });
  };

  const handleUploadFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      goToUpload({ imageUri: result.assets[0].uri });
    }
  };

  return (
    <ScreenContainer
      noPadding
      edges={["top", "bottom", "left", "right"]}
      style={{ backgroundColor: colors.darkBg }}
    >
      <View style={styles.fill}>
        {/* ── Camera / permission ─────────────────────────────────────────── */}
        {permission?.granted ? (
          <CameraView
            style={styles.fill}
            facing="back"
            onBarcodeScanned={handleBarcodeScanned}
          />
        ) : (
          <View style={styles.permissionBox}>
            <Ionicons name="camera-outline" size={iconSize.xl} color="#fff" />
            <Text style={[typography.body, { color: "#fff", marginTop: rs.md, textAlign: "center" }]}>
              Camera permission is required to scan QR codes.
            </Text>
            <AppButton
              title="Grant Permission"
              onPress={requestPermission}
              style={{ marginTop: rs.lg, minWidth: scale(200, 0.5) }}
            />
          </View>
        )}

        {/* ── Top bar ─────────────────────────────────────────────────────── */}
        <View
          style={[
            styles.topBar,
            { top: rs.lg, left: screenPadding, right: screenPadding },
          ]}
        >
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Ionicons name="close" size={iconSize.md} color="#fff" />
          </Pressable>
          <Text style={[typography.h3, { color: "#fff", flex: 1, textAlign: "center" }]}>
            {t("scanQR")}
          </Text>
          {/* Spacer keeps title centered */}
          <View style={{ width: iconSize.md }} />
        </View>

        {/* ── Viewfinder ──────────────────────────────────────────────────── */}
        <View style={styles.finderWrapper}>
          <View
            style={[
              styles.finder,
              {
                width:        FINDER_SIZE,
                height:       FINDER_SIZE,
                borderRadius: rr.lg,
                borderColor:  colors.primaryLight,
              },
            ]}
          />
          <Text
            style={[
              typography.body,
              { color: "#fff", textAlign: "center", marginTop: rs.md },
            ]}
          >
            {t("pointCameraAtQR")}
          </Text>
        </View>

        {/* ── Bottom actions ───────────────────────────────────────────────── */}
        <View
          style={[
            styles.bottomActions,
            { bottom: rs.xl, left: screenPadding, right: screenPadding },
          ]}
        >
          <AppButton
            title={t("addPaymentScreenshot")}
            onPress={() => goToUpload()}
            style={{ marginBottom: rs.md, ...shadows.button }}
          />
          <AppButton
            title={t("uploadFromGallery")}
            variant="outline"
            onPress={handleUploadFromGallery}
            style={{ borderColor: "#fff" }}
            icon={
              <Ionicons
                name="image-outline"
                size={iconSize.sm}
                color={colors.primaryLight}
              />
            }
          />
          <Text
            style={[
              typography.caption,
              {
                color:      "rgba(255,255,255,0.70)",
                textAlign:  "center",
                marginTop:  rs.sm,
              },
            ]}
          >
            {t("ensureQRClear")}
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: "#000" },
  permissionBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: rs.xl,
  },
  topBar: {
    position:       "absolute",
    flexDirection:  "row",
    alignItems:     "center",
  },
  finderWrapper: {
    position:  "absolute",
    alignSelf: "center",
    top:       "28%",
    alignItems: "center",
  },
  finder: {
    borderWidth: 3,
  },
  bottomActions: {
    position: "absolute",
  },
});
