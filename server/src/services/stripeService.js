// import Stripe from 'stripe';
// import { env } from '../config/env.js';
// import User from '../models/User.js';

// export const stripe = new Stripe(env.stripeSecretKey, {apiVersion: '2024-06-20',});

// const PRICE_TO_PLAN = {
//   [env.stripePrices.starter]: 'starter',
//   [env.stripePrices.pro]: 'pro',
//   [env.stripePrices.team]: 'team',
// };

// export async function createCheckoutSession({ user, priceId, successUrl, cancelUrl }) {
//   let customerId = user.stripeCustomerId;

//   if (!customerId) {
//     const customer = await stripe.customers.create({
//       email: user.email,
//       metadata: { clerkId: user.clerkId, userId: user._id.toString() },
//     });
//     customerId = customer.id;
//     user.stripeCustomerId = customerId;
//     await user.save();
//   }

//   const session = await stripe.checkout.sessions.create({
//     mode: 'subscription',
//     customer: customerId,
//     line_items: [{ price: priceId, quantity: 1 }],
//     success_url: successUrl,
//     cancel_url: cancelUrl,
//     subscription_data: {
//       metadata: { userId: user._id.toString() },
//     },
//   });

//   return session;
// }

// export async function createPortalSession({ user, returnUrl }) {
//   if (!user.stripeCustomerId) {
//     throw new Error('User has no Stripe customer yet');
//   }

//   const session = await stripe.billingPortal.sessions.create({
//     customer: user.stripeCustomerId,
//     return_url: returnUrl,
//   });

//   return session;
// }

// /**
//  * Verifies and routes a raw Stripe webhook payload to the right handler.
//  * `rawBody` must be the untouched request buffer (Stripe signs the raw bytes).
//  */
// export async function handleStripeWebhook({ rawBody, signature }) {
//   const event = stripe.webhooks.constructEvent(rawBody, signature, env.stripeWebhookSecret);

//   switch (event.type) {
//     case 'checkout.session.completed':
//       await onCheckoutCompleted(event.data.object);
//       break;
//     case 'customer.subscription.updated':
//       await onSubscriptionUpdated(event.data.object);
//       break;
//     case 'customer.subscription.deleted':
//       await onSubscriptionDeleted(event.data.object);
//       break;
//     case 'invoice.payment_failed':
//       await onPaymentFailed(event.data.object);
//       break;
//     default:
//       // Unhandled event types are fine to ignore.
//       break;
//   }

//   return event;
// }

// async function onCheckoutCompleted(session) {
//   const customerId = session.customer;
//   const subscriptionId = session.subscription;

//   const user = await findUserByCustomerId(customerId);
//   if (!user) return;

//   let plan = 'free';
//   if (subscriptionId) {
//     const subscription = await stripe.subscriptions.retrieve(subscriptionId);
//     const priceId = subscription.items.data[0]?.price?.id;
//     plan = PRICE_TO_PLAN[priceId] || 'free';
//     user.subscriptionStatus = subscription.status;
//     user.stripeSubscriptionId = subscription.id;
//   }

//   user.plan = plan;
//   await user.save();
// }

// async function onSubscriptionUpdated(subscription) {
//   const user = await findUserByCustomerId(subscription.customer);
//   if (!user) return;

//   const priceId = subscription.items.data[0]?.price?.id;
//   user.plan = PRICE_TO_PLAN[priceId] || user.plan;
//   user.subscriptionStatus = subscription.status;
//   user.stripeSubscriptionId = subscription.id;
//   await user.save();
// }

// async function onSubscriptionDeleted(subscription) {
//   const user = await findUserByCustomerId(subscription.customer);
//   if (!user) return;

//   user.plan = 'free';
//   user.subscriptionStatus = 'canceled';
//   await user.save();
// }

// async function onPaymentFailed(invoice) {
//   const user = await findUserByCustomerId(invoice.customer);
//   if (!user) return;

//   user.subscriptionStatus = 'past_due';
//   await user.save();
//   // In production: trigger an email via alertService/Resend to warn the user here.
// }

// async function findUserByCustomerId(customerId) {
//   const user = await User.findOne({ stripeCustomerId: customerId });
//   if (!user) {
//     console.warn(`[stripe] No local user found for Stripe customer ${customerId}`);
//   }
//   return user;
// }

import Stripe from 'stripe';
import { env } from '../config/env.js';
import User from '../models/User.js';

export const stripe = new Stripe(env.stripeSecretKey, {
  apiVersion: '2024-06-20',
});

const PRICE_TO_PLAN = {
  [env.stripePrices.starter]: 'starter',
  [env.stripePrices.pro]: 'pro',
  [env.stripePrices.team]: 'team',
};

export async function createCheckoutSession({
  user,
  priceId,
  successUrl,
  cancelUrl,
}) {
  const customerId = await getOrCreateCustomer(user);

  return stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      metadata: {
        userId: user._id.toString(),
      },
    },
  });
}

export async function createPortalSession({ user, returnUrl }) {
  if (!user.stripeCustomerId) {
    throw new Error('User has no Stripe customer yet');
  }

  return stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: returnUrl,
  });
}

export async function handleStripeWebhook({ rawBody, signature }) {
  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    env.stripeWebhookSecret
  );

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object);
      break;

    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;

    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
  }

  return event;
}

async function getOrCreateCustomer(user) {
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: user.email,
    metadata: {
      clerkId: user.clerkId,
      userId: user._id.toString(),
    },
  });

  user.stripeCustomerId = customer.id;
  await user.save();

  return customer.id;
}

async function handleCheckoutCompleted(session) {
  const user = await findUserByCustomerId(session.customer);

  if (!user) return;

  let plan = 'free';

  if (session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription
    );

    const priceId = subscription.items.data[0]?.price?.id;

    plan = PRICE_TO_PLAN[priceId] || 'free';

    user.subscriptionStatus = subscription.status;
    user.stripeSubscriptionId = subscription.id;
  }

  user.plan = plan;

  await user.save();
}

async function handleSubscriptionUpdated(subscription) {
  const user = await findUserByCustomerId(subscription.customer);

  if (!user) return;

  const priceId = subscription.items.data[0]?.price?.id;

  user.plan = PRICE_TO_PLAN[priceId] || user.plan;
  user.subscriptionStatus = subscription.status;
  user.stripeSubscriptionId = subscription.id;

  await user.save();
}

async function handleSubscriptionDeleted(subscription) {
  const user = await findUserByCustomerId(subscription.customer);

  if (!user) return;

  user.plan = 'free';
  user.subscriptionStatus = 'canceled';

  await user.save();
}

async function handlePaymentFailed(invoice) {
  const user = await findUserByCustomerId(invoice.customer);

  if (!user) return;

  user.subscriptionStatus = 'past_due';

  await user.save();

  // TODO: Send a payment-failed email.
}

async function findUserByCustomerId(customerId) {
  const user = await User.findOne({
    stripeCustomerId: customerId,
  });

  if (!user) {
    console.warn(
      `[stripe] No local user found for Stripe customer ${customerId}`
    );
  }

  return user;
}

