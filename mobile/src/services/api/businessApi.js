import request from "./client";

// TODO: connect to GET /account/profile on the BunnaPay backend.
export async function getUserBankInfo() {
  const response = await request("/account/profile", { method: "GET" });
  return {
    provider: response?.default_provider || "cbe",
    bankName: getBankNameFromProvider(response?.default_provider),
  };
}

// TODO: connect to POST /account/profile/bank on the BunnaPay backend.
export async function updateUserBank(provider) {
  const response = await request("/account/profile/bank", {
    method: "POST",
    body: { default_provider: provider },
  });
  return response;
}

export function getBankNameFromProvider(provider) {
  const bankNames = {
    cbe: "Commercial Bank of Ethiopia",
    dashen: "Dashen Bank",
    zemen: "Zemen Bank",
    awash: "Awash International Bank",
  };
  return bankNames[provider?.toLowerCase()] || "Commercial Bank of Ethiopia";
}

export const AVAILABLE_BANKS = [
  { id: "cbe", name: "Commercial Bank of Ethiopia", code: "CBE" },
  { id: "dashen", name: "Dashen Bank", code: "DASHEN" },
  { id: "zemen", name: "Zemen Bank", code: "ZEMEN" },
  { id: "awash", name: "Awash International Bank", code: "AWASH" },
];

// TODO: connect to GET /businesses/:id/branches on the BunnaPay backend.
export async function getBranches() {
  await request("/branches");
  return [
    { id: "b1", name: "Bole Main Branch", address: "Bole Road, Addis Ababa", staffCount: 6 },
    { id: "b2", name: "Piassa Branch", address: "Piassa, Addis Ababa", staffCount: 3 },
    { id: "b3", name: "Adama Branch", address: "Adama City Center", staffCount: 2 },
  ];
}

// TODO: connect to POST /branches on the BunnaPay backend.
export async function createBranch({ name, address }) {
  await request("/branches", { method: "POST", body: { name, address } });
  return { success: true };
}

// TODO: connect to GET /branches/:id/staff on the BunnaPay backend.
export async function getStaff(branchId) {
  await request(`/branches/${branchId}/staff`);
  return [
    { id: "s1", name: "Meron A.", role: "Cashier" },
    { id: "s2", name: "Yonas T.", role: "Manager" },
  ];
}

// TODO: connect to GET /businesses/:id/subscription on the BunnaPay backend.
export async function getSubscription() {
  await request("/subscription");
  return { plan: "Pro", renewsOn: "2026-08-01", price: 499, currency: "ETB" };
}
