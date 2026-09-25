import { env } from "../config/env";

// import { env } from "../config/env";
export async function createCheckout({ variantId, user }) {
	const response = await fetch(
		'https://api.lemonsqueezy.com/v1/checkouts',
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${env.lemonSqueezyApiKey}`,
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json',
			},
			body: JSON.stringify({
				data: {
					type: 'checkouts',
					attributes: {
						checkout_data: {
							email: user.email,
							custom: {userId: user._id.toString(),},
						},
					},
					relationships: {
						store: {
							data: {
								type: 'stores',
								id: String(env.lemonSqueezyStoreId),
							},
						},
						variant: {
							data: {
								type: 'variants',
								id: String(variantId),
							},
						},
					},
				},
			}),
		}
	);

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Lemon Squeezy checkout failed: ${error}`);
	}

	const data = await response.json();

	return data.data.attributes.url;
}




// ─────────────────────────────────────────────
// Verify webhook signature
// ─────────────────────────────────────────────

function verifyWebhookSignature(rawBody, signature) {
	if (!signature) throw new Error('Missing Lemon Squeezy webhook signature');

	const secret = env.lemonSqueezyWebhookSecret;

	const expectedSignature = crypto
		.createHmac('sha256', secret)
		.update(rawBody)
		.digest('hex')
	;

	const received = Buffer.from(signature, 'utf8');
	const expected = Buffer.from(expectedSignature, 'utf8');

	if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) 
		throw new Error('Invalid Lemon Squeezy webhook signature')
	;
}

// ─────────────────────────────────────────────
// Main webhook handler
// ─────────────────────────────────────────────

export async function handleLemonSqueezyWebhook({rawBody,signature,}) {
	// 1. Verify that the webhook came from Lemon Squeezy
	verifyWebhookSignature(rawBody, signature);

	// 2. Parse the event
	const event = JSON.parse(rawBody.toString());

	const eventName = event.meta?.event_name;
	const payload = event.data?.attributes;

	if (!eventName || !payload) throw new Error('Invalid Lemon Squeezy webhook payload');
	
	console.log(`[lemonsqueezy] Received event: ${eventName}`);

	// 3. Handle the event
	// switch (eventName) {
	// 	case 'subscription_created':
	// 		await handleSubscriptionCreated(payload);
	// 	break;

	// 	case 'subscription_updated':
	// 		await handleSubscriptionUpdated(payload);
	// 	break;

	// 	case 'subscription_cancelled':
	// 		await handleSubscriptionCancelled(payload);
	// 	break;

	// 	case 'subscription_resumed':
	// 		await handleSubscriptionResumed(payload);
	// 	break;

	// 	case 'subscription_expired':
	// 		await handleSubscriptionExpired(payload);
	// 	break;

	// 	case 'subscription_payment_failed':
	// 		await handlePaymentFailed(payload);
	// 	break;

	// 	default: console.log(`[lemonsqueezy] Ignored event: ${eventName}`);
	// }

	return event;
}

// ─────────────────────────────────────────────
// Subscription created
// ─────────────────────────────────────────────

async function handleSubscriptionCreated(subscription) {
	const user = await findUser(subscription);

	if (!user) return;

	const plan = getPlanFromVariant(subscription.variant_id);

	user.plan = plan;
	user.subscriptionStatus = subscription.status;
	user.lemonSqueezySubscriptionId = String(subscription.id);

	if (subscription.customer_id) user.lemonSqueezyCustomerId = String(subscription.customer_id);
	
	await user.save();

	console.log(`[lemonsqueezy] Subscription created for user ${user._id}`);
}

// ─────────────────────────────────────────────
// Subscription updated
// ─────────────────────────────────────────────

async function handleSubscriptionUpdated(subscription) {
	const user = await findUser(subscription);
	if (!user) return;

	const plan = getPlanFromVariant(subscription.variant_id);
	if (plan) user.plan = plan;

	user.subscriptionStatus = subscription.status;
	user.lemonSqueezySubscriptionId = String(subscription.id);

	await user.save();
}

// ─────────────────────────────────────────────
// Subscription cancelled
// ─────────────────────────────────────────────

async function handleSubscriptionCancelled(subscription) {
	const user = await findUser(subscription);

	if (!user) return;

	user.plan = 'free';
	user.subscriptionStatus = 'cancelled';

	await user.save();
}

// ─────────────────────────────────────────────
// Subscription resumed
// ─────────────────────────────────────────────

async function handleSubscriptionResumed(subscription) {
	const user = await findUser(subscription);
	if (!user) return;

	const plan = getPlanFromVariant(subscription.variant_id);
	if (plan) user.plan = plan;
	
	user.subscriptionStatus = subscription.status;
	await user.save();
}

// ─────────────────────────────────────────────
// Subscription expired
// ─────────────────────────────────────────────

async function handleSubscriptionExpired(subscription) {
	const user = await findUser(subscription);
	if (!user) return;

	user.plan = 'free';
	user.subscriptionStatus = 'expired';

	await user.save();
}

// ─────────────────────────────────────────────
// Payment failed
// ─────────────────────────────────────────────

async function handlePaymentFailed(subscription) {
	const user = await findUser(subscription);

	if (!user) return;

	user.subscriptionStatus = 'past_due';

	await user.save();

	console.log(`[lemonsqueezy] Payment failed for user ${user._id}`);
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function getPlanFromVariant(variantId) {
	return VARIANT_TO_PLAN[String(variantId)] || null;
}

async function findUser(subscription) {
	const customData = subscription.custom_data;

	// The custom userId is sent during checkout
	const userId = customData?.userId;

	if (userId) {
		const user = await User.findById(userId);
		if (user) return user;
	}

	// Fallback: find by Lemon Squeezy subscription ID
	if (subscription.id) {
		const user = await User.findOne({lemonSqueezySubscriptionId: String(subscription.id), });
		if (user) return user;
	}

	console.warn('[lemonsqueezy] Could not find local user');

	return null;
}