import crypto from "crypto";

// Ephemeral per-process fallback secret if UPI_GATEWAY_SECRET env var is not configured.
// Never hardcoded to a static literal.
const EPHEMERAL_FALLBACK_KEY = crypto.randomBytes(32).toString("hex");

function getSigningSecret(): string {
  const configured = process.env.UPI_GATEWAY_SECRET?.trim();
  return configured && configured.length >= 16 ? configured : EPHEMERAL_FALLBACK_KEY;
}

export interface SignedPaymentPayload {
  orderId: string;
  transactionRef: string;
  totalAmount: number;
  userId: string;
}

export function signPaymentSession(payload: SignedPaymentPayload): string {
  const canonical = `${payload.orderId}|${payload.transactionRef}|${payload.totalAmount.toFixed(2)}|${payload.userId}`;
  return crypto
    .createHmac("sha256", getSigningSecret())
    .update(canonical)
    .digest("hex");
}

export function verifyPaymentSignature(
  payload: SignedPaymentPayload,
  signature: string
): boolean {
  if (!signature || typeof signature !== "string") return false;
  const expected = signPaymentSession(payload);
  const expectedBuf = Buffer.from(expected, "utf8");
  const actualBuf = Buffer.from(signature, "utf8");
  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

export function isValidUpiVpa(vpa: string): boolean {
  return /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/.test(vpa.trim());
}

export function isValidUtrNumber(utr: string): boolean {
  const cleaned = utr.trim();
  // Standard UPI UTR / RRN is 12 digits and cannot be all zeros
  return /^\d{12}$/.test(cleaned) && !/^0{12}$/.test(cleaned);
}
