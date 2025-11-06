/**
 * Get the next billing date from today.
 * @param months Number of months to add (default 1)
 */
export function getNextBillingDate(months = 1): Date {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date;
}

/**
 * Format a date nicely (e.g., "12 Nov 2025")
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Check if a subscription is expired
 */
export function isExpired(expiryDate: Date): boolean {
  return new Date() > new Date(expiryDate);
}
