import { Platform } from "react-native";

export function getShadows(isDark = false) {
  if (isDark) {
    return {
      card: {
        borderWidth: 1,
        borderColor: "#27324A",
      },
      button: Platform.select({
        ios: {
          shadowColor: "#16A34A",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
        },
        android: { elevation: 6 },
        default: {},
      }),
    };
  }

  return {
    card: Platform.select({
      ios: {
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
      default: {},
    }),
    button: Platform.select({
      ios: {
        shadowColor: "#16A34A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
      default: {},
    }),
  };
}

// Default light shadows for static imports
export const shadows = getShadows(false);

export default shadows;
