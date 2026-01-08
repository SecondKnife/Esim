/**
 * Payment Methods Configuration
 * Enable/disable payment methods for your store
 */

export const PAYMENT_CONFIG = {
  // Enable/disable Stripe (Visa/Mastercard)
  // Set to false if you're in Vietnam and cannot use Stripe
  stripe: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_STRIPE === "true",
    requireKeys: true, // If true, Stripe will only work if keys are configured
  },

  // Bank transfer - Always enabled (default payment method)
  bankTransfer: {
    enabled: true,
  },

  // COD (Cash on Delivery) - Only for physical products
  cod: {
    enabled: true,
    onlyForPhysicalProducts: true, // Only show for SIM cards, not eSIM
  },

  // VNPay integration (for Vietnam)
  vnpay: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_VNPAY === "true",
  },

  // MoMo Wallet (for Vietnam)
  momo: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_MOMO === "true",
  },

  // ZaloPay (for Vietnam)
  zalopay: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_ZALOPAY === "true",
  },
};

/**
 * Check if Stripe is available
 */
export function isStripeAvailable(): boolean {
  if (!PAYMENT_CONFIG.stripe.enabled) {
    return false;
  }

  if (PAYMENT_CONFIG.stripe.requireKeys) {
    const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;
    return !!(
      stripeKey &&
      !stripeKey.includes("placeholder") &&
      stripeKey.length >= 20 &&
      (stripeKey.startsWith("sk_test_") || stripeKey.startsWith("sk_live_"))
    );
  }

  return true;
}

/**
 * Get available payment methods
 */
export function getAvailablePaymentMethods() {
  const methods: string[] = [];

  if (PAYMENT_CONFIG.bankTransfer.enabled) {
    methods.push("bank_transfer");
  }

  if (isStripeAvailable()) {
    methods.push("visa");
  }

  if (PAYMENT_CONFIG.vnpay.enabled) {
    methods.push("vnpay");
  }

  if (PAYMENT_CONFIG.momo.enabled) {
    methods.push("momo");
  }

  if (PAYMENT_CONFIG.zalopay.enabled) {
    methods.push("zalopay");
  }

  // COD is added conditionally in the component based on product type
  // methods.push("cod");

  return methods;
}

/**
 * Check if payment method is enabled
 */
export function isPaymentMethodEnabled(method: string): boolean {
  switch (method) {
    case "bank_transfer":
      return PAYMENT_CONFIG.bankTransfer.enabled;
    case "visa":
      return isStripeAvailable();
    case "vnpay":
      return PAYMENT_CONFIG.vnpay.enabled;
    case "momo":
      return PAYMENT_CONFIG.momo.enabled;
    case "zalopay":
      return PAYMENT_CONFIG.zalopay.enabled;
    case "cod":
      return PAYMENT_CONFIG.cod.enabled;
    default:
      return false;
  }
}

