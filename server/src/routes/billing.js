
import { Router } from 'express';

import { requireAuth } from '../middleware/auth.js';
import {
  createCheckoutSession,
  createPortalSession,
} from '../services/stripeService.js';
import { env } from '../config/env.js';

const router = Router();

router.use(requireAuth);

const VALID_PLANS = ['starter', 'pro', 'team'];

// POST /api/billing/checkout
router.post('/checkout', async (req, res, next) => {
  try {
    const { plan } = req.body;

    if (!VALID_PLANS.includes(plan)) {
      return res.status(400).json({
        error: `plan must be one of ${VALID_PLANS.join(', ')}`,
      });
    }

    const priceId = env.stripePrices[plan];

    if (!priceId) {
      return res.status(500).json({
        error: `No Stripe price configured for plan "${plan}"`,
      });
    }

    const session = await createCheckoutSession({
      user: req.user,
      priceId,
      successUrl: `${env.clientUrl}/settings?checkout=success`,
      cancelUrl: `${env.clientUrl}/settings?checkout=cancelled`,
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
});

// POST /api/billing/portal
router.post('/portal', async (req, res, next) => {
  try {
    const session = await createPortalSession({
      user: req.user,
      returnUrl: `${env.clientUrl}/settings`,
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
});

export default router;

