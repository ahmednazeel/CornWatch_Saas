import mongoose from 'mongoose';

const { Schema } = mongoose;

const checkLogSchema = new Schema(
  {
    monitorId: {
      type: Schema.Types.ObjectId,
      ref: 'Monitor',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['up', 'down'],
      required: true,
    },
    responseTime: {
      // milliseconds
      type: Number,
      default: null,
    },
    statusCode: {
      type: Number,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    checkedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: false }
);

// Common query pattern: recent logs for a monitor, most recent first.
checkLogSchema.index({ monitorId: 1, checkedAt: -1 });

// TTL-style cap could be added later; for now retain everything.

export default mongoose.model('CheckLog', checkLogSchema);
