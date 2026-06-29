import React, { createContext, useContext, useState, useCallback } from "react";
import * as authApi from "../services/api/authApi";

const AuthContext = createContext({
  user: null,
  isLoading: false,
  signIn: async () => {},
  signOut: () => {},
  registerDraft: {},
  setRegisterDraft: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registerDraft, setRegisterDraft] = useState({});

  const signIn = useCallback(async (phoneNumber, password) => {
    setIsLoading(true);
    try {
      const result = await authApi.signIn({ phoneNumber, password });
      const signedInUser = result.user ?? {
        id: "u1",
        name: phoneNumber ? "Abel Tesfaye" : "User",
        phoneNumber,
        verified: true,
      };
      setUser(signedInUser);
      return { ...result, user: signedInUser };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
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
