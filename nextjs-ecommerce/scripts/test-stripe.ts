/**
 * Script to test Stripe configuration
 * Run: npx tsx scripts/test-stripe.ts
 */

import Stripe from "stripe";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), ".env") });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

console.log("🔍 Checking Stripe configuration...\n");

// Check if keys exist
if (!stripeSecretKey) {
  console.error("❌ STRIPE_SECRET_KEY or STRIPE_API_KEY is not set");
  console.log("\n📝 Please add to .env.local:");
  console.log("STRIPE_SECRET_KEY=sk_test_your_key_here");
  process.exit(1);
}

if (!stripePublishableKey) {
  console.error("❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
  console.log("\n📝 Please add to .env.local:");
  console.log("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here");
  process.exit(1);
}

// Check key format
if (stripeSecretKey.includes("placeholder") || stripeSecretKey.length < 20) {
  console.error("❌ STRIPE_SECRET_KEY appears to be invalid (too short or contains 'placeholder')");
  console.log(`   Current value: ${stripeSecretKey.substring(0, 10)}...`);
  process.exit(1);
}

if (stripePublishableKey.includes("placeholder") || stripePublishableKey.length < 20) {
  console.error("❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY appears to be invalid");
  console.log(`   Current value: ${stripePublishableKey.substring(0, 10)}...`);
  process.exit(1);
}

// Check key prefixes
if (!stripeSecretKey.startsWith("sk_test_") && !stripeSecretKey.startsWith("sk_live_")) {
  console.error("❌ STRIPE_SECRET_KEY must start with 'sk_test_' or 'sk_live_'");
  console.log(`   Current value starts with: ${stripeSecretKey.substring(0, 8)}...`);
  process.exit(1);
}

if (!stripePublishableKey.startsWith("pk_test_") && !stripePublishableKey.startsWith("pk_live_")) {
  console.error("❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with 'pk_test_' or 'pk_live_'");
  console.log(`   Current value starts with: ${stripePublishableKey.substring(0, 8)}...`);
  process.exit(1);
}

console.log("✅ Keys found and format looks correct");
console.log(`   Secret key: ${stripeSecretKey.substring(0, 12)}...${stripeSecretKey.substring(stripeSecretKey.length - 4)}`);
console.log(`   Publishable key: ${stripePublishableKey.substring(0, 12)}...${stripePublishableKey.substring(stripePublishableKey.length - 4)}`);

// Test Stripe connection
async function testStripeConnection() {
  console.log("\n🔌 Testing Stripe API connection...");

  try {
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Try to retrieve account info (this will validate the key)
    const account = await stripe.accounts.retrieve();
    
    console.log("✅ Stripe connection successful!");
    console.log(`   Account: ${account.id}`);
    console.log(`   Country: ${account.country || "N/A"}`);
    console.log(`   Charges enabled: ${account.charges_enabled ? "Yes" : "No"}`);
    console.log(`   Payouts enabled: ${account.payouts_enabled ? "Yes" : "No"}`);
    
    console.log("\n🎉 Stripe is configured correctly!");
    console.log("   You can now use Stripe payment in your application.");
    
  } catch (error: any) {
    console.error("❌ Stripe API connection failed:");
    console.error(`   Error: ${error.message}`);
    
    if (error.type === "StripeInvalidRequestError") {
      console.error("\n💡 This usually means:");
      console.error("   - The API key is invalid or has been revoked");
      console.error("   - The API key doesn't have the required permissions");
      console.error("   - You're using a test key but Stripe is in live mode (or vice versa)");
    }
    
    if (error.type === "StripeAuthenticationError") {
      console.error("\n💡 This usually means:");
      console.error("   - The API key is incorrect");
      console.error("   - The API key has been deleted or disabled");
    }
    
    console.error("\n📝 Please check:");
    console.error("   1. Go to https://dashboard.stripe.com/test/apikeys");
    console.error("   2. Verify your API keys are correct");
    console.error("   3. Make sure you're using test keys (sk_test_...) for development");
    console.error("   4. Ensure the keys are properly set in .env.local");
    
    process.exit(1);
  }
}

// Run the test
testStripeConnection().catch(console.error);

