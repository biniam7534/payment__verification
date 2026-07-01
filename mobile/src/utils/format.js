// Currency/number formatting helpers used across screens.
export function formatCurrency(amount, currency = "ETB") {
  const num = Number(amount || 0);
  const formatted = num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${currency} ${formatted}`;
}

export function formatDate(date = new Date()) {
  return date.toLocaleString();
}
