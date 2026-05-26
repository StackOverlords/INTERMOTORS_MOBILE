/**
 * Parameterized currency formatter using Intl.NumberFormat.
 * Falls back to 'BOB' if the currency code is invalid (e.g. dirty DB data).
 */
export function formatCurrency(
  amount: number,
  currency: string,
  locale: string,
  fractionDigits = 2,
): string {
  // ISO 4217: exactly 3 uppercase ASCII letters
  const safeCurrency = /^[A-Z]{3}$/.test(currency) ? currency : 'BOB';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: safeCurrency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(amount);
  } catch {
    return `${safeCurrency} ${Number(amount).toFixed(fractionDigits)}`;
  }
}

/**
 * Parameterized date formatter using Intl.DateTimeFormat.
 * No hardcoded locale — caller owns locale and format options.
 *
 * If isoDate is invalid, returns the original string without throwing.
 * Default options show day/month/year numerically.
 */
export function formatDate(
  isoDate: string,
  locale: string,
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  },
): string {
  const date = new Date(isoDate);

  if (isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
}
