import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
	{
		clerkId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
			index: true,
		},
		stripeCustomerId: {
			type: String,
			default: null,
			index: true,
		},
		stripeSubscriptionId: {
			type: String,
			default: null,
		},lemonSqueezyCustomerId: {
  type: String,
},

lemonSqueezySubscriptionId: {
  type: String,
},

		subscriptionStatus: {
			type: String,
			enum: ['active', 'trialing', 'past_due', 'canceled', 'incomplete', 'none'],
			default: 'none',
		},
		plan: {
			type: String,
			enum: ['free', 'starter', 'pro', 'team'],
			default: 'free',
		},
	},
	{ timestamps: true }
);

export default mongoose.model('User', userSchema);
