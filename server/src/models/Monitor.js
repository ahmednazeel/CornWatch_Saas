import mongoose from 'mongoose';

const { Schema } = mongoose;

const alertChannelsSchema = new Schema(
	{
		email: {
			enabled: { type: Boolean, default: true },
			address: { type: String, default: null }, // defaults to user's account email if null
		},
		slack: {
			enabled: { type: Boolean, default: false },
			webhookUrl: { type: String, default: null },
		},
		webhook: {
			enabled: { type: Boolean, default: false },
			url: { type: String, default: null },
		},
	},
	{ _id: false }
);

const monitorSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 120,
		},
		alertSent: {
			type: Boolean,
			default: false,
		},
		url: {
			type: String,
			required: true,
			trim: true,
		},
		schedule: {
			// Standard cron string, e.g. "*/5 * * * *"
			type: String,
			required: true,
		},
		gracePeriod: {
			// Minutes of tolerance after expected run time before marking "late/down"
			type: Number,
			default: 5,
			min: 0,
		},
		downSince: {
			type: Date,
			default: null,
		},
		timezone: {
			type: String,
			default: 'UTC',
		},
		alertChannels: {
			type: alertChannelsSchema,
			default: () => ({}),
		},
		isActive: {
			type: Boolean,
			default: true,
			index: true,
		},
		lastCheckAt: {
			type: Date,
			default: null,
		},
		lastStatus: {
			type: String,
			enum: ['up', 'down', 'pending', 'unknown'],
			default: 'unknown',
		},
		nextExpectedAt: {
			type: Date,
			default: null,
		},
		consecutiveFailures: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

monitorSchema.index({ userId: 1, isActive: 1 });

export default mongoose.model('Monitor', monitorSchema);
