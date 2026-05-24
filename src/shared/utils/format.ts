/**
 * Parameterized currency formatter using Intl.NumberFormat.
 * No hardcoded locale or currency — caller owns those decisions.
 */
export function formatCurrency(
  amount: number,
  currency: string,
  locale: string,
  fractionDigits = 2,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
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
