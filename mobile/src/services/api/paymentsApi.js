import request from "./client";

// TODO: connect to GET /payments/summary on the BunnaPay backend.
export async function getDashboardSummary() {
  await request("/payments/summary");
  // Mocked dashboard data matching the design reference.
  return {
    totalVerifiedToday: 38200.0,
    currency: "ETB",
    stats: { totalToday: 42, totalVerifiedAmount: 8150, successRate: 0.93 },
  };
}

// TODO: connect to GET /payments/transactions on the BunnaPay backend.
export async function getTransactions({ query, status } = {}) {
  await request("/payments/transactions", { method: "GET", body: { query, status } });
  return MOCK_TRANSACTIONS;
}

// TODO: connect to POST /payments/verify with a multipart screenshot upload.
export async function submitPaymentScreenshot({ imageUri, qrPayload }) {
  await request("/payments/verify", { method: "POST", body: { imageUri, qrPayload } });
  // Mocked extracted payment details for the "Verify Payment" review screen.
  return {
    id: "tx_mock_1",
    from: "Degrawit W.",
    reference: "FT26149OJYLM",
    amount: 10.0,
    currency: "ETB",
    screenshotUri: imageUri,
  };
}

// TODO: connect to POST /payments/:id/confirm on the BunnaPay backend.
export async function confirmPayment(transactionId) {
  await request(`/payments/${transactionId}/confirm`, { method: "POST" });
  return { success: true, status: "verified" };
}

// TODO: connect to POST /payments/:id/report on the BunnaPay backend.
export async function reportPaymentIssue(transactionId, reason) {
  await request(`/payments/${transactionId}/report`, { method: "POST", body: { reason } });
  return { success: true };
}

// TODO: connect to GET /payments/qr on the BunnaPay backend.
export async function getMyQrCode() {
  await request("/payments/qr");
  return { qrPayload: "bunnapay://merchant/u1" };
}

export const MOCK_TRANSACTIONS = [
  { id: "tx1", name: "Degrawit W.", date: "Today, 10:10 AM", amount: 10.0, status: "verified" },
  { id: "tx2", name: "Abel T.", date: "Today, 09:42 AM", amount: 240.0, status: "verified" },
  { id: "tx3", name: "Hana M.", date: "Oct 12, 08:15 AM", amount: 1200.0, status: "verified" },
  { id: "tx4", name: "Samuel G.", date: "Oct 11, 04:30 PM", amount: 75.5, status: "pending" },
  { id: "tx5", name: "Liya K.", date: "Oct 10, 02:05 PM", amount: 320.0, status: "failed" },
];
