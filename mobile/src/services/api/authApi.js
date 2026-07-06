import request from "./client";

// TODO: connect to POST /auth/sign-in on the BunnaPay backend.
export async function signIn({ phoneNumber, password }) {
  await request("/auth/sign-in", { method: "POST", body: { phoneNumber, password } });
  // Mocked successful sign-in — returns the phone number as a stand-in name
  // until the real backend supplies the user's profile.
  // The actual name is injected by AuthContext from registerDraft when available.
  return {
    token: "mock-token",
    user: { id: "u1", name: null, phoneNumber, verified: true },
  };
}

// TODO: connect to POST /auth/sign-up on the BunnaPay backend.
export async function signUp({ fullName, phoneNumber, password }) {
  await request("/auth/sign-up", { method: "POST", body: { fullName, phoneNumber, password } });
  return { success: true };
}

// TODO: connect to POST /auth/verify-otp on the BunnaPay backend.
export async function verifyOtp({ phoneNumber, code }) {
  await request("/auth/verify-otp", { method: "POST", body: { phoneNumber, code } });
  return { success: true };
}

// TODO: connect to POST /auth/resend-otp on the BunnaPay backend.
export async function resendOtp({ phoneNumber }) {
  await request("/auth/resend-otp", { method: "POST", body: { phoneNumber } });
  return { success: true };
}
