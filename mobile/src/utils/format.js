// Currency/number formatting helpers used across screens.
export function formatCurrency(amount, currency = "ETB") {
  return `${currency} ${Number(amount || 0).toFixed(2)}`;
}

export function formatDate(date = new Date()) {
  return date.toLocaleString();
}
