// import { Router } from 'express';
// import { handleStripeWebhook } from '../services/stripeService.js';

// const router = Router();

// // POST /api/webhooks/stripe
// // NOTE: this route must receive the raw request body (see server.js,
// // where express.raw() is mounted specifically for this path) because
// // Stripe signs the exact byte payload.
// router.post('/stripe', async (req, res) => {
//     const signature = req.headers['stripe-signature'];

//     try {
//       await handleStripeWebhook({ rawBody: req.body, signature });
//       res.json({ received: true });
//     } catch (err) {
//       console.error('[webhooks/stripe] signature verification failed:', err.message);
//       res.status(400).json({ error: `Webhook Error: ${err.message}` });
//     }
// });

// export default router;

import { Router } from 'express';
import { handleStripeWebhook } from '../services/stripeService.js';

const router = Router();

// POST /api/webhooks/stripe
router.post('/stripe', async (req, res) => {
  const signature = req.headers['stripe-signature'];

  try {
    await handleStripeWebhook({
      rawBody: req.body,
      signature,
    });

    res.json({ received: true });
  } catch (err) {
    console.error('[webhooks/stripe] signature verification failed:', err.message);

    res.status(400).json({
      error: `Webhook Error: ${err.message}`,
    });
  }
});

export default router;

