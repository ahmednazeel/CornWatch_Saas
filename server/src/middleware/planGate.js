import Monitor from '../models/Monitor.js';
import { PLAN_LIMITS } from '../config/env.js';

/**
 * Blocks monitor creation once a user has hit their plan's monitor limit.
 * Must run after requireAuth (needs req.user).
 */
export async function enforceMonitorLimit(req, res, next) {
  try {
    const user = req.user;
    const limit = PLAN_LIMITS[user.plan] ?? PLAN_LIMITS.free;

    if (limit === Infinity) return next();

    const count = await Monitor.countDocuments({ userId: user._id });

    if (count >= limit) {
      return res.status(403).json({
        error: 'Monitor limit reached for your plan',
        plan: user.plan,
        limit,
        current: count,
        upgradeRequired: true,
      });
    }

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Blocks access to a route entirely unless the user's subscription is
 * in good standing (used for premium-only features if needed later).
 */
export function requireActiveSubscription(req, res, next) {
  const { subscriptionStatus, plan } = req.user;
  if (plan === 'free') return next(); // free plan has no subscription to check
  if (['active', 'trialing'].includes(subscriptionStatus)) return next();

  return res.status(402).json({
    error: 'Your subscription is not active',
    subscriptionStatus,
  });
}
