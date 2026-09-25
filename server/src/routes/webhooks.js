import { Router } from 'express';
import { handleStripeWebhook } from '../services/stripeService.js';
// import { handleLemonSqueezyWebhook } from '../services/lemonSqueezy.service.js';

const router = Router();

// POST /api/webhooks/stripe
router.post('/stripe', async (req, res) => {
	const signature = req.headers['stripe-signature'];

	try {
		await handleStripeWebhook({rawBody: req.body, signature,});

		res.json({ received: true });
	} catch (err) {
		console.error('[webhooks/stripe] signature verification failed:', err.message);

		res.status(400).json({ error: `Webhook Error: ${err.message}`, });
	}
});
// router.post('/lemonsqueezy', async (req, res) => {
// 	try {
// 		await handleLemonSqueezyWebhook({
// 			rawBody: req.body,
// 			signature: req.headers['x-signature'],
// 		});

// 		res.json({ received: true });
// 	}catch(err) {
// 		console.error('[webhooks/lemonsqueezy]',err);
// 		res.status(400).json({error: err.message,});
// 	}
// });
export default router;

 