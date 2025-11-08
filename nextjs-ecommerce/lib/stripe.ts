import Stripe from "stripe";

// Get Stripe secret key from environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;

if (!stripeSecretKey || stripeSecretKey.includes("placeholder") || stripeSecretKey.length < 20) {
  console.warn("⚠️ Stripe secret key is not configured properly. Payment via Stripe will not work.");
  console.warn("Please set STRIPE_SECRET_KEY in your .env.local file");
}

export const stripe = new Stripe(stripeSecretKey || "sk_test_placeholder", {
  apiVersion: "2023-10-16",
  typescript: true,
});
