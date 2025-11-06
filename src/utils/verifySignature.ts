import crypto from 'crypto';

/**
 * Verify Razorpay webhook or payment signature
 * @param payload - The raw request body string
 * @param signature - The Razorpay signature header from webhook
 * @param secret - Your Razorpay webhook secret
 * @returns true if valid, false otherwise
 */
export function verifyRazorpaySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return expectedSignature === signature;
}
