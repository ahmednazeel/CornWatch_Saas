import dotenv from 'dotenv';
dotenv.config();

function required(name, fallback = undefined) {
  const val = process.env[name] ?? fallback;
  if (val === undefined) {
    // Don't throw at import time in dev tooling contexts (tests etc.),
    // but warn loudly so misconfiguration is obvious.
    console.warn(`[env] Missing environment variable: ${name}`);
  }
  return val;
}

export const env = {
    port: process.env.PORT || 4000,
    nodeEnv: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

    mongodbUri: process.env.MONGODB_URI,

    clerkSecretKey: process.env.CLERK_SECRET_KEY,
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    clerkWebhookSecret: process.env.CLERK_WEBHOOK_SECRET,

    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    stripePrices: {
      starter: process.env.STRIPE_PRICE_STARTER,
      pro: process.env.STRIPE_PRICE_PRO,
      team: process.env.STRIPE_PRICE_TEAM,
    },

    resendApiKey: process.env.RESEND_API_KEY,
    alertFromEmail: process.env.ALERT_FROM_EMAIL || 'alerts@cronwatch.io',

    agendaCollection: process.env.AGENDA_DB_COLLECTION || 'agendaJobs',

    lemonSqueezyStoreId:process.env.LEMONSQUEEZY_STORE_ID,
    lemonSqueezyApiKey:process.env.LEMONSQUEEZY_API_KEY,
    lemonSqueezyStarterMonthlyVariant : process.env.LEMONSQUEEZY_STARTER_MONTHLY_VARIANT,
    lemonSqueezyProMonthlyVariant : process.env.LEMONSQUEEZY_PRO_MONTHLY_VARIANT,
    lemonSqueezyWebhookSecret:process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
};

export const PLAN_LIMITS = {
    free: 3,
    starter: 20,
    pro: 100,
    team: Infinity,
};
