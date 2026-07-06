import React, { createContext, useContext, useState, useCallback } from "react";
import * as authApi from "../services/api/authApi";

const AuthContext = createContext({
  user:              null,
  isLoading:         false,
  signIn:            async () => {},
  signOut:           () => {},
  registerDraft:     {},
  setRegisterDraft:  () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser]                   = useState(null);
  const [isLoading, setIsLoading]         = useState(false);
  const [registerDraft, setRegisterDraft] = useState({});

  const signIn = useCallback(async (phoneNumber, password) => {
    setIsLoading(true);
    try {
      const result = await authApi.signIn({ phoneNumber, password });

      // Build the signed-in user object.
      // Priority order for the display name:
      //   1. Name returned by the real API (result.user.name)
      //   2. Name stored in registerDraft (set during account creation)
      //   3. Derive a readable label from the phone number as a last resort
      const resolvedName =
        result.user?.name ||
        registerDraft.fullName ||
        phoneNumber;

      const signedInUser = {
        id:          result.user?.id ?? "u1",
        name:        resolvedName,
        phoneNumber: result.user?.phoneNumber ?? phoneNumber,
        verified:    result.user?.verified    ?? true,
      };

      setUser(signedInUser);   // triggers RootNavigator → AppStack
      return { ...result, user: signedInUser };
    } catch (err) {
      // Re-throw so the screen can show the error message
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [registerDraft]);          // depends on registerDraft so the name is fresh

  const signOut = useCallback(() => {
    setUser(null);
    setRegisterDraft({});       // clear draft on sign-out
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signIn, signOut, registerDraft, setRegisterDraft }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
