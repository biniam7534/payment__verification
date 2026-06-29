import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translations, { LANGUAGES } from "./translations";

const LANGUAGE_STORAGE_KEY = "bunnapay.language";

const I18nContext = createContext({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState("en");

  useEffect(() => {
    // Restore previously chosen language on app start.
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY).then((stored) => {
      if (stored && translations[stored]) setLanguageState(stored);
    });
  }, []);

  const setLanguage = useCallback((code) => {
    setLanguageState(code);
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, code).catch(() => {});
  }, []);

  const t = useCallback(
    (key) => {
      const dict = translations[language] || translations.en;
      return dict[key] ?? translations.en[key] ?? key;
    },
    [language]
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
