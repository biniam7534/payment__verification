/**
 * SignInScreen
 *
 * Layout (top → bottom):
 *   • Marquee ticker  — scrolls "Welcome back • Bunna Pay • tagline" horizontally
 *   • Hero section    — shield icon + static "Welcome back" + "Buna Pay"
 *   • Form section    — inputs, button, sign-up link, language picker
 */
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Animated,
  Easing,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth }  from "../../store/AuthContext";
import { useI18n }  from "../../i18n/I18nContext";
import {
  scale,
  moderateScale,
  vScale,
  rr,
  rs,
  iconSize,
  screenPadding,
} from "../../theme/responsive";

// ─── Brand colors ─────────────────────────────────────────────────────────────
const BG     = "#1A6B38";
const BTN    = "#22A750";
const ACCENT = "#4ADE80";
const TICKER_BG   = "#155D2E";   // slightly darker strip for the marquee

// ─── Layout ───────────────────────────────────────────────────────────────────
const INPUT_H = scale(52, 0.4);
const BTN_H   = scale(52, 0.4);
const H_PAD   = screenPadding;

// ─── Marquee ticker ───────────────────────────────────────────────────────────
/**
 * Continuously scrolling text strip built with Animated.Value.
 * No third-party library required.
 *
 * The full ticker text is duplicated side-by-side so the loop is seamless:
 *   [text ][text ]  — when the first copy exits the left edge, the second
 *   copy is already in place, then the animation resets to 0 instantly.
 */
const TICKER_TEXT =
  "Welcome back   •   Bunna Pay   •   የእውነተኛ ደርሰኝ ፣ ብልህ ማረጋገጫ   •   ";
const TICKER_SPEED = 55;   // px per second — lower = slower

function Marquee() {
  const { width: screenW } = useWindowDimensions();
  const translateX = useRef(new Animated.Value(0)).current;
  // We don't know the text width until render, so we measure it
  const [textWidth, setTextWidth] = useState(screenW * 3);

  useEffect(() => {
    if (!textWidth) return;
    const duration = (textWidth / TICKER_SPEED) * 1000;

    const anim = Animated.loop(
      Animated.timing(translateX, {
        toValue:         -textWidth,
        duration,
        easing:          Easing.linear,
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [textWidth, translateX]);

  return (
    <View style={mS.strip}>
      {/* Clip overflow so text disappears cleanly off both edges */}
      <View style={mS.clip}>
        <Animated.View
          style={[mS.track, { transform: [{ translateX }] }]}
        >
          {/* First copy */}
          <Text
            style={mS.text}
            onLayout={e => setTextWidth(e.nativeEvent.layout.width)}
            numberOfLines={1}
          >
            {TICKER_TEXT}
          </Text>
          {/* Second copy sits immediately after — makes the loop seamless */}
          <Text style={mS.text} numberOfLines={1}>
            {TICKER_TEXT}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const mS = StyleSheet.create({
  strip: {
    width:           "100%",
    backgroundColor: TICKER_BG,
    paddingVertical: rs.xs + 2,
    overflow:        "hidden",
  },
  clip: {
    overflow: "hidden",
  },
  track: {
    flexDirection: "row",
  },
  text: {
    fontSize:      moderateScale(12),
    color:         "rgba(255,255,255,0.85)",
    fontWeight:    "500",
    letterSpacing:  0.3,
    paddingHorizontal: rs.sm,
  },
});

// ─── Shield + checkmark hero icon ─────────────────────────────────────────────
function ShieldIcon() {
  const outerSize  = scale(120, 0.45);
  const innerSize  = scale(88,  0.45);
  const shieldSize = scale(54,  0.45);

  return (
    <View style={{
      width:           outerSize,
      height:          outerSize,
      borderRadius:    outerSize / 2,
      backgroundColor: "rgba(255,255,255,0.12)",
      alignItems:      "center",
      justifyContent:  "center",
    }}>
      <View style={{
        width:           innerSize,
        height:          innerSize,
        borderRadius:    innerSize / 2,
        backgroundColor: "#155D2E",
        alignItems:      "center",
        justifyContent:  "center",
        shadowColor:     "#000",
        shadowOffset:    { width: 0, height: 4 },
        shadowOpacity:   0.30,
        shadowRadius:    10,
        elevation:       6,
      }}>
        <Ionicons name="shield-checkmark" size={shieldSize} color="#FFFFFF" />
      </View>
    </View>
  );
}

// ─── Translucent input ────────────────────────────────────────────────────────
function GreenInput({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, error }) {
  const [hidden, setHidden] = useState(!!secureTextEntry);
  return (
    <View style={{ marginBottom: rs.md }}>
      {label ? <Text style={iS.label}>{label}</Text> : null}
      <View style={[iS.wrap, error && iS.err]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.40)"
          secureTextEntry={hidden}
          keyboardType={keyboardType ?? "default"}
          autoCapitalize="none"
          style={iS.text}
        />
        {secureTextEntry ? (
          <Pressable onPress={() => setHidden(h => !h)} hitSlop={10}>
            <Ionicons
              name={hidden ? "eye-off-outline" : "eye-outline"}
              size={iconSize.sm}
              color="rgba(255,255,255,0.50)"
            />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={iS.errTxt}>{error}</Text> : null}
    </View>
  );
}

const iS = StyleSheet.create({
  label:  { fontSize: moderateScale(13), fontWeight: "500", color: "rgba(255,255,255,0.88)", marginBottom: rs.xs },
  wrap: {
    flexDirection: "row", alignItems: "center",
    height: INPUT_H, borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)", borderRadius: rr.md,
    paddingHorizontal: rs.md, backgroundColor: "rgba(255,255,255,0.13)",
  },
  err:    { borderColor: "#FCA5A5" },
  text:   { flex: 1, fontSize: moderateScale(14), color: "#FFFFFF" },
  errTxt: { fontSize: moderateScale(11), color: "#FCA5A5", marginTop: rs.xs },
});

// ─── Language picker ──────────────────────────────────────────────────────────
function LanguagePicker({ language, languages, onPress }) {
  const current = languages?.find(l => l.code === language);
  return (
    <Pressable onPress={onPress} style={lS.row} hitSlop={8}>
      <Ionicons name="globe-outline" size={iconSize.sm} color="rgba(255,255,255,0.65)" />
      <Text style={lS.label}>{current?.label ?? "English"}</Text>
      <Ionicons name="chevron-down" size={scale(14, 0.3)} color="rgba(255,255,255,0.65)" />
    </Pressable>
  );
}
const lS = StyleSheet.create({
  row:   { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: rs.sm, gap: rs.xs },
  label: { fontSize: moderateScale(13), color: "rgba(255,255,255,0.75)", marginHorizontal: rs.xs, fontWeight: "500" },
});

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function SignInScreen({ navigation }) {
  const { signIn, isLoading }      = useAuth();
  const { t, language, languages } = useI18n();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword]       = useState("");
  const [remember, setRemember]       = useState(false);
  const [errors, setErrors]           = useState({});
  const [apiError, setApiError]       = useState("");

  function validate() {
    const e = {};
    if (!phoneNumber.trim()) e.phone    = "Phone number is required";
    if (!password)           e.password = "Password is required";
    return e;
  }

  async function handleSignIn() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setApiError("");
    try {
      await signIn(phoneNumber.trim(), password);
    } catch (err) {
      setApiError(err?.message ?? "Sign in failed. Please try again.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={S.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={TICKER_BG} />

      {/* ── Marquee ticker — above everything, full-width ────────────── */}
      <Marquee />

      <ScrollView
        contentContainerStyle={S.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <View style={S.top}>
          <ShieldIcon />

          {/* Static title — "Welcome back" */}
          <Text style={[S.title, { marginTop: vScale(18, 0.35) }]}>
            Welcome back
          </Text>

          {/* Static subtitle — "Buna Pay" in brand style */}
          <View style={S.brandRow}>
            <Text style={S.brandBuna}>Buna</Text>
            <Text style={S.brandPay}> Pay</Text>
          </View>
        </View>

        {/* ── Form ─────────────────────────────────────────────────── */}
        <View style={S.form}>

          <GreenInput
            label={t("phoneNumber")}
            value={phoneNumber}
            onChangeText={v => { setPhoneNumber(v); setErrors(e => ({ ...e, phone: undefined })); }}
            placeholder="091 000 0000"
            keyboardType="phone-pad"
            error={errors.phone}
          />

          <View style={S.pwdRow}>
            <Text style={iS.label}>{t("password")}</Text>
            <Pressable hitSlop={8}>
              <Text style={S.forgot}>{t("forgotPassword")}</Text>
            </Pressable>
          </View>
          <GreenInput
            value={password}
            onChangeText={v => { setPassword(v); setErrors(e => ({ ...e, password: undefined })); }}
            placeholder="••••••••"
            secureTextEntry
            error={errors.password}
          />

          <Pressable onPress={() => setRemember(r => !r)} style={S.remRow} hitSlop={6}>
            <View style={[S.box, remember && S.boxOn]}>
              {remember && <Ionicons name="checkmark" size={scale(11, 0.3)} color="#fff" />}
            </View>
            <Text style={S.remLabel}>{t("rememberMe")}</Text>
          </Pressable>

          {apiError ? (
            <View style={S.apiBox}>
              <Text style={S.apiTxt}>{apiError}</Text>
            </View>
          ) : null}

          <Pressable
            onPress={handleSignIn}
            disabled={isLoading}
            style={({ pressed }) => [S.btn, { opacity: pressed || isLoading ? 0.82 : 1 }]}
          >
            {isLoading
              ? <ActivityIndicator color="#fff" />
              : <Text style={S.btnTxt}>{t("signIn")}</Text>}
          </Pressable>

          <View style={S.suRow}>
            <Text style={S.suGray}>{t("noAccount")} </Text>
            <Pressable onPress={() => navigation.navigate("CreateAccount")} hitSlop={8}>
              <Text style={S.suLink}>{t("signUp")}</Text>
            </Pressable>
          </View>

          <LanguagePicker language={language} languages={languages} onPress={() => navigation.navigate("Language")} />
          <View style={{ height: rs.lg }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  root:   { flex: 1, backgroundColor: BG },
  scroll: { flexGrow: 1, backgroundColor: BG },

  // Hero
  top: {
    alignItems:        "center",
    paddingTop:        vScale(48, 0.35),
    paddingBottom:     vScale(20, 0.35),
    paddingHorizontal: H_PAD,
    backgroundColor:   BG,
  },
  title: {
    fontSize:      moderateScale(26),
    fontWeight:    "700",
    color:         "#FFFFFF",
    letterSpacing: 0.3,
    textAlign:     "center",
  },

  // "Buna Pay" brand name row below the title
  brandRow: {
    flexDirection: "row",
    alignItems:    "baseline",
    marginTop:     rs.xs,
  },
  brandBuna: {
    fontSize:      moderateScale(22),
    fontWeight:    "800",
    color:         "#A7F3A0",   // light green — pops against the dark green bg
    letterSpacing: 0.4,
  },
  brandPay: {
    fontSize:      moderateScale(22),
    fontWeight:    "800",
    color:         "#FFFFFF",
    letterSpacing: 0.4,
  },

  // Form
  form: {
    flex:              1,
    paddingHorizontal: H_PAD,
    paddingTop:        vScale(24, 0.35),
    backgroundColor:   BG,
  },
  pwdRow:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: rs.xs },
  forgot:  { fontSize: moderateScale(12), color: "rgba(255,255,255,0.60)", fontWeight: "500" },

  remRow:  { flexDirection: "row", alignItems: "center", marginTop: rs.xs, marginBottom: rs.lg },
  box: {
    width: scale(18, 0.3), height: scale(18, 0.3), borderRadius: scale(4, 0.3),
    borderWidth: 1.5, borderColor: "rgba(255,255,255,0.38)",
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  boxOn:    { backgroundColor: BTN, borderColor: BTN },
  remLabel: { fontSize: moderateScale(13), color: "rgba(255,255,255,0.78)", marginLeft: rs.sm },

  apiBox: {
    backgroundColor: "rgba(239,68,68,0.20)", borderWidth: 1,
    borderColor: "rgba(252,165,165,0.35)", borderRadius: rr.md,
    padding: rs.md, marginBottom: rs.md,
  },
  apiTxt: { fontSize: moderateScale(12), color: "#FCA5A5", textAlign: "center" },

  btn: {
    height: BTN_H, backgroundColor: BTN, borderRadius: rr.pill,
    alignItems: "center", justifyContent: "center",
    shadowColor: BTN, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45, shadowRadius: 14, elevation: 8,
    marginBottom: rs.lg,
  },
  btnTxt: { fontSize: moderateScale(16), fontWeight: "700", color: "#FFFFFF", letterSpacing: 0.4 },

  suRow:  { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: rs.md },
  suGray: { fontSize: moderateScale(13), color: "rgba(255,255,255,0.55)" },
  suLink: { fontSize: moderateScale(13), color: ACCENT, fontWeight: "600" },
});
