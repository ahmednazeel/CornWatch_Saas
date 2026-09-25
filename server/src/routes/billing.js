
import { Router } from 'express';

import { requireAuth } from '../middleware/auth.js';
import {
	createCheckoutSession,
	createPortalSession,
} from '../services/stripeService.js';
import { env } from '../config/env.js';
import User from '../models/User.js';

const router = Router();

router.use(requireAuth);

const VALID_PLANS = ['starter', 'pro', 'team'];

// POST /api/billing/checkout
// router.post('/checkout', async (req, res, next) => {
// 	try {
// 		const { plan } = req.body;

// 		if (!VALID_PLANS.includes(plan)) return res.status(400).json({error: `plan must be one of ${VALID_PLANS.join(', ')}`, });
		

// 		const priceId = env.stripePrices[plan];

// 		if (!priceId) return res.status(500).json({
// 			error: `No Stripe price configured for plan "${plan}"`,
// 		});
		

// 		const session = await createCheckoutSession({
// 			user: req.user,
// 			priceId,
// 			successUrl: `${env.clientUrl}/settings?checkout=success`,
// 			cancelUrl: `${env.clientUrl}/settings?checkout=cancelled`,
// 		});

// 		res.json({ url: session.url });
// 	} catch (err) {
// 		next(err);
// 	}
// });
// POST /api/billing/portal
router.post('/portal', async (req, res, next) => {
	try {
		const session = await createPortalSession({user: req.user, returnUrl: `${env.clientUrl}/settings`,});
		res.json({ url: session.url });
	} catch (err) {
		next(err);
	}
});

router.post('/checkout', async (req, res, next) => {
  try {
    const { plan } = req.body;

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    const variantMap = {
      starter: env.lemonSqueezyStarterMonthlyVariant,
      pro: env.lemonSqueezyProMonthlyVariant,
    };

    const variantId = variantMap[plan];

    if (!variantId) {
      return res.status(400).json({
        message: 'Invalid plan',
      });
    }

    const checkoutUrl = await createCheckout({
      variantId,
      user,
    });

    return res.json({
      checkoutUrl,
    });
  } catch (err) {
    next(err);
  }
});




export default router;

